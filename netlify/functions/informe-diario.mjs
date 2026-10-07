/* =====================================================================
   INFORME DIARIO DE LA WEB
   ---------------------------------------------------------------------
   Función HTTP normal que devuelve el resumen de visitas en texto.
   El "cada día" lo dispara GitHub Actions (.github/workflows/informe-diario.yml),
   que publica el resumen como comentario en el repositorio de GitHub y
   te menciona: GitHub te avisa por email y en la app del móvil.
   Probar abriendo:
     https://yamilet-abdalh-web.netlify.app/.netlify/functions/informe-diario

   (Antes se enviaba con Web3Forms, pero Web3Forms bloquea los envíos
   hechos desde servidores con una comprobación de Cloudflare.)

   Los números salen del contador propio (netlify/functions/contar-visita.mjs,
   guardado en Netlify Blobs) — no hace falta ninguna clave externa.

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

    const msg =
`Informe de tu web — ${fecha}

HOY (hasta ahora): ${hoy} visita${hoy === 1 ? "" : "s"}
AYER: ${ayer} visita${ayer === 1 ? "" : "s"}
ÚLTIMOS 7 DÍAS: ${totalSemana} visitas

Detalle por día (últimos 7)
${detalle}

Para ver países y de dónde vienen los visitantes, entra en tu panel
de Cloudflare Web Analytics.

${SITIO}`;

    return new Response(msg, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (e) {
    return new Response("No se pudo generar el informe:\n" + e.message, { status: 500 });
  }
};
