/* =====================================================================
   TUS PROYECTOS
   ---------------------------------------------------------------------
   Cada objeto es una ficha. Copia uno, pégalo y edítalo para añadir
   los tuyos reales. Borra los que no quieras. El orden aquí es el
   orden en que se muestran.

   categoria: define en qué filtro aparece. Valores posibles:
     "diseno"   -> Diseño
     "terapias" -> Terapias / bienestar
     "redes"    -> Redes sociales
     "ia"       -> Inteligencia artificial
   ===================================================================== */

window.PROYECTOS = [

  {
    icono: "🎨",
    categoria: "diseno",
    titulo: "Identidad visual para un centro de bienestar",
    cliente: "Centro de bienestar",
    sector: "Salud",
    anio: 2025,
    desc: "Logo, paleta de color, tipografías y plantillas listas para redes, carteles y documentos de consulta.",
    problema: "La marca se veía distinta en la web, en los carteles y en Instagram; no había coherencia.",
    solucion: "Creé un manual de marca sencillo y un juego de plantillas editables para que el equipo publique sin diseñar de cero.",
    rol: "Dirección de arte y diseño",
    stack: ["Figma", "Illustrator", "Canva"],
    resultado: "Imagen coherente en todos los canales y horas menos de trabajo al publicar",
    destacado: true
  },

  {
    icono: "💍",
    categoria: "diseno",
    titulo: "Rediseño de la web de una taller de joyería",
    cliente: "Taller de joyería",
    sector: "Moda y complementos",
    anio: 2024,
    desc: "Web-catálogo con estética editorial, fichas de producto centradas en la fotografía y carga muy rápida.",
    problema: "La web antigua era lenta y no transmitía el nivel artesanal del producto.",
    solucion: "Rediseño con tipografía de contraste, mucho aire, imágenes optimizadas y una navegación mínima.",
    rol: "Diseño de interfaz y maquetación",
    stack: ["Figma", "HTML", "CSS"],
    resultado: "+45 % de tiempo de permanencia en las fichas de producto"
  },

  {
    icono: "🌿",
    categoria: "terapias",
    titulo: "Web y reservas para una consulta de psicología",
    cliente: "Psicóloga colegiada",
    sector: "Salud mental",
    anio: 2025,
    desc: "Web informativa sobre el enfoque terapéutico, con reserva de sesión online y primera consulta gratuita.",
    problema: "Las reservas llegaban por WhatsApp, se perdían citas y quedaban huecos sin cubrir.",
    solucion: "Página clara y cercana + agenda con confirmación automática y recordatorio 24 h antes.",
    rol: "Diseño y desarrollo",
    stack: ["HTML", "CSS", "JavaScript", "Cal.com"],
    resultado: "−50 % de ausencias y agenda completa con 3 semanas de antelación"
  },

  {
    icono: "📔",
    categoria: "terapias",
    titulo: "Material digital para terapia entre sesiones",
    cliente: "Terapeuta ocupacional",
    sector: "Rehabilitación",
    anio: 2024,
    desc: "Cuadernos de ejercicios interactivos y una zona privada donde el paciente los completa entre sesiones.",
    problema: "Los ejercicios en papel se perdían y no había forma de ver si se hacían.",
    solucion: "Fichas rellenables y un panel donde la terapeuta ve el progreso de cada paciente.",
    rol: "Diseño de material y desarrollo",
    stack: ["Figma", "HTML", "CSS", "JavaScript"],
    resultado: "Más constancia con los ejercicios y sesiones mejor aprovechadas"
  },

  {
    icono: "📱",
    categoria: "redes",
    titulo: "Optimización de Instagram para un estudio de yoga",
    cliente: "Estudio de yoga",
    sector: "Bienestar",
    anio: 2025,
    desc: "Auditoría de la cuenta, nuevas líneas de contenido, calendario mensual y plantillas de reels reutilizables.",
    problema: "Publicaban sin plan y el alcance llevaba meses estancado.",
    solucion: "Definí temáticas fijas, un calendario realista y guiones de reels que el equipo puede repetir.",
    rol: "Estrategia y diseño de contenido",
    stack: ["Metricool", "Canva", "CapCut"],
    resultado: "+120 % de alcance y +38 % de seguidores en 3 meses"
  },

  {
    icono: "✨",
    categoria: "redes",
    titulo: "Gestión de redes de una marca de cosmética natural",
    cliente: "Marca de cosmética",
    sector: "Comercio",
    anio: 2024,
    desc: "Plan de contenidos, diseño de publicaciones, textos y programación semanal en Instagram y TikTok.",
    problema: "No tenían tiempo ni criterio para publicar con constancia.",
    solucion: "Me encargo del ciclo completo: idea, diseño, copy y programación, con revisión mensual de resultados.",
    rol: "Community management y diseño",
    stack: ["Meta Business Suite", "Canva", "Notion"],
    resultado: "Publicación constante y +25 % de tráfico a la tienda desde redes"
  },

  {
    icono: "🤖",
    categoria: "ia",
    titulo: "Asistente con IA para atención al cliente",
    cliente: "Tienda online",
    sector: "Comercio",
    anio: 2025,
    desc: "Chat en la web que responde dudas de pedidos, envíos y devoluciones con la información real de la tienda.",
    problema: "El 60 % de los mensajes de soporte eran preguntas repetidas.",
    solucion: "Conecté un asistente con IA a su base de conocimiento, con paso a una persona cuando hace falta.",
    rol: "Integración y ajuste de instrucciones",
    stack: ["JavaScript", "API de Claude", "Netlify Functions"],
    resultado: "−55 % de consultas de primer nivel y respuestas 24/7"
  },

  {
    icono: "⚡",
    categoria: "ia",
    titulo: "Automatización de contenidos con IA para un blog",
    cliente: "Consultora",
    sector: "Servicios profesionales",
    anio: 2024,
    desc: "Flujo que convierte notas de voz en borradores de artículo estructurados y con el tono de la marca.",
    problema: "Tenían ideas constantemente, pero nunca tiempo de sentarse a redactar.",
    solucion: "Monté un flujo que transcribe, ordena las ideas y redacta un primer borrador listo para revisar.",
    rol: "Diseño del flujo y de las instrucciones",
    stack: ["Whisper", "API de Claude", "Make"],
    resultado: "De 1 artículo al mes a 1 por semana"
  }

];
