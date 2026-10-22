/* utils.js — tiny DOM helpers, shuffle, sound, modal, toast */
(function (root) {
  'use strict';
  var PSA = (root.PSA = root.PSA || {});

  /* h('div', {class:'x', onClick:fn, html:'<b>..</b>'}, child, ...) */
  PSA.h = function (tag, props) {
    var e = document.createElement(tag);
    var p = props || {};
    Object.keys(p).forEach(function (k) {
      var v = p[k];
      if (v === false || v == null) return;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'text') e.textContent = v;
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') e.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v === true) e.setAttribute(k, '');
      else e.setAttribute(k, v);
    });
    var kids = Array.prototype.slice.call(arguments, 2);
    (function add(list) {
      list.forEach(function (c) {
        if (c == null || c === false) return;
        if (Array.isArray(c)) return add(c);
        e.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
      });
    })(kids);
    return e;
  };
  PSA.clear = function (el) { while (el.firstChild) el.removeChild(el.firstChild); return el; };
  PSA.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  };

  PSA.shuffle = function (arr, notSameAs) {
    var a = arr.slice();
    for (var tries = 0; tries < 20; tries++) {
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      if (!notSameAs || a.join('|') !== notSameAs.join('|') || a.length < 2) break;
    }
    return a;
  };

  /* Screen-reader announcements */
  PSA.announce = function (msg) {
    var r = document.getElementById('live-region');
    if (!r) return;
    r.textContent = '';
    setTimeout(function () { r.textContent = msg; }, 30);
  };

  /* Sound (Web Audio, generated — no files needed). Off by default for classrooms. */
  var ac = null;
  PSA.sound = {
    enabled: false,
    play: function (kind) {
      if (!PSA.sound.enabled) return;
      try {
        ac = ac || new (root.AudioContext || root.webkitAudioContext)();
        var seq = { good: [[660, .08], [880, .12]], bad: [[220, .18]], win: [[523, .1], [659, .1], [784, .1], [1047, .25]], click: [[440, .04]] }[kind] || [];
        var t = ac.currentTime;
        seq.forEach(function (n) {
          var o = ac.createOscillator(), g = ac.createGain();
          o.type = 'square'; o.frequency.value = n[0];
          g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + n[1]);
          o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + n[1]);
          t += n[1];
        });
      } catch (e) { /* ignore */ }
    }
  };

  PSA.toast = function (msg, ms) {
    var box = document.getElementById('toasts');
    if (!box) return;
    var t = PSA.h('div', { class: 'toast', role: 'status' }, msg);
    box.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, ms || 2600);
  };

  /* Modal dialog. Returns {close()}. buttons: [{label, cls, onClick}] */
  PSA.modal = function (opts) {
    var prev = document.activeElement;
    var back = PSA.h('div', { class: 'modal-back' });
    var box = PSA.h('div', { class: 'modal' + (opts.wide ? ' wide' : ''), role: 'dialog', 'aria-modal': 'true', 'aria-label': opts.title || 'Dialog' });
    var head = PSA.h('div', { class: 'modal-head' }, PSA.h('h2', null, opts.title || ''),
      PSA.h('button', { class: 'btn small ghost', 'aria-label': 'Close', onClick: close }, '✕'));
    var body = PSA.h('div', { class: 'modal-body' });
    if (typeof opts.body === 'string') body.innerHTML = opts.body; else if (opts.body) body.appendChild(opts.body);
    var foot = PSA.h('div', { class: 'modal-foot' });
    (opts.buttons || []).forEach(function (b) {
      foot.appendChild(PSA.h('button', { class: 'btn ' + (b.cls || ''), onClick: function () { if (b.onClick) b.onClick(); if (b.close !== false) close(); } }, b.label));
    });
    box.appendChild(head); box.appendChild(body); if (opts.buttons && opts.buttons.length) box.appendChild(foot);
    back.appendChild(box);
    back.addEventListener('mousedown', function (e) { if (e.target === back) close(); });
    function key(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', key);
    function close() {
      document.removeEventListener('keydown', key);
      if (back.parentNode) back.parentNode.removeChild(back);
      if (prev && prev.focus) try { prev.focus(); } catch (e) { /* */ }
    }
    document.body.appendChild(back);
    var f = box.querySelector('button.btn:not(.ghost), input, button');
    if (f) f.focus();
    return { close: close, box: box };
  };

  PSA.confirm = function (title, text, yesLabel) {
    return new Promise(function (resolve) {
      var done = false;
      PSA.modal({
        title: title, body: '<p>' + text + '</p>',
        buttons: [
          { label: 'Cancel', cls: 'ghost', onClick: function () { if (!done) { done = true; resolve(false); } } },
          { label: yesLabel || 'Yes', cls: 'danger', onClick: function () { done = true; resolve(true); } }
        ]
      });
    });
  };

  PSA.download = function (filename, text, mime) {
    var blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); if (a.parentNode) a.parentNode.removeChild(a); }, 500);
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* Printing: shows `html` in #print-root and prints only that (see responsive.css @media print). */
(function (root) {
  'use strict';
  var PSA = root.PSA;
  PSA.printHTML = function (html) {
    var pr = document.getElementById('print-root');
    if (!pr) { pr = document.createElement('div'); pr.id = 'print-root'; document.body.appendChild(pr); }
    pr.innerHTML = html;
    document.body.classList.add('printing');
    function done() { document.body.classList.remove('printing'); root.removeEventListener('afterprint', done); }
    root.addEventListener('afterprint', done);
    setTimeout(function () { try { root.print(); } catch (e) { /* ignore */ } setTimeout(done, 1500); }, 50);
  };
})(typeof window !== 'undefined' ? window : globalThis);
