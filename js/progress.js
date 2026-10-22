/* progress.js — profiles, scoring, unlocking, stars, badges. Stored in localStorage (no personal data beyond a nickname). */
(function (root) {
  'use strict';
  var PSA = (root.PSA = root.PSA || {});
  var KEY = 'psa.v1';
  var S = PSA.scoring;

  /* ---- storage with in-memory fallback (private mode / blocked storage) ---- */
  var mem = null;
  function load() {
    try { var raw = root.localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) { /* fall through */ }
    return mem ? JSON.parse(mem) : { profiles: {}, current: null, settings: {} };
  }
  var db = load();
  if (!db.profiles) db.profiles = {};
  if (!db.settings) db.settings = {};
  function save() {
    var raw = JSON.stringify(db);
    mem = raw;
    try { root.localStorage.setItem(KEY, raw); } catch (e) { /* storage unavailable: kept in memory */ }
  }

  /* ---- item ids of closed (auto-checked) questions ---- */
  function itemIds(ex) {
    if (PSA.isOpen(ex)) return [];
    var ids = [];
    if (ex.type === 'gapstory') ids = ex.gaps.map(function (g) { return g.id; });
    else ids = (ex.items || []).map(function (i) { return i.id; });
    if (ex.type === 'memory') ids = ids.concat(ex.matchItems.map(function (m) { return m.id; }));
    return ids;
  }

  var P = {};
  PSA.progress = P;
  P.itemIds = itemIds;

  /* ---- settings ---- */
  P.setting = function (k, v) { if (v === undefined) return db.settings[k]; db.settings[k] = v; save(); return v; };

  /* ---- profiles ---- */
  P.profiles = function () { return Object.keys(db.profiles).map(function (n) { return db.profiles[n]; }); };
  P.current = function () { return db.current && db.profiles[db.current] ? db.profiles[db.current] : null; };
  P.cleanNick = function (n) { return String(n || '').replace(/[<>&"'`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16); };
  P.create = function (nick, avatar) {
    nick = P.cleanNick(nick);
    if (!nick) return null;
    if (!db.profiles[nick]) db.profiles[nick] = { nick: nick, avatar: avatar || '🚀', created: Date.now(), ex: {}, streak: 0, bestStreak: 0 };
    else if (avatar) db.profiles[nick].avatar = avatar;
    db.current = nick; save();
    return db.profiles[nick];
  };
  P.select = function (nick) { if (db.profiles[nick]) { db.current = nick; save(); } return P.current(); };
  P.signOut = function () { db.current = null; save(); };
  P.remove = function (nick) { delete db.profiles[nick]; if (db.current === nick) db.current = null; save(); };
  P.resetCurrent = function () { var p = P.current(); if (p) { p.ex = {}; p.streak = 0; p.bestStreak = 0; save(); } };
  P.resetAll = function () { db = { profiles: {}, current: null, settings: db.settings }; save(); };

  function exRec(exId, create) {
    var p = P.current(); if (!p) return null;
    var k = String(exId);
    if (!p.ex[k] && create) p.ex[k] = { done: false, items: {}, extra: {} };
    return p.ex[k] || null;
  }

  /* ---- recording answers ---- */
  P.pointsFor = function (attempts, revealed) {
    if (revealed) return S.reveal;
    return attempts <= 1 ? S.first : S.retry;
  };
  /* attempts = number of checks until correct. Keeps the BEST result (replay can only improve). */
  P.record = function (exId, itemId, attempts, revealed) {
    var r = exRec(exId, true); if (!r) return 0;
    var pts = P.pointsFor(attempts, revealed);
    var old = r.items[itemId];
    if (!old || pts > old.p) r.items[itemId] = { p: pts, a: attempts, r: revealed ? 1 : 0 };
    var p = P.current();
    if (!old) { // streak counts first-ever answers only
      if (pts === S.first) { p.streak = (p.streak || 0) + 1; p.bestStreak = Math.max(p.bestStreak || 0, p.streak); } else p.streak = 0;
    }
    save();
    return pts;
  };
  P.itemState = function (exId, itemId) { var r = exRec(exId); return r && r.items[itemId] ? r.items[itemId] : null; };
  P.isResolved = function (exId, itemId) { return !!P.itemState(exId, itemId); };
  P.markDone = function (exId) { var r = exRec(exId, true); if (r) { r.done = true; if (!r.doneAt) r.doneAt = Date.now(); save(); } };
  P.isDone = function (exId) { var r = exRec(exId); return !!(r && r.done); };
  P.extra = function (exId) { var r = exRec(exId, true); return r ? r.extra : {}; };
  P.setExtra = function (exId, patch) {
    var r = exRec(exId, true); if (!r) return;
    Object.keys(patch).forEach(function (k) { r.extra[k] = patch[k]; });
    save();
  };

  /* ---- scores ---- */
  P.exPoints = function (exId) {
    var ex = PSA.exerciseById(exId), r = exRec(exId);
    if (!r) return 0;
    var total = 0;
    Object.keys(r.items).forEach(function (k) { total += r.items[k].p; });
    if (PSA.isOpen(ex) && r.done) total += S.completion;
    if (ex.id === 5 && r.extra && r.extra.bonusDone) total += S.bonus;
    return total;
  };
  P.exClosedPoints = function (exId) {
    var ex = PSA.exerciseById(exId), r = exRec(exId), t = 0;
    if (!r) return 0;
    itemIds(ex).forEach(function (id) { if (r.items[id]) t += r.items[id].p; });
    return t;
  };
  P.exClosedMax = function (exId) { return itemIds(PSA.exerciseById(exId)).length * S.first; };
  P.exMax = function (exId) {
    var ex = PSA.exerciseById(exId);
    return P.exClosedMax(exId) + (PSA.isOpen(ex) ? S.completion : 0) + (ex.id === 5 ? S.bonus : 0);
  };
  P.levelPoints = function (lv) { return PSA.exercisesOfLevel(lv).reduce(function (a, e) { return a + P.exPoints(e.id); }, 0); };
  P.levelClosed = function (lv) {
    var got = 0, max = 0;
    PSA.exercisesOfLevel(lv).forEach(function (e) { got += P.exClosedPoints(e.id); max += P.exClosedMax(e.id); });
    return { got: got, max: max, ratio: max ? got / max : 1 };
  };
  P.totalPoints = function () { return PSA.levels.reduce(function (a, l) { return a + P.levelPoints(l.id); }, 0); };
  P.maxPoints = function () { return PSA.exercises.reduce(function (a, e) { return a + P.exMax(e.id); }, 0); };
  /* doneCount / parts / coreStars count the 5 core missions only; the bonus mission is extra. */
  P.doneCount = function () { return PSA.coreExercises().filter(function (e) { return P.isDone(e.id); }).length; };
  P.parts = function () { return Math.round(12 * P.doneCount() / PSA.coreExercises().length); };

  /* ---- unlocking ---- */
  P.levelComplete = function (lv) { return PSA.exercisesOfLevel(lv).every(function (e) { return P.isDone(e.id); }); };
  /* Free navigation: every mission and exercise is open. Set to false to restore step-by-step unlocking. */
  P.freeNavigation = true;
  P.levelUnlocked = function (lv) {
    var L = PSA.levelById(lv);
    if (L && L.bonus) return P.gameComplete(); /* bonus mission: only after all core missions, even with free navigation */
    return P.freeNavigation || lv <= 1 || P.levelComplete(lv - 1);
  };
  P.exUnlocked = function (exId) {
    var ex = PSA.exerciseById(exId);
    if (!P.levelUnlocked(ex.level)) return false;
    if (P.freeNavigation) return true;
    var list = PSA.exercisesOfLevel(ex.level), i = list.indexOf(ex);
    return i === 0 || P.isDone(list[i - 1].id);
  };
  P.levelStars = function (lv) {
    if (!P.levelComplete(lv)) return 0;
    var r = P.levelClosed(lv).ratio;
    return r >= 0.85 ? 3 : r >= 0.6 ? 2 : 1;
  };
  P.gameComplete = function () { return PSA.coreLevels().every(function (l) { return P.levelComplete(l.id); }); };
  P.totalStars = function () { return PSA.levels.reduce(function (a, l) { return a + P.levelStars(l.id); }, 0); };
  P.coreStars = function () { return PSA.coreLevels().reduce(function (a, l) { return a + P.levelStars(l.id); }, 0); };

  /* ---- items to retry (anything that earned less than full points) ---- */
  P.flaggedIn = function (exId) {
    var ex = PSA.exerciseById(exId), r = exRec(exId);
    if (!r) return [];
    return itemIds(ex).filter(function (id) { return r.items[id] && r.items[id].p < S.first; });
  };
  P.flaggedLevel = function (lv) {
    return PSA.exercisesOfLevel(lv).map(function (e) { return { exId: e.id, ids: P.flaggedIn(e.id) }; })
      .filter(function (x) { return x.ids.length; });
  };

  /* ---- drafts (writing) ---- */
  P.saveDraft = function (exId, text) { P.setExtra(exId, { draft: text, draftAt: Date.now() }); };
  P.getDraft = function (exId) { return (P.extra(exId) || {}).draft || ''; };

  /* total points of any profile, without switching the current player */
  P.pointsOf = function (nick) { var old = db.current; db.current = nick; var t = P.totalPoints(); db.current = old; return t; };

  /* ---- small per-profile flags (e.g. which intros were seen) ---- */
  P.flag = function (k, v) {
    var p = P.current(); if (!p) return false;
    p.flags = p.flags || {};
    if (v === undefined) return !!p.flags[k];
    p.flags[k] = v; save(); return v;
  };

  /* ---- badges ---- */
  PSA.badgeDefs = [
    { id: 'first', icon: '🚀', name: 'First Jump', desc: 'Complete your first exercise', test: function () { return P.doneCount() >= 1; } },
    { id: 'l1', icon: '🏫', name: 'Was/Were Wizard', desc: 'Complete Level 1', test: function () { return P.levelComplete(1); } },
    { id: 'l2', icon: '🌀', name: 'Portal Pioneer', desc: 'Complete Level 2', test: function () { return P.levelComplete(2); } },
    { id: 'l3', icon: '🧪', name: 'Question Scientist', desc: 'Complete Level 3', test: function () { return P.levelComplete(3); } },
    { id: 'l4', icon: '🌲', name: 'Forest Ranger', desc: 'Complete Level 4', test: function () { return P.levelComplete(4); } },
    { id: 'l5', icon: '⏳', name: 'Time Hero', desc: 'Complete the whole game', test: function () { return P.gameComplete(); } },
    { id: 'l6', icon: '👑', name: 'Time Master', desc: 'Complete the Bonus Mission', test: function () { return P.levelComplete(6); } },
    { id: 'streak', icon: '🔥', name: 'Hot Streak', desc: '10 correct answers in a row on the first try', test: function () { var p = P.current(); return p && (p.bestStreak || 0) >= 10; } },
    { id: 'stars', icon: '⭐', name: 'Star Collector', desc: 'Earn 3 stars on any level', test: function () { return PSA.levels.some(function (l) { return P.levelStars(l.id) === 3; }); } },
    { id: 'writer', icon: '✍️', name: 'Storyteller', desc: 'Submit both writing missions (10 and 20)', test: function () { return P.isDone(10) && P.isDone(20); } },
    { id: 'speed', icon: '⚡', name: 'Speed Runner', desc: 'Score 10 or more in the timed rapid recall (Exercise 16)', test: function () { return !!(P.extra(16) || {}).speedDone; } },
    { id: 'detective', icon: '🕵️', name: 'Super Detective', desc: 'Solve the mystery (Exercise 15)', test: function () { return P.isDone(15); } }
  ];
  P.badges = function () {
    if (!P.current()) return [];
    return PSA.badgeDefs.filter(function (b) { try { return !!b.test(); } catch (e) { return false; } });
  };
})(typeof window !== 'undefined' ? window : globalThis);
