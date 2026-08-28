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
  web3formsKey: "PON-AQUI-TU-ACCESS-KEY",

  /* Mientras la clave no esté puesta, los formularios funcionan en
     "modo demo" (validan pero no envían nada). En cuanto la pongas,
     envían de verdad a tu correo. */


  /* --- DATOS DE CONTACTO QUE SE MUESTRAN EN LA WEB ------------------ */
  email: "hola@tudominio.com",

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


  /* --- REDES (el pie de página) — deja "" las que no uses ---------- */
  redes: {
    github:    "https://github.com/tu-usuario",
    linkedin:  "https://linkedin.com/in/tu-usuario",
    instagram: "",
    email:     "hola@tudominio.com"
  }

};
