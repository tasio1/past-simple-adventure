/* teacher-mode.js — all exercises, answer keys, model answers, practice/whiteboard play, printable worksheets and keys, reset. */
(function (root) {
  'use strict';
  var PSA = root.PSA, h = PSA.h, P = PSA.progress, A = PSA.app, esc = PSA.esc;

  var TYPE_LABEL = { choice: 'Multiple choice', rewrite: 'Sentence rewriting', tiles: 'Drag-and-drop word order', detective: 'Error detection + correction', gapstory: 'Story / dialogue completion', speaking: 'Speaking (pair work)', typing: 'Typed verb forms', gapfill: 'Gap-fill (typed)', writing: 'Creative writing', memory: 'Matching + typing + timed recall', mystery: 'Role-play (pair / solo)', boss: 'Multiple-choice boss battle' };

  /* ---------- answer keys ---------- */
  function ansList(a) { return a.join('  /  '); }
  function keyHTML(ex) {
    var out = '<section class="sheet"><h2>Answer key — Exercise ' + ex.id + ': ' + esc(ex.title) + '</h2>';
    var t = ex.type;
    function ol(items) { return '<ol>' + items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>'; }
    if (t === 'choice' || t === 'boss') out += ol(ex.items.map(function (i) { var parts = i.prompt.split('___'); return esc(parts[0]) + '<b>' + esc(i.answer) + '</b>' + esc(parts[1] || '') + ' <span class="why">— ' + esc(i.explain) + '</span>'; }));
    else if (t === 'rewrite') out += ol(ex.items.map(function (i) { return '<b>' + esc(i.answers[0]) + '</b>' + (i.answers.length > 1 ? ' <span class="why">(also: ' + esc(i.answers.slice(1).join(' | ')) + ')</span>' : '') + ' <span class="why">— ' + esc(i.explain) + '</span>'; }));
    else if (t === 'tiles') out += ol(ex.items.map(function (i) { return '<b>' + esc(i.answers[0]) + '</b>' + (i.extra && i.extra.length ? ' <span class="why">(trap tile: ' + esc(i.extra.join(', ')) + ')</span>' : '') + ' <span class="why">— ' + esc(i.explain) + '</span>'; }));
    else if (t === 'detective') out += ol(ex.items.map(function (i) { var w = i.sentence.split(' '); return esc(i.sentence) + ' → mistake: <b>' + esc(i.culprit.map(function (k) { return w[k].replace(/[.?!]/g, ''); }).join(' + ')) + '</b> → <b>' + esc(i.answers[0]) + '</b> <span class="why">— ' + esc(i.explain) + '</span>'; }));
    else if (t === 'typing' || t === 'gapfill') out += ol(ex.items.map(function (i) { return (t === 'typing' ? esc(i.prompt) + ' → ' : '') + '<b>' + esc(i.answers[0]) + '</b> <span class="why">— ' + esc(i.explain) + '</span>'; }));
    else if (t === 'gapstory') out += ol(ex.gaps.map(function (g) { return '<b>' + esc(ansList(g.answers)) + '</b> <span class="why">— ' + esc(g.explain) + '</span>'; })) + (ex.bonus ? '<p><b>Bonus (model):</b> ' + esc(ex.model) + '</p>' : '');
    else if (t === 'memory') out += '<table class="key-table"><tr><th>Infinitive</th><th>Past Simple</th></tr>' + ex.items.map(function (i) { return '<tr><td>' + esc(i.base) + '</td><td><b>' + esc(i.answers[0]) + '</b></td></tr>'; }).join('') + '</table>';
    else {
      out += '<p><b>Open task:</b> accept any answer that meets the criteria below. The game only awards completion points.</p>';
      if (t === 'writing') out += '<p><b>Requirements:</b> ' + esc(ex.minWords + '–' + ex.maxWords + ' words') + '; ' + esc(JSON.stringify(ex.rules).replace(/[{}"]/g, '').replace(/,/g, '; ')) + '</p>';
      if (t === 'speaking') out += '<p><b>Questions:</b> ' + ex.questions.map(esc).join(' · ') + '</p>';
      if (t === 'mystery') out += '<p><b>Solo case solution:</b> the dog ate the cake (chocolate on its nose). Clues come from questions about the window, Mr Brown and the dog.</p>';
      out += '<p><b>Model answer:</b> ' + esc(ex.model) + '</p>';
    }
    return out + '</section>';
  }

  /* ---------- printable student worksheets ---------- */
  function line(n) { return '<span class="ws-line" style="min-width:' + (n || 40) + 'ch"></span>'; }
  function wsHead(ex) {
    return '<section class="sheet"><h2>Exercise ' + ex.id + ': ' + esc(ex.title) + '</h2><p class="meta">Name: ' + line(22) + ' Class: ' + line(8) + ' Date: ' + line(10) + '</p><p class="instr">' + esc(ex.instructions) + '</p>';
  }
  function worksheetHTML(ex) {
    var o = wsHead(ex), t = ex.type;
    function ol(items) { return '<ol class="ws">' + items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>'; }
    if (t === 'choice' || t === 'boss') o += ol(ex.items.map(function (i) { return esc(i.prompt.replace('___', '________')) + ' <span class="opts">(' + esc(i.options.join(' / ')) + ')</span>'; }));
    else if (t === 'rewrite') o += ol(ex.items.map(function (i) { return esc(i.prompt) + (i.task ? ' <i>(' + esc(i.task.toLowerCase()) + ')</i>' : '') + '<br>' + line(70); }));
    else if (t === 'tiles') o += ol(ex.items.map(function (i) { return '<span class="opts">' + esc(PSA.shuffle(i.words.concat(i.extra || [])).join('  /  ')) + '</span><br>' + line(70); }));
    else if (t === 'detective') o += ol(ex.items.map(function (i) { return esc(i.sentence) + '<br>Mistake: ' + line(16) + ' Correct sentence: ' + line(40); }));
    else if (t === 'typing') o += '<table class="key-table"><tr><th>Infinitive</th><th>Past Simple</th></tr>' + ex.items.map(function (i) { return '<tr><td>' + esc(i.prompt) + '</td><td>' + line(18) + '</td></tr>'; }).join('') + '</table>';
    else if (t === 'gapfill') o += ol(ex.items.map(function (i) { return esc(i.prompt.replace('___', '__________')); }));
    else if (t === 'gapstory') {
      function fill(text) { return esc(text).replace(/\{(\d+)\}/g, function (m, n) { return '<b>(' + n + ')</b> ' + line(ex.mode === 'select' ? 8 : 12); }); }
      if (ex.mode === 'select') o += '<p class="opts">Choose: ' + esc(ex.options.join(' / ')) + '</p>';
      if (ex.lines) o += ex.lines.map(function (l) { return '<p class="ws-p"><b>' + esc(l.who) + ':</b> ' + fill(l.text) + '</p>'; }).join('');
      else o += ex.panels.map(function (p) { return p.text.split('\n\n').map(function (para) { return '<p class="ws-p">' + fill(para) + '</p>'; }).join(''); }).join('');
      if (ex.bonus) o += '<p><b>' + esc(ex.bonus.title) + '</b> ' + esc(ex.bonus.text) + '</p>' + [1, 2, 3, 4, 5, 6].map(function (n) { return '<p>' + n + '. ' + line(70) + '</p>'; }).join('');
    } else if (t === 'speaking') {
      o += '<ul class="ws-check">' + ex.questions.map(function (q) { return '<li>☐ ' + esc(q) + '</li>'; }).join('') + '</ul><p><b>Notes:</b></p>' + [1, 2, 3].map(function () { return '<p>' + line(80) + '</p>'; }).join('') + '<p><b>Three facts about my partner:</b></p>' + [1, 2, 3].map(function (n) { return '<p>' + n + '. ' + line(72) + '</p>'; }).join('');
    } else if (t === 'writing') {
      o += '<p><b>Requirements:</b> ' + esc(ex.minWords + '–' + ex.maxWords + ' words') + '. ' + esc(ex.checks.filter(function (c) { return c !== 'words'; }).map(function (c) { return { verbs: '6 different Past Simple verbs', irregular: ex.rules.irregular + ' irregular verbs', regular: ex.rules.regular + ' regular verbs', linkers: 'first / then / after that / finally', wasWere: '2 sentences with was/were', negatives: '2 negative sentences', questions: '2 questions in dialogue' }[c]; }).join(' · ')) + '</p>' + Array.apply(null, Array(12)).map(function () { return '<p>' + line(88) + '</p>'; }).join('');
    } else if (t === 'memory') {
      o += '<table class="key-table"><tr><th>Infinitive</th><th>Past Simple</th></tr>' + ex.items.map(function (i) { return '<tr><td>' + esc(i.base) + '</td><td>' + line(16) + '</td></tr>'; }).join('') + '</table>';
    } else if (t === 'mystery') {
      o += '<p><b>The unusual event (Student A):</b> ' + line(60) + '</p><p>Starters: ' + esc(ex.starters.join('  ·  ')) + '</p><table class="key-table"><tr><th>#</th><th>Question</th><th>Answer / clue</th></tr>' + [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) { return '<tr><td>' + n + '</td><td>' + line(34) + '</td><td>' + line(24) + '</td></tr>'; }).join('') + '</table>';
    }
    return o + '</section>';
  }

  function sheetsFor(kind, which) {
    var list = which === 'all' ? PSA.exercises : /^L\d$/.test(which) ? PSA.exercisesOfLevel(Number(which.slice(1))) : [PSA.exerciseById(which)];
    return list.filter(Boolean).map(kind === 'key' ? keyHTML : worksheetHTML).join('');
  }

  /* ---------- Teacher dashboard ---------- */
  A.route('/teacher', function (params, main) {
    var p = P.current();
    function exCard(ex) {
      var model = PSA.isOpen(ex) || ex.type === 'gapstory' && ex.bonus;
      return h('article', { class: 'tcard', id: 'tex-' + ex.id },
        h('div', { class: 'tcard-head' }, h('h4', null, ex.icon + ' Exercise ' + ex.id + ' · ' + ex.title),
          h('span', { class: 'tag' }, TYPE_LABEL[ex.type] || ex.type), h('span', { class: 'tag' }, '~' + ex.minutes + ' min')),
        h('p', null, h('b', null, 'Learning objective: '), ex.objective),
        h('p', null, h('b', null, 'Mechanic: '), ex.mechanic, ' · ', h('b', null, 'Items: '), PSA.isOpen(ex) ? 'open task (completion credit)' : String(PSA.progress.itemIds(ex).length) + ' auto-checked'),
        h('p', null, h('b', null, 'Pair work: '), ex.pair),
        h('div', { class: 'actions' },
          h('a', { class: 'btn small primary', href: '#/teacher/play/' + ex.id }, '▶ Try it (not saved)'),
          h('a', { class: 'btn small', href: '#/teacher/present/' + ex.id }, '🖥 Project on whiteboard'),
          h('a', { class: 'btn small ghost', href: '#/teacher/sheet/ws/' + ex.id }, '🖨 Worksheet'),
          h('a', { class: 'btn small ghost', href: '#/teacher/sheet/key/' + ex.id }, '🖨 Answer key')),
        h('details', { class: 'key-details' }, h('summary', null, model ? 'Answer key & model answer' : 'Answer key'), h('div', { class: 'key-inline', html: keyHTML(ex).replace('<section class="sheet">', '<div>').replace('</section>', '</div>') })));
    }
    var levels = PSA.levels.map(function (lv) {
      var exs = PSA.exercisesOfLevel(lv.id), mins = exs.reduce(function (a, e) { return a + e.minutes; }, 0);
      return h('section', { class: 'tlevel', style: '--lv:' + lv.color },
        h('h3', null, lv.icon + (lv.bonus ? ' Bonus mission: ' : ' Mission ' + lv.id + ': ') + lv.title), h('p', { class: 'muted' }, 'Focus: ' + lv.focus + ' · Exercises ' + exs[0].id + '–' + exs[exs.length - 1].id + ' · about ' + mins + ' minutes'),
        h('details', { class: 'key-details' }, h('summary', null, '📖 Grammar explanation for this mission'), PSA.renderExplain(lv)),
        h('div', { class: 'actions' }, h('a', { class: 'btn small ghost', href: '#/teacher/sheet/ws/L' + lv.id }, '🖨 Worksheets: mission ' + lv.id), h('a', { class: 'btn small ghost', href: '#/teacher/sheet/key/L' + lv.id }, '🖨 Answer keys: mission ' + lv.id)),
        exs.map(exCard));
    });
    var students = P.profiles();
    main.appendChild(h('section', { class: 'teacher' },
      h('div', { class: 'page-head' }, h('div', { class: 'node-kicker' }, 'TEACHER MODE'), h('h2', null, '🧑‍🏫 Teacher mode'),
        h('p', null, 'All ' + PSA.exercises.length + ' exercises (20 in the five missions plus the bonus mission), answer keys, model answers, printable materials and a classroom presentation mode. You can open any exercise directly: nothing is locked and practice plays are not saved.')),
      h('div', { class: 'card tools' },
        h('div', { class: 'actions' },
          h('button', { type: 'button', class: 'btn', onClick: function () { A.toggle('present'); A.render(); } }, P.setting('present') ? '🖥 Presentation mode: ON' : '🖥 Presentation mode: OFF'),
          h('a', { class: 'btn', href: '#/teacher/sheet/ws/all' }, '🖨 All worksheets'),
          h('a', { class: 'btn', href: '#/teacher/sheet/key/all' }, '🖨 Full answer key'),
          h('a', { class: 'btn ghost', href: p ? '#/map' : '#/' }, '← Back to the game')),
        h('div', { class: 'actions' },
          p ? h('button', { type: 'button', class: 'btn danger small', onClick: function () { PSA.confirm('Reset progress?', 'Reset all progress of <b>' + esc(p.nick) + '</b> (scores, stars, drafts)? This cannot be undone.', 'Reset progress').then(function (y) { if (y) { P.resetCurrent(); PSA.toast('Progress reset for ' + p.nick); A.render(); } }); } }, '↺ Reset ' + p.nick + '\'s progress') : null,
          students.length ? h('button', { type: 'button', class: 'btn danger small', onClick: function () { PSA.confirm('Delete all players?', 'Delete <b>all ' + students.length + ' player(s)</b> and their progress on this device? This cannot be undone.', 'Delete everything').then(function (y) { if (y) { P.resetAll(); PSA.toast('All players deleted'); A.render(); } }); } }, '🗑 Delete all players (' + students.length + ')') : null)),
      students.length ? h('div', { class: 'card' }, h('h3', null, 'Players on this device'), h('div', { class: 'table-wrap' }, h('table', { class: 'gtable' },
        h('thead', null, h('tr', null, ['Player', 'Points', 'Exercises done'].map(function (x) { return h('th', null, x); }))),
        h('tbody', null, students.map(function (s) {
          return h('tr', null, h('td', null, (s.avatar || '') + ' ' + s.nick), h('td', null, String(P.pointsOf(s.nick))), h('td', null, String(Object.keys(s.ex || {}).filter(function (k) { return s.ex[k].done; }).length) + ' / ' + PSA.exercises.length));
        }))))) : null,
      levels));
  });

  /* ---------- Practice play (not saved) + whiteboard ---------- */
  A.route('/teacher/play/:id', function (params, main) {
    var ex = PSA.exerciseById(params.id); if (!ex) return A.go('/teacher');
    A.playExercise(main, ex, { practice: true, teacher: true, backHref: '#/teacher', backLabel: 'Teacher mode', kicker: 'TEACHER MODE · EXERCISE ' + ex.id });
  });
  A.route('/teacher/present/:id', function (params, main) {
    var ex = PSA.exerciseById(params.id); if (!ex) return A.go('/teacher');
    document.body.classList.add('board');
    A.onCleanup(function () { document.body.classList.remove('board'); });
    var ctx = A.playExercise(main, ex, { practice: true, teacher: true, backHref: '#/teacher', backLabel: 'Exit whiteboard', kicker: 'WHITEBOARD · EXERCISE ' + ex.id });
  });

  /* ---------- Printable sheets preview ---------- */
  A.route('/teacher/sheet/:kind/:which', function (params, main) {
    var kind = params.kind === 'key' ? 'key' : 'ws';
    var html = sheetsFor(kind, params.which);
    if (!html) return A.go('/teacher');
    var box = h('div', { class: 'sheets', html: html });
    main.appendChild(h('section', { class: 'teacher' },
      h('div', { class: 'actions no-print' }, h('a', { class: 'btn', href: '#/teacher' }, '← Teacher mode'),
        h('button', { type: 'button', class: 'btn primary big', onClick: function () { PSA.printHTML(box.innerHTML); } }, '🖨 Print ' + (kind === 'key' ? 'answer key' : 'worksheet') + (params.which === 'all' ? 's' : '')),
        h('span', { class: 'muted' }, 'Preview below. Each exercise starts on a new page.')),
      box));
  });
})(typeof window !== 'undefined' ? window : globalThis);
