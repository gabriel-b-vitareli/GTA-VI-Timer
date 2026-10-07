(function () {
  'use strict';

  /* ===== Configuração ===== */
  // Lançamento: 19/11/2026 às 00:00 (fuso do visitante). Altere aqui se a data mudar.
  var TARGET = new Date(2026, 10, 19, 0, 0, 0, 0).getTime();
  var START  = new Date(2023, 11, 5, 0, 0, 0, 0).getTime(); // 1º trailer

  var $ = function (id) { return document.getElementById(id); };
  var pad = function (n, l) { return String(n).padStart(l, '0'); };
  var nf = new Intl.NumberFormat('pt-BR');
  var ids = ['d','h','m','s','ms','tw','th','tm','ts','tms','pc'];
  var el = {}; ids.forEach(function (i) { el[i] = $(i); });
  var fill = $('fill');
  var last = {};

  /* ===== Reflexos na água ===== */
  var waves = $('waves');
  for (var i = 0; i < 16; i++) {
    var w = document.createElement('i');
    w.style.top = (6 + i * 5.8) + '%';
    w.style.width = (58 - i * 2.8) + '%';
    w.style.animationDelay = (i * 0.28) + 's';
    waves.appendChild(w);
  }

  /* ===== Contagem ===== */
  function set(key, text, bump) {
    if (last[key] === text) return;
    last[key] = text;
    el[key].textContent = text;
    if (bump) {
      el[key].classList.remove('tick');
      void el[key].offsetWidth;
      el[key].classList.add('tick');
    }
  }

  function tick() {
    var now = Date.now();
    var diff = TARGET - now;
    if (diff <= 0) { diff = 0; document.body.classList.add('done'); }

    set('d', pad(Math.floor(diff / 864e5), 3), true);
    set('h', pad(Math.floor(diff % 864e5 / 36e5), 2), true);
    set('m', pad(Math.floor(diff % 36e5 / 6e4), 2), true);
    set('s', pad(Math.floor(diff % 6e4 / 1e3), 2), true);
    set('ms', pad(Math.floor(diff % 1e3), 3), false);

    set('tw', nf.format(Math.floor(diff / 6048e5)));
    set('th', nf.format(Math.floor(diff / 36e5)));
    set('tm', nf.format(Math.floor(diff / 6e4)));
    set('ts', nf.format(Math.floor(diff / 1e3)));
    set('tms', nf.format(diff));

    var pct = Math.max(0, Math.min(100, (now - START) / (TARGET - START) * 100));
    set('pc', pct.toFixed(6).replace('.', ',') + '%');
    fill.style.width = pct + '%';

    if (diff > 0) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ===== Paralaxe com mouse / inclinação ===== */
  var root = document.documentElement;
  document.querySelectorAll('.layer').forEach(function (l) {
    l.style.setProperty('--d', l.dataset.depth || 0);
  });
  function setParallax(x, y) { root.style.setProperty('--mx', x.toFixed(3)); root.style.setProperty('--my', y.toFixed(3)); }
  window.addEventListener('pointermove', function (e) {
    setParallax(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1);
  });
  window.addEventListener('deviceorientation', function (e) {
    if (e.gamma == null) return;
    setParallax(Math.max(-1, Math.min(1, e.gamma / 30)), Math.max(-1, Math.min(1, (e.beta - 45) / 30)));
  });

  /* ===== Estrelas e brasas (canvas) ===== */
  var cv = $('fx'), ctx = cv.getContext('2d');
  var W, H, dpr, stars = [], embers = [];
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.round(W / 8) }, function () {
      return { x: Math.random() * W, y: Math.random() * H * 0.42, r: Math.random() * 1.3 + .3, p: Math.random() * 6.28, s: Math.random() * 2 + .6 };
    });
    embers = Array.from({ length: Math.round(W / 30) }, function () { return newEmber(true); });
  }
  function newEmber(init) {
    return {
      x: Math.random() * W, y: init ? Math.random() * H : H + 10,
      r: Math.random() * 2 + .6, v: Math.random() * .35 + .12, dx: (Math.random() - .5) * .25,
      c: Math.random() < .5 ? '255,79,163' : (Math.random() < .5 ? '255,200,87' : '63,216,255'), p: Math.random() * 6.28
    };
  }
  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    t /= 1000;
    stars.forEach(function (s) {
      var a = .35 + .65 * Math.abs(Math.sin(t * s.s + s.p));
      ctx.fillStyle = 'rgba(255,255,255,' + (a * (1 - s.y / (H * .5))).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
    });
    embers.forEach(function (e, i) {
      e.y -= e.v; e.x += e.dx + Math.sin(t + e.p) * .2;
      if (e.y < -10) embers[i] = newEmber(false);
      var a = .2 + .5 * Math.abs(Math.sin(t * 1.3 + e.p));
      var g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 5);
      g.addColorStop(0, 'rgba(' + e.c + ',' + a.toFixed(3) + ')');
      g.addColorStop(1, 'rgba(' + e.c + ',0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r * 5, 0, 6.283); ctx.fill();
    });
    if (!reduce) requestAnimationFrame(draw);
  }
  addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);

  /* ===== Assets opcionais (se existirem na pasta assets/) ===== */
  function probe(srcs, ok) {
    (function next(i) {
      if (i >= srcs.length) return;
      var im = new Image();
      im.onload = function () { ok(srcs[i]); };
      im.onerror = function () { next(i + 1); };
      im.src = srcs[i];
    })(0);
  }
  probe(['assets/logo.png', 'assets/logo.webp', 'assets/logo.svg'], function (src) {
    var img = $('logoImg'); img.src = src; img.hidden = false;
    $('logo').classList.add('has-img');
  });
  document.querySelectorAll('.char').forEach(function (c) {
    probe([c.dataset.src], function (src) { c.src = src; c.hidden = false; });
  });
  probe(['assets/hero.jpg', 'assets/hero.webp', 'assets/hero.png'], function (src) {
    root.style.setProperty('--hero', 'url("' + src + '")');
  });
  var au = new Audio(); window.GTA = { au: au };
  au.loop = true; au.volume = .5;
  au.addEventListener('canplaythrough', function () { $('music').hidden = false; }, { once: true });
  au.src = 'assets/music.mp3';
  $('music').addEventListener('click', function () {
    var b = this;
    if (au.paused) { au.play().catch(function(){}); b.classList.add('on'); }
    else { au.pause(); b.classList.remove('on'); }
  });
})();