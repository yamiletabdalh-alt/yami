// ===================================================================
//  PORTFOLIO — lógica de la página
//  Los datos editables están en config.js y proyectos.js
// ===================================================================

function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

var cfg = window.PORTFOLIO_CONFIG || {};
var tieneConfig = !!window.PORTFOLIO_CONFIG;
var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ===== Contador propio de visitas (para el informe diario) =====
try {
  fetch("/.netlify/functions/contar-visita", { method: "POST", keepalive: true }).catch(function () {});
} catch (e) {}

// ===== Analítica de visitas (Cloudflare Web Analytics) =====
if (cfg.analiticaCloudflare) {
  var _cf = document.createElement("script");
  _cf.defer = true;
  _cf.src = "https://static.cloudflareinsights.com/beacon.min.js";
  _cf.setAttribute("data-cf-beacon", '{"token": "' + cfg.analiticaCloudflare + '"}');
  document.head.appendChild(_cf);
}

function web3Listo() {
  return cfg.web3formsKey && !/PON-AQUI|ACCESS-KEY|ACCESS_KEY/i.test(cfg.web3formsKey);
}
function enviarWeb3(datos) {
  return fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(Object.assign({ access_key: cfg.web3formsKey }, datos)),
  }).then(function (r) { return r.json(); });
}

// ===== Año =====
document.getElementById("anio").textContent = new Date().getFullYear();

// ===== Tema =====
var btnTema = document.getElementById("tema");
var temaGuardado = lsGet("tema");
if (temaGuardado) document.documentElement.setAttribute("data-tema", temaGuardado);
btnTema.addEventListener("click", function () {
  var actual = document.documentElement.getAttribute("data-tema");
  var nuevo = actual === "claro" ? "oscuro" : "claro";
  document.documentElement.setAttribute("data-tema", nuevo);
  lsSet("tema", nuevo);
});

// ===== Barra promocional (con el mes actual) =====
var mesPromo = document.getElementById("mes-promo");
if (mesPromo) mesPromo.textContent = new Date().toLocaleDateString("es-ES", { month: "long" });
var promo = document.getElementById("promo");
if (lsGet("promo-cerrada") === "1") promo.hidden = true;
document.getElementById("cerrar-promo").addEventListener("click", function () {
  promo.hidden = true;
  lsSet("promo-cerrada", "1");
});

// ===== Barra de progreso de scroll =====
var barra = document.getElementById("progreso");
addEventListener("scroll", function () {
  var h = document.documentElement;
  barra.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
}, { passive: true });

// ===== Palabra rotativa del titular =====
var palabras = ["optimizo", "diseño", "hago crecer", "automatizo"];
var rot = document.getElementById("rotativo");
var idx = 0;
rot.style.transition = "opacity .2s ease";
setInterval(function () {
  idx = (idx + 1) % palabras.length;
  rot.style.opacity = "0";
  setTimeout(function () { rot.textContent = palabras[idx]; rot.style.opacity = "1"; }, 200);
}, 2600);

