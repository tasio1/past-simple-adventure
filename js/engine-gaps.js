/* engine-gaps.js — story / dialogue completion (Ex 5, 14, 17): gaps checked together, with explanations. */
(function (root) {
  'use strict';
  var PSA = root.PSA, h = PSA.h, P = PSA.progress, V = PSA.v, E = PSA.engine, T = E.types;

  T.gapstory = {
    mount: function (root, ex, ctx) {
      var selectMode = ex.mode === 'select';
      var gapByN = {}; ex.gaps.forEach(function (g) { gapByN[g.n] = g; });
      var states = {}, panelEls = [], hintLv = 0, failedChecks = 0, finished = false;
      var wrap = h('div', { class: 'gap-page' + (ex.lines ? ' dialogue' : '') });
      var gained = 0;

      /* ---- text → DOM with gaps ---- */
      function buildGap(n, restText) {
        var g = gapByN[n], st = { gap: g, attempts: 0, resolved: false };
        var vm = restText.match(/^\s*\(([^)]*)\)/);
        st.base = vm && /^[a-z]+$/.test(vm[1]) ? vm[1] : null;
        var el;
        if (selectMode) {
          el = h('select', { class: 'gap-select', 'aria-label': 'Gap ' + n }, h('option', { value: '' }, '—'),
            ex.options.map(function (o) { return h('option', { value: o }, o); }));
        } else {
          var longest = Math.max.apply(null, g.answers.map(function (a) { return a.length; }));
          el = h('input', { type: 'text', class: 'gap-input', size: Math.min(16, Math.max(5, longest + 1)), autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', 'aria-label': 'Gap ' + n });
        }
        el.addEventListener('input', function () { el.classList.remove('wrong'); });
        el.addEventListener('change', function () { el.classList.remove('wrong'); });
        if (!selectMode) el.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); doCheck(); } });
        st.el = el;
        states[n] = st;
        return h('span', { class: 'gapwrap' }, h('span', { class: 'gapnum' }, '(' + n + ')'), el);
      }
      function renderText(text, parent) {
        text.split('\n\n').forEach(function (para) {
          var p = h('p', { class: 'story-p' });
          var parts = para.split(/(\{\d+\})/);
          parts.forEach(function (seg, i) {
            var m = seg.match(/^\{(\d+)\}$/);
            if (m) p.appendChild(buildGap(Number(m[1]), parts[i + 1] || ''));
            else if (seg) p.appendChild(document.createTextNode(seg));
          });
          parent.appendChild(p);
        });
      }
      if (ex.lines) {
        ex.lines.forEach(function (ln, i) {
          var bubble = h('div', { class: 'bubble' }, h('div', { class: 'who' }, ln.who));
          renderText(ln.text, bubble);
          wrap.appendChild(h('div', { class: 'dlg-row ' + (i % 2 ? 'right' : 'left') }, h('div', { class: 'dlg-avatar', html: PSA.art.avatar(ln.who) }), bubble));
        });
      } else {
        if (ex.id === 5) wrap.appendChild(h('div', { class: 'story-pic', html: PSA.art.story('trip') }));
        ex.panels.forEach(function (pn) {
          var box = h('div', { class: 'story-panel' });
          if (ex.progressive) box.appendChild(h('div', { class: 'story-pic', html: PSA.art.story(pn.scene) }));
          var txt = h('div', { class: 'story-text' }); renderText(pn.text, txt);
          box.appendChild(txt); wrap.appendChild(box); panelEls.push(box);
        });
      }

      /* ---- initial state: resolved gaps from earlier progress / review mode ---- */
      ex.gaps.forEach(function (g) {
        var st = states[g.n];
        if (E.shouldSkip(ctx, ex.id, g.id)) { st.resolved = true; setSolved(st, true); }
      });
      function panelGaps(i) {
        var ns = (ex.panels[i].text.match(/\{(\d+)\}/g) || []).map(function (s) { return Number(s.slice(1, -1)); });
        return ns.map(function (n) { return states[n]; });
      }
      function visiblePanelLimit() {
        if (!ex.progressive) return panelEls.length;
        for (var i = 0; i < ex.panels.length; i++) if (panelGaps(i).some(function (s) { return !s.resolved; })) return i + 1;
        return ex.panels.length;
      }
      function applyVisibility() {
        if (!ex.progressive) return;
        var lim = visiblePanelLimit();
        panelEls.forEach(function (p, i) { p.hidden = i >= lim; });
      }
      function visibleStates() {
        var list = [];
        if (!ex.progressive) return Object.keys(states).map(function (k) { return states[k]; });
        for (var i = 0; i < visiblePanelLimit(); i++) list = list.concat(panelGaps(i));
        return list;
      }
      function val(st) { return st.el.value; }
      function setSolved(st, good) {
        st.el.value = st.gap.answers[0];
        st.el.disabled = true; st.el.classList.remove('wrong'); st.el.classList.add(good ? 'ok' : 'shown');
      }

      /* ---- controls ---- */
      var fb = h('div', { class: 'feedback gap-feedback', 'aria-live': 'polite' });
      var hintBox = h('div', { class: 'hintbox', hidden: true });
      var btnCheck = h('button', { class: 'btn primary', type: 'button', onClick: doCheck }, 'Check answers ✓');
      var btnHint = h('button', { class: 'btn ghost', type: 'button', onClick: doHint }, '💡 Hint');
      var btnReveal = h('button', { class: 'btn ghost', type: 'button', hidden: !ctx.teacher, onClick: doReveal }, '👁 Show answers');
      var counter = h('span', { class: 'chip pts' }, '+0 pts');
      var progress = h('div', { class: 'progress-row' }, h('span', { class: 'q-count' }), h('div', { class: 'bar' }, h('div', { class: 'bar-fill' })), counter);
      var actions = h('div', { class: 'actions' }, btnCheck, btnHint, btnReveal);
      var tail = h('div', { class: 'gap-tail' });
      root.appendChild(progress); root.appendChild(wrap); root.appendChild(actions); root.appendChild(hintBox); root.appendChild(fb); root.appendChild(tail);
      applyVisibility(); updateProgress();
      setTimeout(function () { if (!finished && Object.keys(states).every(function (k) { return states[k].resolved; })) complete(); }, 0);

      function updateProgress() {
        var total = ex.gaps.length, done = ex.gaps.filter(function (g) { return states[g.n].resolved; }).length;
        progress.firstChild.textContent = done + ' of ' + total + ' gaps solved';
        progress.querySelector('.bar-fill').style.width = Math.round(100 * done / total) + '%';
        counter.textContent = '+' + gained + ' pts';
      }
      function say(kind, html) { fb.className = 'feedback gap-feedback ' + kind; fb.innerHTML = html; PSA.announce(fb.textContent); }
      function doHint() {
        hintLv++;
        var txt;
        if (hintLv === 1) txt = ex.hint;
        else {
          var st = visibleStates().filter(function (s) { return !s.resolved; })[0];
          if (!st) return;
          txt = selectMode ? 'Gap ' + st.gap.n + ': is the subject singular (it, he, she, I) or plural (they, we, you)? Is the sentence positive or negative?'
            : 'Gap ' + st.gap.n + ' starts with “' + st.gap.answers[0].charAt(0) + '” (' + st.gap.answers[0].length + ' letters).';
        }
        hintBox.hidden = false; hintBox.innerHTML = '<b>💡 Hint:</b> ' + PSA.esc(txt);
      }
      function resolveGap(st, revealed) {
        st.resolved = true;
        setSolved(st, !revealed);
        var pts = E.record(ctx, ex, st.gap.id, Math.max(st.attempts, 1), revealed);
        gained += pts;
      }
      function doCheck() {
        if (finished) return;
        var open = visibleStates().filter(function (s) { return !s.resolved; });
        var filled = open.filter(function (s) { return String(val(s)).trim() !== ''; });
        if (!filled.length) { say('info', 'Fill in at least one gap first.'); return; }
        var good = [], bad = [];
        filled.forEach(function (s) {
          s.attempts++;
          var r = V.check(val(s), s.gap.answers);
          if (r.ok) { good.push(s); resolveGap(s, false); }
          else { bad.push({ s: s, msg: V.diagnose(val(s), { base: s.base, answers: s.gap.answers }) }); s.el.classList.add('wrong'); }
        });
        var html = '';
        if (good.length) { PSA.sound.play('good'); html += '<div><b>✓ ' + E.praise() + '</b> ' + good.length + ' correct.</div>'; }
        else PSA.sound.play('bad');
        html += '<ul class="gap-notes">' + good.map(function (s) { return '<li class="g">✓ (' + s.gap.n + ') <b>' + PSA.esc(s.gap.answers[0]) + '</b> — ' + PSA.esc(s.gap.explain) + '</li>'; }).join('');
        html += bad.map(function (b) { return '<li class="b">✗ (' + b.s.gap.n + ') ' + PSA.esc(b.msg || (selectMode ? 'Check the subject and whether the sentence is positive or negative.' : 'Not quite. Check the rule in the hint.')) + '</li>'; }).join('') + '</ul>';
        var left = open.length - good.length;
        if (bad.length) { failedChecks++; html += '<div class="muted">Fix the red gaps and press Check again.</div>'; if (failedChecks >= 2) btnReveal.hidden = false; }
        else if (left > 0 && ex.progressive === undefined) html += '<div class="muted">' + left + ' gap(s) still empty.</div>';
        say(bad.length ? 'bad' : 'good', html);
        applyVisibility(); updateProgress();
        if (ex.progressive && !bad.length) {
          var lim = visiblePanelLimit();
          if (lim > 0 && panelEls[lim - 1] && !panelEls[lim - 1].hidden) { var f = panelEls[lim - 1].querySelector('input'); if (f && !f.disabled) f.focus(); }
        }
        if (Object.keys(states).every(function (k) { return states[k].resolved; })) complete();
      }
      function doReveal() {
        var open = visibleStates().filter(function (s) { return !s.resolved; });
        open.forEach(function (s) { s.attempts = Math.max(s.attempts, 1); resolveGap(s, true); });
        say('info', '<b>👁 Answers shown.</b> Read the explanations below and try those gaps again later.<ul class="gap-notes">' + open.map(function (s) { return '<li>(' + s.gap.n + ') <b>' + PSA.esc(s.gap.answers[0]) + '</b> — ' + PSA.esc(s.gap.explain) + '</li>'; }).join('') + '</ul>');
        applyVisibility(); updateProgress();
        if (Object.keys(states).every(function (k) { return states[k].resolved; })) complete();
      }

      function complete() {
        if (finished) return; finished = true;
        if (!ctx.practice) P.markDone(ex.id);
        btnCheck.hidden = true; btnHint.hidden = true; btnReveal.hidden = true; hintBox.hidden = true;
        PSA.sound.play('win');
        var list = h('details', { class: 'review-details' }, h('summary', null, '📘 Review all explanations'),
          h('ol', null, ex.gaps.map(function (g) { return h('li', null, h('b', null, g.answers[0]), ' — ', g.explain); })));
        tail.appendChild(list);
        if (ex.bonus) bonus(); else finishBar();
      }
      function finishBar() {
        tail.appendChild(h('div', { class: 'actions' }, h('button', { class: 'btn primary big', type: 'button', onClick: function () { E.finish(ctx, ex); } }, 'Finish exercise ▶')));
      }

      /* ---- Ex 5 bonus mission ---- */
      function bonus() {
        var b = ex.bonus, saved = (P.extra(ex.id) || {}).bonusLines || [], lines = [];
        var box = h('div', { class: 'bonus-box' }, h('h3', null, '⭐ ' + b.title), h('p', null, b.text));
        var status = h('div', { class: 'muted bonus-status' });
        function update() {
          var good = lines.filter(function (l) { return l.value.trim().split(/\s+/).length >= 3; }).length;
          lines.forEach(function (l, i) { var tag = l.parentNode.querySelector('.wtag'); var ok = /\b(was|were|wasn't|weren't)\b/i.test(l.value.replace(/[‘’]/g, "'")); tag.textContent = l.value.trim() ? (ok ? '✓ was/were' : '–') : ''; });
          status.textContent = good + ' of ' + b.minLines + ' sentences written (3+ words each).';
          submit.disabled = good < b.minLines;
          if (!ctx.practice) P.setExtra(ex.id, { bonusLines: lines.map(function (l) { return l.value; }) });
        }
        for (var i = 0; i < b.minLines; i++) {
          (function (i) {
            var inp = h('input', { type: 'text', class: 'ans-input wide', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Fantastic detail ' + (i + 1), value: saved[i] || '', placeholder: (i + 1) + '. Write a new, fantastic detail…' });
            inp.addEventListener('input', update); lines.push(inp);
            box.appendChild(h('div', { class: 'bonus-line' }, inp, h('span', { class: 'wtag' })));
          })(i);
        }
        var ideas = h('div', { class: 'hintbox', hidden: true }, '💡 Ideas: ' + b.sample.join(' · '));
        var submit = h('button', { class: 'btn primary', type: 'button', disabled: true, onClick: function () {
          if (!ctx.practice) { P.setExtra(ex.id, { bonusDone: true, bonusLines: lines.map(function (l) { return l.value; }) }); }
          if (ctx.onUpdate) ctx.onUpdate();
          PSA.toast('Bonus complete! +' + PSA.scoring.bonus + ' points');
          E.finish(ctx, ex);
        } }, 'Submit bonus ★ (+' + PSA.scoring.bonus + ')');
        var ideasBtn = h('button', { class: 'btn ghost', type: 'button', onClick: function () { ideas.hidden = !ideas.hidden; } }, '💡 Show ideas');
        var skip = h('button', { class: 'btn ghost', type: 'button', onClick: function () { E.finish(ctx, ex); } }, 'Skip bonus & finish ▶');
        box.appendChild(status); box.appendChild(ideas); box.appendChild(h('div', { class: 'actions' }, submit, ideasBtn, skip));
        tail.appendChild(box); update();
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
