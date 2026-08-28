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

PLANES MENSUALES en dólares (cuota pequeña, sin permanencia, alta $0):
- Esencial: $15/mes. Web de 1 página siempre al día, hosting y dominio
  gestionados, 1 cambio de contenido al mes, soporte por email en 48 h.
- Negocio: $35/mes. Hasta 5 páginas, cambios de contenido ilimitados,
  formulario, analítica y SEO básico, soporte prioritario en 24 h.
- Pro: $65/mes. Todo lo de Negocio, más tienda/reservas/integraciones,
  asistente con IA para tus clientes, informe mensual y prioridad máxima.
También proyectos puntuales con presupuesto a medida (sin suscripción).

PROCESO DE TRABAJO:
1. Primera llamada gratuita de 20 minutos.
2. Propuesta con el plan recomendado en 24-48 horas.
3. Los planes mensuales se pagan por adelantado cada mes, sin permanencia.
   En proyectos puntuales, 50 % al empezar y 50 % a la entrega.
4. Primera versión publicada en 1-2 semanas; mejoras continuas cada mes.
5. Soporte incluido en el plan; cancela cuando quieras.

TECNOLOGÍAS: HTML, CSS y JavaScript; Astro, WordPress a medida o React según el proyecto.

CÓMO CONTACTAR: desde el formulario de contacto de la propia web. Respuesta en menos de 24 h.
`.trim(),

  /* Respuestas rápidas. "claves" son palabras o trozos de frase; si el
     mensaje del cliente contiene alguna, se muestra esa respuesta. */
  faqs: [
    { claves: ["precio", "cuesta", "cuánto vale", "tarifa", "presupuesto", "coste", "cuanto cuesta", "suscripción", "plan", "mensual"],
      respuesta: "Trabajo con planes mensuales sin permanencia y con alta gratuita: Esencial $15/mes, Negocio $35/mes y Pro $65/mes. También hago proyectos puntuales con presupuesto a medida." },

    { claves: ["tarda", "plazo", "cuánto tiempo", "cuando estará", "duración", "entrega"],
      respuesta: "La primera versión de tu web se publica en 1-2 semanas, y a partir de ahí se mejora cada mes dentro de tu plan." },

    { claves: ["pago", "pagar", "factura", "anticipo", "señal", "cómo se paga", "permanencia", "cancelar"],
      respuesta: "Los planes mensuales se pagan por adelantado cada mes y no tienen permanencia: cancelas cuando quieras. En proyectos puntuales, 50 % al empezar y 50 % a la entrega." },

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