// ===== Contadores animados =====
var obsContador = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (e) {
    if (!e.isIntersecting) return;
    var el = e.target, fin = parseInt(el.dataset.cuenta, 10), suf = el.dataset.sufijo || "";
    var n = 0, paso = Math.max(1, Math.round(fin / 40));
    var t = setInterval(function () {
      n += paso;
      if (n >= fin) { n = fin; clearInterval(t); }
      el.textContent = n + suf;
    }, 25);
    obsContador.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll("[data-cuenta]").forEach(function (c) { obsContador.observe(c); });

// ===== Proyectos (los datos están en proyectos.js) =====
var proyectos = window.PROYECTOS || [];
var lista = document.getElementById("lista-proyectos");

// ===== Maquetas animadas de cada proyecto (campo "escena" en proyectos.js) =====
// Los elementos con data-t aparecen a los X milisegundos (y data-fin los
// oculta); el contenedor data-secuencia indica cada cuánto se repite.
var FOTO_TERAPIA = "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=960&h=600&q=75";
var ESCENAS = {
  web: function () {
    return '<div class="esc esc-web">' +
      '<div class="navegador">' +
        '<div class="nav-barra"><i></i><i></i><i></i><span>yamilet-abdalh-web.netlify.app</span></div>' +
        '<div class="nav-pantalla" style="background-image:url(img/web-completa.jpg)"></div>' +
      "</div></div>";
  },
  chat: function () {
    return '<div class="esc esc-chat">' +
      '<img class="esc-fondo" src="img/proyecto-web.jpg" alt="" loading="lazy">' +
      '<div class="movil"><div class="movil-pantalla" data-secuencia="11000">' +
        '<div class="m-cab"><b>Asistente de Yamilet</b><span>● Responde al momento</span></div>' +
        '<div class="m-msgs" data-t="4300">' +
          '<p class="m-msg yo" data-t="400">¿Cuánto cuestan los planes?</p>' +
          '<p class="m-msg bot" data-t="1100"><span class="dots" data-t="1100" data-fin="2400"><i></i><i></i><i></i></span>' +
            '<span class="txt" data-t="2400">Esencial $15, Negocio $35 y Pro $65 al mes. Sin permanencia 🙂</span></p>' +
          '<p class="m-msg yo" data-t="4400">¿Haces webs para terapeutas?</p>' +
          '<p class="m-msg bot" data-t="5100"><span class="dots" data-t="5100" data-fin="6400"><i></i><i></i><i></i></span>' +
            '<span class="txt" data-t="6400">Sí: web con reservas online y recordatorios automáticos.</span></p>' +
        "</div>" +
      "</div></div></div>";
  },
  informe: function () {
    var barras = [38, 55, 47, 70, 62, 84, 100].map(function (h, i) {
      return '<i style="--h:' + h + "%;--d:" + (i * 0.12) + 's"></i>';
    }).join("");
    return '<div class="esc esc-informe">' +
      '<div class="grafica"><b>Visitas · últimos 7 días</b><div class="barras">' + barras + "</div><small>Vista de ejemplo</small></div>" +
      '<div class="movil"><div class="movil-pantalla bloqueo" data-secuencia="8000">' +
        '<div class="b-hora">7:00</div><div class="b-fecha">Buenos días</div>' +
        '<div class="notif" data-t="900"><b>GitHub · ahora</b><span>📊 Informe diario de visitas</span>' +
          "<small>@yamiletabdalh-alt aquí tienes el informe de hoy 👇</small></div>" +
      "</div></div></div>";
  },
  marca: function () {
    return '<div class="esc esc-marca">' +
      '<div class="marca-logo"><img src="img/redes-con-ia-logo-cuadrado.jpg" alt="" loading="lazy"></div>' +
      '<div class="marca-paleta">' +
        ["#7b2ff7", "#f0157a", "#ff7a1a", "#ffe14d"].map(function (c, i) {
          return '<span style="--c:' + c + ";--d:" + (i * 0.25) + 's"><i></i>' + c + "</span>";
        }).join("") +
      "</div>" +
      '<div class="marca-tipo">Aa<small>Tipografía</small></div>' +
    "</div>";
  },
  canal: function () {
    return '<div class="esc esc-canal">' +
      '<div class="navegador">' +
        '<div class="nav-barra"><i></i><i></i><i></i><span>youtube.com/@redesconia-oficial</span></div>' +
        '<div class="canal-cuerpo">' +
          '<div class="canal-banner"></div>' +
          '<div class="canal-info"><img src="img/redes-con-ia-logo-cuadrado.jpg" alt="" loading="lazy">' +
            "<div><b>Redes con IA</b><span>@redesconia-oficial</span></div>" +
            '<span class="canal-sub">Suscribirse</span></div>' +
          '<div class="canal-tabs"><span class="on">Inicio</span><span>Vídeos</span><span>Shorts</span></div>' +
        "</div>" +
      "</div></div>";
  },
  reservas: function () {
    var dias = [["L", 12], ["M", 13], ["X", 14], ["J", 15], ["V", 16]].map(function (d, i) {
      return '<span class="dia"' + (i === 2 ? ' data-t="900"' : "") + ">" + d[0] + "<b>" + d[1] + "</b></span>";
    }).join("");
    return '<div class="esc esc-reservas">' +
      '<img class="esc-fondo foto" src="' + FOTO_TERAPIA + '" alt="" loading="lazy">' +
      '<div class="movil"><div class="movil-pantalla" data-secuencia="8500">' +
        '<div class="r-cab"><b>Reserva tu sesión</b><span>Terapia individual · 50 min</span></div>' +
        '<div class="r-dias">' + dias + "</div>" +
        '<div class="r-horas"><span class="hora">10:00</span><span class="hora" data-t="1900">11:30</span><span class="hora">17:00</span></div>' +
        '<div class="r-btn" data-t="2900">Confirmar cita</div>' +
        '<div class="r-ok" data-t="3500"><b>✓ Cita confirmada</b><small>Te recordamos 24 h antes</small></div>' +
      "</div></div></div>";
  },
};

function ficha(p) {
  var tags = (p.stack || []).map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("");
  var visual, clase = "proyecto-img";
  if (p.escena && ESCENAS[p.escena]) {
    visual = ESCENAS[p.escena]();
  } else if (p.imagen) {
    visual = '<img src="' + p.imagen + '" alt="' + (p.imagenAlt || p.titulo) + '" loading="lazy">';
  } else {
    visual = '<span class="icono-grande" aria-hidden="true">' + (p.icono || "✦") + "</span>";
    clase += " sin-foto";
  }
  if (p.credito) visual += '<span class="credito">' + p.credito + "</span>";
  var etiqueta = p.escena ? ' role="img" aria-label="' + (p.imagenAlt || p.titulo) + '"' : "";
  return (
    '<article class="proyecto reveal" data-tilt data-cat="' + p.categoria + '">' +
      '<div class="' + clase + '"' + etiqueta + ">" + visual + "</div>" +
      '<div class="proyecto-cuerpo">' +
        "<h3>" + p.titulo + "</h3>" +
        '<p class="cliente">' + p.cliente + " · " + p.sector + " · " + p.anio + "</p>" +
        "<p>" + p.desc + "</p>" +
        '<div class="tags">' + tags + "</div>" +
        '<details class="caso">' +
          "<summary>Ver el caso</summary>" +
          "<p><b>Reto:</b> " + p.problema + "</p>" +
          "<p><b>Qué hice:</b> " + p.solucion + "</p>" +
          "<p><b>Mi rol:</b> " + p.rol + "</p>" +
        "</details>" +
        '<p class="resultado">' + (p.icono || "✦") + " " + p.resultado + "</p>" +
      "</div>" +
    "</article>"
  );
}

// ===== Efecto 3D: las tarjetas se inclinan siguiendo el ratón =====
var tiltActivo = matchMedia("(hover: hover) and (pointer: fine)").matches &&
                 !matchMedia("(prefers-reduced-motion: reduce)").matches;
function activarTilt() {
  if (!tiltActivo) return;
  document.querySelectorAll("[data-tilt]:not([data-tilt-on])").forEach(function (el) {
    el.setAttribute("data-tilt-on", "");
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--rx", ((0.5 - y) * 9).toFixed(2) + "deg");
      el.style.setProperty("--ry", ((x - 0.5) * 11).toFixed(2) + "deg");
      el.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
      el.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
    });
    el.addEventListener("pointerleave", function () {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });
}

function pintarProyectos(cat) {
  var visibles = cat === "todos" ? proyectos : proyectos.filter(function (p) { return p.categoria === cat; });
  lista.innerHTML = visibles.length
    ? visibles.map(ficha).join("")
    : '<p style="color:var(--muted)">No hay proyectos en esta categoría todavía.</p>';
  observarReveal();
  activarTilt();
  iniciarEscenas();
}

// Reproduce las secuencias (chat, reservas, notificación) solo mientras se ven
function iniciarEscenas() {
  var reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-secuencia]:not([data-sec-on])").forEach(function (sec) {
    sec.setAttribute("data-sec-on", "");
    var pasos = sec.querySelectorAll("[data-t]");
    if (reducir || !("IntersectionObserver" in window)) {
      pasos.forEach(function (el) { if (!el.hasAttribute("data-fin")) el.classList.add("on"); });
      return;
    }
    var ciclo = parseInt(sec.dataset.secuencia, 10) || 10000, timers = [], activo = false;
    function parar() { timers.forEach(clearTimeout); timers = []; }
    function reproducir() {
      parar();
      pasos.forEach(function (el) { el.classList.remove("on"); });
      pasos.forEach(function (el) {
        timers.push(setTimeout(function () { el.classList.add("on"); }, +el.dataset.t));
        if (el.dataset.fin) timers.push(setTimeout(function () { el.classList.remove("on"); }, +el.dataset.fin));
      });
      timers.push(setTimeout(function () { if (activo) reproducir(); }, ciclo));
    }
    new IntersectionObserver(function (e) {
      var ve = e[0].isIntersecting;
      if (ve && !activo) { activo = true; reproducir(); }
      else if (!ve && activo) { activo = false; parar(); }
    }, { threshold: 0.25 }).observe(sec);
  });
}

