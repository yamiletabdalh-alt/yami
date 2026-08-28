/* =====================================================================
   ASISTENTE DE LA WEB  (se monta solo, no hay que tocar el HTML)
   ---------------------------------------------------------------------
   Nivel 1: responde con las "faqs" de conocimiento.js. Funciona ya.
   Nivel 2: si config.js tiene asistente.ia = true, además pregunta a
            Claude a través de la función del servidor. Si falla, cae
            automáticamente al Nivel 1.
   ===================================================================== */
(function () {
  var KB = window.CONOCIMIENTO;
  if (!KB) return; // sin base de conocimiento no se monta

  var cfg = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.asistente) || {};
  var usaIA = !!cfg.ia && !!cfg.endpoint;

  // --- Utilidades ---------------------------------------------------
  var RX_TILDES = new RegExp("[\\u0300-\\u036f]", "g");
  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(RX_TILDES, "");
  }
  function responderLocal(texto) {
    var t = norm(texto);
    var mejor = null, mejorPunt = 0;
    KB.faqs.forEach(function (f) {
      var punt = 0;
      f.claves.forEach(function (c) { if (t.indexOf(norm(c)) > -1) punt++; });
      if (punt > mejorPunt) { mejorPunt = punt; mejor = f; }
    });
    return mejor ? mejor.respuesta : KB.sinRespuesta;
  }
  function pedirIA(historial) {
    var ctrl = new AbortController();
    var to = setTimeout(function () { ctrl.abort(); }, 12000);
    return fetch(cfg.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensajes: historial, contexto: KB.contexto }),
      signal: ctrl.signal,
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok || !res.d || !res.d.respuesta) throw new Error("sin respuesta");
        return res.d.respuesta;
      })
      .finally(function () { clearTimeout(to); });
  }

  // --- Interfaz ----------------------------------------------------
  var raiz = document.createElement("div");
  raiz.className = "chat";
  raiz.innerHTML =
    '<button class="chat-lanzador" id="chat-lanzador" aria-expanded="false" aria-controls="chat-panel" aria-label="Abrir el asistente">' +
      '<span class="chat-ico" data-abrir>💬</span><span class="chat-ico" data-cerrar hidden>✕</span>' +
    "</button>" +
    '<section class="chat-panel" id="chat-panel" role="dialog" aria-label="Asistente de Yamilet" hidden>' +
      '<header class="chat-cab">' +
        '<span class="chat-punto" aria-hidden="true"></span>' +
        "<div><b>Asistente de Yamilet</b><span>Responde al momento</span></div>" +
        '<button class="chat-x" id="chat-x" aria-label="Cerrar asistente">✕</button>' +
      "</header>" +
      '<div class="chat-mensajes" id="chat-mensajes" aria-live="polite"></div>' +
      '<div class="chat-chips" id="chat-chips"></div>' +
      '<form class="chat-form" id="chat-form">' +
        '<input id="chat-input" autocomplete="off" placeholder="Escribe tu pregunta…" aria-label="Escribe tu pregunta">' +
        '<button type="submit" aria-label="Enviar">➤</button>' +
      "</form>" +
      '<p class="chat-pie">Respuestas automáticas. Para temas concretos, <a href="#contacto" data-ir-contacto>escríbele</a>.</p>' +
    "</section>";
  document.body.appendChild(raiz);

  var lanzador = raiz.querySelector("#chat-lanzador");
  var panel = raiz.querySelector("#chat-panel");
  var iconoAbrir = raiz.querySelector("[data-abrir]");
  var iconoCerrar = raiz.querySelector("[data-cerrar]");
  var cont = raiz.querySelector("#chat-mensajes");
  var chips = raiz.querySelector("#chat-chips");
  var form = raiz.querySelector("#chat-form");
  var input = raiz.querySelector("#chat-input");
  var iniciado = false;
  var historial = []; // [{role:"user"|"assistant", content:"..."}]

  function burbuja(texto, quien) {
    var b = document.createElement("div");
    b.className = "chat-msg " + quien;
    b.textContent = texto;
    cont.appendChild(b);
    cont.scrollTop = cont.scrollHeight;
    return b;
  }
  function escribiendo() {
    var b = document.createElement("div");
    b.className = "chat-msg bot chat-typing";
    b.innerHTML = "<span></span><span></span><span></span>";
    cont.appendChild(b);
    cont.scrollTop = cont.scrollHeight;
    return b;
  }
  function pintarChips(lista) {
    chips.innerHTML = "";
    (lista || []).forEach(function (txt) {
      var c = document.createElement("button");
      c.type = "button";
      c.className = "chat-chip";
      c.textContent = txt;
      c.addEventListener("click", function () { enviar(txt); });
      chips.appendChild(c);
    });
  }

  function responder(texto) {
    var esperando = escribiendo();
    var local = responderLocal(texto);

    function mostrar(txt) {
      esperando.remove();
      burbuja(txt, "bot");
      historial.push({ role: "assistant", content: txt });
    }

    if (usaIA) {
      pedirIA(historial.slice(-10))
        .then(function (txt) { mostrar(txt); })
        .catch(function () { mostrar(local); });
    } else {
      setTimeout(function () { mostrar(local); }, 350);
    }
  }

  function enviar(texto) {
    texto = (texto || input.value).trim();
    if (!texto) return;
    input.value = "";
    chips.innerHTML = "";
    burbuja(texto, "yo");
    historial.push({ role: "user", content: texto });
    responder(texto);
  }

  function iniciar() {
    if (iniciado) return;
    iniciado = true;
    burbuja(KB.saludo, "bot");
    pintarChips(KB.sugerencias);
  }
  function abrir() {
    panel.hidden = false;
    lanzador.setAttribute("aria-expanded", "true");
    iconoAbrir.hidden = true;
    iconoCerrar.hidden = false;
    iniciar();
    setTimeout(function () { input.focus(); }, 50);
  }
  function cerrar() {
    panel.hidden = true;
    lanzador.setAttribute("aria-expanded", "false");
    iconoAbrir.hidden = false;
    iconoCerrar.hidden = true;
    lanzador.focus();
  }

  lanzador.addEventListener("click", function () { panel.hidden ? abrir() : cerrar(); });
  raiz.querySelector("#chat-x").addEventListener("click", cerrar);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) cerrar(); });
  form.addEventListener("submit", function (e) { e.preventDefault(); enviar(); });
  raiz.querySelector("[data-ir-contacto]").addEventListener("click", function () {
    cerrar();
    var c = document.getElementById("contacto");
    if (c) c.scrollIntoView({ behavior: "smooth" });
  });
})();
