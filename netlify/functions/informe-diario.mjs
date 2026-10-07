/* =====================================================================
   AGENTE SUPERVISOR: INFORME DIARIO DE LA WEB
   ---------------------------------------------------------------------
   Función HTTP que devuelve el resumen del día en texto: visitas,
   clientes, llamadas, soporte y pagos. El "cada día" lo dispara GitHub
   Actions (.github/workflows/informe-diario.yml), que lo publica como
   comentario en el repositorio y te menciona: GitHub te avisa por email
   y en la app del móvil.
   Probar abriendo:
     https://yamilet-abdalh-web.netlify.app/.netlify/functions/informe-diario

   Solo da NÚMEROS (nada de nombres ni emails): los detalles están en
   tu panel privado (panel.html).

   Variable de entorno opcional en Netlify:
     INFORME_TOKEN   -> si lo defines, hay que llamar con ?t=ESE_VALOR
   ===================================================================== */
import { getStore } from "@netlify/blobs";

const SITIO = "https://yamilet-abdalh-web.netlify.app";
const ZONA = "America/New_York"; // los días se cuentan en la hora de Yamilet (igual que contar-visita.mjs)

function fechaISO(diasAtras) {
  const d = new Date(Date.now() - diasAtras * 86400000);
  return d.toLocaleDateString("en-CA", { timeZone: ZONA }); // YYYY-MM-DD
}
const diaDe = (iso) => (iso ? new Date(iso).toLocaleDateString("en-CA", { timeZone: ZONA }) : "");
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

async function leerTodo(store, coleccion) {
  const { blobs } = await store.list({ prefix: coleccion + "/" });
  const items = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
  return items.filter(Boolean);
}

async function resumenNegocio(hoy, ayer, manana) {
  const store = getStore({ name: "crm", consistency: "strong" });
  const [clientes, llamadas, tickets, pagos] = await Promise.all(
    ["clientes", "llamadas", "tickets", "pagos"].map((c) => leerTodo(store, c))
  );
  const porEstado = (e) => clientes.filter((c) => c.estado === e).length;
  const leadsAyer = clientes.filter((c) => diaDe(c.creado) === ayer).length;

  const llamadasHoy = llamadas
    .filter((l) => l.fecha === hoy && l.estado === "pendiente")
    .sort((a, b) => a.hora.localeCompare(b.hora));
  const llamadasManana = llamadas.filter((l) => l.fecha === manana && l.estado === "pendiente").length;

  const abiertos = tickets.filter((t) => t.estado !== "resuelto");
  const urgentes = abiertos.filter((t) => t.urgencia === "Urgente").length;

  const pagosAyer = pagos.filter((p) => diaDe(p.fecha) === ayer);
  const cobrado = pagosAyer.filter((p) => p.tipo === "pago").reduce((s, p) => s + (p.importe || 0), 0);
  const nCobros = pagosAyer.filter((p) => p.tipo === "pago").length;
  const fallidos = pagosAyer.filter((p) => p.tipo === "fallido").length;
  const bajas = pagosAyer.filter((p) => p.tipo === "cancelacion").length;

  const alertas = [];
  if (urgentes) alertas.push(`⚠️ ${plural(urgentes, "ticket urgente", "tickets urgentes")} sin resolver`);
  if (fallidos) alertas.push(`⚠️ ${plural(fallidos, "pago fallido", "pagos fallidos")} ayer`);
  if (porEstado("nuevo")) alertas.push(`🆕 ${plural(porEstado("nuevo"), "cliente nuevo espera", "clientes nuevos esperan")} tu propuesta`);

  return `CLIENTES
  Activos: ${porEstado("activo")} · Nuevos (por empezar): ${porEstado("nuevo")} · Interesados: ${porEstado("lead")}
  Pago fallido: ${porEstado("pago-fallido")} · Cancelados: ${porEstado("cancelado")}
  Contactos nuevos ayer: ${leadsAyer}

LLAMADAS
  Hoy: ${llamadasHoy.length ? llamadasHoy.map((l) => l.hora).join(", ") + " (hora de Nueva York)" : "ninguna"}
  Mañana: ${llamadasManana}

SOPORTE Y QUEJAS
  Tickets abiertos: ${abiertos.length}${urgentes ? ` (${urgentes} urgentes)` : ""}

PAGOS DE AYER
  Cobrado: ${(cobrado / 100).toFixed(2)} USD en ${plural(nCobros, "pago", "pagos")}
  Fallidos: ${fallidos} · Cancelaciones: ${bajas}
${alertas.length ? "\nATENCIÓN\n  " + alertas.join("\n  ") + "\n" : ""}`;
}

export default async (req) => {
  const secreto = process.env.INFORME_TOKEN;
  if (secreto) {
    try {
      const u = new URL(req.url);
      if (u.searchParams.get("t") !== secreto) return new Response("No autorizado.", { status: 401 });
    } catch (_) {}
  }

  try {
    const store = getStore({ name: "visitas", consistency: "strong" });
    const hoyStr = fechaISO(0);
    const dias = Array.from({ length: 7 }, (_, i) => fechaISO(i + 1)); // ayer .. hace 7 días
    const [hoyVal, ...valores] = await Promise.all(
      [hoyStr, ...dias].map((f) => store.get(f, { type: "text" }))
    );
    const hoy = parseInt(hoyVal || "0", 10);
    const cifras = valores.map((v) => parseInt(v || "0", 10));

    const ayer = cifras[0];
    const totalSemana = cifras.reduce((a, b) => a + b, 0);
    const detalle = dias.map((f, i) => `  ${f}: ${cifras[i]} visita${cifras[i] === 1 ? "" : "s"}`).join("\n");

    const fecha = new Date().toLocaleDateString("es-ES", {
      weekday: "long", day: "numeric", month: "long", timeZone: ZONA,
    });

    let negocio;
    try {
      negocio = await resumenNegocio(hoyStr, dias[0], fechaISO(-1));
    } catch (e) {
      negocio = `(No se pudo leer el registro de clientes: ${e.message})\n`;
    }

    const msg =
`Informe de tu web — ${fecha}

VISITAS
  Hoy (hasta ahora): ${hoy} · Ayer: ${ayer} · Últimos 7 días: ${totalSemana}

${negocio}
Detalle de visitas (últimos 7 días)
${detalle}

Detalles con nombres en tu panel privado: ${SITIO}/panel.html
Países y origen de las visitas: panel de Cloudflare Web Analytics.`;

    return new Response(msg, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (e) {
    return new Response("No se pudo generar el informe:\n" + e.message, { status: 500 });
  }
};