document.getElementById("filtros").addEventListener("click", function (e) {
  var btn = e.target.closest(".filtro");
  if (!btn) return;
  document.querySelectorAll(".filtro").forEach(function (b) { b.classList.toggle("activo", b === btn); });
  pintarProyectos(btn.dataset.cat);
});
pintarProyectos("todos");

// ===== Opiniones =====
// Solo reseñas reales, con permiso del cliente. Mientras esté vacío,
// la sección "Opiniones" y su enlace del menú se ocultan solos.
// Formato: { texto: "...", nombre: "Nombre o tipo de cliente", rol: "Sector" },
var opiniones = [
];
if (!opiniones.length) {
  document.getElementById("opiniones").style.display = "none";
  document.querySelectorAll('a[href="#opiniones"]').forEach(function (a) { a.style.display = "none"; });
}
document.getElementById("lista-opiniones").innerHTML = opiniones
  .map(function (o) {
    var ini = o.nombre.split(" ").map(function (x) { return x[0]; }).slice(0, 2).join("");
    return (
      '<figure class="opinion reveal">' +
        '<div class="estrellas" aria-label="5 de 5">★★★★★</div>' +
        "<p>\"" + o.texto + "\"</p>" +
        '<figcaption class="autor">' +
          '<span class="avatar" aria-hidden="true">' + ini + "</span>" +
          "<span><b>" + o.nombre + "</b><span>" + o.rol + "</span></span>" +
        "</figcaption>" +
      "</figure>"
    );
  })
  .join("");

