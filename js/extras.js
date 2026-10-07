(function () {
  'use strict';
  var B = document.body, R = document.documentElement, $ = function (s) { return document.querySelector(s); };
  var TARGET = new Date(2026, 10, 19).getTime();
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var au = (window.GTA || {}).au || new Audio();
  function h(s) { var d = document.createElement('div'); d.innerHTML = s.trim(); return d.firstChild; }
  function add(s, parent) { var n = h(s); (parent || B).appendChild(n); return n; }

  /* ===== Estrutura injetada ===== */
  var intro = add('<div id="intro"><p>ROCKSTAR GAMES</p><h2>GRAND THEFT AUTO <b>VI</b></h2><button id="enter">ENTRAR</button></div>');
  B.classList.add('locked');
  add('<div class="hud" aria-hidden="true"><div id="stars"><i>★</i><i>★</i><i>★</i><i>★</i><i>★</i></div><div class="hudr"><b id="hclock">12:00</b><b id="money">$0</b></div></div>');
  add('<div class="ctrl"><button id="tod">Hora: auto</button><button id="share">Compartilhar</button><button id="cal">Calendário</button></div>');
  add('<div id="toasts" aria-live="polite"></div>');
  var fw = add('<canvas id="fw"></canvas>');
  $('main').appendChild(h('<p class="more-hint">ROLE PARA EXPLORAR ↓</p>'));
  $('main').appendChild(h('<p class="hint">CÓDIGOS SECRETOS: LEONIDA · VICE · WANTED · BOOM</p>'));

  var scene = $('.scene');
  scene.insertBefore(h('<div class="car"><div class="beam"></div><svg viewBox="0 0 200 60"><path fill="#10051d" d="M4 44c0-8 6-10 16-12l28-16c8-4 20-6 40-6s34 2 46 10l36 8c14 2 26 6 26 16v8H4z"/><circle cx="52" cy="48" r="11" fill="#10051d" stroke="#3fd8ff" stroke-width="2"/><circle cx="154" cy="48" r="11" fill="#10051d" stroke="#3fd8ff" stroke-width="2"/><rect x="190" y="32" width="8" height="6" fill="#fff6d8"/><rect x="2" y="34" width="6" height="5" fill="#ff4fa3"/></svg></div>'), $('.flare'));
  [[14, 38], [22, 52], [10, 70]].forEach(function (f, i) {
    var el = h('<div class="flamingo"><svg viewBox="0 0 100 60" fill="currentColor"><ellipse cx="50" cy="32" rx="22" ry="9"/><path d="M68 28c8-10 14-14 16-24l4 2c-2 10-8 16-14 28z"/><path d="M84 6l12 4-12 3z" fill="#ffc857"/><path d="M40 38l-18 20M46 40l-14 18" stroke="currentColor" stroke-width="2" fill="none"/><path d="M30 28L6 18c10-4 24-2 30 4z" opacity=".8"/></svg></div>');
    el.style.top = f[0] + '%'; el.style.animationDuration = f[1] + 's'; el.style.animationDelay = (-i * 17) + 's';
    scene.insertBefore(el, $('.flare'));
  });
  var sea = $('.sea'), eq = add('<div class="eq" aria-hidden="true"></div>', sea), bars = [];
  for (var i = 0; i < 28; i++) bars.push(eq.appendChild(document.createElement('i')));

  /* Seções abaixo da dobra */
  var more = h('<section class="more"><div><div class="plate"><small>LEONIDA</small><b id="pdays">000</b><small>DIAS RESTANTES · SUNSHINE STATE</small></div></div>' +
    '<div><h2>Jason &amp; Lucia</h2><div class="cards">' +
    '<article class="card"><img alt="Jason" src="assets/jason.webp"><h3>Jason</h3><p>Dupla de criminosos em busca de uma saída em Leonida. Tudo gira em torno de confiança.</p></article>' +
    '<article class="card"><img alt="Lucia" src="assets/lucia.webp"><h3>Lucia</h3><p>Protagonista pela primeira vez na série moderna: esperta, durona e sempre um passo à frente.</p></article>' +
    '</div></div><div><h2>Linha do tempo</h2><ol class="tl">' +
    '<li><b>05/12/2023</b><span>Primeiro trailer quebra recordes de visualizações.</span></li>' +
    '<li><b>06/05/2025</b><span>Segundo trailer.</span></li>' +
    '<li><b>26/05/2026</b><span>Data prevista anteriormente (adiada).</span></li>' +
    '<li class="now"><b>19/11/2026</b><span>Lançamento no PS5 e Xbox Series X|S.</span></li></ol></div></section>');
  $('main').after(more);
  more.querySelectorAll('img').forEach(function (im) { im.onerror = function () { this.closest('.card').style.display = 'none'; }; });
  more.querySelectorAll('.card').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = 'rotateY(' + x * 16 + 'deg) rotateX(' + -y * 16 + 'deg)';
    });
    c.addEventListener('pointerleave', function () { c.style.transform = ''; });
  });

  /* ===== Toasts ===== */
  function toast(t, s) {
    var n = add('<div class="toast"><b>' + t + '</b><span>' + (s || '') + '</span></div>', $('#toasts'));
    setTimeout(function () { n.remove(); }, 4600);
  }

  /* ===== Intro + áudio ===== */
  var ac, an, data;
  $('#enter').addEventListener('click', function () {
    intro.classList.add('out'); B.classList.remove('locked');
    setTimeout(function () { intro.remove(); }, 1100);
    au.play().then(function () { var m = $('#music'); if (m) m.classList.add('on'); }).catch(function () {});
    if (/^https?:/.test(location.protocol)) {
      try {
        ac = new (window.AudioContext || window.webkitAudioContext)();
        var src = ac.createMediaElementSource(au); an = ac.createAnalyser(); an.fftSize = 128;
        src.connect(an); an.connect(ac.destination); data = new Uint8Array(an.frequencyBinCount);
      } catch (e) { an = null; }
    }
    var d = Math.ceil((TARGET - Date.now()) / 864e5);
    if (d > 0) setTimeout(function () { toast('LEONIDA TE ESPERA', 'Faltam ' + d + ' dias'); }, 900);
  });

  /* ===== Dia / noite ===== */
  var modes = ['auto', 'dawn', 'day', 'sunset', 'night'], names = { auto: 'auto', dawn: 'amanhecer', day: 'dia', sunset: 'pôr do sol', night: 'noite' }, mi = 0;
  function autoMode() { var hr = new Date().getHours(); return hr < 5 || hr >= 19 ? 'night' : hr < 8 ? 'dawn' : hr < 16 ? 'day' : 'sunset'; }
  function applyTod() { var m = modes[mi]; B.dataset.time = m === 'auto' ? autoMode() : m; $('#tod').textContent = 'Hora: ' + names[m]; }
  $('#tod').addEventListener('click', function () { mi = (mi + 1) % modes.length; applyTod(); });
  applyTod();

  /* ===== Compartilhar e calendário ===== */
  $('#share').addEventListener('click', function () {
    var d = Math.ceil((TARGET - Date.now()) / 864e5), txt = 'Faltam ' + Math.max(d, 0) + ' dias para GTA VI!';
    if (navigator.share) navigator.share({ title: 'GTA VI', text: txt, url: location.href }).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(txt + ' ' + location.href).then(function () { toast('LINK COPIADO', 'Cole onde quiser'); });
  });
  $('#cal').addEventListener('click', function () {
    var ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:gta6@fan\r\nDTSTAMP:20260101T000000Z\r\nDTSTART;VALUE=DATE:20261119\r\nDTEND;VALUE=DATE:20261120\r\nSUMMARY:Lançamento de GTA VI\r\nEND:VEVENT\r\nEND:VCALENDAR';
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'gta6.ics'; a.click();
  });

  /* ===== HUD: procurado, dinheiro, relógio ===== */
  var heat = 0, money = 0, lx = null, ly = null, stars = document.querySelectorAll('#stars i');
  window.addEventListener('pointermove', function (e) {
    if (lx !== null) heat = Math.min(5, heat + Math.hypot(e.clientX - lx, e.clientY - ly) / 6000);
    lx = e.clientX; ly = e.clientY;
  });
  window.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button,#intro')) return;
    heat = Math.min(5, heat + .3); money += 100; $('#money').textContent = '$' + money.toLocaleString('pt-BR');
    var f = add('<div class="float">+$100</div>'); f.style.left = e.clientX + 'px'; f.style.top = e.clientY + 'px'; setTimeout(function () { f.remove(); }, 1000);
  });

  /* ===== Fogos ===== */
  var fx = fw.getContext('2d'), parts = [], fwOn = false;
  function boom(x, y) {
    var c = ['255,79,163', '63,216,255', '255,200,87', '217,79,255'][Math.random() * 4 | 0];
    for (var i = 0; i < 60; i++) { var a = Math.random() * 6.28, v = Math.random() * 5 + 1; parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, c: c }); }
  }
  function fwLoop() {
    fw.width = innerWidth; fw.height = innerHeight; fx.clearRect(0, 0, fw.width, fw.height);
    parts = parts.filter(function (p) { return p.l > 0; });
    parts.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.vy += .06; p.l -= .014; fx.fillStyle = 'rgba(' + p.c + ',' + p.l + ')'; fx.beginPath(); fx.arc(p.x, p.y, 2.4, 0, 6.28); fx.fill(); });
    if (parts.length || fwOn) requestAnimationFrame(fwLoop);
  }
  function fireworks(sec) {
    fwOn = true; var n = 0, iv = setInterval(function () { boom(Math.random() * innerWidth, Math.random() * innerHeight * .6); if (++n > sec * 3) { clearInterval(iv); fwOn = false; } }, 330);
    requestAnimationFrame(fwLoop);
  }

  /* ===== Marcos e códigos secretos ===== */
  var marks = [[30 * 864e5, '30 DIAS'], [7 * 864e5, '7 DIAS'], [864e5, '24 HORAS'], [36e5, '1 HORA']], prev = TARGET - Date.now(), celebrated = false;
  function celebrate() { if (celebrated) return; celebrated = true; toast('MISSION PASSED', 'GTA VI chegou! Respect +'); fireworks(12); }
  function sirenOn() { B.classList.add('siren'); setTimeout(function () { B.classList.remove('siren'); }, 4000); toast('PROCURADO', 'A polícia de Leonida está atrás de você'); heat = 3; }
  var buf = '';
  window.addEventListener('keydown', function (e) {
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toUpperCase()).slice(-10);
    var hit = true;
    if (/LEONIDA$/.test(buf)) { mi = mi === 4 ? 3 : 4; applyTod(); }
    else if (/VICE$/.test(buf)) B.classList.toggle('vice');
    else if (/WANTED$/.test(buf)) { heat = 5; }
    else if (/BOOM$/.test(buf)) fireworks(5);
    else hit = false;
    if (hit) { buf = ''; toast('CÓDIGO ATIVADO', 'Trapaceiro!'); }
  });

  /* ===== Loop principal ===== */
  var tl = 0, up = 0, d = Date.now();
  function loop(t) {
    var dt = Math.min((t - tl) / 1000, .1); tl = t;
    heat = Math.max(0, heat - dt * .25);
    var n = Math.floor(heat);
    stars.forEach(function (s, i) { s.classList.toggle('on', i < n || heat >= 5); });
    if (heat >= 5 && !B.classList.contains('siren')) sirenOn();

    var b = 0, m = 0, hi = 0, playing = !au.paused;
    if (an && playing) {
      an.getByteFrequencyData(data);
      b = avg(0, 4); m = avg(5, 16); hi = avg(17, 40);
      bars.forEach(function (el, i) { el.style.setProperty('--v', (data[i + 1] / 255).toFixed(2)); });
    } else if (playing) {
      b = .5 + .5 * Math.sin(t / 230); m = .5 + .5 * Math.sin(t / 410);
      bars.forEach(function (el, i) { el.style.setProperty('--v', (.3 + .3 * Math.sin(t / 180 + i * .6)).toFixed(2)); });
    } else bars.forEach(function (el) { el.style.setProperty('--v', 0); });
    if (!reduce) { R.style.setProperty('--bass', b.toFixed(3)); R.style.setProperty('--mid', m.toFixed(3)); }

    if (t - up > 1000) {
      up = t; var now = Date.now(), diff = TARGET - now;
      $('#pdays').textContent = String(Math.max(0, Math.floor(diff / 864e5))).padStart(3, '0');
      var gm = Math.floor(now / 2000) % 1440;
      $('#hclock').textContent = String(gm / 60 | 0).padStart(2, '0') + ':' + String(gm % 60).padStart(2, '0');
      marks.forEach(function (k) { if (prev > k[0] && diff <= k[0]) toast('MISSION PASSED', 'Faltam menos de ' + k[1]); });
      if (diff <= 0) celebrate();
      prev = diff;
      if (modes[mi] === 'auto') B.dataset.time = autoMode();
    }
    requestAnimationFrame(loop);
  }
  function avg(a, z) { var s = 0; for (var i = a; i < z; i++) s += data[i]; return s / (z - a) / 255; }
  requestAnimationFrame(loop);
})();
