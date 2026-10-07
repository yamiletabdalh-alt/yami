/* =====================================================================
   AGENTES DE CLIENTES, LLAMADAS Y SOPORTE  (función pública)
   ---------------------------------------------------------------------
   Recibe lo que envían los formularios de la web y lo guarda en el
   registro de clientes (Netlify Blobs, almacén "crm"):

   GET  ?accion=huecos            -> huecos libres para llamadas
   POST { tipo: "lead" }          -> mensaje del formulario de contacto
   POST { tipo: "inicio" }        -> formulario de inicio tras pagar
   POST { tipo: "llamada" }       -> reserva de llamada gratis
   POST { tipo: "soporte", tipoConsulta } -> queja / incidencia (crea un ticket)

   Lo ves todo en panel.html. No guarda datos de tarjetas (eso es Stripe).
   ===================================================================== */
import { getStore } from "@netlify/blobs";
import { createHash, randomUUID } from "node:crypto";

const ZONA = "America/New_York";

/* Horario de llamadas (hora de Nueva York). Para cambiarlo, edita esto. */
const DISPONIBILIDAD = {
  dias: [1, 2, 3, 4, 5],                                  // 0 = domingo … 6 = sábado
  horas: ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
  diasVista: 14,                                          // cuántos días se pueden reservar
  antelacionHoras: 12,                                    // no se reserva con menos antelación
};

const TIPOS_SOPORTE = ["Queja", "Problema con mi web", "Quiero un cambio en mi web", "Facturación o pagos", "Cancelación o reembolso", "Otro"];
const TEMAS_LLAMADA = ["Quiero una web", "Web para terapeutas", "Redes sociales", "IA y asistentes", "Otro"];
const RX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (datos, status = 200) =>
  new Response(JSON.stringify(datos), { status, headers: { "Content-Type": "application/json; charset=utf-8" } });

const texto = (v, max) => String(v == null ? "" : v).trim().slice(0, max);
const claveEmail = (email) => createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 24);

/* ---------- Fechas en la hora de Nueva York ---------- */
function offsetMinutos(fecha) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: ZONA, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).formatToParts(fecha).map((x) => [x.type, x.value])
  );
  const comoUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return Math.round((comoUTC - fecha.getTime()) / 60000);
}
function instanteNY(fecha, hora) {
  const [y, m, d] = fecha.split("-").map(Number);
  const [hh, mm] = hora.split(":").map(Number);
  const aprox = Date.UTC(y, m - 1, d, hh, mm);
  return new Date(aprox - offsetMinutos(new Date(aprox)) * 60000);
}
const fechaNY = (ms) => new Date(ms).toLocaleDateString("en-CA", { timeZone: ZONA });

async function huecosLibres(store) {
  const { blobs } = await store.list({ prefix: "huecos/" });
  const ocupados = new Set(blobs.map((b) => b.key.slice("huecos/".length)));
  const ahora = Date.now();
  const limite = ahora + DISPONIBILIDAD.antelacionHoras * 3600000;
  const libres = [];
  for (let i = 0; i <= DISPONIBILIDAD.diasVista; i++) {
    const fecha = fechaNY(ahora + i * 86400000);
    const diaSemana = new Date(fecha + "T12:00:00Z").getUTCDay();
    if (!DISPONIBILIDAD.dias.includes(diaSemana)) continue;
    for (const hora of DISPONIBILIDAD.horas) {
      const inicio = instanteNY(fecha, hora);
      if (inicio.getTime() < limite) continue;
      if (ocupados.has(`${fecha}_${hora}`)) continue;
      libres.push({ fecha, hora, inicio: inicio.toISOString() });
    }
  }
  return libres;
}

/* ---------- Registro de clientes ---------- */
const RANGO = { lead: 0, nuevo: 1, "pago-fallido": 2, activo: 3, cancelado: 1 };

async function guardarCliente(store, datos, nota) {
  const id = claveEmail(datos.email);
  const clave = `clientes/${id}`;
  const ahora = new Date().toISOString();
  const previo = (await store.get(clave, { type: "json" })) || {
    id, email: datos.email.toLowerCase(), estado: "lead", creado: ahora, historial: [], notas: "",
  };
  const c = { ...previo };
  for (const k of ["nombre", "telefono", "negocio", "plan"]) if (datos[k]) c[k] = datos[k];
  if (datos.inicio) c.inicio = datos.inicio;
  if (datos.origen && !c.origen) c.origen = datos.origen;
  // El estado solo "sube" (un cliente activo no vuelve a ser lead por escribir)
  if (datos.estado && (RANGO[datos.estado] ?? 0) >= (RANGO[c.estado] ?? 0)) c.estado = datos.estado;
  c.historial = [...(c.historial || []), { fecha: ahora, texto: nota }].slice(-50);
  c.actualizado = ahora;
  await store.setJSON(clave, c);
  return c;
}