// ===== FAQ acordeón exclusivo =====
var faqs = document.querySelectorAll(".acordeon details");
faqs.forEach(function (d) {
  d.addEventListener("toggle", function () {
    if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
  });
});

// ===== Selección de plan =====
var planMsg = document.getElementById("plan-msg");
var pagos = cfg.pagos || {};
document.querySelectorAll("[data-plan]").forEach(function (b) {
  b.addEventListener("click", function () {
    var url = pagos[b.dataset.plan.toLowerCase().split(" ")[0]];
    if (url) { window.open(url, "_blank", "noopener"); return; }
    planMsg.textContent = 'Has elegido "' + b.dataset.plan + '". Te llevo al formulario para contarme los detalles.';
    planMsg.className = "estado ok";
    document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
  });
});

// ===== Boletín =====
var formBoletin = document.getElementById("form-boletin");
var boletinEstado = document.getElementById("boletin-estado");
formBoletin.addEventListener("submit", function (e) {
  e.preventDefault();
  var email = document.getElementById("email-boletin").value.trim();
  if (!emailRe.test(email)) {
    boletinEstado.textContent = "Escribe un email válido.";
    boletinEstado.className = "estado error";
    return;
  }
  if (!web3Listo()) {
    boletinEstado.textContent = "Modo demo: pon tu clave de Web3Forms en config.js para recibir las altas.";
    boletinEstado.className = "estado ok";
    formBoletin.reset();
    return;
  }
  boletinEstado.textContent = "Enviando…";
  boletinEstado.className = "estado";
  enviarWeb3({ subject: "Nueva suscripción al boletín", email: email, from_name: "Boletín del portfolio" })
    .then(function (data) {
      if (data.success) {
        boletinEstado.textContent = "¡Listo! Te has suscrito.";
        boletinEstado.className = "estado ok";
        formBoletin.reset();
      } else {
        boletinEstado.textContent = "No se pudo completar: " + (data.message || "inténtalo más tarde.");
        boletinEstado.className = "estado error";
      }
    })
    .catch(function () {
      boletinEstado.textContent = "Error de red. Inténtalo de nuevo en un momento.";
      boletinEstado.className = "estado error";
    });
});

