/* =====================================================================
   TUS PROYECTOS
   ---------------------------------------------------------------------
   Cada objeto es una ficha. Copia uno, pégalo y edítalo para añadir
   los tuyos. Borra los que no quieras. El orden aquí es el orden en
   que se muestran (los "destacado: true" salen igual, solo llevan
   una marca visual).

   categoria: define en qué filtro aparece. Valores posibles:
     "web"    -> Webs y landings
     "tienda" -> Tiendas
     "app"    -> Apps y paneles
     "opt"    -> Optimización (accesibilidad / rendimiento)
   ===================================================================== */

window.PROYECTOS = [

  {
    icono: "📅",
    categoria: "app",
    titulo: "Reserva de citas para una clínica dental",
    cliente: "Clínica dental",
    sector: "Salud",
    anio: 2025,
    desc: "Agenda web con elección de servicio y profesional, confirmación por email y recordatorio automático 24 h antes de la cita.",
    problema: "Solo se podía reservar por teléfono. Había huecos sin cubrir y muchas ausencias sin avisar.",
    solucion: "Diseñé el flujo de reserva en 3 pasos, lo conecté a su calendario y automaticé los correos de confirmación y recordatorio.",
    rol: "Diseño de la experiencia y desarrollo completo",
    stack: ["HTML", "CSS", "JavaScript", "API de calendario", "Netlify"],
    resultado: "−55% de ausencias y unas 3 h/día menos de teléfono en recepción",
    destacado: true
  },

  {
    icono: "🏺",
    categoria: "tienda",
    titulo: "Tienda online de cerámica artesanal",
    cliente: "Taller de cerámica",
    sector: "Artesanía",
    anio: 2024,
    desc: "Catálogo con fichas de producto, carrito y pago con tarjeta, más un panel sencillo para actualizar existencias.",
    problema: "Vendían solo en ferias presenciales. No tenían catálogo online ni forma de cobrar por internet.",
    solucion: "Monté la tienda con un generador de sitios rápido y le integré pagos y control de stock básico que el cliente gestiona solo.",
    rol: "Desarrollo e integración de pagos",
    stack: ["Astro", "Stripe", "Snipcart"],
    resultado: "El 40% de las ventas ya son online seis meses después"
  },

  {
    icono: "🚀",
    categoria: "web",
    titulo: "Landing de lanzamiento para una app de finanzas",
    cliente: "Startup fintech",
    sector: "Finanzas",
    anio: 2025,
    desc: "Página única de captación con lista de espera, animaciones al hacer scroll y prueba A/B del titular.",
    problema: "Querían medir interés y reunir una lista de espera antes de lanzar la app.",
    solucion: "Diseñé y desarrollé la landing, preparé dos variantes del mensaje principal y dejé la analítica lista para leer resultados.",
    rol: "Diseño de interfaz y desarrollo",
    stack: ["HTML", "CSS", "JavaScript", "Plausible"],
    resultado: "2.300 registros en la lista de espera en 4 semanas"
  },

  {
    icono: "🔎",
    categoria: "web",
    titulo: "Centro de ayuda con buscador instantáneo",
    cliente: "SaaS de facturación",
    sector: "Software",
    anio: 2024,
    desc: "Base de conocimiento con categorías, búsqueda que responde mientras escribes y votación de utilidad en cada artículo.",
    problema: "El equipo de soporte recibía las mismas preguntas una y otra vez.",
    solucion: "Estructuré todo el contenido de ayuda, añadí un buscador local muy rápido y un sistema para detectar qué artículos fallan.",
    rol: "Arquitectura de contenido y desarrollo",
    stack: ["Astro", "Pagefind", "CSS"],
    resultado: "−38% de tickets de primer nivel en 3 meses"
  },

  {
    icono: "🎧",
    categoria: "app",
    titulo: "Panel de métricas para una productora de pódcast",
    cliente: "Productora de audio",
    sector: "Medios",
    anio: 2025,
    desc: "Cuadro de mando que reúne las descargas de todas las plataformas por episodio, con gráficos y exportación a CSV.",
    problema: "Los datos estaban repartidos en cuatro plataformas distintas y el informe semanal se hacía a mano.",
    solucion: "Unifiqué las fuentes en una sola vista con gráficos claros y un botón de exportación para su informe de patrocinadores.",
    rol: "Desarrollo frontend",
    stack: ["JavaScript", "Chart.js", "Fetch API"],
    resultado: "El informe semanal pasó de media jornada a ser automático"
  },

  {
    icono: "🎓",
    categoria: "web",
    titulo: "Rediseño del sitio de una escuela de idiomas",
    cliente: "Escuela de idiomas",
    sector: "Educación",
    anio: 2024,
    desc: "Rediseño responsive completo, nueva organización de los cursos y formulario de matrícula más corto.",
    problema: "La web anterior era lenta, no se veía bien en móvil y el 70% del tráfico entraba desde el teléfono.",
    solucion: "Repensé la estructura, rehíce la maquetación mobile-first y optimicé imágenes y fuentes.",
    rol: "Rediseño y maquetación",
    stack: ["WordPress a medida", "PHP", "CSS"],
    resultado: "+32% de solicitudes de información y carga 3× más rápida"
  },

  {
    icono: "🤝",
    categoria: "app",
    titulo: "Área privada de socios de una asociación cultural",
    cliente: "Asociación cultural",
    sector: "Tercer sector",
    anio: 2024,
    desc: "Zona con alta de socio, descarga de recibos, datos personales y avisos de próximos eventos.",
    problema: "Las altas y las cuotas se llevaban a mano en hojas de cálculo y se perdía información.",
    solucion: "Creé una área privada ligera con base de datos gestionada y correos automáticos de bienvenida y renovación.",
    rol: "Desarrollo full-stack ligero",
    stack: ["JavaScript", "Supabase", "Netlify"],
    resultado: "200 socios migrados y renovaciones sin trabajo manual"
  },

  {
    icono: "♿",
    categoria: "opt",
    titulo: "Accesibilidad y rendimiento de un medio digital",
    cliente: "Revista online",
    sector: "Medios",
    anio: 2025,
    desc: "Auditoría de accesibilidad WCAG AA y plan de mejora de velocidad aplicado sobre la web en producción.",
    problema: "Puntuación baja en Lighthouse y quejas de lectores que usan lector de pantalla.",
    solucion: "Corregí contraste y foco de teclado, añadí texto alternativo, ordené los encabezados y optimicé imágenes con carga diferida.",
    rol: "Consultoría y correcciones",
    stack: ["Auditoría a11y", "HTML semántico", "CSS", "Lighthouse"],
    resultado: "Lighthouse de 62 a 98 y navegación por teclado completa"
  }

];
