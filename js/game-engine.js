/* game-engine.js — core runner + closed-answer exercise types (choice, rewrite, typing, gapfill, tiles, detective, boss).
   Other exercise types live in engine-gaps.js, engine-memory.js and engine-open.js. */
(function (root) {
  'use strict';
  var PSA = root.PSA, h = PSA.h, P = PSA.progress, V = PSA.v;
  var E = (PSA.engine = { types: {} });
  var T = E.types;
  var PRAISE = ['Correct!', 'Great!', 'Nice one!', 'Spot on!', 'Well done!', 'Perfect!'];
  function praise() { return PRAISE[Math.floor(Math.random() * PRAISE.length)]; }
  E.praise = praise;
  var GENERIC_WRONG = 'Not quite. Read the hint, check the rule and try again.';

  /* ---- shared bookkeeping ---- */
  E.session = function (ctx) { ctx.session = ctx.session || { gained: 0, firstTry: 0, count: 0, tricky: 0 }; return ctx.session; };
  E.record = function (ctx, ex, itemId, attempts, revealed, isReview) {
    var pts = P.pointsFor(attempts, revealed);
    if (isReview) return pts;
    if (!ctx.practice) P.record(ex.id, itemId, attempts, revealed);
    var s = E.session(ctx);
    s.gained += pts; s.count++;
    if (pts === PSA.scoring.first) s.firstTry++; else s.tricky++;
    if (ctx.onUpdate) ctx.onUpdate();
    return pts;
  };
  E.finish = function (ctx, ex) {
    if (!ctx.practice) P.markDone(ex.id);
    PSA.sound.play('win');
    if (ctx.onFinish) ctx.onFinish(E.session(ctx));
  };
  E.inOnly = function (ctx, id) { return !ctx.only || ctx.only.has(id); };
  E.shouldSkip = function (ctx, exId, id) {
    if (ctx.only) return !ctx.only.has(id);
    if (ctx.replay || ctx.practice || P.isDone(exId)) return false;
    return P.isResolved(exId, id);
  };

  E.textInput = function (api, label, placeholder, cls) {
    var inp = h('input', { type: 'text', class: 'ans-input ' + (cls || ''), autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', 'aria-label': label || 'Your answer', placeholder: placeholder || '' });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); api.submit(); } });
    inp.addEventListener('input', function () { inp.classList.remove('wrong'); });
    return inp;
  };
  function firstWordHint(item) {
    var a = item.answers && item.answers[0];
    if (!a) return null;
    var w = String(a).split(' ')[0].replace(/[?.!]/g, '');
    return 'The answer starts with “' + w + '”' + (String(a).split(' ').length === 1 ? ' (' + w.length + ' letters)' : '') + '.';
  }

  /* ================= Sequence runner: one item at a time ================= */
  E.sequence = function (root, ex, ctx, type, cfg) {
    cfg = cfg || {};
    var source = cfg.items || ex.items;
    var queue = source.filter(function (it) {
      if (cfg.onlyIds && !cfg.onlyIds.has(it.id)) return false;
      return !E.shouldSkip(ctx, ex.id, it.id);
    });
    var total = queue.length, answered = 0, idx = 0;
    if (!queue.length) { return (cfg.onDone || function () { E.finish(ctx, ex); })(); }
    PSA.clear(root);
    var before = cfg.before ? cfg.before(root) : null;
    var progRow = h('div', { class: 'progress-row' });
    var qLabel = h('span', { class: 'q-count' });
    var bar = h('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100' }, h('div', { class: 'bar-fill' }));
    var gained = h('span', { class: 'chip pts' }, '+0');
    progRow.appendChild(qLabel); progRow.appendChild(bar); progRow.appendChild(gained);
    var card = h('div', { class: 'qcard' });
    root.appendChild(progRow); root.appendChild(card);
    var seqGain = 0;

    function setProgress() {
      var pct = Math.round(100 * answered / queue.length);
      bar.firstChild.style.width = pct + '%';
      bar.setAttribute('aria-valuenow', String(pct));
      qLabel.textContent = 'Question ' + Math.min(idx + 1, queue.length) + ' of ' + queue.length;
      gained.textContent = '+' + seqGain + ' pts';
    }

    function show() {
      PSA.clear(card);
      var item = queue[idx], attempts = 0, hintLv = 0, resolved = false;
      setProgress();
      var body = h('div', { class: 'qbody' });
      var fb = h('div', { class: 'feedback', 'aria-live': 'polite' });
      var hintBox = h('div', { class: 'hintbox', hidden: true });
      var api = { ex: ex, item: item, ctx: ctx, submit: doCheck };
      var handle = type.build(item, body, api);
      if (item._review) body.insertBefore(h('div', { class: 'review-tag' }, '↻ Practice again'), body.firstChild);

      var btnCheck = h('button', { class: 'btn primary', type: 'button', onClick: doCheck }, 'Check ✓');
      var btnHint = h('button', { class: 'btn ghost', type: 'button', onClick: doHint }, '💡 Hint');
      var btnReveal = h('button', { class: 'btn ghost', type: 'button', hidden: !ctx.teacher, onClick: doReveal }, '👁 Show answer');
      var isLast = idx >= queue.length - 1;
      var btnNext = h('button', { class: 'btn primary', type: 'button', hidden: true, onClick: next }, isLast ? 'Finish ✔' : 'Next ▶');
      var actions = h('div', { class: 'actions' }, handle.auto ? null : btnCheck, btnHint, btnReveal, btnNext);
      card.appendChild(body); card.appendChild(actions); card.appendChild(hintBox); card.appendChild(fb);
      if (handle.focus) setTimeout(function () { handle.focus(); }, 30);

      function say(kind, html) {
        fb.className = 'feedback ' + kind;
        fb.innerHTML = html;
        PSA.announce(fb.textContent);
      }
      function doHint() {
        if (resolved) return;
        hintLv++;
        var txt = hintLv === 1 ? (item.hint || ex.hint) : (handle.hint2 ? handle.hint2() : firstWordHint(item)) || (item.hint || ex.hint);
        hintBox.hidden = false;
        hintBox.innerHTML = '<b>💡 Hint ' + Math.min(hintLv, 2) + ':</b> ' + PSA.esc(txt);
        if (hintLv >= 2) btnHint.textContent = '💡 Hint (again)';
      }
      function doCheck() {
        if (resolved) return;
        var r = handle.check();
        if (!r || r.empty) { say('info', 'Give an answer first.'); return; }
        attempts++;
        if (r.ok) return resolve(false, r);
        PSA.sound.play('bad');
        if (handle.wrong) handle.wrong(r);
        var msg = r.msg || GENERIC_WRONG;
        say('bad', '<b>✗ Not yet.</b> ' + PSA.esc(msg) + (attempts >= 2 ? '' : ' <span class="muted">Try again!</span>'));
        if (attempts >= 2) btnReveal.hidden = false;
        if (cfg.after) cfg.after(item, false, attempts);
      }
      function doReveal() {
        if (resolved) return;
        resolve(true, { ok: false });
      }
      function resolve(revealed, r) {
        resolved = true;
        if (revealed && handle.reveal) handle.reveal();
        if (handle.lock) handle.lock(!revealed);
        var pts = E.record(ctx, ex, item.id, Math.max(attempts, 1), revealed, item._review);
        if (!item._review) seqGain += pts;
        answered++;
        var lead;
        if (revealed) lead = '<b>👁 Answer shown.</b> You can practise this one again later.';
        else lead = '<b>✓ ' + praise() + '</b>' + (item._review ? '' : ' <span class="pts-badge">+' + pts + '</span>');
        var answerLine = revealed || (type.showAnswer && type.showAnswer(item)) ? '<div class="ans-line">' + PSA.esc(E.answerText(item)) + '</div>' : '';
        say(revealed ? 'info' : 'good', lead + (r && r.tip ? ' <span class="tip">' + PSA.esc(r.tip) + '</span>' : '') + answerLine + (item.explain ? '<div class="explain">📘 ' + PSA.esc(item.explain) + '</div>' : ''));
        PSA.sound.play(revealed ? 'click' : 'good');
        btnCheck.hidden = true; btnHint.hidden = true; btnReveal.hidden = true; btnNext.hidden = false;
        hintBox.hidden = true;
        if (cfg.after) cfg.after(item, !revealed, attempts, revealed);
        // practice-again copy for tricky verbs
        if (cfg.requeue && !item._review && (attempts > 1 || revealed)) {
          var copy = {}; Object.keys(item).forEach(function (k) { copy[k] = item[k]; });
          copy._review = true; queue.push(copy);
        }
        setProgress();
        setTimeout(function () { btnNext.focus(); }, 30);
      }
      function next() {
        idx++;
        if (idx >= queue.length) { (cfg.onDone || function () { E.finish(ctx, ex); })(); return; }
        show();
      }
    }
    show();
  };

  E.answerText = function (item) {
    if (item.answer) return item.prompt ? item.prompt.replace('___', item.answer) : item.answer;
    if (item.answers) return item.answers[0];
    return '';
  };

  /* ================= CHOICE (rapid choice / boss) ================= */
  T.choice = {
    mount: function (root, ex, ctx) { E.sequence(root, ex, ctx, T.choice); },
    showAnswer: function (item) { return false; },
    build: function (item, mount, api) {
      var chosen = null, locked = false;
      var parts = item.prompt.split('___');
      var gap = h('span', { class: 'gap-slot' }, '＿＿＿');
      var sentence = h('p', { class: 'choice-sentence' }, parts[0], gap, parts[1] || '');
      var box = h('div', { class: 'choice-options n' + item.options.length });
      var btns = item.options.map(function (o, i) {
        var b = h('button', { class: 'choice-btn', type: 'button', 'data-opt': o, onClick: function () { if (locked) return; chosen = o; api.submit(); } },
          item.options.length > 2 ? h('span', { class: 'opt-key' }, 'ABC'[i]) : null, o);
        box.appendChild(b); return b;
      });
      mount.appendChild(sentence); mount.appendChild(box);
      return {
        auto: true,
        focus: function () { if (btns[0]) btns[0].focus(); },
        check: function () {
          if (chosen == null) return { empty: true };
          var ok = chosen.toLowerCase() === item.answer.toLowerCase();
          return ok ? { ok: true } : { ok: false, msg: V.diagnose(item.prompt.replace('___', chosen), item) || ('“' + chosen + '” is not right here.') };
        },
        wrong: function () {
          btns.forEach(function (b) { if (b.getAttribute('data-opt') === chosen) { b.classList.add('wrong'); b.disabled = true; } });
          chosen = null;
        },
        reveal: function () { chosen = item.answer; },
        lock: function () {
          locked = true; gap.textContent = item.answer; gap.classList.add('filled');
          btns.forEach(function (b) { b.disabled = true; if (b.getAttribute('data-opt') === item.answer) b.classList.add('right'); });
        }
      };
    }
  };

  /* ================= REWRITE (full-sentence typing) ================= */
  T.rewrite = {
    mount: function (root, ex, ctx) { E.sequence(root, ex, ctx, T.rewrite); },
    build: function (item, mount, api) {
      var inp = E.textInput(api, 'Your sentence', 'Type the full sentence…', 'wide');
      var label = item.task || api.ex.task || 'Rewrite the sentence';
      mount.appendChild(h('div', { class: 'task-label' }, label));
      mount.appendChild(h('div', { class: 'sentence-box' }, item.prompt));
      mount.appendChild(inp);
      return {
        focus: function () { inp.focus(); },
        check: function () {
          var v = inp.value, r = V.check(v, item.answers);
          if (r.empty) return { empty: true };
          if (r.ok) return { ok: true, tip: r.apos ? 'Tip: remember the apostrophe (wasn\'t, weren\'t, didn\'t).' : null };
          var plain = item.prompt.replace(/\s*\([^)]*\)\s*$/, '');
          if (V.normalise(v) === V.normalise(plain)) return { ok: false, msg: 'That is the same sentence. Change it!' };
          return { ok: false, msg: V.diagnose(v, item) };
        },
        wrong: function () { inp.classList.add('wrong'); inp.focus(); },
        reveal: function () { inp.value = item.answers[0]; },
        lock: function (good) { inp.disabled = true; inp.classList.toggle('ok', !!good); }
      };
    }
  };

  /* ================= TYPING (single verb form) ================= */
  T.typing = {
    mount: function (root, ex, ctx) { E.sequence(root, ex, ctx, T.typing); },
    showAnswer: function () { return true; },
    build: function (item, mount, api) {
      var inp = E.textInput(api, 'Past simple of ' + item.base, 'past simple…');
      mount.appendChild(h('div', { class: 'task-label' }, 'Write the PAST SIMPLE'));
      mount.appendChild(h('div', { class: 'verb-big' }, item.base, h('span', { class: 'arrow' }, ' → '), '?'));
      mount.appendChild(inp);
      return {
        focus: function () { inp.focus(); },
        check: function () {
          var r = V.check(inp.value, item.answers);
          if (r.empty) return { empty: true };
          if (r.ok) return { ok: true };
          return { ok: false, msg: V.diagnose(inp.value, item) };
        },
        wrong: function () { inp.classList.add('wrong'); inp.select(); },
        reveal: function () { inp.value = item.answers[0]; },
        lock: function (good) { inp.disabled = true; inp.classList.toggle('ok', !!good); },
        hint2: function () { return 'The past form starts with “' + item.answers[0].charAt(0) + '” and has ' + item.answers[0].length + ' letters.'; }
      };
    }
  };

  /* ================= GAPFILL (verb in brackets, typed inline) ================= */
  T.gapfill = {
    mount: function (root, ex, ctx) { E.sequence(root, ex, ctx, T.gapfill); },
    showAnswer: function () { return false; },
    build: function (item, mount, api) {
      var m = item.prompt.match(/^(.*?)___\s*\(([^)]*)\)(.*)$/) || [null, item.prompt, '', ''];
      var inp = E.textInput(api, 'Missing verb', '', 'inline');
      inp.size = 9;
      mount.appendChild(h('div', { class: 'task-label' }, 'Write the PAST SIMPLE of the verb in brackets'));
      mount.appendChild(h('p', { class: 'choice-sentence' }, m[1], inp, h('span', { class: 'verb-hint' }, ' (' + m[2] + ')'), m[3]));
      return {
        focus: function () { inp.focus(); },
        check: function () {
          var r = V.check(inp.value, item.answers);
          if (r.empty) return { empty: true };
          if (r.ok) return { ok: true };
          return { ok: false, msg: V.diagnose(inp.value, item) };
        },
        wrong: function () { inp.classList.add('wrong'); inp.select(); },
        reveal: function () { inp.value = item.answers[0]; },
        lock: function (good) { inp.disabled = true; inp.classList.toggle('ok', !!good); }
      };
    }
  };

  /* ================= TILES (drag and drop + keyboard/click alternative) ================= */
  T.tiles = {
    mount: function (root, ex, ctx) { E.sequence(root, ex, ctx, T.tiles); },
    showAnswer: function () { return true; },
    build: function (item, mount, api) {
      var all = item.words.concat(item.extra || []).map(function (w, i) { return { id: 't' + i, text: w, extra: i >= item.words.length }; });
      var byId = {}; all.forEach(function (t) { byId[t.id] = t; });
      var order = PSA.shuffle(all.map(function (t) { return t.id; }), item.words.map(function (w, i) { return 't' + i; }));
      var placed = [], dragId = null, locked = false, lastFocus = null;
      var bank = h('div', { class: 'tile-bank', 'aria-label': 'Available words' });
      var zone = h('div', { class: 'tile-zone', 'aria-label': 'Your question (drop words here)' });
      var preview = h('div', { class: 'tile-preview', 'aria-live': 'polite' });
      var qm = /\?$/.test(item.answers[0]) ? '?' : '.';

      function tileEl(t, inZone) {
        var b = h('button', { type: 'button', class: 'tile' + (t.extra ? '' : ''), draggable: locked ? 'false' : 'true', 'data-id': t.id, 'aria-label': t.text + (inZone ? ', in your answer, position ' + (placed.indexOf(t.id) + 1) : '') }, t.text);
        b.addEventListener('click', function () {
          if (locked) return;
          if (inZone) { placed.splice(placed.indexOf(t.id), 1); lastFocus = null; } else { placed.push(t.id); lastFocus = t.id; }
          render();
        });
        b.addEventListener('keydown', function (e) {
          if (locked || !inZone) return;
          var i = placed.indexOf(t.id);
          if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); placed.splice(i, 1); placed.splice(i - 1, 0, t.id); lastFocus = t.id; render(); }
          else if (e.key === 'ArrowRight' && i < placed.length - 1) { e.preventDefault(); placed.splice(i, 1); placed.splice(i + 1, 0, t.id); lastFocus = t.id; render(); }
          else if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); placed.splice(i, 1); lastFocus = null; render(); }
        });
        b.addEventListener('dragstart', function (e) { dragId = t.id; b.classList.add('dragging'); try { e.dataTransfer.setData('text/plain', t.id); e.dataTransfer.effectAllowed = 'move'; } catch (x) { /* */ } });
        b.addEventListener('dragend', function () { dragId = null; b.classList.remove('dragging'); zone.classList.remove('over'); });
        return b;
      }
      function render() {
        PSA.clear(bank); PSA.clear(zone);
        order.forEach(function (id) { if (placed.indexOf(id) < 0) bank.appendChild(tileEl(byId[id], false)); });
        placed.forEach(function (id) { zone.appendChild(tileEl(byId[id], true)); });
        zone.classList.toggle('empty', !placed.length);
        var text = placed.map(function (id) { return byId[id].text; }).join(' ');
        preview.textContent = text ? text.charAt(0).toUpperCase() + text.slice(1) + qm : 'Your sentence appears here…';
        if (lastFocus) { var f = (placed.indexOf(lastFocus) >= 0 ? zone : bank).querySelector('[data-id="' + lastFocus + '"]'); if (f) f.focus(); }
      }
      zone.addEventListener('dragover', function (e) { if (locked) return; e.preventDefault(); zone.classList.add('over'); });
      zone.addEventListener('dragleave', function () { zone.classList.remove('over'); });
      zone.addEventListener('drop', function (e) {
        e.preventDefault(); zone.classList.remove('over');
        if (locked || !dragId) return;
        var id = dragId, at = placed.length;
        var tgt = e.target && e.target.closest ? e.target.closest('.tile') : null;
        if (tgt && tgt.getAttribute('data-id') !== id) {
          at = placed.indexOf(tgt.getAttribute('data-id'));
          var r = tgt.getBoundingClientRect();
          if (e.clientX > r.left + r.width / 2) at++;
        }
        var old = placed.indexOf(id);
        if (old >= 0) { placed.splice(old, 1); if (old < at) at--; }
        placed.splice(Math.max(0, Math.min(at, placed.length)), 0, id);
        lastFocus = null; render();
      });
      bank.addEventListener('dragover', function (e) { if (!locked) e.preventDefault(); });
      bank.addEventListener('drop', function (e) {
        e.preventDefault(); if (locked || !dragId) return;
        var i = placed.indexOf(dragId); if (i >= 0) placed.splice(i, 1);
        lastFocus = null; render();
      });
      var clear = h('button', { type: 'button', class: 'btn small ghost', onClick: function () { if (!locked) { placed = []; lastFocus = null; render(); } } }, '↺ Clear');
      mount.appendChild(h('div', { class: 'task-label' }, 'Build the question'));
      mount.appendChild(zone); mount.appendChild(preview);
      mount.appendChild(h('div', { class: 'tile-help muted' }, 'Drag the tiles, or click / press Enter on a tile to move it. In your answer: ← → move a tile, Backspace removes it.'));
      mount.appendChild(bank); mount.appendChild(clear);
      render();
      return {
        focus: function () { var f = bank.querySelector('.tile'); if (f) f.focus(); },
        check: function () {
          if (!placed.length) return { empty: true };
          var words = placed.map(function (id) { return byId[id].text; });
          if (V.tilesCheck(words, item.answers).ok) return { ok: true };
          var usedExtra = placed.some(function (id) { return byId[id].extra; });
          if (usedExtra) return { ok: false, msg: 'Trap tile! DID is not used with was / were. Take it out.' };
          var d = V.diagnose(words.join(' '), item);
          if (d) return { ok: false, msg: d };
          if (placed.length < item.words.length) return { ok: false, msg: 'You have not used all the words yet.' };
          return { ok: false, msg: 'Check the word order: the question word or verb comes first, then the subject.' };
        },
        wrong: function () { zone.classList.add('wrong'); setTimeout(function () { zone.classList.remove('wrong'); }, 600); },
        reveal: function () { placed = item.words.map(function (w, i) { return 't' + i; }); lastFocus = null; render(); },
        lock: function () { locked = true; render(); zone.classList.add('ok'); },
        hint2: function () { return 'The first word is “' + item.answers[0].split(' ')[0] + '”.'; }
      };
    }
  };

  /* ================= DETECTIVE (select the mistake, then rewrite) ================= */
  T.detective = {
    mount: function (root, ex, ctx) { E.sequence(root, ex, ctx, T.detective); },
    showAnswer: function () { return true; },
    build: function (item, mount, api) {
      var toks = item.sentence.split(' '), sel = {}, locked = false;
      var row = h('div', { class: 'tok-row', role: 'group', 'aria-label': 'Click the wrong word or words' });
      var tb = toks.map(function (t, i) {
        var b = h('button', { type: 'button', class: 'tok', 'aria-pressed': 'false', onClick: function () {
          if (locked) return;
          sel[i] = !sel[i]; b.classList.toggle('sel', !!sel[i]); b.setAttribute('aria-pressed', sel[i] ? 'true' : 'false'); b.classList.remove('wrong');
        } }, t);
        row.appendChild(b); return b;
      });
      var inp = E.textInput(api, 'Corrected sentence', 'Rewrite the whole sentence correctly…', 'wide');
      mount.appendChild(h('div', { class: 'task-label' }, '1. Click the wrong word(s)'));
      mount.appendChild(row);
      mount.appendChild(h('div', { class: 'task-label' }, '2. Rewrite the sentence correctly'));
      mount.appendChild(inp);
      function picked() { return Object.keys(sel).filter(function (k) { return sel[k]; }).map(Number); }
      return {
        focus: function () { if (tb[0]) tb[0].focus(); },
        check: function () {
          var p = picked();
          if (!p.length && !inp.value.trim()) return { empty: true };
          if (!p.length) return { ok: false, msg: 'First click the wrong word(s) in the sentence.' };
          var bad = p.filter(function (i) { return item.culprit.indexOf(i) < 0; });
          if (bad.length) { bad.forEach(function (i) { tb[i].classList.add('wrong'); sel[i] = false; tb[i].classList.remove('sel'); tb[i].setAttribute('aria-pressed', 'false'); }); return { ok: false, msg: 'Look again: “' + toks[bad[0]].replace(/[.?!]/g, '') + '” is fine. Which word(s) are wrong?' }; }
          if (!inp.value.trim()) return { ok: false, msg: 'Good eye! Now rewrite the whole sentence correctly.' };
          var r = V.check(inp.value, item.answers);
          if (r.ok) return { ok: true, tip: r.apos ? 'Tip: remember the apostrophe.' : null };
          return { ok: false, msg: 'You found the mistake, but your correction is not right yet. ' + (V.diagnose(inp.value, item) || '') };
        },
        wrong: function () { inp.classList.add('wrong'); },
        reveal: function () {
          item.culprit.forEach(function (i) { sel[i] = true; tb[i].classList.add('sel'); });
          inp.value = item.answers[0];
        },
        lock: function (good) { locked = true; inp.disabled = true; inp.classList.toggle('ok', !!good); tb.forEach(function (b, i) { b.disabled = true; if (item.culprit.indexOf(i) >= 0) b.classList.add('culprit'); }); },
        hint2: function () { return item.culprit.length === 1 ? 'Exactly one word is wrong.' : item.culprit.length + ' words belong to the mistake (you can click one or both).'; }
      };
    }
  };

  /* ================= BOSS (Ex 19): choice + rebuilding machine ================= */
  T.boss = {
    mount: function (root, ex, ctx) {
      var built = 0, hp = ex.items.length;
      ex.items.forEach(function (it) { if (!ctx.only && !ctx.replay && !ctx.practice && !P.isDone(ex.id) && P.isResolved(ex.id, it.id)) { built++; } });
      hp -= built;
      var machineBox, hpFill, hpText, partLabel, glitchBox;
      function before(rootEl) {
        machineBox = h('div', { class: 'boss-machine', html: PSA.art.machine(built, { float: false }) });
        hpFill = h('div', { class: 'bar-fill hp' });
        hpText = h('div', { class: 'hp-text' });
        partLabel = h('div', { class: 'part-label muted', 'aria-live': 'polite' }, 'Answer correctly to rebuild the machine.');
        glitchBox = h('div', { class: 'boss-glitch', html: PSA.art.glitch() });
        var head = h('div', { class: 'boss-head' }, machineBox,
          h('div', { class: 'boss-info' }, h('div', { class: 'boss-name' }, '👾 GLITCH'), h('div', { class: 'bar hpbar' }, hpFill), hpText, partLabel), glitchBox);
        rootEl.appendChild(head); updateHp();
        return head;
      }
      function updateHp() {
        var total = ex.items.length;
        hpFill.style.width = Math.max(0, 100 * hp / total) + '%';
        hpText.textContent = 'Glitch HP: ' + Math.max(0, hp) + ' / ' + total + ' · Machine: ' + built + ' / ' + total + ' parts';
      }
      function after(item, ok, attempts, revealed) {
        if (ok || revealed) {
          var part = machineBox.querySelector('[data-part="' + built + '"]');
          built++; hp--;
          if (part) { part.setAttribute('class', 'mpart on pop'); }
          partLabel.textContent = '🔧 Part rebuilt: ' + (ex.parts[built - 1] || '');
          glitchBox.classList.add('hit'); setTimeout(function () { glitchBox.classList.remove('hit'); }, 500);
          if (built >= ex.items.length) { partLabel.textContent = '🎉 The time machine is repaired!'; glitchBox.classList.add('defeated'); }
        } else {
          partLabel.textContent = 'Glitch dodged! Think about the rule and try again.';
          glitchBox.classList.add('laugh'); setTimeout(function () { glitchBox.classList.remove('laugh'); }, 500);
        }
        updateHp();
      }
      E.sequence(root, ex, ctx, T.choice, { before: before, after: after });
    }
  };

  /* ================= Entry point ================= */
  E.mount = function (container, ex, ctx) {
    PSA.clear(container);
    var t = T[ex.type];
    if (!t) { container.appendChild(h('p', null, 'Unknown exercise type: ' + ex.type)); return; }
    E.session(ctx);
    t.mount(container, ex, ctx);
  };
})(typeof window !== 'undefined' ? window : globalThis);
