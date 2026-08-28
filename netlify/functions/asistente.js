/* =====================================================================
   FUNCIÓN DEL ASISTENTE CON IA  (Nivel 2 — opcional)
   ---------------------------------------------------------------------
   Se ejecuta en el servidor (Netlify Functions / Vercel), NUNCA en el
   navegador, para que tu clave de API no quede expuesta.

   Para activarla:
     1. Despliega esta carpeta en Netlify con `npm install` (no sirve
        arrastrar el ZIP; ver CONFIGURAR.md).
     2. En Netlify: Site settings → Environment variables →
        añade  ANTHROPIC_API_KEY = tu-clave  (se saca en console.anthropic.com).
     3. En config.js pon  asistente: { ia: true, ... }.
   ===================================================================== */

const Anthropic = require("@anthropic-ai/sdk");

// Modelo. Se usa "claude-haiku-4-5" porque es rápido y barato para un
// asistente de preguntas frecuentes. Para respuestas más elaboradas,
// cambia a "claude-sonnet-5" (más caro) o "claude-opus-5" (el más capaz).
const MODELO = "claude-haiku-4-5";

const CABECERAS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function resp(statusCode, obj) {
  return { statusCode: statusCode, headers: CABECERAS, body: JSON.stringify(obj) };
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CABECERAS, body: "" };
  if (event.httpMethod !== "POST") return resp(405, { error: "Método no permitido" });
  if (!process.env.ANTHROPIC_API_KEY) return resp(500, { error: "Falta ANTHROPIC_API_KEY en el servidor." });

  let datos;
  try {
    datos = JSON.parse(event.body || "{}");
  } catch (e) {
    return resp(400, { error: "El cuerpo no es JSON válido." });
  }

  const contexto = String(datos.contexto || "").slice(0, 6000);
  const entrantes = Array.isArray(datos.mensajes) ? datos.mensajes.slice(-10) : [];
  const mensajes = entrantes
    .filter(function (m) {
      return m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string";
    })
    .map(function (m) {
      return { role: m.role, content: m.content.slice(0, 2000) };
    });

  if (!mensajes.length || mensajes[0].role !== "user") {
    return resp(400, { error: "La conversación está vacía." });
  }

  const system = [
    "Eres el asistente virtual del portfolio de Yamilet Abdalh, diseñadora y desarrolladora web.",
    "Respondes ÚNICAMENTE con la información del CONTEXTO de abajo. Si algo no aparece ahí,",
    "dilo con naturalidad y sugiere dejar un mensaje en el formulario de contacto de la página.",
    "Escribe en español, con tono cercano y profesional, en 2-4 frases. No inventes precios,",
    "plazos ni datos. No hables de temas ajenos al trabajo de Yamilet.",
    "",
    "CONTEXTO:",
    contexto,
  ].join("\n");

  const client = new Anthropic(); // toma ANTHROPIC_API_KEY del entorno

  try {
    const respuesta = await client.messages.create({
      model: MODELO,
      max_tokens: 1024,
      system: system,
      messages: mensajes,
    });
    const texto = respuesta.content
      .filter(function (b) { return b.type === "text"; })
      .map(function (b) { return b.text; })
      .join("")
      .trim();
    return resp(200, { respuesta: texto || "No he sabido responder a eso." });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return resp(401, { error: "La clave de API no es válida." });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return resp(429, { error: "Demasiadas consultas ahora mismo. Prueba en un minuto." });
    }
    if (err instanceof Anthropic.APIError) {
      return resp(err.status || 502, { error: "El asistente no está disponible ahora mismo." });
    }
    return resp(500, { error: "Error inesperado en el asistente." });
  }
};
