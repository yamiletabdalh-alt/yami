/* =====================================================================
   CONTADOR DE VISITAS PROPIO
   ---------------------------------------------------------------------
   Cada vez que alguien abre la web, script.js llama a esta función y
   suma 1 al contador del día (guardado en Netlify Blobs, sin cuentas
   ni claves externas). El informe diario lee estos números.
   ===================================================================== */
import { getStore } from "@netlify/blobs";

export default async () => {
  try {
    const store = getStore({ name: "visitas", consistency: "strong" });
    const hoy = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
    const actual = parseInt((await store.get(hoy, { type: "text" })) || "0", 10);
    await store.set(hoy, String(actual + 1));
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
};
