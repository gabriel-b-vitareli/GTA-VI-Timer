(function () {
  'use strict';
  var B = document.body, R = document.documentElement;
  var $ = function (s) { return document.querySelector(s); };
  function h(s) { var d = document.createElement('div'); d.innerHTML = s.trim(); return d.firstChild; }
  var TARGET = new Date(2026, 10, 19).getTime();

  /* ===== Intro: toque/tecla pula ===== */
  var intro = $('#intro');
  function endIntro(fast) {
    if (!R.classList.contains('intro-on')) return;
    if (fast && intro) intro.classList.add('out');
    setTimeout(function () { R.classList.remove('intro-on'); }, fast ? 380 : 0);
  }
  if (intro && R.classList.contains('intro-on')) {
    intro.addEventListener('click', function () { endIntro(true); });
    addEventListener('keydown', function () { endIntro(true); }, { once: true });
    setTimeout(function () { endIntro(false); }, 3300);
  }

  /* ===== Sons de interface (sintetizados, sem arquivos) ===== */
  var ac;
  function ctx() {
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    if (ac && ac.state === 'suspended') ac.resume();
    return ac;
  }
  function tone(f1, f2, dur, vol, type, when) {
    var c = ctx(); if (!c) return;
    var t = c.currentTime + (when || 0), o = c.createOscillator(), g = c.createGain();
    o.type = type || 'square'; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + .02);
  }
  function blip() { tone(880, 1320, .07, .035); }
  function chime() { tone(660, 660, .12, .04, 'triangle'); tone(990, 990, .22, .04, 'triangle', .1); tone(1320, 1320, .3, .035, 'triangle', .22); }
  function stat() {
    var c = ctx(); if (!c) return;
    var n = Math.floor(c.sampleRate * .4), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = .7; g.gain.value = .12;
    s.buffer = buf; s.connect(f); f.connect(g); g.connect(c.destination); s.start();
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.ctrl button,#sheet .opts button,.rp,#music,#sheet .x')) blip();
  });
  var tw = $('#toasts');
  if (tw) new MutationObserver(function (m) {
    m.forEach(function (r) { if (r.addedNodes.length && ac) chime(); });
  }).observe(tw, { childList: true });

  /* ===== Mini-mapa ===== */
  B.appendChild(h('<div class="minimap" aria-hidden="true"><svg viewBox="0 0 100 100">' +
    '<path d="M0 0h100v100H0z" fill="#1c1a55"/>' +
    '<path d="M0 62C14 56 22 64 34 58S52 44 62 50 86 54 100 46V100H0z" fill="#2c2380"/>' +
    '<path d="M62 0C60 14 70 20 68 32S78 44 100 40V0z" fill="#3a2a8f" opacity=".7"/>' +
    '<g stroke="rgba(255,255,255,.14)" stroke-width=".6"><path d="M0 25h100M0 50h100M0 75h100M25 0v100M50 0v100M75 0v100"/></g>' +
    '<path d="M10 90L40 56l18 6 30-26" stroke="#ff8fc7" stroke-width="1.4" fill="none" opacity=".75"/>' +
    '<text x="50" y="11" text-anchor="middle" font-size="8" font-weight="700" fill="#fff" font-family="Montserrat,sans-serif">N</text>' +
    '</svg><div class="sweep"></div><div class="blip"></div></div>'));

  /* ===== Estrada até Leonida: polaroids ===== */
  var more = $('.more');
  if (more) {
    var D = function (y, m, d) { return new Date(y, m - 1, d).getTime(); };
    var ev = [
      { t: 'Primeiro trailer', d: D(2023, 12, 5), s: 'Leonida aparece ao mundo', p: '8% 66%', r: -4 },
      { t: '1º adiamento', d: D(2025, 5, 2), s: 'Nova data: 26/05/2026', p: '2% 6%', r: 3 },
      { t: 'Trailer 2', d: D(2025, 5, 6), s: 'Jason e Lucia de volta', p: '66% 26%', r: -2 },
      { t: '2º adiamento', d: D(2025, 11, 6), s: 'Nova data: 19/11/2026', p: '30% 96%', r: 4 },
      { t: 'Lançamento', d: TARGET, s: 'PS5 e Xbox Series X|S', p: '97% 18%', r: -3, next: 1 }
    ];
    var DAY = 864e5, nf = new Intl.NumberFormat('pt-BR');
    var fmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    function rel(t) {
      var n = Math.round((t - Date.now()) / DAY), a = nf.format(Math.abs(n));
      return n > 0 ? 'faltam ' + a + (a === '1' ? ' dia' : ' dias') : n === 0 ? 'é hoje!' : 'há ' + a + (a === '1' ? ' dia' : ' dias');
    }
    var html = ev.map(function (e) {
      return '<figure class="pola' + (e.next ? ' next' : '') + '" style="--r:' + e.r + 'deg;--pos:' + e.p + '"><div class="ph"></div>' +
        '<h3>' + e.t + '</h3><time>' + fmt.format(e.d) + '</time><em>' + e.s + ' · ' + rel(e.d) + '</em></figure>';
    }).join('');
    more.appendChild(h('<section class="road"><h2>A estrada até Leonida</h2><p>Cada marco desde o primeiro trailer, do começo da espera até o dia de voltar.</p><div class="polas">' + html + '</div></section>'));
  }

  /* ===== Rádio: estação 1 = faixa do site, estação 2 = synthwave gerada no navegador ===== */
  var au = (window.GTA || {}).au;
  var oldBtn = $('#music');
  if (au && oldBtn) {
    var btn = oldBtn.cloneNode(true); oldBtn.replaceWith(btn); // remove o handler antigo
    var stations = [
      { n: 'LEONIDA FM', f: 98.1, src: 'assets/music.mp3' },
      { n: 'NEON DRIVE FM', f: 104.7, src: null }
    ], cur = 0, synthUrl = null;

    var radio = h('<div class="radio" id="radio"><button class="rp" type="button" data-d="-1" aria-label="Estação anterior">‹</button>' +
      '<div class="rd"><b id="rn"></b><small id="rf"></small><div class="scale"><i id="needle"></i></div></div>' +
      '<button class="rp" type="button" data-d="1" aria-label="Próxima estação">›</button></div>');
    B.appendChild(radio);

    function synthWav() {
      var sr = 22050, bpm = 100, beat = 60 / bpm, bars = 8, len = Math.floor(sr * beat * 4 * bars), TAU = 6.2832;
      var chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], bass = [33, 29, 36, 31];
      var fq = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };
      var arpSeq = [0, 1, 2, 1, 0, 2, 1, 2], pcm = new Int16Array(len), seed = 7;
      for (var i = 0; i < len; i++) {
        var t = i / sr, bt = t / beat, bar = Math.floor(bt / 4) % 4, ch = chords[bar], v = 0;
        // baixo em colcheias
        var s8 = Math.floor(bt * 2), p8 = (bt * 2) % 1, bf = fq(bass[bar] + (s8 % 4 === 3 ? 12 : 0));
        var ph = (t * bf) % 1; v += (2 * ph - 1) * .22 * Math.exp(-p8 * 1.8);
        // arpejo em semicolcheias
        var s16 = Math.floor(bt * 4), p16 = (bt * 4) % 1, af = fq(ch[arpSeq[s16 % 8] % 3] + 12);
        v += (Math.sin(TAU * t * af) > 0 ? 1 : -1) * .06 * Math.exp(-p16 * 4.5);
        v += Math.sin(TAU * t * af * 1.005) * .05 * Math.exp(-p16 * 3);
        // pad
        for (var k = 0; k < 3; k++) v += Math.sin(TAU * t * fq(ch[k])) * .035;
        // bumbo a cada tempo
        var tk = (bt % 1) * beat; v += Math.sin(TAU * (45 * tk + 2.6 * (1 - Math.exp(-30 * tk)))) * .55 * Math.exp(-tk * 9);
        // chimbal no contratempo
        var th = ((bt + .5) % 1) * beat; seed = (seed * 16807) % 2147483647;
        v += ((seed / 1073741823.5) - 1) * .07 * Math.exp(-th * 55);
        pcm[i] = Math.max(-1, Math.min(1, v)) * 30000;
      }
      var buf = new ArrayBuffer(44 + len * 2), dv = new DataView(buf);
      var w = function (o, s) { for (var j = 0; j < s.length; j++) dv.setUint8(o + j, s.charCodeAt(j)); };
      w(0, 'RIFF'); dv.setUint32(4, 36 + len * 2, true); w(8, 'WAVEfmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true);
      dv.setUint16(22, 1, true); dv.setUint32(24, sr, true); dv.setUint32(28, sr * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true);
      w(36, 'data'); dv.setUint32(40, len * 2, true);
      for (var q = 0; q < len; q++) dv.setInt16(44 + q * 2, pcm[q], true);
      return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
    }

    function label() {
      var s = stations[cur];
      $('#rn').textContent = s.n; $('#rf').textContent = s.f.toFixed(1) + ' MHz';
      $('#needle').style.left = ((s.f - 88) / 20 * 100) + '%';
    }
    function tune(i, quiet) {
      cur = (i + stations.length) % stations.length;
      var s = stations[cur];
      if (!s.src) { synthUrl = synthUrl || synthWav(); }
      if (!quiet) stat();
      au.src = s.src || synthUrl; au.load(); au.play().catch(function () {});
      label();
    }
    label();
    btn.addEventListener('click', function () {
      if (au.paused) { tune(cur, true); btn.classList.add('on'); B.classList.add('radio-on'); }
      else { au.pause(); btn.classList.remove('on'); B.classList.remove('radio-on'); }
    });
    radio.addEventListener('click', function (e) {
      var b = e.target.closest('.rp'); if (b) tune(cur + (+b.dataset.d));
    });
  }
})();
