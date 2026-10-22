/* engine-open.js — open-ended activities: speaking (Ex 6), writing (Ex 10, 20), mystery role-play (Ex 15).
   These award completion credit only. Keyword checks are shown as helpers, never as a grammar verdict. */
(function (root) {
  'use strict';
  var PSA = root.PSA, h = PSA.h, P = PSA.progress, V = PSA.v, E = PSA.engine, T = E.types;

  function saver(ctx, ex) {
    var t = null;
    return function (patch) {
      if (ctx.practice) return;
      clearTimeout(t);
      t = setTimeout(function () { P.setExtra(ex.id, patch()); }, 350);
    };
  }
  function saved(ctx, ex) { return ctx.practice ? {} : (P.extra(ex.id) || {}); }
  function submitBar(ctx, ex, label, enabledFn, note, onSubmit) {
    var btn = h('button', { type: 'button', class: 'btn primary big', onClick: function () { if (onSubmit) onSubmit(); else E.finish(ctx, ex); } }, label || 'Mark as complete ✔');
    var msg = h('div', { class: 'muted submit-note' });
    function refresh() {
      var ok = ctx.teacher || enabledFn();
      btn.disabled = !ok;
      msg.textContent = ok ? '' : note;
    }
    return { el: h('div', { class: 'submit-bar' }, btn, msg), refresh: refresh, btn: btn };
  }

  /* =========================== SPEAKING (Ex 6) =========================== */
  T.speaking = {
    mount: function (root, ex, ctx) {
      var sv = saved(ctx, ex), checks = sv.checks || ex.questions.map(function () { return false; });
      var facts = sv.facts || ['', '', ''], notes = sv.notes || '', extraQs = sv.extraQs || '';
      var persist = saver(ctx, ex);
      function patch() { return { checks: checks, facts: facts, notes: notes, extraQs: extraQs }; }
      var count = h('span', { class: 'chip pts' });
      var bar = submitBar(ctx, ex, 'Mission complete ✔', function () {
        return checks.filter(Boolean).length >= ex.minQuestions && facts.filter(function (f) { return f.trim().split(/\s+/).length >= 3; }).length >= ex.factsNeeded;
      }, 'Tick all 6 questions and write 3 facts (3+ words each) to complete. Your teacher can also complete it.');

      var list = h('ul', { class: 'check-list' }, ex.questions.map(function (q, i) {
        var cb = h('input', { type: 'checkbox', id: 'q6-' + i, checked: checks[i] ? true : null });
        cb.addEventListener('change', function () { checks[i] = cb.checked; update(); });
        return h('li', null, cb, h('label', { for: 'q6-' + i }, q));
      }));
      var soloLog = h('div', { class: 'solo-log' });
      var solo = h('details', { class: 'solo-box' }, h('summary', null, '🤖 No partner? Interview ' + ex.solo.who),
        h('p', { class: 'muted' }, 'Click a question to hear the robot\'s answer. Read the question aloud first!'),
        h('div', { class: 'solo-qs' }, ex.solo.qa.map(function (qa, i) {
          return h('button', { type: 'button', class: 'btn small ghost', onClick: function () {
            soloLog.appendChild(h('p', null, h('b', null, '🗣 ' + qa[0]), h('br'), '🤖 ' + qa[1]));
            checks[i] = true; list.querySelectorAll('input')[i].checked = true; update();
          } }, qa[0]);
        })), soloLog);
      var notesEl = h('textarea', { class: 'notes', rows: '4', 'aria-label': 'Notes about my partner', placeholder: 'Notes: write short answers you hear…' }); notesEl.value = notes;
      notesEl.addEventListener('input', function () { notes = notesEl.value; update(); });
      var factEls = facts.map(function (f, i) {
        var el = h('input', { type: 'text', class: 'ans-input wide', 'aria-label': 'Fact ' + (i + 1), placeholder: (ex.starters[i] || 'My partner …') + '' }); el.value = f;
        el.addEventListener('input', function () { facts[i] = el.value; update(); }); return el;
      });
      function update() { count.textContent = checks.filter(Boolean).length + ' / ' + ex.questions.length + ' questions asked'; persist(patch); bar.refresh(); }
      root.appendChild(h('div', { class: 'open-card' },
        h('h3', null, '1 · Ask your partner (at least six questions)'), list, h('div', null, count), solo,
        h('h3', null, '2 · Notes'), notesEl,
        h('h3', null, '3 · Report three facts about your partner'), h('p', { class: 'muted' }, 'Use was / were. No speech recognition is needed: just speak with your partner and then write.'), factEls,
        bar.el));
      update();
    }
  };

  /* =========================== WRITING (Ex 10, 20) =========================== */
  T.writing = {
    mount: function (root, ex, ctx) {
      var sv = saved(ctx, ex), persist = saver(ctx, ex);
      var self = sv.self || {}, rubric = sv.rubric || { by: 'self' };
      var ta = h('textarea', { class: 'writing', rows: '10', 'aria-label': 'Your text', placeholder: 'Start writing here…' });
      ta.value = sv.draft || '';
      var wc = h('div', { class: 'wc' });
      var wcBar = h('div', { class: 'bar' }, h('div', { class: 'bar-fill' }));
      var list = h('ul', { class: 'req-list' });
      var R = ex.rules;
      function patch() { return { draft: ta.value, draftAt: Date.now(), self: self, rubric: rubric }; }

      function reqRows(a) {
        var rows = [];
        function row(ok, text) { rows.push(h('li', { class: ok ? 'ok' : '' }, (ok ? '✔ ' : '○ ') + text)); }
        ex.checks.forEach(function (c) {
          if (c === 'words') row(a.words >= ex.minWords && a.words <= ex.maxWords, 'Length: ' + ex.minWords + '–' + ex.maxWords + ' words (you have ' + a.words + ')');
          if (c === 'verbs') row(a.verbs >= R.verbs, 'At least ' + R.verbs + ' different Past Simple verbs (found ' + a.verbs + ')');
          if (c === 'irregular') row(a.irregular >= R.irregular, 'At least ' + R.irregular + ' irregular verbs, not counting was/were (found ' + a.irregular + (a.irregularList.length ? ': ' + a.irregularList.join(', ') : '') + ')');
          if (c === 'regular') row(a.regular >= R.regular, 'At least ' + R.regular + ' regular -ed verbs (found ' + a.regular + ')');
          if (c === 'linkers') ['first', 'then', 'after that', 'finally'].forEach(function (l) { row(a.linkers[l], 'Use “' + l + '”'); });
          if (c === 'wasWere') row(a.wasWere >= R.wasWere, 'Two sentences with was / were (found ' + a.wasWere + ')');
          if (c === 'negatives') row(a.negatives >= R.negatives, 'Two negative sentences (found ' + a.negatives + ')');
          if (c === 'questions') row(a.questions >= R.questions, 'Two questions in dialogue (found ' + a.questions + (a.questions >= 2 && !a.hasQuotes ? ': put speech in “quotation marks”' : '') + ')');
        });
        return rows;
      }
      var allOk = false;
      function update(skipSave) {
        var a = V.analyseWriting(ta.value);
        PSA.clear(list); reqRows(a).forEach(function (r) { list.appendChild(r); });
        allOk = list.querySelectorAll('li:not(.ok)').length === 0;
        var pct = Math.min(100, Math.round(100 * a.words / ex.minWords));
        wcBar.firstChild.style.width = pct + '%';
        wcBar.firstChild.classList.toggle('over', a.words > ex.maxWords);
        wc.textContent = a.words + ' words · target ' + ex.minWords + '–' + ex.maxWords;
        if (!skipSave) persist(patch);
        bar.refresh();
      }
      var bar = submitBar(ctx, ex, 'Submit my text ✔', function () { return V.countWords(ta.value) >= Math.round(ex.minWords * 0.5); },
        'Write at least ' + Math.round(ex.minWords * 0.5) + ' words to submit. Your teacher can also mark it complete.',
        function () {
          function go() {
            if (!ctx.practice) P.setExtra(ex.id, { draft: ta.value, final: ta.value, finalAt: Date.now(), self: self, rubric: rubric });
            E.finish(ctx, ex);
          }
          if (!allOk && !ctx.teacher) {
            PSA.confirm('Submit anyway?', 'Some checklist items are not ticked yet. You can still submit, but try to improve your text first.', 'Submit anyway').then(function (y) { if (y) go(); });
          } else go();
        });
      ta.addEventListener('input', function () { update(); });

      var selfBox = h('div', { class: 'self-box' }, h('h4', null, 'Self-check (tick when true)'), ex.selfCheck.map(function (s, i) {
        var cb = h('input', { type: 'checkbox', id: 'self-' + ex.id + '-' + i, checked: self[i] ? true : null });
        cb.addEventListener('change', function () { self[i] = cb.checked; persist(patch); });
        return h('div', { class: 'self-row' }, cb, h('label', { for: 'self-' + ex.id + '-' + i }, s));
      }));

      var toolbar = h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'btn', onClick: function () { if (!ctx.practice) P.setExtra(ex.id, patch()); PSA.toast('Draft saved on this device ✔'); } }, '💾 Save draft'),
        h('button', { type: 'button', class: 'btn', onClick: function () { PSA.download('past-simple-' + ex.draftKey + '.txt', (ex.title + '\n\n' + ta.value + '\n'), 'text/plain;charset=utf-8'); } }, '⬇ Export .txt'),
        h('button', { type: 'button', class: 'btn', onClick: function () {
          var nick = (P.current() || {}).nick || '';
          PSA.printHTML('<h1>' + PSA.esc(ex.title) + '</h1><p class="meta">' + PSA.esc(nick) + ' · ' + new Date().toLocaleDateString() + '</p>' + ta.value.split(/\n+/).map(function (p) { return '<p>' + PSA.esc(p) + '</p>'; }).join(''));
        } }, '🖨 Print'));

      var rub = null;
      if (ex.rubric) {
        var crit = [['grammar', 'Past Simple accuracy'], ['variety', 'Verb variety (regular + irregular)'], ['forms', 'Negatives and questions'], ['org', 'Organisation and ideas']];
        rub = h('details', { class: 'rubric' }, h('summary', null, '🧑‍🏫 Assessment (self or teacher)'),
          h('div', { class: 'rubric-by' }, 'Assessed by: ',
            ['self', 'teacher'].map(function (w) {
              var r = h('input', { type: 'radio', name: 'by', id: 'by-' + w, value: w, checked: rubric.by === w ? true : null });
              r.addEventListener('change', function () { rubric.by = w; persist(patch); });
              return h('label', { class: 'inline', for: 'by-' + w }, r, ' ' + (w === 'self' ? 'Me' : 'Teacher'));
            })),
          crit.map(function (c) {
            var sel = h('select', { 'aria-label': c[1] }, h('option', { value: '' }, '—'), [1, 2, 3, 4].map(function (n) { return h('option', { value: String(n) }, n + (n === 1 ? ' (needs work)' : n === 4 ? ' (excellent)' : '')); }));
            sel.value = rubric[c[0]] || '';
            sel.addEventListener('change', function () { rubric[c[0]] = sel.value; persist(patch); });
            return h('div', { class: 'rubric-row' }, h('span', null, c[1]), sel);
          }),
          (function () { var c = h('textarea', { rows: '2', class: 'notes', placeholder: 'Comment…', 'aria-label': 'Assessment comment' }); c.value = rubric.comment || ''; c.addEventListener('input', function () { rubric.comment = c.value; persist(patch); }); return c; })());
      }
      var model = h('details', { class: 'model-box' }, h('summary', null, '📄 See an example text (try your own first!)'), h('p', null, ex.model));

      root.appendChild(h('div', { class: 'open-card writing-card' },
        h('div', { class: 'write-grid' },
          h('div', { class: 'write-main' }, ta, h('div', { class: 'wc-row' }, wc, wcBar), toolbar),
          h('div', { class: 'write-side' }, h('h4', null, 'Requirements checklist'), list,
            h('p', { class: 'muted small' }, 'This checklist only looks for words and patterns. It cannot tell you if your grammar is correct, so read your text carefully or ask your teacher.'))),
        selfBox, rub, model, bar.el));
      update(true);
    }
  };

  /* =========================== MYSTERY (Ex 15) =========================== */
  T.mystery = {
    mount: function (root, ex, ctx) {
      var sv = saved(ctx, ex), persist = saver(ctx, ex);
      var rows = sv.rows || []; while (rows.length < ex.minQuestions) rows.push({ q: '', a: '' });
      var event = sv.event || '', solved = !!sv.soloSolved, asked = sv.asked || [], clues = sv.clues || '';
      function patch() { return { rows: rows, event: event, soloSolved: solved, asked: asked, clues: clues }; }
      var mode = sv.mode || 'partner';
      var tabs = h('div', { class: 'mode-tabs' }), pane = h('div', { class: 'mode-area' });
      root.appendChild(tabs); root.appendChild(pane);
      var bar = submitBar(ctx, ex, 'Case closed ✔', function () { return mode === 'partner' ? validCount() >= ex.minQuestions : (asked.length >= ex.minQuestions && solved); },
        'Partner mode: write 8 good questions. Solo mode: ask 8 questions and solve the case.');
      function validCount() { return rows.filter(function (r) { return V.looksLikeQuestion(r.q); }).length; }
      function setMode(m) {
        mode = m; PSA.clear(tabs); PSA.clear(pane);
        [['partner', '👥 Partner mode'], ['solo', '🕵️ Solo detective']].forEach(function (t) {
          tabs.appendChild(h('button', { type: 'button', class: 'mode-tab' + (mode === t[0] ? ' active' : ''), onClick: function () { setMode(t[0]); } }, t[1]));
        });
        if (mode === 'partner') partner(); else soloMode();
        pane.appendChild(bar.el); bar.refresh();
      }

      function partner() {
        var focusIdx = 0, inputs = [], badges = [];
        var cover = h('div', { class: 'cover-chips' });
        var count = h('span', { class: 'chip pts' });
        var table = h('div', { class: 'notes-table' });
        var ev = h('input', { type: 'text', class: 'ans-input wide', 'aria-label': 'The unusual event', placeholder: 'Student A: the unusual event (e.g. “A giraffe walked into school.”)' }); ev.value = event;
        ev.addEventListener('input', function () { event = ev.value; persist(patch); });
        function refresh() {
          var used = {};
          rows.forEach(function (r, i) {
            var ok = V.looksLikeQuestion(r.q), w = V.questionWordOf(r.q);
            if (ok && w) used[w] = true;
            if (badges[i]) { badges[i].textContent = !r.q.trim() ? '' : ok ? '✓' : '?'; badges[i].className = 'qbadge ' + (ok ? 'ok' : 'no'); badges[i].title = ok ? 'Looks like a question' : 'Start with Did / Was / Were / Where / When / Why / Who and end with ?'; }
          });
          PSA.clear(cover);
          ex.words.forEach(function (w) { cover.appendChild(h('span', { class: 'cchip' + (used[w] ? ' on' : '') }, (used[w] ? '✔ ' : '') + w)); });
          count.textContent = validCount() + ' / ' + ex.minQuestions + ' questions';
          persist(patch); bar.refresh();
        }
        function build() {
          PSA.clear(table); inputs = []; badges = [];
          rows.forEach(function (r, i) {
            var q = h('input', { type: 'text', class: 'ans-input q', 'aria-label': 'Question ' + (i + 1), placeholder: (i + 1) + '. Your question…', autocomplete: 'off', spellcheck: 'false' }); q.value = r.q;
            var a = h('input', { type: 'text', class: 'ans-input a', 'aria-label': 'Answer ' + (i + 1), placeholder: 'Answer / clue…', autocomplete: 'off' }); a.value = r.a;
            var b = h('span', { class: 'qbadge' });
            q.addEventListener('focus', function () { focusIdx = i; });
            q.addEventListener('input', function () { r.q = q.value; refresh(); });
            a.addEventListener('input', function () { r.a = a.value; persist(patch); });
            inputs.push(q); badges.push(b);
            table.appendChild(h('div', { class: 'notes-row' }, b, q, a));
          });
          refresh();
        }
        var chips = h('div', { class: 'starter-chips' }, ex.starters.map(function (s) {
          return h('button', { type: 'button', class: 'chip-btn', onClick: function () {
            var i = rows[focusIdx] && !rows[focusIdx].q.trim() ? focusIdx : rows.findIndex(function (r) { return !r.q.trim(); });
            if (i < 0) i = focusIdx;
            rows[i].q = s.replace('…?', '').replace(' …?', ' '); inputs[i].value = rows[i].q; inputs[i].focus(); refresh();
          } }, s);
        }));
        pane.appendChild(h('div', { class: 'open-card' },
          h('h3', null, 'Roles'), h('p', null, 'Student A invents an unusual event from yesterday and answers in character. Student B is the detective: ask at least eight questions and write the clues. Then swap roles!'),
          ev, h('h3', null, 'Detective notes'), h('p', { class: 'muted' }, 'Question starters (click to use):'), chips, cover, table,
          h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn ghost', onClick: function () { rows.push({ q: '', a: '' }); build(); } }, '＋ Add a row'), count)));
        build();
      }

      function soloMode() {
        var S = ex.solo, log = h('div', { class: 'solo-log' });
        var counter = h('span', { class: 'chip pts' });
        function upd() { counter.textContent = asked.length + ' / ' + ex.minQuestions + ' questions asked'; persist(patch); bar.refresh(); }
        var qbtns = S.qa.map(function (qa, i) {
          var b = h('button', { type: 'button', class: 'btn small ghost solo-q', onClick: function () {
            if (asked.indexOf(i) < 0) asked.push(i);
            b.classList.add('asked'); showLog(); upd();
          } }, qa[0]);
          return b;
        });
        function showLog() {
          PSA.clear(log);
          asked.forEach(function (i) { log.appendChild(h('p', null, h('b', null, '🕵️ ' + S.qa[i][0]), h('br'), '🗣 ' + S.suspect + ': ' + S.qa[i][1])); });
        }
        var notes = h('textarea', { class: 'notes', rows: '3', 'aria-label': 'Clues', placeholder: 'Write the clues you found…' }); notes.value = clues;
        notes.addEventListener('input', function () { clues = notes.value; persist(patch); });
        var verdict = h('div', { class: 'feedback info', 'aria-live': 'polite' }, solved ? '✓ Case solved: it was ' + S.culprit + '!' : '');
        var sel = h('select', { 'aria-label': 'Who ate the cake?' }, h('option', { value: '' }, 'Who ate the cake?'), S.suspects.map(function (s) { return h('option', { value: s }, s); }));
        var accuse = h('button', { type: 'button', class: 'btn primary', onClick: function () {
          if (!sel.value) { verdict.className = 'feedback info'; verdict.textContent = 'Choose a suspect first.'; return; }
          if (asked.length < ex.minQuestions) { verdict.className = 'feedback info'; verdict.textContent = 'Ask at least ' + ex.minQuestions + ' questions first, then accuse someone.'; return; }
          if (sel.value === S.culprit) { solved = true; verdict.className = 'feedback good'; verdict.textContent = '✓ Case solved! ' + S.culprit + ' ate the cake: there was chocolate on its nose.'; PSA.sound.play('win'); }
          else { verdict.className = 'feedback bad'; verdict.textContent = '✗ Not ' + sel.value + '. Read the interview again and look for the clue about the chocolate!'; PSA.sound.play('bad'); }
          upd();
        } }, 'Accuse!');
        pane.appendChild(h('div', { class: 'open-card' }, h('h3', null, '📁 ' + S.title), h('p', null, S.intro),
          h('p', { class: 'muted' }, 'Click the questions to ask ' + S.suspect + '. Ask at least eight!'), h('div', { class: 'solo-qs' }, qbtns), counter, log,
          h('h3', null, 'Clues'), notes, h('h3', null, 'Your verdict'), h('div', { class: 'actions' }, sel, accuse), verdict));
        showLog(); asked.forEach(function (i) { qbtns[i].classList.add('asked'); }); upd();
      }
      setMode(mode);
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
