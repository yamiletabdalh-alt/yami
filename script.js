// ===================================================================
//  PORTFOLIO — lógica de la página
//  Los datos editables están en config.js y proyectos.js
// ===================================================================

function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

var cfg = window.PORTFOLIO_CONFIG || {};
var tieneConfig = !!window.PORTFOLIO_CONFIG;
var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

// ===== Barra promocional =====
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

function ficha(p) {
  var tags = (p.stack || []).map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("");
  return (
    '<article class="proyecto reveal" data-cat="' + p.categoria + '">' +
      '<div class="proyecto-top">' +
        '<span class="icono" aria-hidden="true">' + (p.icono || "•") + "</span>" +
        '<span class="anio">' + p.anio + "</span>" +
      "</div>" +
      "<h3>" + p.titulo + "</h3>" +
      '<p class="cliente">' + p.cliente + " · " + p.sector + "</p>" +
      "<p>" + p.desc + "</p>" +
      '<div class="tags">' + tags + "</div>" +
      '<details class="caso">' +
        "<summary>Ver el caso</summary>" +
        "<p><b>Reto:</b> " + p.problema + "</p>" +
        "<p><b>Qué hice:</b> " + p.solucion + "</p>" +
        "<p><b>Mi rol:</b> " + p.rol + "</p>" +
      "</details>" +
      '<p class="resultado">📈 ' + p.resultado + "</p>" +
    "</article>"
  );
}

function pintarProyectos(cat) {
  var visibles = cat === "todos" ? proyectos : proyectos.filter(function (p) { return p.categoria === cat; });
  lista.innerHTML = visibles.length
    ? visibles.map(ficha).join("")
    : '<p style="color:var(--muted)">No hay proyectos en esta categoría todavía.</p>';
  observarReveal();
}

document.getElementById("filtros").addEventListener("click", function (e) {
  var btn = e.target.closest(".filtro");
  if (!btn) return;
  document.querySelectorAll(".filtro").forEach(function (b) { b.classList.toggle("activo", b === btn); });
  pintarProyectos(btn.dataset.cat);
});
pintarProyectos("todos");

// ===== Opiniones =====
var opiniones = [
  { texto: "Nos hizo la identidad completa y ahora la marca se ve coherente en la web y en redes.", nombre: "Ana Torres", rol: "Centro de bienestar" },
  { texto: "La web y la agenda me quitaron el lío de reservar por WhatsApp. Ahora todo va solo.", nombre: "Psicóloga colegiada", rol: "Consulta privada" },
  { texto: "En tres meses el alcance de Instagram se disparó y por fin publico con un plan.", nombre: "Estudio de yoga", rol: "Bienestar" },
  { texto: "El asistente con IA responde el 60 % de las consultas de la tienda. Un cambio enorme.", nombre: "Sergio Pardo", rol: "Tienda online" },
];
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
document.querySelectorAll("[data-plan]").forEach(function (b) {
  b.addEventListener("click", function () {
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
