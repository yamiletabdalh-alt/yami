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

PROYECTOS REALES (está empezando y aún no tiene casos de clientes publicados;
no inventes clientes, cifras ni resultados):
- Su propia web profesional (esta), con planes de pago online, formulario y SEO.
- El asistente con IA de esta web (tú mismo).
- Un informe diario automático de visitas que le llega por email.
- La marca y el lanzamiento de su canal «Redes con IA» (YouTube e Instagram).
- Una web con reservas para terapeutas, en desarrollo: busca sus primeros casos
  con condiciones especiales de lanzamiento.

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

LLAMADA GRATIS: se reserva en la página "Reservar llamada" (llamada.html): el
cliente elige día y hora (hora de Nueva York), 20 minutos por videollamada.

CLIENTES ACTUALES, QUEJAS O PROBLEMAS: en la página "Soporte y quejas"
(soporte.html) se abre un caso con número de seguimiento; respuesta en menos
de 24 h. Para cambiar la tarjeta, ver facturas o cancelar, el cliente usa su
portal de cliente de Stripe (enlace en el pie de la web y en Soporte).

CANCELACIÓN Y REEMBOLSOS: sin permanencia; la cancelación se aplica al final
del mes ya pagado. Si se cancela en los 7 días siguientes al primer pago y
Yamilet aún no ha empezado el trabajo, se devuelve el 100 %.
Si alguien está molesto o tiene una queja, discúlpate con amabilidad y
dirígelo a la página de Soporte y quejas para que quede registrado.
`.trim(),

  /* Respuestas rápidas. "claves" son palabras o trozos de frase; si el
     mensaje del cliente contiene alguna, se muestra esa respuesta. */
  faqs: [
    // Primero quejas y cancelaciones: si hay empate, gana la que va antes
    { claves: ["queja", "reclamación", "reclamacion", "problema", "no funciona", "error", "molesta", "enfadad", "mal servicio", "soporte", "ayuda con mi web", "incidencia"],
      respuesta: "Siento mucho el inconveniente. Para que quede registrado y se resuelva cuanto antes, abre un caso en Soporte y quejas (botón de abajo): recibirás un número de seguimiento y respuesta en menos de 24 h." },

    { claves: ["cancelar", "cancelación", "cancelacion", "darme de baja", "baja", "reembolso", "devolución", "devolucion", "cambiar tarjeta", "factura"],
      respuesta: "Puedes cancelar cuando quieras desde tu portal de cliente (botón de abajo): se aplica al final del mes ya pagado. Si cancelas en los 7 días siguientes al primer pago y aún no se ha empezado tu proyecto, se devuelve el 100 %." },

    { claves: ["precio", "cuesta", "cuánto vale", "tarifa", "presupuesto", "coste", "cuanto cuesta", "suscripción", "plan", "mensual"],
      respuesta: "Trabajo con planes mensuales sin permanencia y con alta gratuita: Esencial $15/mes, Negocio $35/mes y Pro $65/mes. También hago proyectos puntuales con presupuesto a medida." },

    { claves: ["tarda", "plazo", "cuánto tiempo", "cuando estará", "duración", "entrega"],
      respuesta: "La primera versión de tu web se publica en 1-2 semanas, y a partir de ahí se mejora cada mes dentro de tu plan." },

    { claves: ["pago", "pagar", "factura", "anticipo", "señal", "cómo se paga", "permanencia", "cancelar"],
      respuesta: "Los planes mensuales se pagan por adelantado cada mes y no tienen permanencia: cancelas cuando quieras. En proyectos puntuales, 50 % al empezar y 50 % a la entrega." },

    { claves: ["remoto", "país", "extranjero", "distancia", "online", "presencial", "idioma"],
      respuesta: "Sí, Yamilet trabaja en remoto con clientes de cualquier país, con reuniones por videollamada." },

    { claves: ["soporte", "mantenimiento", "después de", "garantía", "actualizaciones"],
      respuesta: "Mientras tengas tu plan mensual activo, la web se mantiene al día y tienes soporte por email: 48 h en Esencial, 24 h en Negocio y prioridad máxima en Pro." },

    { claves: ["diseño", "logo", "logotipo", "identidad", "marca", "branding", "imagen"],
      respuesta: "Hace identidad visual completa: logo, colores, tipografías y plantillas para redes y documentos, con un manual de marca sencillo para que el equipo publique sin diseñar de cero." },

    { claves: ["redes", "instagram", "tiktok", "community", "contenido", "publicaciones", "seguidores"],
      respuesta: "Gestiona y optimiza redes sociales: auditoría de la cuenta, plan de contenidos, diseño de publicaciones y programación. Ahora mismo lo aplica en su propio canal, «Redes con IA»." },

    { claves: ["ia", "inteligencia artificial", "chatbot", "asistente", "automatizar", "automatización", "chatgpt", "claude"],
      respuesta: "Integra IA para negocios: asistentes de atención al cliente conectados a tu información (como este mismo chat, que lo montó ella) y automatizaciones, como el informe diario de visitas que le llega por email." },

    { claves: ["terapia", "psicología", "psicologia", "consulta", "paciente", "sesión", "terapeuta"],
      respuesta: "Ofrece a profesionales del bienestar webs claras sobre su enfoque terapéutico, con reserva de sesiones online y recordatorios. Está buscando sus primeros casos con condiciones especiales de lanzamiento." },

    { claves: ["reserva", "citas", "agenda", "calendario", "booking"],
      respuesta: "Desarrolla sistemas de reservas con confirmación y recordatorios automáticos, para que las citas no se pierdan por WhatsApp." },

    { claves: ["contacto", "hablar", "llamada", "llamar", "reunión", "reunion", "cita", "videollamada", "empezar", "contratar"],
      respuesta: "La primera llamada de 20 minutos es gratis: elige día y hora en la página de reservas (botón de abajo). Si prefieres, escríbele desde el formulario de contacto y te responde en menos de 24 h." },

  ],

  /* Botones de acción que el asistente muestra según lo que pregunte el
     cliente. "url" puede ser una página o "portal" (el de Stripe). */
  acciones: [
    { claves: ["llamada", "llamar", "reunión", "reunion", "cita", "videollamada", "hablar", "empezar", "contratar"], texto: "📞 Reservar llamada gratis", url: "llamada.html" },
    { claves: ["queja", "reclamación", "reclamacion", "problema", "no funciona", "error", "molesta", "enfadad", "soporte", "incidencia", "ayuda con mi web"], texto: "🆘 Abrir caso de soporte", url: "soporte.html" },
    { claves: ["cancelar", "cancelación", "cancelacion", "baja", "reembolso", "devolución", "devolucion", "tarjeta", "factura"], texto: "💳 Mi portal de cliente", url: "portal" },
    { claves: ["precio", "cuesta", "cuánto", "cuanto", "plan", "tarifa", "pagar", "suscrib"], texto: "💰 Ver planes", url: "./#servicios" }
  ],

  /* Mensajes de la interfaz del asistente */
  saludo: "¡Hola! Soy el asistente de Yamilet 👋 Puedo ayudarte con dudas sobre servicios, precios, plazos y proceso de trabajo. ¿Qué te gustaría saber?",
  sugerencias: ["¿Cuánto cuestan los planes?", "Quiero reservar una llamada", "¿Haces webs para terapias?", "Tengo un problema con mi web"],
  sinRespuesta: "Esa pregunta la responde mejor Yamilet en persona. Déjale tu mensaje en el formulario de contacto de esta página y te contesta en menos de 24 h."
};
