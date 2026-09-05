/* =====================================================================
   INFORME DIARIO DE LA WEB  ->  email
   ---------------------------------------------------------------------
   Se ejecuta solo cada día (cron de Netlify) y también se puede probar
   abriendo:  https://yamilet-abdalh-web.netlify.app/.netlify/functions/informe-diario

   Necesita 2 variables de entorno en Netlify (Project configuration ->
   Environment variables):
     CF_API_TOKEN    -> token de Cloudflare con permiso "Account Analytics: Read"
     CF_ACCOUNT_ID   -> ID de tu cuenta de Cloudflare
   Opcionales:
     CF_SITE_TAG     -> por defecto usa el token de Web Analytics de config.js
     WEB3FORMS_KEY   -> por defecto usa la del formulario de contacto
   ===================================================================== */

export const config = { schedule: "0 7 * * *" }; // 07:00 UTC cada día

const CF_TOKEN   = process.env.CF_API_TOKEN;
const CF_ACCOUNT = process.env.CF_ACCOUNT_ID;
const CF_SITE    = process.env.CF_SITE_TAG || "61bc754d281b44da961b14ec3b494490";
const WEB3_KEY   = process.env.WEB3FORMS_KEY || "dcff39c2-5260-45ca-9d30-d985e128da88";
const SITIO      = "https://yamilet-abdalh-web.netlify.app";

function rango(diasAtras) {
  const hasta = new Date(); hasta.setUTCHours(0, 0, 0, 0);
  const desde = new Date(hasta); desde.setUTCDate(desde.getUTCDate() - diasAtras);
  return { desde: desde.toISOString(), hasta: hasta.toISOString() };
}

async function pedirCloudflare(desde, hasta) {
  const query = `
    query ($acc: String!, $site: String!, $desde: Time!, $hasta: Time!) {
      viewer {
        accounts(filter: { accountTag: $acc }) {
          total: rumPageloadEventsAdaptiveGroups(
            filter: { siteTag: $site, datetime_geq: $desde, datetime_lt: $hasta }, limit: 1
          ) { count sum { visits } }
          paises: rumPageloadEventsAdaptiveGroups(
            filter: { siteTag: $site, datetime_geq: $desde, datetime_lt: $hasta },
            limit: 5, orderBy: [count_DESC]
          ) { count dimensions { countryName } }
          origen: rumPageloadEventsAdaptiveGroups(
            filter: { siteTag: $site, datetime_geq: $desde, datetime_lt: $hasta },
            limit: 6, orderBy: [count_DESC]
          ) { count dimensions { refererHost } }
        }
      }
    }`;
  const r = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${CF_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { acc: CF_ACCOUNT, site: CF_SITE, desde, hasta } }),
  });
  const j = await r.json();
  if (j.errors && j.errors.length) throw new Error("Cloudflare: " + JSON.stringify(j.errors));
  const acc = j?.data?.viewer?.accounts?.[0];
  if (!acc) throw new Error("Cloudflare no devolvió datos de la cuenta (¿ID o token incorrectos?)");
  return acc;
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

function lista(rows, dimName, vacio) {
  if (!rows || !rows.length) return "  (sin datos)";
  return rows.map((x) => "  " + (x.dimensions[dimName] || vacio) + ": " + x.count).join("\n");
}

export default async () => {
  if (!CF_TOKEN || !CF_ACCOUNT) {
    return new Response(
      "Faltan variables: define CF_API_TOKEN y CF_ACCOUNT_ID en Netlify.",
      { status: 500 }
    );
  }
  try {
    const ayer = rango(1);
    const sem = rango(7);
    const dAyer = await pedirCloudflare(ayer.desde, ayer.hasta);
    const dSem = await pedirCloudflare(sem.desde, sem.hasta);

    const a = dAyer.total[0] || { count: 0, sum: { visits: 0 } };
    const s = dSem.total[0] || { count: 0, sum: { visits: 0 } };
    const fecha = new Date(ayer.desde).toLocaleDateString("es-ES", {
      weekday: "long", day: "numeric", month: "long",
    });

    const msg =
`Informe de tu web — ${fecha}

AYER
  Visitas: ${a.sum?.visits ?? 0}
  Páginas vistas: ${a.count}

ÚLTIMOS 7 DÍAS
  Visitas: ${s.sum?.visits ?? 0}
  Páginas vistas: ${s.count}

PAÍSES (ayer)
${lista(dAyer.paises, "countryName", "desconocido")}

DE DÓNDE VIENEN (ayer)
${lista(dAyer.origen, "refererHost", "acceso directo")}

Nota: los mensajes del formulario de contacto te llegan aparte, en el momento.
${SITIO}`;

    await enviarEmail("📊 Informe diario de tu web", msg);
    return new Response("Informe enviado por email.\n\n" + msg, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    return new Response("No se pudo generar el informe:\n" + e.message, { status: 500 });
  }
};
