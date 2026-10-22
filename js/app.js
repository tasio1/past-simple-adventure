/* app.js — router, top bar, welcome, nickname and mission map screens. Level / exercise screens are in screens-play.js. */
(function (root) {
  'use strict';
  var PSA = root.PSA, h = PSA.h, P = PSA.progress;
  var A = (PSA.app = { routes: [], cleanups: [], teacherCtx: false });

  /* ---------- router ---------- */
  A.route = function (pattern, handler) {
    var keys = [];
    var re = new RegExp('^' + pattern.replace(/:[a-z]+/g, function (m) { keys.push(m.slice(1)); return '([^/]+)'; }) + '$');
    A.routes.push({ re: re, keys: keys, handler: handler });
  };
  A.go = function (path) { if (location.hash === '#' + path) A.render(); else location.hash = '#' + path; };
  A.onCleanup = function (fn) { A.cleanups.push(fn); };
  function runCleanups() { var c = A.cleanups; A.cleanups = []; c.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); }
  A.render = function () {
    runCleanups();
    var path = (location.hash || '#/').slice(1) || '/';
    var q = path.indexOf('?'); if (q >= 0) path = path.slice(0, q);
    for (var i = 0; i < A.routes.length; i++) {
      var m = path.match(A.routes[i].re);
      if (m) {
        var params = {}; A.routes[i].keys.forEach(function (k, j) { params[k] = decodeURIComponent(m[j + 1]); });
        var main = document.getElementById('main'); PSA.clear(main);
        document.body.classList.toggle('in-teacher', /^\/teacher/.test(path));
        A.topbar();
        try { A.routes[i].handler(params, main); } catch (e) { console.error(e); main.appendChild(h('div', { class: 'card' }, h('h2', null, 'Oops!'), h('p', null, 'Something went wrong on this screen. Go back to the map and try again.'), h('a', { class: 'btn', href: '#/map' }, 'Back to map'))); }
        window.scrollTo(0, 0);
        main.focus({ preventScroll: true });
        return;
      }
    }
    A.go('/');
  };

  /* ---------- settings ---------- */
  A.applySettings = function () {
    PSA.sound.enabled = !!P.setting('sound');
    document.body.classList.toggle('reduce-motion', !!P.setting('reduce'));
    document.body.classList.toggle('present', !!P.setting('present'));
  };
  A.toggle = function (k) { P.setting(k, !P.setting(k)); A.applySettings(); A.topbar(); };

  /* ---------- top bar ---------- */
  A.topbar = function () {
    var bar = document.getElementById('topbar'); PSA.clear(bar);
    var p = P.current();
    var left = h('a', { class: 'brand', href: p ? '#/map' : '#/', 'aria-label': 'Home' }, h('span', { class: 'brand-icon', 'aria-hidden': 'true' }, '⏳'), h('span', { class: 'brand-text' }, 'PAST SIMPLE'));
    var mid = p ? h('a', { class: 'player-chip', href: '#/map', title: 'Mission map' },
      h('span', { class: 'avatar' }, p.avatar || '🚀'), h('span', { class: 'nick' }, p.nick),
      h('span', { class: 'score' }, '⭐ ' + P.totalStars()), h('span', { class: 'score' }, '🏅 ' + P.totalPoints())) : null;
    var verbsBtn = h('button', { type: 'button', class: 'btn small verbs-btn', onClick: A.verbList, title: 'Open the list of irregular verbs' }, '📋 Irregular verbs');
    bar.appendChild(left); if (mid) bar.appendChild(mid); bar.appendChild(verbsBtn);
  };
  A.refreshScore = function () { A.topbar(); };

  /* ---------- helpers ---------- */
  A.stars = function (n, max) {
    max = max || 3; var s = '';
    for (var i = 0; i < max; i++) s += i < n ? '★' : '☆';
    return h('span', { class: 'stars s' + n, 'aria-label': n + ' of ' + max + ' stars' }, s);
  };
  A.needProfile = function () { if (!P.current()) { A.go('/nick'); return false; } return true; };
  /* ---------- Irregular verb list (Appendix 2 of the course book) ---------- */
  A.verbList = function () {
    var list = PSA.irregularAll || [], hide = false, q = '';
    var search = h('input', { type: 'text', class: 'verb-search', placeholder: 'Search a verb…', 'aria-label': 'Search the verb list', autocomplete: 'off' });
    var cover = h('input', { type: 'checkbox', id: 'verb-cover' });
    var count = h('span', { class: 'muted small', 'aria-live': 'polite' });
    var tbody = h('tbody');
    function row(v) {
      var tr = h('tr', { class: 'vrow' + (hide ? ' covered' : '') },
        h('th', { scope: 'row' }, v.base === 'read' ? 'read (reed) ★' : v.base),
        h('td', { class: 'v-past' }, v.base === 'read' ? 'read (red) ★' : v.past), h('td', { class: 'v-pp' }, v.base === 'read' ? 'read (red) ★' : v.pp));
      tr.addEventListener('click', function () { tr.classList.toggle('shown'); });
      return tr;
    }
    function draw() {
      PSA.clear(tbody);
      var n = 0;
      list.forEach(function (v) { if (!q || v.base.indexOf(q) > -1) { tbody.appendChild(row(v)); n++; } });
      count.textContent = n + ' of ' + list.length + ' verbs';
      if (!n) tbody.appendChild(h('tr', null, h('td', { colspan: '3', class: 'muted' }, 'No verb found.')));
    }
    search.addEventListener('input', function () { q = search.value.trim().toLowerCase(); draw(); });
    cover.addEventListener('change', function () { hide = cover.checked; draw(); });
    var either = h('table', { class: 'vtable vtable-either' }, h('thead', null, h('tr', null, h('th', null, 'infinitive'), h('th', null, 'past simple / past participle'))),
      h('tbody', null, (PSA.irregularEither || []).map(function (v) { return h('tr', null, h('th', { scope: 'row' }, v.base), h('td', null, v.past)); })));
    var body = h('div', { class: 'verb-modal' },
      h('div', { class: 'verb-tools' }, search, h('label', { class: 'verb-cover', for: 'verb-cover' }, cover, ' Hide the past forms (click a row to check yourself)'), count),
      h('table', { class: 'vtable' }, h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'infinitive'), h('th', { scope: 'col' }, 'past simple'), h('th', { scope: 'col' }, 'past participle'))), tbody),
      h('p', { class: 'muted small' }, '★ read is pronounced “reed” in the infinitive and “red” in the past simple and past participle.'),
      h('h3', { class: 'verb-sub' }, 'These verbs can be regular (-ed) or irregular (-t)'), either);
    draw();
    var m = PSA.modal({ title: 'Irregular verbs', wide: true, body: body, buttons: [{ label: 'Close', cls: 'primary' }] });
    setTimeout(function () { search.focus(); }, 30);
    return m;
  };

  A.howTo = function () {
    PSA.modal({
      title: 'How to play', wide: true, body:
        '<p>Your time machine broke down in the past. Finish <b>5 missions</b> (20 exercises) to repair it and return to the present! Then a <b>bonus mission</b> with harder exercises opens.</p>' +
        '<ul><li><b>10 points</b> for a correct answer on the first try, <b>5 points</b> after a retry.</li>' +
        '<li>No time limits, no lost points, <b>unlimited retries</b> and free hints 💡.</li>' +
        '<li>Writing and speaking missions give <b>20 completion points</b>.</li>' +
        '<li>⭐⭐⭐ = strong performance (85%+), ⭐⭐ = 60%+, ⭐ = you finished the mission.</li>' +
        '<li>Completed missions can be replayed any time to improve your score.</li>' +
        '<li>Progress is saved in this browser. Use a <b>nickname</b>, not your real name.</li></ul>',
      buttons: [{ label: 'Got it!', cls: 'primary' }]
    });
  };

  /* ---------- Welcome ---------- */
  A.route('/', function (params, main) {
    var p = P.current();
    var menu = h('div', { class: 'menu' },
      p ? h('a', { class: 'btn primary big', href: '#/map' }, '▶ Continue as ' + p.nick) : h('a', { class: 'btn primary big', href: '#/nick' }, '▶ START'),
      p ? h('a', { class: 'btn big', href: '#/nick' }, '👥 Switch player') : null,
      h('button', { type: 'button', class: 'btn big', onClick: A.howTo }, '❓ How to play'),
      h('a', { class: 'btn big ghost', href: '#/teacher' }, '🧑‍🏫 Teacher mode'));
    main.appendChild(h('section', { class: 'welcome' },
      h('div', { class: 'hero-art', html: PSA.art.machine(12) }),
      h('h1', { class: 'game-title' }, h('span', { class: 't1' }, 'PAST SIMPLE'), h('span', { class: 't2' }, 'TIME TRAVEL ADVENTURE')),
      h('p', { class: 'tagline' }, 'Your time machine is broken! Complete grammar missions from the past to repair it and get back to the present.'),
      menu,
      h('p', { class: 'fineprint' }, 'Works offline · No registration · Progress is saved in this browser')));
  });

  /* ---------- Nickname ---------- */
  var AVATARS = ['🚀', '🤖', '🦊', '🐙', '⚡', '🪐', '🐲', '🎧'];
  A.route('/nick', function (params, main) {
    var chosen = AVATARS[0];
    var input = h('input', { type: 'text', id: 'nick-input', class: 'ans-input wide', maxlength: '16', autocomplete: 'off', placeholder: 'Your nickname (not your real name)', 'aria-label': 'Nickname' });
    var err = h('div', { class: 'muted', role: 'alert' });
    var avWrap = h('div', { class: 'avatar-grid', role: 'radiogroup', 'aria-label': 'Choose an avatar' }, AVATARS.map(function (a, i) {
      var b = h('button', { type: 'button', class: 'avatar-opt' + (i === 0 ? ' on' : ''), role: 'radio', 'aria-checked': i === 0 ? 'true' : 'false', 'aria-label': 'Avatar ' + (i + 1), onClick: function () {
        chosen = a; Array.prototype.forEach.call(avWrap.children, function (c) { c.classList.remove('on'); c.setAttribute('aria-checked', 'false'); }); b.classList.add('on'); b.setAttribute('aria-checked', 'true');
      } }, a);
      return b;
    }));
    function go() {
      var n = P.cleanNick(input.value);
      if (!n) { err.textContent = 'Please type a nickname.'; input.focus(); return; }
      P.create(n, chosen); A.applySettings(); A.go('/map');
    }
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    var profiles = P.profiles();
    main.appendChild(h('section', { class: 'narrow' },
      h('h2', null, 'Choose your player'),
      profiles.length ? h('div', { class: 'card' }, h('h3', null, 'Continue as…'), h('div', { class: 'profile-list' }, profiles.map(function (pr) {
        return h('div', { class: 'profile-row' },
          h('button', { type: 'button', class: 'btn', onClick: function () { P.select(pr.nick); A.go('/map'); } }, (pr.avatar || '🚀') + ' ' + pr.nick + ' · ' + P.pointsOf(pr.nick) + ' pts'),
          h('button', { type: 'button', class: 'btn small ghost', 'aria-label': 'Delete player ' + pr.nick, onClick: function () {
            PSA.confirm('Delete player?', 'Delete <b>' + PSA.esc(pr.nick) + '</b> and all of their progress on this device?', 'Delete').then(function (y) { if (y) { P.remove(pr.nick); A.render(); } });
          } }, '🗑'));
      }))) : null,
      h('div', { class: 'card' }, h('h3', null, 'New player'), h('label', { for: 'nick-input' }, 'Nickname'), input, err,
        h('p', { class: 'muted' }, 'Pick an avatar:'), avWrap,
        h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn primary big', onClick: go }, 'Start the adventure ▶'))),
      h('p', { class: 'fineprint' }, 'We only store a nickname and your game progress on this device. No registration, no personal data.')));
    setTimeout(function () { input.focus(); }, 50);
  });

  /* ---------- Mission map ---------- */
  A.route('/map', function (params, main) {
    if (!A.needProfile()) return;
    var done = P.doneCount();
    var parts = P.parts(), coreN = PSA.coreExercises().length;
    var nodes = h('div', { class: 'map-path' });
    PSA.levels.forEach(function (lv, i) {
      var unlocked = P.levelUnlocked(lv.id), complete = P.levelComplete(lv.id);
      var ex = PSA.exercisesOfLevel(lv.id), n = ex.filter(function (e) { return P.isDone(e.id); }).length;
      var started = n > 0 || P.flag('intro' + lv.id);
      var status = !unlocked ? 'locked' : complete ? 'done' : 'open';
      var node = h('div', { class: 'map-node ' + status + (i % 2 ? ' right' : ' left'), style: '--lv:' + lv.color },
        h('div', { class: 'node-art', html: lv.scene === 'machine' ? PSA.art.machine(complete || lv.bonus ? 12 : Math.max(0, Math.round(12 * n / ex.length)), { float: false }) : PSA.art.scene(lv.scene) }),
        h('div', { class: 'node-body' },
          h('div', { class: 'node-kicker' }, PSA.missionName(lv) + (unlocked ? '' : ' · 🔒 LOCKED')),
          h('h3', null, lv.icon + ' ' + lv.title),
          h('div', { class: 'node-focus' }, lv.focus),
          h('div', { class: 'node-meta' }, n + ' / ' + ex.length + ' exercises ', A.stars(P.levelStars(lv.id))),
          unlocked ? h('a', { class: 'btn ' + (complete ? '' : 'primary'), href: started ? '#/level/' + lv.id + '/hub' : '#/level/' + lv.id + '/intro' }, complete ? '↻ Revisit mission' : n ? '▶ Continue' : '▶ Start mission')
            : h('span', { class: 'muted' }, lv.bonus ? 'Complete all 5 missions to unlock' : 'Finish mission ' + (lv.id - 1) + ' to unlock')));
      nodes.appendChild(node);
    });
    var badges = P.badges(), allBadges = PSA.badgeDefs;
    var cert = P.gameComplete() ? h('a', { class: 'btn primary big', href: '#/certificate' }, '🏆 Open your certificate') : null;
    main.appendChild(h('section', { class: 'map' },
      h('div', { class: 'map-head card' },
        h('div', { class: 'map-machine', html: PSA.art.machine(parts) }),
        h('div', null, h('h2', null, 'Mission map'), h('p', null, 'Machine repair: ', h('b', null, parts + ' / 12 parts'), ' · Exercises: ', h('b', null, done + ' / ' + coreN)),
          h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: 'width:' + Math.round(100 * done / coreN) + '%' })),
          h('p', { class: 'muted' }, '🏅 ' + P.totalPoints() + ' points · ⭐ ' + P.totalStars() + ' stars'), cert)),
      nodes,
      h('div', { class: 'card badges' }, h('h3', null, 'Achievements'), h('div', { class: 'badge-row' }, allBadges.map(function (b) {
        var have = badges.indexOf(b) >= 0;
        return h('div', { class: 'badge' + (have ? ' got' : ''), title: b.desc }, h('span', { class: 'b-icon' }, have ? b.icon : '🔒'), h('span', { class: 'b-name' }, b.name), h('span', { class: 'b-desc' }, b.desc));
      })))));
  });

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    A.applySettings();
    window.addEventListener('hashchange', A.render);
    A.render();
  });
})(typeof window !== 'undefined' ? window : globalThis);
