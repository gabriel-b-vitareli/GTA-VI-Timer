(function () {
  'use strict';
  var B = document.body, R = document.documentElement, $ = function (s) { return document.querySelector(s); };
  var TARGET = new Date(2026, 10, 19).getTime();
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var au = (window.GTA || {}).au || new Audio();
  function h(s) { var d = document.createElement('div'); d.innerHTML = s.trim(); return d.firstChild; }
  function add(s, parent) { var n = h(s); (parent || B).appendChild(n); return n; }
  var ico = function (p) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>'; };
  var ICON = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    link: '<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',
    down: '<path d="M12 3v12M7 11l5 5 5-5M4 21h16"/>',
    chat: '<path d="M21 12a8 8 0 01-11.6 7.1L3 21l1.9-6.2A8 8 0 1121 12z"/>',
    send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
    x: '<path d="M4 4l16 16M20 4L4 20"/>'
  };

  /* ===== Estrutura ===== */
  add('<div class="hud" aria-hidden="true"><div id="stars"><i>★</i><i>★</i><i>★</i><i>★</i><i>★</i><i>★</i></div></div>');
  add('<div class="ctrl"><button id="tod">' + ico(ICON.sun) + '<span>Hora: auto</span></button><button id="share">' + ico(ICON.share) + '<span>Compartilhar</span></button><button id="cal">' + ico(ICON.cal) + '<span>Lembrete</span></button></div>');
  add('<div id="toasts" aria-live="polite"></div>');
  $('main').appendChild(h('<p class="more-hint">ROLE PARA EXPLORAR ↓</p>'));
  $('main').after(h('<section class="more"><div class="plate"><small>LEONIDA</small><b id="pdays">000</b><small>DIAS RESTANTES · SUNSHINE STATE</small></div></section>'));

  var scene = $('.scene');
  scene.insertBefore(h('<div class="car"><div class="beam"></div><svg viewBox="0 0 200 60"><path fill="#10051d" d="M4 44c0-8 6-10 16-12l28-16c8-4 20-6 40-6s34 2 46 10l36 8c14 2 26 6 26 16v8H4z"/><circle cx="52" cy="48" r="11" fill="#10051d" stroke="#3fd8ff" stroke-width="2"/><circle cx="154" cy="48" r="11" fill="#10051d" stroke="#3fd8ff" stroke-width="2"/><rect x="190" y="32" width="8" height="6" fill="#fff6d8"/><rect x="2" y="34" width="6" height="5" fill="#ff4fa3"/></svg></div>'), $('.flare'));
  [[14, 38], [22, 52], [10, 70]].forEach(function (f, i) {
    var el = h('<div class="flamingo"><svg viewBox="0 0 100 60" fill="currentColor"><ellipse cx="50" cy="32" rx="22" ry="9"/><path d="M68 28c8-10 14-14 16-24l4 2c-2 10-8 16-14 28z"/><path d="M84 6l12 4-12 3z" fill="#ffc857"/><path d="M40 38l-18 20M46 40l-14 18" stroke="currentColor" stroke-width="2" fill="none"/><path d="M30 28L6 18c10-4 24-2 30 4z" opacity=".8"/></svg></div>');
    el.style.top = f[0] + '%'; el.style.animationDuration = f[1] + 's'; el.style.animationDelay = (-i * 17) + 's';
    scene.insertBefore(el, $('.flare'));
  });
  var eq = add('<div class="eq" aria-hidden="true"></div>', $('.sea')), bars = [];
  for (var i = 0; i < 28; i++) bars.push(eq.appendChild(document.createElement('i')));

  function toast(t, s) {
    var n = add('<div class="toast"><b>' + t + '</b><span>' + (s || '') + '</span></div>', $('#toasts'));
    setTimeout(function () { n.remove(); }, 4600);
  }

  /* ===== Áudio reativo (inicia quando a música toca) ===== */
  var an, data, hooked = false;
  au.addEventListener('play', function () {
    if (hooked || !/^https?:/.test(location.protocol)) return;
    hooked = true;
    try {
      var ac = new (window.AudioContext || window.webkitAudioContext)();
      var src = ac.createMediaElementSource(au); an = ac.createAnalyser(); an.fftSize = 128;
      src.connect(an); an.connect(ac.destination); data = new Uint8Array(an.frequencyBinCount); ac.resume();
    } catch (e) { an = null; }
  });

  /* ===== Dia / noite ===== */
  var modes = ['auto', 'dawn', 'day', 'sunset', 'night'], names = { auto: 'auto', dawn: 'amanhecer', day: 'dia', sunset: 'pôr do sol', night: 'noite' }, mi = 0;
  function autoMode() { var hr = new Date().getHours(); return hr < 5 || hr >= 19 ? 'night' : hr < 8 ? 'dawn' : hr < 16 ? 'day' : 'sunset'; }
  function applyTod() { var m = modes[mi]; B.dataset.time = m === 'auto' ? autoMode() : m; $('#tod span').textContent = 'Hora: ' + names[m]; }
  $('#tod').addEventListener('click', function () { mi = (mi + 1) % modes.length; applyTod(); });
  applyTod();

  /* ===== Calendário ===== */
  $('#cal').addEventListener('click', function () {
    var ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:gta6@fan\r\nDTSTAMP:20260101T000000Z\r\nDTSTART;VALUE=DATE:20261119\r\nDTEND;VALUE=DATE:20261120\r\nSUMMARY:Lançamento de GTA VI\r\nBEGIN:VALARM\r\nTRIGGER:-P1D\r\nACTION:DISPLAY\r\nDESCRIPTION:GTA VI lança amanhã!\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR';
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'gta6.ics'; a.click();
    toast('LEMBRETE CRIADO', 'Abra o arquivo para salvar no calendário');
  });

  /* ===== Compartilhar: cartão em imagem + painel ===== */
  function timeLeft() { var d = Math.max(0, TARGET - Date.now()); return { d: Math.floor(d / 864e5), h: Math.floor(d % 864e5 / 36e5), done: d <= 0 }; }
  function shareText() {
    var t = timeLeft();
    return t.done ? 'GTA VI já chegou! 🌴' : 'Faltam ' + t.d + ' dias e ' + t.h + ' horas para GTA VI! 🌴';
  }
  function drawCard() {
    return (document.fonts ? Promise.all([document.fonts.load('200px Anton'), document.fonts.load('600 40px Oswald')]) : Promise.resolve()).then(function () {
      var S = 1080, c = document.createElement('canvas'); c.width = c.height = S; var x = c.getContext('2d'), t = timeLeft();
      var g = x.createLinearGradient(0, 0, 0, S);
      [[0, '#14143f'], [.22, '#4a46d6'], [.45, '#D94FFF'], [.65, '#FF4FA3'], [.85, '#FF8A3D'], [1, '#FFC857']].forEach(function (s) { g.addColorStop(s[0], s[1]); });
      x.fillStyle = g; x.fillRect(0, 0, S, S);
      for (var i = 0; i < 70; i++) { x.fillStyle = 'rgba(255,255,255,' + (Math.random() * .8) + ')'; x.fillRect(Math.random() * S, Math.random() * 380, 3, 3); }
      var o = document.createElement('canvas'); o.width = o.height = S; var ox = o.getContext('2d');
      var sg = ox.createLinearGradient(0, 330, 0, 850); sg.addColorStop(0, '#FFF3C4'); sg.addColorStop(.4, '#FFC857'); sg.addColorStop(.7, '#FF8A3D'); sg.addColorStop(1, '#FF4FA3');
      ox.fillStyle = sg; ox.beginPath(); ox.arc(540, 600, 270, 0, 6.283); ox.fill();
      ox.globalCompositeOperation = 'destination-out';
      for (var y = 640; y < 880; y += 22) { ox.fillRect(0, y, S, 6 + (y - 640) / 30); }
      x.shadowColor = 'rgba(255,138,61,.8)'; x.shadowBlur = 80; x.drawImage(o, 0, 0); x.shadowBlur = 0;
      var sea = x.createLinearGradient(0, 860, 0, S); sea.addColorStop(0, '#d85aa0'); sea.addColorStop(.35, '#7b3fb8'); sea.addColorStop(1, '#0b0724');
      x.fillStyle = sea; x.fillRect(0, 860, S, S - 860);
      x.textAlign = 'center'; x.lineJoin = 'round';
      x.font = '84px Pricedown, Anton, Impact, sans-serif'; x.lineWidth = 16; x.strokeStyle = '#000'; x.strokeText('GRAND THEFT AUTO', 540, 150); x.fillStyle = '#fff'; x.fillText('GRAND THEFT AUTO', 540, 150);
      var vg = x.createLinearGradient(0, 160, 0, 360); vg.addColorStop(0, '#3FD8FF'); vg.addColorStop(.4, '#D94FFF'); vg.addColorStop(.75, '#FF4FA3'); vg.addColorStop(1, '#FF8A3D');
      x.font = '250px Anton, Impact, sans-serif'; x.lineWidth = 24; x.strokeStyle = '#000'; x.strokeText('VI', 540, 370); x.fillStyle = vg; x.fillText('VI', 540, 370);
      x.shadowColor = '#FF4FA3'; x.shadowBlur = 40; x.fillStyle = '#fff'; x.font = '300px Anton, Impact, sans-serif'; x.strokeStyle = '#000'; x.lineWidth = 14;
      var num = t.done ? '0' : String(t.d); x.strokeText(num, 540, 760); x.fillText(num, 540, 760); x.shadowBlur = 0;
      x.fillStyle = '#3FD8FF'; x.font = '600 52px Oswald, Anton, sans-serif'; x.shadowColor = '#3FD8FF'; x.shadowBlur = 16;
      x.fillText(t.done ? 'JÁ DISPONÍVEL EM LEONIDA' : 'DIAS PARA VOLTAR A LEONIDA', 540, 920); x.shadowBlur = 0;
      x.fillStyle = '#fff'; x.font = '600 36px Oswald, sans-serif'; x.fillText('19 NOV 2026  •  PS5 & XBOX SERIES X|S', 540, 1000);
      x.globalAlpha = .6; x.font = '26px Oswald, sans-serif'; x.fillText('PÁGINA DE FÃ NÃO OFICIAL', 540, 1048);
      return new Promise(function (ok) { c.toBlob(function (b) { ok({ blob: b, url: URL.createObjectURL(b) }); }, 'image/png'); });
    });
  }
  var sheet = add('<div id="sheet" role="dialog" aria-modal="true" aria-label="Compartilhar"><div class="box"><button class="x" aria-label="Fechar">×</button><h3>Compartilhar</h3><img alt="Prévia do cartão"><div class="opts"></div></div></div>');
  var opts = sheet.querySelector('.opts'), pic = sheet.querySelector('img'), card = null;
  function opt(label, icon, fn, cls) {
    var b = add('<button' + (cls ? ' class="' + cls + '"' : '') + '>' + ico(icon) + '<span>' + label + '</span></button>', opts); b.addEventListener('click', fn); return b;
  }
  function url() { return location.href.split('#')[0]; }
  function open(u) { window.open(u, '_blank', 'noopener'); }
  function closeSheet() { sheet.classList.remove('open'); }
  var fileOf = function () { return card && new File([card.blob], 'gta6-contagem.png', { type: 'image/png' }); };
  if (navigator.share) opt('Enviar', ICON.send, function () {
    var data = { title: 'GTA VI', text: shareText(), url: url() }, f = fileOf();
    if (f && navigator.canShare && navigator.canShare({ files: [f] })) data.files = [f];
    navigator.share(data).catch(function () {});
  }, 'main');
  opt('WhatsApp', ICON.chat, function () { open('https://wa.me/?text=' + encodeURIComponent(shareText() + ' ' + url())); });
  opt('X / Twitter', ICON.x, function () { open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText()) + '&url=' + encodeURIComponent(url())); });
  opt('Telegram', ICON.send, function () { open('https://t.me/share/url?url=' + encodeURIComponent(url()) + '&text=' + encodeURIComponent(shareText())); });
  opt('Copiar link', ICON.link, function () {
    var t = shareText() + ' ' + url();
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { toast('LINK COPIADO', 'Cole onde quiser'); }, function () { toast('NÃO FOI POSSÍVEL COPIAR', url()); });
  });
  opt('Baixar imagem', ICON.down, function () {
    if (!card) return; var a = document.createElement('a'); a.href = card.url; a.download = 'gta6-contagem.png'; a.click();
  });
  $('#share').addEventListener('click', function () {
    sheet.classList.add('open'); pic.removeAttribute('src');
    drawCard().then(function (c) { card = c; pic.src = c.url; });
  });
  sheet.addEventListener('click', function (e) { if (e.target === sheet || e.target.classList.contains('x')) closeSheet(); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });

  /* ===== Nível de procurado: sobe com o tempo no site ===== */
  var t0 = Date.now(), lvl = 0, starEls = document.querySelectorAll('#stars i'), box = $('#stars'), maxed = false;
  function setStars(n) {
    if (n === lvl) return;
    var up = n > lvl; lvl = n;
    starEls.forEach(function (s, i) { s.classList.toggle('on', i < n); });
    if (up) {
      box.classList.remove('flash'); void box.offsetWidth; box.classList.add('flash');
      clearTimeout(setStars.t); setStars.t = setTimeout(function () { box.classList.remove('flash'); }, 2400);
    }
    if (n === 6 && !maxed) {
      maxed = true; B.classList.add('siren'); toast('PROCURADO', 'Nível máximo: 6 estrelas');
      setTimeout(function () { B.classList.remove('siren'); }, 4000);
    }
  }

  /* ===== Loop ===== */
  var up = 0, prev = TARGET - Date.now(), marks = [[30 * 864e5, '30 DIAS'], [7 * 864e5, '7 DIAS'], [864e5, '24 HORAS'], [36e5, '1 HORA']];
  function avg(a, z) { var s = 0; for (var i = a; i < z; i++) s += data[i]; return s / (z - a) / 255; }
  function loop(t) {
    var b = 0, m = 0, playing = !au.paused;
    if (an && playing) {
      an.getByteFrequencyData(data); b = avg(0, 4); m = avg(5, 16);
      bars.forEach(function (el, i) { el.style.setProperty('--v', (data[i + 1] / 255).toFixed(2)); });
    } else if (playing) {
      b = .5 + .5 * Math.sin(t / 230); m = .5 + .5 * Math.sin(t / 410);
      bars.forEach(function (el, i) { el.style.setProperty('--v', (.3 + .3 * Math.sin(t / 180 + i * .6)).toFixed(2)); });
    } else bars.forEach(function (el) { el.style.setProperty('--v', 0); });
    if (!reduce) { R.style.setProperty('--bass', b.toFixed(3)); R.style.setProperty('--mid', m.toFixed(3)); }

    if (t - up > 1000) {
      up = t; var now = Date.now(), diff = TARGET - now, el = (now - t0) / 1000;
      $('#pdays').textContent = String(Math.max(0, Math.floor(diff / 864e5))).padStart(3, '0');
      setStars(el < 8 ? 0 : Math.min(6, 1 + Math.floor((el - 8) / 25)));
      marks.forEach(function (k) { if (prev > k[0] && diff <= k[0]) toast('MISSION PASSED', 'Faltam menos de ' + k[1]); });
      if (prev > 0 && diff <= 0) toast('MISSION PASSED', 'GTA VI chegou! Respect +');
      prev = diff;
      if (modes[mi] === 'auto') B.dataset.time = autoMode();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
