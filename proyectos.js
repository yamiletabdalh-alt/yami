/* =====================================================================
   TUS PROYECTOS
   ---------------------------------------------------------------------
   Cada objeto es una ficha. Copia uno, pégalo y edítalo para añadir
   los tuyos reales. Borra los que no quieras. El orden aquí es el
   orden en que se muestran.

   IMPORTANTE: aquí solo van trabajos que existen de verdad. Cuando
   tengas tu primer cliente, añade su ficha arriba del todo (con su
   permiso para nombrarlo, o anonimizado: "Consulta de psicología").

   imagen (opcional): foto de la ficha, p. ej. "img/mi-proyecto.jpg"
   (mejor en horizontal, proporción 16:10). Sin imagen se muestra el
   icono en grande. "credito" pone un pie pequeño sobre la foto.

   categoria: define en qué filtro aparece. Valores posibles:
     "diseno"   -> Diseño
     "terapias" -> Terapias / bienestar
     "redes"    -> Redes sociales
     "ia"       -> Inteligencia artificial
   ===================================================================== */

window.PROYECTOS = [

  {
    icono: "🌐",
    imagen: "img/proyecto-web.jpg",
    imagenAlt: "Portada de la web de Yamilet Abdalh",
    categoria: "diseno",
    titulo: "Mi web profesional, de cero a publicada",
    cliente: "Proyecto propio",
    sector: "Servicios digitales",
    anio: 2026,
    desc: "Esta misma web: proyectos filtrables, planes mensuales con pago online, formulario de contacto y preparada para aparecer en Google.",
    problema: "Necesitaba un escaparate profesional para mostrar mis servicios y captar clientes sin depender solo de las redes.",
    solucion: "Diseñé la estructura y los textos, monté los planes de suscripción con Stripe, el formulario que llega a mi correo y la configuración para Google (Search Console, sitemap).",
    rol: "Dirección del proyecto, diseño y contenido, con desarrollo asistido por IA",
    stack: ["HTML", "CSS", "JavaScript", "Netlify", "Stripe"],
    resultado: "Web publicada 24/7, rápida y verificada en Google Search Console",
    destacado: true
  },

  {
    icono: "🤖",
    imagen: "img/proyecto-asistente.jpg",
    imagenAlt: "El asistente con IA respondiendo a una pregunta sobre precios",
    categoria: "ia",
    titulo: "Asistente con IA que atiende a mis visitantes",
    cliente: "Proyecto propio",
    sector: "Atención al cliente",
    anio: 2026,
    desc: "El chat de esta web: responde al momento dudas sobre servicios, precios, plazos y forma de trabajo. Pruébalo abajo a la derecha.",
    problema: "Muchas preguntas se repiten y un cliente que no recibe respuesta rápida se va a otra web.",
    solucion: "Escribí una base de conocimiento con mi información real y la conecté a Claude para que responda preguntas abiertas sin inventar, y que derive al formulario lo que no sabe.",
    rol: "Diseño de la base de conocimiento, instrucciones e integración",
    stack: ["JavaScript", "API de Claude", "Netlify Functions"],
    resultado: "Respuestas al instante, de día y de noche, sin que yo tenga que estar conectada"
  },

  {
    icono: "📊",
    categoria: "ia",
    titulo: "Informe diario automático de visitas",
    cliente: "Proyecto propio",
    sector: "Automatización",
    anio: 2026,
    desc: "Un contador de visitas propio y una tarea programada que cada mañana me envía por email cuánta gente entró ayer y en la última semana.",
    problema: "Quería saber si la web funciona sin tener que entrar cada día a un panel de estadísticas.",
    solucion: "Cada visita suma en un contador guardado en la nube, y un proceso automático programado a diario prepara el resumen y me lo manda al correo.",
    rol: "Diseño de la automatización",
    stack: ["Netlify Functions", "Netlify Blobs", "GitHub Actions", "Cloudflare Analytics"],
    resultado: "Seguimiento diario de la web sin hacer nada a mano"
  },

  {
    icono: "🎨",
    imagen: "img/redes-con-ia-logo.jpg",
    imagenAlt: "Logo de Redes con IA: botón de play amarillo sobre círculo morado y rosa",
    categoria: "diseno",
    titulo: "Identidad visual de «Redes con IA»",
    cliente: "Proyecto propio",
    sector: "Creación de contenido",
    anio: 2026,
    desc: "Logo y banner del canal: degradado morado, rosa y naranja, texto amarillo con brillo e iconos de play, chat y corazón.",
    problema: "Un canal nuevo necesita reconocerse a primera vista y verse igual en todas las plataformas.",
    solucion: "Definí una paleta vibrante y un logo cuadrado que funciona como foto de perfil, marca de agua y banner a la vez.",
    rol: "Dirección de arte y diseño",
    stack: ["Canva"],
    resultado: "Una sola imagen de marca para YouTube e Instagram"
  },

  {
    icono: "📱",
    imagen: "img/redes-con-ia-banner.jpg",
    imagenAlt: "Banner del canal Redes con IA: degradado morado, rosa y naranja",
    categoria: "redes",
    titulo: "Lanzamiento del canal «Redes con IA»",
    cliente: "Proyecto propio",
    sector: "Redes sociales",
    anio: 2026,
    desc: "Mi canal sobre redes sociales e IA: estrategia, perfiles en YouTube e Instagram, calendario de publicación y guiones de los primeros vídeos.",
    problema: "Empezar en redes sin plan suele acabar en publicar sin constancia y abandonar a las pocas semanas.",
    solucion: "Definí los temas fijos del canal, un calendario realista, el guion del primer vídeo y su versión corta (short), y unifiqué nombre y marca en todas las plataformas.",
    rol: "Estrategia, contenido y diseño",
    stack: ["YouTube Studio", "Instagram", "Canva", "Claude"],
    resultado: "Canal y perfiles creados, con el plan de contenidos en marcha"
  },

  {
    icono: "🌿",
    imagen: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=960&h=600&q=75",
    imagenAlt: "Dos mujeres conversando en una mesa, en un ambiente tranquilo",
    credito: "Foto ilustrativa · Unsplash",
    categoria: "terapias",
    titulo: "Web con reservas para terapeutas",
    cliente: "Proyecto en desarrollo",
    sector: "Bienestar",
    anio: 2026,
    desc: "Una web cercana para presentar tu enfoque terapéutico, con agenda online, confirmación automática y recordatorio antes de cada sesión.",
    problema: "Muchas consultas gestionan las citas por WhatsApp: se pierden mensajes, hay ausencias y huecos sin cubrir.",
    solucion: "Estoy preparando una base adaptable para terapeutas y la quiero construir junto a mis primeras clientas, con condiciones especiales de lanzamiento.",
    rol: "Diseño y desarrollo",
    stack: ["HTML", "CSS", "JavaScript", "Agenda online"],
    resultado: "¿Eres terapeuta? Escríbeme y sé uno de los primeros casos"
  }

];