// ===== Formulario de contacto =====
var form = document.getElementById("form-contacto");
var estado = document.getElementById("form-estado");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  var d = new FormData(form);
  var nombre = (d.get("nombre") || "").trim();
  var email = (d.get("email") || "").trim();
  var mensaje = (d.get("mensaje") || "").trim();

  if (!nombre || !email || !mensaje) {
    estado.textContent = "Rellena todos los campos, por favor.";
    estado.className = "estado error";
    return;
  }
  if (!emailRe.test(email)) {
    estado.textContent = "El email no parece válido.";
    estado.className = "estado error";
    return;
  }
  if (!web3Listo()) {
    estado.textContent = "Modo demo: configura tu clave de Web3Forms en config.js para enviar de verdad.";
    estado.className = "estado ok";
    form.reset();
    return;
  }

  var boton = form.querySelector('button[type="submit"]');
  boton.disabled = true;
  estado.textContent = "Enviando…";
  estado.className = "estado";

  enviarWeb3({
    subject: "Nuevo mensaje desde el portfolio",
    from_name: nombre,
    name: nombre,
    email: email,
    message: mensaje,
  })
    .then(function (data) {
      if (data.success) {
        estado.textContent = "¡Mensaje enviado! Te responderé en menos de 24 h.";
        estado.className = "estado ok";
        form.reset();
      } else {
        estado.textContent = "No se pudo enviar: " + (data.message || "inténtalo más tarde.");
        estado.className = "estado error";
      }
    })
    .catch(function () {
      estado.textContent = "Error de red. Revisa tu conexión e inténtalo de nuevo.";
      estado.className = "estado error";
    })
    .finally(function () { boton.disabled = false; });
});

// ===== Aplicar configuración (WhatsApp, redes) =====
var wa = document.querySelector(".wa");
if (cfg.whatsapp) wa.href = "https://wa.me/" + String(cfg.whatsapp).replace(/[^\d]/g, "");
else if (tieneConfig && wa) wa.remove();

document.querySelectorAll(".site-footer .redes a[data-red]").forEach(function (a) {
  var url = (cfg.redes || {})[a.dataset.red];
  if (a.dataset.red === "email" && url && url.indexOf("@") > -1 && url.indexOf("mailto:") !== 0) url = "mailto:" + url;
  if (url) { a.href = url; a.hidden = false; }
  else a.remove();
});

// ===== Botón "volver arriba" =====
var arriba = document.getElementById("arriba");
addEventListener("scroll", function () {
  arriba.classList.toggle("visible", scrollY > 600);
}, { passive: true });
arriba.addEventListener("click", function () { scrollTo({ top: 0, behavior: "smooth" }); });

// ===== Aparición al hacer scroll =====
var obsReveal;
function observarReveal() {
  if (!obsReveal) {
    obsReveal = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("dentro"); obsReveal.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
  }
  document.querySelectorAll(".reveal:not(.dentro)").forEach(function (el) { obsReveal.observe(el); });
}
document.querySelectorAll(".bloque, .stat").forEach(function (el) { el.classList.add("reveal"); });
observarReveal();
activarTilt();
