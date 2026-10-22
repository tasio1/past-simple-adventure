/* engine-memory.js — Exercise 16: Irregular Verb Memory Challenge (match · type · timed recall). */
(function (root) {
  'use strict';
  var PSA = root.PSA, h = PSA.h, P = PSA.progress, V = PSA.v, E = PSA.engine, T = E.types;

  E.addCleanup = function (ctx, fn) { if (ctx.cleanups) ctx.cleanups.push(fn); };

  T.memory = {
    mount: function (root, ex, ctx) {
      var local = { m1: false, m2: false };
      var saved = ctx.practice ? {} : (P.extra(ex.id) || {});
      var fresh = !ctx.only && !ctx.replay && !ctx.practice && !P.isDone(ex.id);
      // modes already completed in an earlier session (only when continuing, not when replaying / reviewing)
      if (fresh) { local.m1 = !!saved.m1; local.m2 = !!saved.m2; }
      var tabs = h('div', { class: 'mode-tabs', role: 'tablist' });
      var area = h('div', { class: 'mode-area' });
      var tail = h('div', { class: 'gap-tail' });
      root.appendChild(tabs); root.appendChild(area); root.appendChild(tail);
      var current = null, timer = null, ended = false;
      E.addCleanup(ctx, function () { ended = true; if (timer) clearInterval(timer); });

      function setFlag(k) {
        local[k] = true;
        if (!ctx.practice) { var p = {}; p[k] = true; P.setExtra(ex.id, p); }
      }
      function bothDone() { return local.m1 && local.m2; }
      function hub() {
        PSA.clear(tabs);
        [['m1', '1 · Match', 'match'], ['m2', '2 · Type', 'type'], ['m3', '3 · Rapid recall ⏱ (optional)', 'rapid']].forEach(function (m) {
          var done = m[0] === 'm3' ? !!saved.speedBest : local[m[0]];
          tabs.appendChild(h('button', { type: 'button', role: 'tab', class: 'mode-tab' + (current === m[2] ? ' active' : '') + (done ? ' done' : ''), 'aria-selected': current === m[2] ? 'true' : 'false', onClick: function () { start(m[2]); } }, (done ? '✓ ' : '') + m[1]));
        });
        PSA.clear(tail);
        if (bothDone() && !ended) {
          if (!ctx.practice) P.markDone(ex.id);
          tail.appendChild(h('div', { class: 'bonus-box' }, h('p', null, '✅ Matching and typing are complete. The timed recall is optional: try it for a Speed Runner badge!'),
            h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn primary big', onClick: function () { E.finish(ctx, ex); } }, 'Finish exercise ▶'))));
        }
      }
      /* after finishing a mode: go to the other required mode if it is still open, otherwise show the summary */
      function afterMode(doneMode, otherFlag, otherMode) {
        if (!local[otherFlag]) { start(otherMode); return; }
        current = doneMode; hub(); PSA.clear(area);
        area.appendChild(h('p', { class: 'feedback good' }, '✓ ' + (doneMode === 'match' ? 'Matching' : 'Typing') + ' is complete! Both required modes are done.'));
      }
      function start(mode) {
        if (timer) { clearInterval(timer); timer = null; }
        current = mode; hub(); PSA.clear(area);
        if (mode === 'match') match(); else if (mode === 'type') typing(); else rapid();
      }

      /* ---------- Mode 1: matching boards (5 verbs per round) ---------- */
      function match() {
        var items = ex.matchItems.filter(function (m) {
          if (ctx.only) return ctx.only.has(m.id);
          return !(local.m1 && fresh) && !E.shouldSkip(ctx, ex.id, m.id);
        });
        if (!items.length) { setFlag('m1'); afterMode('match', 'm2', 'type'); return; }
        var rounds = [], again = [], r = 0;
        for (var i = 0; i < items.length; i += 5) rounds.push(items.slice(i, i + 5));
        var misses = {};
        function round(list, isReview) {
          PSA.clear(area);
          var matched = 0, selL = null, selR = null;
          var left = h('div', { class: 'match-col' }), right = h('div', { class: 'match-col' });
          var msg = h('div', { class: 'feedback info', 'aria-live': 'polite' }, 'Pick a verb, then its past form.');
          var rightOrder = PSA.shuffle(list);
          var lb = {}, rb = {};
          list.forEach(function (m) {
            lb[m.id] = h('button', { type: 'button', class: 'match-btn', onClick: function () { pickL(m); } }, m.base);
            left.appendChild(lb[m.id]);
          });
          rightOrder.forEach(function (m) {
            rb[m.id] = h('button', { type: 'button', class: 'match-btn past', onClick: function () { pickR(m); } }, m.past);
            right.appendChild(rb[m.id]);
          });
          function clearSel() { Object.keys(lb).forEach(function (k) { lb[k].classList.remove('sel'); rb[k].classList.remove('sel'); }); }
          function pickL(m) { if (lb[m.id].disabled) return; selL = m; clearSelSide(lb); lb[m.id].classList.add('sel'); try2(); }
          function pickR(m) { if (rb[m.id].disabled) return; selR = m; clearSelSide(rb); rb[m.id].classList.add('sel'); try2(); }
          function clearSelSide(map) { Object.keys(map).forEach(function (k) { map[k].classList.remove('sel'); }); }
          function try2() {
            if (!selL || !selR) return;
            var a = selL, b = selR; selL = selR = null;
            if (a.id === b.id) {
              lb[a.id].disabled = rb[a.id].disabled = true; lb[a.id].classList.remove('sel'); rb[a.id].classList.remove('sel');
              lb[a.id].classList.add('right'); rb[a.id].classList.add('right');
              if (!isReview) E.record(ctx, ex, a.id, 1 + (misses[a.id] || 0), false);
              matched++; PSA.sound.play('good');
              msg.className = 'feedback good'; msg.textContent = '✓ ' + a.base + ' → ' + a.past;
              if (matched === list.length) roundDone();
            } else {
              misses[a.id] = (misses[a.id] || 0) + 1;
              if (!isReview && again.indexOf(a) < 0) again.push(a);
              lb[a.id].classList.add('wrong'); rb[b.id].classList.add('wrong'); PSA.sound.play('bad');
              msg.className = 'feedback bad'; msg.textContent = '✗ Not a pair. That verb will come back for more practice.';
              setTimeout(function () { clearSel(); lb[a.id].classList.remove('wrong'); rb[b.id].classList.remove('wrong'); }, 700);
            }
            if (ctx.onUpdate) ctx.onUpdate();
          }
          function roundDone() {
            var nextBtn;
            if (!isReview && ++r < rounds.length) nextBtn = h('button', { type: 'button', class: 'btn primary', onClick: function () { round(rounds[r], false); } }, 'Next board ▶');
            else if (!isReview && again.length) nextBtn = h('button', { type: 'button', class: 'btn primary', onClick: function () { var a = again.slice(); again = []; round(a, true); } }, 'Practise the tricky verbs ↻');
            else nextBtn = h('button', { type: 'button', class: 'btn primary', onClick: function () { setFlag('m1'); afterMode('match', 'm2', 'type'); } }, 'Matching complete ✓ — continue ▶');
            area.appendChild(h('div', { class: 'actions' }, nextBtn)); nextBtn.focus();
          }
          area.appendChild(h('div', { class: 'task-label' }, (isReview ? 'Practice again: ' : 'Board ' + (r + 1) + ' of ' + rounds.length + ': ') + 'match each verb with its Past Simple form'));
          area.appendChild(h('div', { class: 'match-board' }, left, right));
          area.appendChild(msg);
        }
        round(rounds[0], false);
      }

      /* ---------- Mode 2: typing (tricky verbs come back) ---------- */
      function typing() {
        var typedIds = new Set(ex.items.map(function (i) { return i.id; }));
        E.sequence(area, ex, ctx, T.typing, {
          requeue: true,
          onlyIds: ctx.only ? typedIds : null,
          onDone: function () { setFlag('m2'); afterMode('type', 'm1', 'match'); }
        });
      }

      /* ---------- Mode 3: timed rapid recall (optional) ---------- */
      function rapid() {
        var secs = ex.timedSeconds || 60, correct = 0, tried = 0, misses = [], deck = [], running = false;
        var clock = h('div', { class: 'timer' }, secs + 's');
        var scoreEl = h('div', { class: 'chip pts' }, '0 correct');
        var verbEl = h('div', { class: 'verb-big' }, 'Ready?');
        var inp = E.textInput({ submit: submitAns }, 'Past simple', 'past simple + Enter');
        inp.disabled = true;
        var flash = h('div', { class: 'feedback info', 'aria-live': 'polite' }, 'Type the past simple and press Enter. Skip with a blank Enter. You have ' + secs + ' seconds. No penalties!');
        var go = h('button', { type: 'button', class: 'btn primary big', onClick: begin }, '▶ Start (' + secs + 's)');
        area.appendChild(h('div', { class: 'task-label' }, 'Rapid recall — optional'));
        area.appendChild(h('div', { class: 'rapid-top' }, clock, scoreEl));
        area.appendChild(verbEl); area.appendChild(inp); area.appendChild(flash); area.appendChild(h('div', { class: 'actions' }, go));
        function nextVerb() {
          if (!deck.length) deck = PSA.shuffle(ex.items);
          var it = deck.pop(); area._cur = it; verbEl.innerHTML = '';
          verbEl.appendChild(document.createTextNode(it.base)); verbEl.appendChild(h('span', { class: 'arrow' }, ' → ?'));
          inp.value = ''; inp.focus();
        }
        function begin() {
          running = true; go.hidden = true; inp.disabled = false; correct = 0; tried = 0; misses = []; scoreEl.textContent = '0 correct';
          var left = secs; clock.textContent = left + 's'; nextVerb();
          timer = setInterval(function () { left--; clock.textContent = left + 's'; clock.classList.toggle('low', left <= 10); if (left <= 0) end(); }, 1000);
        }
        function submitAns() {
          if (!running) return;
          var it = area._cur, v = inp.value.trim();
          if (!v) { misses.push(it); nextVerb(); return; }
          tried++;
          if (V.check(v, it.answers).ok) { correct++; flash.className = 'feedback good'; flash.textContent = '✓ ' + it.base + ' → ' + it.answers[0]; PSA.sound.play('good'); }
          else { misses.push(it); flash.className = 'feedback bad'; flash.textContent = '✗ ' + it.base + ' → ' + it.answers[0]; PSA.sound.play('bad'); }
          scoreEl.textContent = correct + ' correct'; nextVerb();
        }
        function end() {
          running = false; clearInterval(timer); timer = null; inp.disabled = true;
          var best = Math.max(saved.speedBest || 0, correct);
          if (!ctx.practice) { var patch = { speedBest: best }; if (correct >= 10) patch.speedDone = true; P.setExtra(ex.id, patch); saved.speedBest = best; if (correct >= 10) saved.speedDone = true; }
          var uniq = []; misses.forEach(function (m) { if (uniq.indexOf(m.base) < 0) uniq.push(m.base); });
          PSA.clear(area);
          area.appendChild(h('div', { class: 'bonus-box' }, h('h3', null, '⏱ Time is up!'), h('p', { class: 'big-score' }, correct + ' correct (' + tried + ' typed)'),
            h('p', null, correct >= 10 ? '⚡ Speed Runner! 10 or more correct.' : 'Aim for 10 or more to earn the Speed Runner badge.'),
            uniq.length ? h('p', null, 'Practise these: ', uniq.map(function (b) { return b + ' → ' + PSA.irregularByBase[b].past; }).join(' · ')) : null,
            h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn primary', onClick: function () { start('rapid'); } }, '↻ Try again'))));
          hub();
        }
      }

      if (bothDone()) { hub(); area.appendChild(h('p', { class: 'muted' }, 'Both required modes are complete. Choose a mode above to practise again.')); }
      else start(!local.m1 ? 'match' : 'type');
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
