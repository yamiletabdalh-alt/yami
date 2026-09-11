/* =====================================================================
   INFORME DIARIO DE LA WEB  ->  email
   ---------------------------------------------------------------------
   Función HTTP normal. El "cada día" lo dispara GitHub Actions
   (.github/workflows/informe-diario.yml). Probar abriendo:
     https://yamilet-abdalh-web.netlify.app/.netlify/functions/informe-diario

   Los números salen del contador propio (netlify/functions/contar-visita.mjs,
   guardado en Netlify Blobs) — no hace falta ninguna clave externa.

   Variable de entorno opcional en Netlify:
     WEB3FORMS_KEY   -> por defecto usa la del formulario de contacto
     INFORME_TOKEN   -> si lo defines, hay que llamar con ?t=ESE_VALOR
   ===================================================================== */
import { getStore } from "@netlify/blobs";

const limpio = (v) => (v || "").trim().replace(/^["']|["']$/g, "");
const WEB3_KEY = limpio(process.env.WEB3FORMS_KEY) || "dcff39c2-5260-45ca-9d30-d985e128da88";
const SITIO = "https://yamilet-abdalh-web.netlify.app";

function fechaISO(diasAtras) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - diasAtras);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

async function enviarEmail(asunto, texto) {
  const r = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: SITIO, Referer: SITIO + "/" },
    body: JSON.stringify({
      access_key: WEB3_KEY,
      subject: asunto,
      from_name: "Informe de tu web",
      email: "informe@yamilet-abdalh-web.netlify.app",
      message: texto,
    }),
  });
  const j = await r.json();
  if (!j.success) throw new Error("Web3Forms: " + (j.message || "no se pudo enviar"));
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

    const fecha = new Date(Date.now() - 86400000).toLocaleDateString("es-ES", {
      weekday: "long", day: "numeric", month: "long",
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

    await enviarEmail("📊 Informe diario de tu web", msg);
    return new Response("Informe enviado por email.\n\n" + msg, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    return new Response("No se pudo generar el informe:\n" + e.message, { status: 500 });
  }
};
