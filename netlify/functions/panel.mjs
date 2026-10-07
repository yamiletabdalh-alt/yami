/* =====================================================================
   PANEL DE CONTROL  (solo para Yamilet)
   ---------------------------------------------------------------------
   Da a panel.html los clientes, llamadas, tickets y pagos, y guarda los
   cambios de estado y notas. Protegido con la variable ADMIN_TOKEN de
   Netlify (tu contraseña del panel). Sin ella, el panel no abre.
   ===================================================================== */
import { getStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "node:crypto";

const COLECCIONES = ["clientes", "llamadas", "tickets", "pagos"];
const ESTADOS = {
  clientes: ["lead", "nuevo", "activo", "pago-fallido", "cancelado"],
  llamadas: ["pendiente", "hecha", "no-asistio", "cancelada"],
  tickets: ["abierto", "en-curso", "resuelto"],
};

const json = (datos, status = 200) =>
  new Response(JSON.stringify(datos), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
const limpio = (v) => (v || "").trim().replace(/^["']|["']$/g, "");
const resumen = (v) => createHash("sha256").update(String(v)).digest();

function autorizado(req) {
  const token = limpio(process.env.ADMIN_TOKEN);
  const enviado = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return token && enviado && timingSafeEqual(resumen(token), resumen(enviado));
}

async function leerTodo(store, coleccion) {
  const { blobs } = await store.list({ prefix: coleccion + "/" });
  const items = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
  return items.filter(Boolean);
}

export default async (req) => {
  if (!limpio(process.env.ADMIN_TOKEN)) {
    return json({ ok: false, error: "El panel aún no tiene contraseña: añade ADMIN_TOKEN en Netlify." }, 503);
  }
  if (!autorizado(req)) return json({ ok: false, error: "Contraseña incorrecta." }, 401);

  const store = getStore({ name: "crm", consistency: "strong" });
  try {
    if (req.method === "GET") {
      const [clientes, llamadas, tickets, pagos] = await Promise.all(COLECCIONES.map((c) => leerTodo(store, c)));
      return json({ ok: true, clientes, llamadas, tickets, pagos });
    }
    if (req.method !== "POST") return json({ ok: false, error: "Método no permitido" }, 405);

    const b = await req.json().catch(() => ({}));
    if (!COLECCIONES.includes(b.coleccion) || !b.id || /[/]/.test(b.id)) {
      return json({ ok: false, error: "Datos no válidos" }, 400);
    }
    const clave = `${b.coleccion}/${b.id}`;
    const item = await store.get(clave, { type: "json" });
    if (!item) return json({ ok: false, error: "No existe" }, 404);

    if (b.accion === "borrar") {
      await store.delete(clave);
      if (b.coleccion === "llamadas") await store.delete(`huecos/${item.fecha}_${item.hora}`);
      return json({ ok: true });
    }

    if (b.accion === "actualizar") {
      const cambios = b.cambios || {};
      const ahora = new Date().toISOString();
      if (cambios.estado !== undefined) {
        if (!(ESTADOS[b.coleccion] || []).includes(cambios.estado)) return json({ ok: false, error: "Estado no válido" }, 400);
        if (b.coleccion === "llamadas" && cambios.estado === "cancelada") {
          await store.delete(`huecos/${item.fecha}_${item.hora}`); // libera el horario
        }
        item.estado = cambios.estado;
        if (b.coleccion === "clientes") {
          item.historial = [...(item.historial || []), { fecha: ahora, texto: `Estado cambiado a "${cambios.estado}" desde el panel.` }].slice(-50);
        }
      }
      if (typeof cambios.notas === "string") item.notas = cambios.notas.slice(0, 3000);
      if (typeof cambios.respuesta === "string") item.respuesta = cambios.respuesta.slice(0, 3000);
      item.actualizado = ahora;
      await store.setJSON(clave, item);
      return json({ ok: true, item });
    }
    return json({ ok: false, error: "Acción no válida" }, 400);
  } catch (e) {
    return json({ ok: false, error: "Error del servidor: " + e.message }, 500);
  }
};
