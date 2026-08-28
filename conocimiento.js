/* =====================================================================
   BASE DE CONOCIMIENTO DEL ASISTENTE
   ---------------------------------------------------------------------
   Esto es lo que el asistente de la web sabe responder por su cuenta.
   Edítalo para que hable como tú. Se usa de dos formas:
     - Nivel 1 (siempre): responde emparejando palabras clave con "faqs".
     - Nivel 2 (si activas la IA en config.js): se envía "contexto" a Claude
       para que responda también preguntas abiertas.
   ===================================================================== */

window.CONOCIMIENTO = {

  /* Texto base. Escríbelo en lenguaje natural, como se lo contarías a un
     cliente nuevo. Cuanto más completo, mejor responde la IA. */
  contexto: `
Yamilet Abdalh es diseñadora y desarrolladora web. Hace sitios y landings,
tiendas online, aplicaciones web y paneles, y también auditorías de
accesibilidad y rendimiento. Trabaja en remoto con clientes de cualquier país.

SERVICIOS Y PRECIOS DE REFERENCIA en dólares (el precio final se cierra tras una llamada):
- Landing express: $490. Una página optimizada, formulario y analítica.
  Entrega en 1 semana. 2 rondas de cambios.
- Web de soporte: $1,900. Centro de ayuda con buscador, chat en vivo,
  portal de tickets del cliente y formación del equipo.
- Proyecto a medida: desde $3,500. Reservas, pagos o integraciones,
  diseño de sistema propio, encuestas y panel de métricas, mantenimiento opcional.

PROCESO DE TRABAJO:
1. Primera llamada gratuita de 20 minutos.
2. Propuesta con presupuesto fijo en 24-48 horas.
3. Pago 50 % al arrancar y 50 % a la entrega (a medida se puede fraccionar por hitos).
4. Entrega en 2-4 semanas según integraciones.
5. 30 días de correcciones sin coste tras el lanzamiento; planes de mantenimiento opcionales.

TECNOLOGÍAS: HTML, CSS y JavaScript; Astro, WordPress a medida o React según el proyecto.

CÓMO CONTACTAR: desde el formulario de contacto de la propia web. Respuesta en menos de 24 h.
`.trim(),

  /* Respuestas rápidas. "claves" son palabras o trozos de frase; si el
     mensaje del cliente contiene alguna, se muestra esa respuesta. */
  faqs: [
    { claves: ["precio", "cuesta", "cuánto vale", "tarifa", "presupuesto", "coste", "cuanto cuesta"],
      respuesta: "Los precios de referencia son: Landing express $490, Web de soporte $1,900 y proyectos a medida desde $3,500. El precio final se cierra con presupuesto fijo tras una llamada gratuita." },

    { claves: ["tarda", "plazo", "cuánto tiempo", "cuando estará", "duración", "entrega"],
      respuesta: "Una landing suele estar lista en 1 semana; una web completa, entre 2 y 4 semanas según las integraciones." },

    { claves: ["pago", "pagar", "factura", "anticipo", "señal", "cómo se paga"],
      respuesta: "El pago es 50 % al arrancar y 50 % a la entrega. En proyectos a medida se puede fraccionar por hitos." },

    { claves: ["remoto", "país", "extranjero", "distancia", "online", "presencial", "idioma"],
      respuesta: "Sí, Yamilet trabaja en remoto con clientes de cualquier país, con reuniones por videollamada." },

    { claves: ["soporte", "mantenimiento", "después de", "garantía", "actualizaciones"],
      respuesta: "Incluye 30 días de correcciones sin coste tras el lanzamiento, y hay planes de mantenimiento mensual opcionales." },

    { claves: ["tecnología", "stack", "wordpress", "react", "astro", "con qué"],
      respuesta: "Trabaja con HTML, CSS y JavaScript, y con Astro, WordPress a medida o React según lo que necesite el proyecto." },

    { claves: ["contacto", "hablar", "llamada", "reunión", "cita", "empezar", "contratar"],
      respuesta: "Escríbele desde el formulario de contacto de esta misma página y te responde en menos de 24 h. La primera llamada de 20 minutos es gratis." },

    { claves: ["accesibilidad", "wcag", "lighthouse", "rendimiento", "velocidad", "lento"],
      respuesta: "Hace auditorías de accesibilidad WCAG AA y mejora de rendimiento. En un caso real subió un medio digital de 62 a 98 en Lighthouse." },

    { claves: ["tienda", "ecommerce", "e-commerce", "vender", "pagos", "stripe", "carrito"],
      respuesta: "Monta tiendas online con pasarela de pago (por ejemplo Stripe) y gestión de stock sencilla. Puedes ver el proyecto de la tienda de cerámica en la sección Proyectos." },

    { claves: ["reserva", "citas", "agenda", "calendario", "booking"],
      respuesta: "Desarrolla sistemas de reservas con confirmación y recordatorios automáticos. Un cliente redujo un 55 % las ausencias con uno de ellos." }
  ],

  /* Mensajes de la interfaz del asistente */
  saludo: "¡Hola! Soy el asistente de Yamilet 👋 Puedo ayudarte con dudas sobre servicios, precios, plazos y proceso de trabajo. ¿Qué te gustaría saber?",
  sugerencias: ["¿Cuánto cuesta una web?", "¿Cuánto se tarda?", "¿Cómo son los pagos?", "¿Trabajas en remoto?"],
  sinRespuesta: "Esa pregunta la responde mejor Yamilet en persona. Déjale tu mensaje en el formulario de contacto de esta página y te contesta en menos de 24 h."
};