/* ---------- Manejadores ---------- */
async function lead(store, b) {
  await guardarCliente(store, { email: b.email, nombre: b.nombre, estado: "lead", origen: "formulario de contacto" },
    "Mensaje: " + texto(b.mensaje, 600));
  return json({ ok: true });
}

async function inicio(store, b) {
  const plan = ["Esencial", "Negocio", "Pro"].includes(b.plan) ? b.plan : "";
  await guardarCliente(store, {
    email: b.email, nombre: b.nombre, negocio: texto(b.negocio, 120), plan, estado: "nuevo", origen: "pago online",
    inicio: {
      necesidad: texto(b.necesidad, 2000), enlaces: texto(b.enlaces, 500), estilo: texto(b.estilo, 1000),
      sesion: texto(b.sesion, 120), fecha: new Date().toISOString(),
    },
  }, `Formulario de inicio recibido (plan ${plan || "?"}).`);
  return json({ ok: true });
}

async function llamada(store, b) {
  const fecha = texto(b.fecha, 10), hora = texto(b.hora, 5);
  const libres = await huecosLibres(store);
  const hueco = libres.find((h) => h.fecha === fecha && h.hora === hora);
  if (!hueco) return json({ ok: false, error: "Ese horario ya no está disponible. Elige otro, por favor." }, 409);
  const clave = `huecos/${fecha}_${hora}`;
  if (await store.get(clave)) return json({ ok: false, error: "Ese horario se acaba de ocupar. Elige otro, por favor." }, 409);

  const id = randomUUID().slice(0, 8);
  const tema = TEMAS_LLAMADA.includes(b.tema) ? b.tema : "Otro";
  await store.setJSON(clave, { id });
  await store.setJSON(`llamadas/${id}`, {
    id, fecha, hora, inicio: hueco.inicio, estado: "pendiente", tema,
    nombre: texto(b.nombre, 100), email: b.email.toLowerCase(), telefono: texto(b.telefono, 40),
    mensaje: texto(b.mensaje, 1000), creado: new Date().toISOString(),
  });
  await guardarCliente(store, { email: b.email, nombre: b.nombre, telefono: texto(b.telefono, 40), estado: "lead", origen: "reserva de llamada" },
    `Llamada reservada: ${fecha} ${hora} (Nueva York) · ${tema}`);
  return json({ ok: true, id, fecha, hora, inicio: hueco.inicio });
}

async function soporte(store, b) {
  const tipo = TIPOS_SOPORTE.includes(b.tipoConsulta) ? b.tipoConsulta : "Otro";
  const urgente = b.urgencia === "Urgente";
  const n = Number((await store.get("contador/tickets", { type: "text" })) || "0") + 1;
  await store.set("contador/tickets", String(n));
  const numero = "T-" + String(n).padStart(4, "0");
  const ahora = new Date().toISOString();
  await store.setJSON(`tickets/${numero}`, {
    id: numero, numero, tipo, urgencia: urgente ? "Urgente" : "Normal", estado: "abierto",
    nombre: texto(b.nombre, 100), email: b.email.toLowerCase(), mensaje: texto(b.mensaje, 3000),
    creado: ahora, actualizado: ahora, respuesta: "",
  });
  await guardarCliente(store, { email: b.email, nombre: b.nombre, origen: "soporte" }, `Ticket ${numero} abierto: ${tipo}`);
  return json({ ok: true, numero });
}

export default async (req) => {
  try {
    const store = getStore({ name: "crm", consistency: "strong" });

    if (req.method === "GET") {
      const accion = new URL(req.url).searchParams.get("accion");
      if (accion === "huecos") return json({ ok: true, zona: ZONA, huecos: await huecosLibres(store) });
      return json({ ok: false, error: "Acción no válida" }, 400);
    }
    if (req.method !== "POST") return json({ ok: false, error: "Método no permitido" }, 405);

    const b = await req.json().catch(() => ({}));
    if (b.botcheck) return json({ ok: true }); // robot: se ignora en silencio
    b.email = texto(b.email, 200);
    b.nombre = texto(b.nombre, 100);
    if (!b.nombre || !RX_EMAIL.test(b.email)) return json({ ok: false, error: "Faltan el nombre o un email válido." }, 400);

    if (b.tipo === "lead") return await lead(store, b);
    if (b.tipo === "inicio") return await inicio(store, b);
    if (b.tipo === "llamada") return await llamada(store, b);
    if (b.tipo === "soporte") {
      if (!texto(b.mensaje, 10)) return json({ ok: false, error: "Cuéntame qué ha pasado." }, 400);
      return await soporte(store, b);
    }
    return json({ ok: false, error: "Tipo no válido" }, 400);
  } catch (e) {
    return json({ ok: false, error: "Error del servidor: " + e.message }, 500);
  }
};
