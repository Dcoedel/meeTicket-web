/* Páginas de respaldo del apex (meeticket.app) para enlaces que, sin la app instalada, caían en error.
 * Un solo sitio renderiza /c/<código>, /claim/<token>, /tickets(/*), /events/* y el 404 genérico, según la
 * ruta. Lo incluyen los index.html de cada base (sirven 200 para /c/, /claim/, … → lo que audita link-audit)
 * y 404.html (sirve las rutas CON parámetro: /c/ABC, /claim/XYZ…, extrayendo el código de la URL). */
(function () {
  // ─────────────────────────────────────────────────────────────────────────
  // EL DÍA DEL LANZAMIENTO: pon aquí la URL del App Store (cambio de UNA línea).
  // Vacía ("") → se muestra "muy pronto en el App Store" (sin botón muerto).
  // Con valor → aparece el botón "Descargar meeTicket" en TODAS las páginas automáticamente.
  var APP_STORE_URL = '';
  // ─────────────────────────────────────────────────────────────────────────

  var p = location.pathname;
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function seg(prefix) { var m = p.match(new RegExp('^' + prefix + '([^/?#]+)')); return m ? decodeURIComponent(m[1]) : ''; }

  function download() {
    return APP_STORE_URL
      ? '<a class="btn" href="' + esc(APP_STORE_URL) + '">Descargar meeTicket</a>'
      : '<p class="soon">meeTicket estará disponible muy pronto en el App Store</p>';
  }
  function codebox(value) {
    if (!value) return '';
    return '<div class="codebox"><span class="code" id="apexCode">' + esc(value) + '</span><button class="copy" id="apexCopy">Copiar</button></div>';
  }
  function steps(list) { return '<ol class="steps"><li>' + list.join('</li><li>') + '</li></ol>'; }

  var DL = 'Descarga meeTicket <span class="muted">(próximamente)</span>';
  var view, title = 'meeTicket';

  if (p.indexOf('/c/') === 0 || p === '/c') {
    var code = seg('/c/');
    title = 'Te han invitado a un grupo';
    view = { icon: '&#128101;', h: 'Te han invitado a un grupo en meeTicket',
      body: (code ? '<p>Únete con este código:</p>' + codebox(code) : '<p>Abre tu invitación en la app para unirte al grupo.</p>') +
        steps([DL, 'Crea tu cuenta', 'Únete con este código']) + download() };
  } else if (p.indexOf('/claim/') === 0 || p === '/claim') {
    var token = seg('/claim/');
    title = 'Te han enviado una entrada';
    view = { icon: '&#127903;', h: 'Te han enviado una entrada en meeTicket',
      body: (token ? '<p>Reclámala con este código:</p>' + codebox(token) : '<p>Abre tu invitación en la app para reclamar tu entrada.</p>') +
        steps([DL, 'Crea tu cuenta', 'Reclama tu entrada con este código']) + download() };
  } else if (p === '/tickets' || p.indexOf('/tickets/') === 0) {
    title = 'Tus entradas';
    view = { icon: '&#127915;', h: 'Tus entradas viven en la app',
      body: '<p>Tus entradas, con su QR, están en meeTicket.</p>' + steps([DL, 'Inicia sesión con tu email', 'Ahí tienes tus entradas y su QR']) + download() };
  } else if (p.indexOf('/events/') === 0) {
    title = 'Evento en meeTicket';
    view = { icon: '&#128197;', h: 'Este evento está en meeTicket',
      body: '<p>Abre el evento en la app para ver detalles y entradas.</p>' + steps([DL, 'Busca el evento', 'Consíguelo desde la app']) + download() };
  } else {
    title = 'Página no encontrada';
    view = { icon: '&#128269;', h: 'Página no encontrada',
      body: '<p>El enlace no existe o ha caducado.</p><a class="btn" href="/">Ir al inicio</a>' };
  }

  document.title = 'meeTicket — ' + title;
  var root = document.getElementById('apex-root') || document.body;
  root.innerHTML = '<div class="container"><div class="logo">meeTicket</div><div class="card" data-apex-backup="1">' +
    '<div class="icon">' + view.icon + '</div><h2>' + esc(view.h) + '</h2>' + view.body + '</div></div>';

  var copyBtn = document.getElementById('apexCopy');
  if (copyBtn) copyBtn.addEventListener('click', function () {
    var v = document.getElementById('apexCode').textContent;
    (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(function () {
      copyBtn.textContent = '¡Copiado!'; setTimeout(function () { copyBtn.textContent = 'Copiar'; }, 2000);
    }).catch(function () { copyBtn.textContent = 'Copia manual'; });
  });
})();
