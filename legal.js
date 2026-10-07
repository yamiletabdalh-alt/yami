// ===================================================================
//  Páginas legales (terminos.html, privacidad.html): rellena el email
//  de contacto y el enlace al portal de clientes desde config.js.
// ===================================================================
(function () {
  var cfg = window.PORTFOLIO_CONFIG || {};
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

  if (cfg.email) {
    document.querySelectorAll("[data-email]").forEach(function (el) {
      el.innerHTML = '<a href="mailto:' + cfg.email + '">' + cfg.email + "</a>";
    });
  }
  var portal = document.getElementById("txt-portal");
  if (portal && cfg.portalClientes) {
    portal.innerHTML = ' desde <a href="' + cfg.portalClientes + '" target="_blank" rel="noopener">tu portal de cliente</a> (con el email con el que pagaste)';
  }
})();
