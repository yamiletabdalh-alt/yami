/* =====================================================================
   CONFIGURACIÓN DEL PORTFOLIO
   ---------------------------------------------------------------------
   Edita SOLO este archivo para conectar los servicios.
   No hace falta tocar index.html, style.css ni script.js.
   ===================================================================== */

window.PORTFOLIO_CONFIG = {

  /* --- FORMULARIO DE CONTACTO Y BOLETÍN (Web3Forms) ------------------
     1. Entra en https://web3forms.com  (gratis, solo pide un email).
     2. Escribe el email donde quieres RECIBIR los mensajes y te dan
        una "Access Key".
     3. Pega esa clave aquí, entre las comillas:                        */
  web3formsKey: "dcff39c2-5260-45ca-9d30-d985e128da88",

  /* Mientras la clave no esté puesta, los formularios funcionan en
     "modo demo" (validan pero no envían nada). En cuanto la pongas,
     envían de verdad a tu correo. */


  /* --- DATOS DE CONTACTO QUE SE MUESTRAN EN LA WEB ------------------ */
  /* Deja "" y no se muestra nada (el contacto va por el formulario). */
  email: "",

  /* WhatsApp en formato internacional, SIN "+" ni espacios.
     Ej. España: "34600112233".  Déjalo "" para ocultar el botón.     */
  whatsapp: "",


  /* --- ASISTENTE QUE RESPONDE SOLO A LOS CLIENTES ------------------
     ia: false -> el asistente responde con las respuestas de
                  conocimiento.js. Funciona ya, sin coste ni servidor.
     ia: true  -> además usa IA (Claude) para preguntas abiertas.
                  Requiere desplegar la función y añadir tu
                  ANTHROPIC_API_KEY (ver CONFIGURAR.md).               */
  asistente: {
    ia: true,
    endpoint: "/.netlify/functions/asistente"
  },


  /* --- PAGOS ONLINE (Stripe Payment Links) -----------------------
     Pega aquí el enlace de cada plan (https://buy.stripe.com/...).
     Si un plan queda "", su botón "Empezar" lleva al formulario.   */
  pagos: {
    esencial: "https://buy.stripe.com/test_bJedRafou4Jf57h9b73cc00",
    negocio:  "https://buy.stripe.com/test_4gM28s2BIfnT2Z98733cc01",
    pro:      "https://buy.stripe.com/test_cNidRa2BIa3zfLV8733cc02"
  },


  /* --- ANALÍTICA DE VISITAS (Cloudflare Web Analytics, gratis) -----
     Pega aquí el "token" que te da Cloudflare (Analytics → Web Analytics).
     Vacío "" = sin analítica.                                       */
  analiticaCloudflare: "",


  /* --- REDES (el pie de página) — pon la URL o deja "" para ocultar --- */
  redes: {
    github:    "",
    linkedin:  "",
    instagram: "",
    email:     ""
  }

};
