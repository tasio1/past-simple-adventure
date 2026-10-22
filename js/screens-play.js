/* screens-play.js — mission intro, grammar briefing, mission hub, exercise screen, results, review and certificate. */
(function (root) {
  'use strict';
  var PSA = root.PSA, h = PSA.h, P = PSA.progress, A = PSA.app;

  function reduced() { return !!P.setting('reduce') || (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function lvOr404(id) { return PSA.levelById(id); }
  function lockMsg(lv) { return lv.bonus ? 'Complete all 5 missions to open the bonus mission!' : 'Finish the previous mission first!'; }
  function posInLevel(ex) { var l = PSA.exercisesOfLevel(ex.level); return { i: l.indexOf(ex) + 1, n: l.length, list: l }; }
  function exStatus(ex) { return P.isDone(ex.id) ? 'done' : P.exUnlocked(ex.id) ? 'open' : 'locked'; }

  /* ---------- Mission intro (animated briefing) ---------- */
  A.route('/level/:id/intro', function (params, main) {
    if (!A.needProfile()) return;
    var lv = lvOr404(params.id); if (!lv) return A.go('/map');
    if (!P.levelUnlocked(lv.id)) { PSA.toast(lockMsg(lv)); return A.go('/map'); }
    P.flag('intro' + lv.id, true);
    var text = h('p', { class: 'briefing-text', 'aria-live': 'polite' });
    var timer = null;
    if (reduced()) text.textContent = lv.story;
    else {
      var i = 0; timer = setInterval(function () { i += 2; text.textContent = lv.story.slice(0, i); if (i >= lv.story.length) { clearInterval(timer); timer = null; } }, 28);
      A.onCleanup(function () { if (timer) clearInterval(timer); });
    }
    main.appendChild(h('section', { class: 'intro', style: '--lv:' + lv.color },
      h('div', { class: 'intro-art', html: lv.scene === 'machine' ? PSA.art.machine(P.parts()) : PSA.art.scene(lv.scene) }),
      h('div', { class: 'intro-card card' },
        h('div', { class: 'node-kicker' }, lv.bonus ? 'BONUS MISSION' : 'MISSION ' + lv.id + ' OF 5'),
        h('h2', null, lv.icon + ' ' + lv.title), h('div', { class: 'node-focus' }, 'Grammar: ' + lv.focus),
        h('div', { class: 'chrono-row' }, h('div', { class: 'chrono', html: PSA.art.chrono() }), h('div', { class: 'speech' }, h('b', null, 'CHRONO: '), text)),
        h('div', { class: 'actions' },
          h('a', { class: 'btn primary big', href: '#/level/' + lv.id + '/explain', onClick: function () { if (timer) clearInterval(timer); } }, 'Start briefing ▶'),
          h('a', { class: 'btn ghost', href: '#/level/' + lv.id + '/hub' }, 'Skip to missions')))));
  });

  /* ---------- Grammar briefing ---------- */
  A.route('/level/:id/explain', function (params, main) {
    if (!A.needProfile()) return;
    var lv = lvOr404(params.id); if (!lv || !P.levelUnlocked(lv.id)) return A.go('/map');
    main.appendChild(h('section', { class: 'explain-page', style: '--lv:' + lv.color },
      h('div', { class: 'page-head' }, h('div', { class: 'node-kicker' }, PSA.missionName(lv) + ' · GRAMMAR BRIEFING'), h('h2', null, lv.icon + ' ' + lv.focus)),
      PSA.renderExplain(lv),
      h('div', { class: 'actions center' }, h('a', { class: 'btn primary big', href: '#/level/' + lv.id + '/hub' }, 'I\'m ready: to the missions ▶'), h('a', { class: 'btn ghost', href: '#/map' }, 'Map'))));
  });

  /* ---------- Mission hub (exercise list) ---------- */
  A.route('/level/:id/hub', function (params, main) {
    if (!A.needProfile()) return;
    var lv = lvOr404(params.id); if (!lv) return A.go('/map');
    if (!P.levelUnlocked(lv.id)) { PSA.toast(lockMsg(lv)); return A.go('/map'); }
    var list = PSA.exercisesOfLevel(lv.id), complete = P.levelComplete(lv.id);
    var next = list.filter(function (e) { return !P.isDone(e.id); })[0];
    var flagged = P.flaggedLevel(lv.id).reduce(function (a, x) { return a + x.ids.length; }, 0);
    var rows = list.map(function (ex, i) {
      var st = exStatus(ex);
      var go = st === 'locked' ? h('span', { class: 'muted' }, '🔒 Finish exercise ' + (i) + ' first') : h('a', { class: 'btn ' + (st === 'open' ? 'primary' : ''), href: '#/ex/' + ex.id }, st === 'done' ? '↻ Replay' : (P.exPoints(ex.id) || P.extra(ex.id).draft ? '▶ Continue' : '▶ Start'));
      return h('div', { class: 'ex-row ' + st },
        h('div', { class: 'ex-icon', 'aria-hidden': 'true' }, st === 'done' ? '✔' : st === 'locked' ? '🔒' : ex.icon),
        h('div', { class: 'ex-main' }, h('div', { class: 'ex-title' }, 'Exercise ' + ex.id + ' · ' + ex.title), h('div', { class: 'muted' }, ex.mechanic + ' · ~' + ex.minutes + ' min' + (PSA.isOpen(ex) ? ' · open task' : ''))),
        h('div', { class: 'ex-score' }, P.exPoints(ex.id) + ' / ' + P.exMax(ex.id) + ' pts'), go);
    });
    main.appendChild(h('section', { class: 'hub', style: '--lv:' + lv.color },
      h('div', { class: 'hub-head card' },
        h('div', { class: 'hub-art', html: lv.scene === 'machine' ? PSA.art.machine(P.parts(), { float: false }) : PSA.art.scene(lv.scene) }),
        h('div', null, h('div', { class: 'node-kicker' }, lv.bonus ? 'BONUS MISSION' : 'MISSION ' + lv.id + ' OF 5'), h('h2', null, lv.icon + ' ' + lv.title), h('div', { class: 'node-focus' }, lv.focus), A.stars(P.levelStars(lv.id)),
          h('div', { class: 'actions' },
            h('a', { class: 'btn', href: '#/level/' + lv.id + '/explain' }, '📖 Grammar briefing'),
            h('a', { class: 'btn ghost', href: '#/level/' + lv.id + '/intro' }, '🎬 Story'),
            complete ? h('a', { class: 'btn', href: '#/level/' + lv.id + '/results' }, '🏁 Results') : null,
            flagged ? h('a', { class: 'btn', href: '#/level/' + lv.id + '/review' }, '↻ Retry tricky answers (' + flagged + ')') : null))),
      h('div', { class: 'ex-list' }, rows),
      h('div', { class: 'actions center' }, next ? h('a', { class: 'btn primary big', href: '#/ex/' + next.id }, '▶ ' + (P.exPoints(next.id) ? 'Continue' : 'Start') + ': Exercise ' + next.id) : h('a', { class: 'btn primary big', href: '#/level/' + lv.id + '/results' }, '🏁 See mission results'), h('a', { class: 'btn ghost', href: '#/map' }, '🗺 Map'))));
  });

  /* ---------- Exercise screen (shared by student + teacher practice mode) ---------- */
  A.playExercise = function (main, ex, opts) {
    opts = opts || {};
    var lv = PSA.levelById(ex.level), pos = posInLevel(ex);
    var ctx = { ex: ex, practice: !!opts.practice, teacher: !!opts.teacher, replay: !!opts.replay, only: opts.only || null, cleanups: [] };
    ctx.onUpdate = function () { if (!ctx.practice) A.refreshScore(); };
    ctx.onFinish = function (session) { A.exerciseDone(main, ex, session, opts); };
    A.onCleanup(function () { ctx.cleanups.forEach(function (f) { try { f(); } catch (e) { /* */ } }); });
    PSA.clear(main);
    var body = h('div', { class: 'ex-body' });
    var back = opts.backHref || '#/level/' + lv.id + '/hub';
    main.appendChild(h('section', { class: 'exercise', style: '--lv:' + lv.color },
      h('div', { class: 'ex-head' },
        h('a', { class: 'btn small ghost', href: back }, '← ' + (opts.backLabel || 'Missions')),
        h('div', { class: 'ex-titles' },
          h('div', { class: 'node-kicker' }, (opts.kicker || PSA.missionName(lv) + ' · EXERCISE ' + pos.i + ' OF ' + pos.n) + (ctx.practice ? ' · PRACTICE (not saved)' : '')),
          h('h2', null, ex.icon + ' ' + ex.title), h('span', { class: 'tag' }, ex.mechanic)),
        h('button', { type: 'button', class: 'btn small', onClick: function () { PSA.modal({ title: '📖 Rule reminder: ' + lv.focus, wide: true, body: PSA.renderExplain(lv), buttons: [{ label: 'Back to the exercise', cls: 'primary' }] }); } }, '📖 Rule reminder')),
      h('div', { class: 'instructions' }, h('b', null, 'Your mission: '), ex.instructions),
      body));
    PSA.engine.mount(body, ex, ctx);
    return ctx;
  };

  A.route('/ex/:id', function (params, main) {
    if (!A.needProfile()) return;
    var ex = PSA.exerciseById(params.id); if (!ex) return A.go('/map');
    if (!P.exUnlocked(ex.id)) { PSA.toast('Finish the earlier exercise first!'); return A.go('/level/' + ex.level + '/hub'); }
    A.playExercise(main, ex, { replay: P.isDone(ex.id) });
  });

  /* ---------- Exercise finished ---------- */
  A.exerciseDone = function (main, ex, session, opts) {
    opts = opts || {};
    PSA.clear(main);
    A.refreshScore();
    var lv = PSA.levelById(ex.level), pos = posInLevel(ex), s = session || { gained: 0, firstTry: 0, count: 0 };
    var practice = !!opts.practice;
    var tricky = practice ? [] : P.flaggedIn(ex.id);
    var next = pos.list[pos.i]; // next exercise in this level (if any)
    var open = PSA.isOpen(ex);
    var actions = h('div', { class: 'actions center' });
    if (practice) {
      actions.appendChild(h('button', { type: 'button', class: 'btn primary big', onClick: function () { A.playExercise(main, ex, opts); } }, '↻ Play again'));
      actions.appendChild(h('a', { class: 'btn', href: opts.backHref || '#/teacher' }, '← Back'));
    } else {
      if (tricky.length) actions.appendChild(h('button', { type: 'button', class: 'btn', onClick: function () { A.playExercise(main, ex, { only: new Set(tricky), replay: true, kicker: 'RETRY ROUND' }); } }, '↻ Retry ' + tricky.length + ' tricky answer' + (tricky.length > 1 ? 's' : '')));
      if (opts.review) { /* handled by review runner */ }
      else if (next) actions.appendChild(h('a', { class: 'btn primary big', href: '#/ex/' + next.id }, 'Next: Exercise ' + next.id + ' ▶'));
      else actions.appendChild(h('a', { class: 'btn primary big', href: '#/level/' + lv.id + '/results' }, '🏁 Mission results ▶'));
      actions.appendChild(h('a', { class: 'btn ghost', href: '#/level/' + lv.id + '/hub' }, 'All exercises'));
    }
    if (opts.onAfter) { PSA.clear(actions); actions.appendChild(h('button', { type: 'button', class: 'btn primary big', onClick: opts.onAfter }, opts.afterLabel || 'Continue ▶')); }
    main.appendChild(h('section', { class: 'done-screen', style: '--lv:' + lv.color },
      h('div', { class: 'done-art', html: PSA.art.chrono() }),
      h('h2', null, '✔ ' + (opts.review ? 'Retry round complete!' : 'Exercise complete!')),
      h('p', { class: 'muted' }, ex.title),
      h('div', { class: 'stat-row' },
        h('div', { class: 'stat' }, h('div', { class: 'stat-n' }, '+' + s.gained), h('div', null, 'points this round')),
        open ? h('div', { class: 'stat' }, h('div', { class: 'stat-n' }, practice ? '—' : '+' + PSA.scoring.completion), h('div', null, 'completion points'))
          : h('div', { class: 'stat' }, h('div', { class: 'stat-n' }, s.firstTry + ' / ' + s.count), h('div', null, 'correct first time')),
        h('div', { class: 'stat' }, h('div', { class: 'stat-n' }, practice ? '—' : P.exPoints(ex.id) + ' / ' + P.exMax(ex.id)), h('div', null, 'exercise total'))),
      tricky.length ? h('p', { class: 'hint-note' }, '💡 ' + tricky.length + ' answer' + (tricky.length > 1 ? 's' : '') + ' needed a retry or a peek. Practise them again to earn full points!') : (!open && !practice ? h('p', { class: 'good-note' }, '🌟 Every answer is at full points!') : null),
      open && !practice ? h('p', { class: 'muted' }, 'Open tasks are checked by you and your teacher. The game only counts completion.') : null,
      actions));
    PSA.announce('Exercise complete');
  };

  /* ---------- Mission results ---------- */
  A.route('/level/:id/results', function (params, main) {
    if (!A.needProfile()) return;
    var lv = lvOr404(params.id); if (!lv) return A.go('/map');
    if (!P.levelComplete(lv.id)) { PSA.toast('Finish all exercises of this mission first.'); return A.go('/level/' + lv.id + '/hub'); }
    var list = PSA.exercisesOfLevel(lv.id), stars = P.levelStars(lv.id), closed = P.levelClosed(lv.id);
    var flagged = P.flaggedLevel(lv.id).reduce(function (a, x) { return a + x.ids.length; }, 0);
    var nextLv = PSA.levelById(lv.id + 1);
    var confetti = reduced() ? null : h('div', { class: 'confetti', 'aria-hidden': 'true' }, Array.apply(null, Array(24)).map(function (_, i) { return h('i', { style: 'left:' + (i * 4.2) + '%;animation-delay:' + ((i % 8) * 0.15) + 's;background:' + ['#22e1ff', '#ff9f1c', '#3ddc84', '#ff5d8f', '#b388ff'][i % 5] }); }));
    var earned = P.badges().filter(function (b) { return /^l\d$/.test(b.id) ? b.id === 'l' + lv.id : false; });
    main.appendChild(h('section', { class: 'results', style: '--lv:' + lv.color },
      confetti,
      h('div', { class: 'results-head card' },
        h('div', { class: 'big-stars' }, A.stars(stars)),
        h('h2', null, lv.bonus ? '👑 Bonus mission complete!' : '🏁 Mission ' + lv.id + ' complete!'), h('p', null, lv.title),
        h('div', { class: 'stat-row' },
          h('div', { class: 'stat' }, h('div', { class: 'stat-n' }, P.levelPoints(lv.id)), h('div', null, 'points')),
          h('div', { class: 'stat' }, h('div', { class: 'stat-n' }, Math.round(100 * closed.ratio) + '%'), h('div', null, 'accuracy (auto-checked)')),
          h('div', { class: 'stat' }, h('div', { class: 'stat-n' }, stars + ' ★'), h('div', null, stars === 3 ? 'excellent' : stars === 2 ? 'good work' : 'completed'))),
        earned.length ? h('p', null, '🏅 New badge: ', h('b', null, earned[0].icon + ' ' + earned[0].name)) : null),
      h('div', { class: 'card' }, h('h3', null, 'Your exercises'), h('div', { class: 'table-wrap' }, h('table', { class: 'gtable' },
        h('thead', null, h('tr', null, ['Exercise', 'Points', 'Retry?'].map(function (x) { return h('th', null, x); }))),
        h('tbody', null, list.map(function (ex) {
          var fl = P.flaggedIn(ex.id).length;
          return h('tr', null, h('td', null, ex.id + '. ' + ex.title), h('td', null, P.exPoints(ex.id) + ' / ' + P.exMax(ex.id)), h('td', null, PSA.isOpen(ex) ? 'open task' : fl ? fl + ' tricky' : '✔ perfect'));
        }))))),
      h('div', { class: 'actions center' },
        flagged ? h('a', { class: 'btn', href: '#/level/' + lv.id + '/review' }, '↻ Retry ' + flagged + ' tricky answer' + (flagged > 1 ? 's' : '')) : null,
        lv.bonus ? null : (nextLv && !nextLv.bonus ? h('a', { class: 'btn primary big', href: '#/level/' + nextLv.id + '/intro' }, 'Next mission: ' + nextLv.title + ' ▶') : h('a', { class: 'btn primary big', href: '#/certificate' }, '🏆 Get your certificate ▶')),
        nextLv && nextLv.bonus ? h('a', { class: 'btn primary big', href: '#/level/' + nextLv.id + '/intro' }, '👑 Bonus mission unlocked: ' + nextLv.title + ' ▶') : null,
        h('a', { class: 'btn ghost', href: '#/map' }, '🗺 Map'))));
    PSA.sound.play('win');
  });

  /* ---------- Review round: replay only the answers that were not perfect ---------- */
  A.route('/level/:id/review', function (params, main) {
    if (!A.needProfile()) return;
    var lv = lvOr404(params.id); if (!lv) return A.go('/map');
    var queue = P.flaggedLevel(lv.id), i = 0;
    if (!queue.length) { PSA.toast('Nothing to retry: all answers are perfect! 🌟'); return A.go('/level/' + lv.id + '/' + (P.levelComplete(lv.id) ? 'results' : 'hub')); }
    function step() {
      if (i >= queue.length) { A.go('/level/' + lv.id + (P.levelComplete(lv.id) ? '/results' : '/hub')); return; }
      var q = queue[i], ex = PSA.exerciseById(q.exId);
      A.playExercise(main, ex, {
        only: new Set(q.ids), replay: true, review: true, kicker: 'RETRY ROUND ' + (i + 1) + ' OF ' + queue.length, backHref: '#/level/' + lv.id + '/hub',
        onAfter: function () { i++; step(); }, afterLabel: i + 1 < queue.length ? 'Next retry exercise ▶' : 'Finish retry round ▶'
      });
    }
    step();
  });

  /* ---------- Certificate ---------- */
  function certificateHTML(p) {
    var stars = P.coreStars(), badges = P.badges(), bonus = P.levelComplete(6);
    return '<div class="certificate"><div class="cert-border">' +
      '<div class="cert-art">' + PSA.art.machine(12, { float: false }) + '</div>' +
      '<div class="cert-kicker">PAST SIMPLE — TIME TRAVEL ADVENTURE</div>' +
      '<h1>Time Traveller Certificate</h1><p>This certifies that</p>' +
      '<div class="cert-name">' + PSA.esc(p.nick) + '</div>' +
      '<p>repaired the time machine and returned to the present by completing all <b>5 missions</b> and <b>20 exercises</b> of the Past Simple' + (bonus ? ', and passed the <b>bonus Time Master Challenge</b> too' : '') + '.</p>' +
      '<div class="cert-stats"><span>🏅 ' + P.totalPoints() + ' points</span><span>⭐ ' + stars + ' / 15 stars</span><span>🎖 ' + badges.length + ' badges</span></div>' +
      '<div class="cert-levels">' + PSA.coreLevels().map(function (l) { return '<div>' + l.icon + ' ' + PSA.esc(l.title) + '<br><b>' + '★'.repeat(P.levelStars(l.id)) + '☆'.repeat(3 - P.levelStars(l.id)) + '</b></div>'; }).join('') + '</div>' +
      '<div class="cert-badges">' + badges.map(function (b) { return '<span title="' + PSA.esc(b.desc) + '">' + b.icon + ' ' + PSA.esc(b.name) + '</span>'; }).join('') + '</div>' +
      '<div class="cert-date">' + new Date().toLocaleDateString() + '</div></div></div>';
  }
  A.route('/certificate', function (params, main) {
    if (!A.needProfile()) return;
    var p = P.current();
    if (!P.gameComplete()) {
      main.appendChild(h('section', { class: 'narrow card' }, h('h2', null, '🏆 Certificate locked'), h('p', null, 'Complete all 5 missions to earn your certificate.'), h('a', { class: 'btn primary', href: '#/map' }, '🗺 Back to the map')));
      return;
    }
    main.appendChild(h('section', { class: 'cert-page' },
      h('div', { html: certificateHTML(p) }),
      h('div', { class: 'actions center no-print' },
        h('button', { type: 'button', class: 'btn primary big', onClick: function () { PSA.printHTML(certificateHTML(p)); } }, '🖨 Print certificate'),
        h('a', { class: 'btn', href: '#/map' }, '🗺 Back to the map'))));
    PSA.sound.play('win');
  });
})(typeof window !== 'undefined' ? window : globalThis);
