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
Yamilet Abdalh trabaja en cuatro áreas: (1) DISEÑO: identidad visual, logos,
paletas, tipografías y plantillas para redes y documentos; (2) TERAPIAS Y
BIENESTAR: webs claras y sistemas de reserva de sesiones para consultas de
psicología y terapeutas, y material digital para pacientes; (3) REDES SOCIALES:
auditoría, plan de contenidos, diseño de publicaciones y programación
(Instagram, TikTok); (4) INTELIGENCIA ARTIFICIAL: asistentes con IA para
atención al cliente y automatización de contenidos.
Trabaja en remoto con clientes de cualquier país.

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

    { claves: ["diseño", "logo", "logotipo", "identidad", "marca", "branding", "imagen"],
      respuesta: "Hace identidad visual completa: logo, colores, tipografías y plantillas para redes y documentos, con un manual de marca sencillo para que el equipo publique sin diseñar de cero." },

    { claves: ["redes", "instagram", "tiktok", "community", "contenido", "publicaciones", "seguidores"],
      respuesta: "Gestiona y optimiza redes sociales: auditoría de la cuenta, plan de contenidos, diseño de publicaciones y programación. En un caso real, +120 % de alcance y +38 % de seguidores en 3 meses." },

    { claves: ["ia", "inteligencia artificial", "chatbot", "asistente", "automatizar", "automatización", "chatgpt", "claude"],
      respuesta: "Integra IA en proyectos reales: asistentes para atención al cliente conectados a tu información, y automatización de contenidos (por ejemplo, de notas de voz a borradores de artículo)." },

    { claves: ["terapia", "psicología", "psicologia", "consulta", "paciente", "sesión", "terapeuta"],
      respuesta: "Trabaja mucho con profesionales del bienestar: webs claras sobre el enfoque terapéutico, reserva de sesiones online con recordatorios y material digital para pacientes." },

    { claves: ["reserva", "citas", "agenda", "calendario", "booking"],
      respuesta: "Desarrolla sistemas de reservas con confirmación y recordatorios automáticos. Una consulta de psicología redujo un 50 % las ausencias con uno de ellos." },

    { claves: ["contacto", "hablar", "llamada", "reunión", "cita", "empezar", "contratar"],
      respuesta: "Escríbele desde el formulario de contacto de esta misma página y te responde en menos de 24 h. La primera llamada de 20 minutos es gratis." }
  ],

  /* Mensajes de la interfaz del asistente */
  saludo: "¡Hola! Soy el asistente de Yamilet 👋 Puedo ayudarte con dudas sobre servicios, precios, plazos y proceso de trabajo. ¿Qué te gustaría saber?",
  sugerencias: ["¿Cuánto cuestan los planes?", "¿Gestionas redes sociales?", "¿Haces webs para terapias?", "¿Trabajas con IA?"],
  sinRespuesta: "Esa pregunta la responde mejor Yamilet en persona. Déjale tu mensaje en el formulario de contacto de esta página y te contesta en menos de 24 h."
};
