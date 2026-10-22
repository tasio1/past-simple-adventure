/* validation.js — answer checking, feedback diagnosis and writing analysis. Pure functions (no DOM). */
(function (root) {
  'use strict';
  var PSA = (root.PSA = root.PSA || {});

  /* ---- Normalisation ---- */
  var MISSING_APOS = /\b(wasnt|werent|didnt)\b/;
  function hasMissingApostrophe(s) { return MISSING_APOS.test(String(s).toLowerCase()); }

  function normalise(s) {
    s = String(s == null ? '' : s).toLowerCase();
    s = s.replace(/[‘’´`]/g, "'");
    s = s.replace(/\b(was|were|did)nt\b/g, '$1 not');         // wasnt → was not
    s = s.replace(/\b(was|were|did|is|are|do|does|had|has|have|could|should|would)n't\b/g, '$1 not');
    s = s.replace(/\bcan't\b/g, 'can not').replace(/\bwon't\b/g, 'will not');
    s = s.replace(/[.,!?;:"“”()]/g, ' ');           // ignore punctuation (7.30 ≡ 7:30)
    return s.replace(/\s+/g, ' ').trim();
  }

  function check(answer, accepted) {
    var n = normalise(answer);
    if (!n) return { ok: false, empty: true };
    var list = Array.isArray(accepted) ? accepted : [accepted];
    for (var i = 0; i < list.length; i++) {
      if (n === normalise(list[i])) return { ok: true, apos: hasMissingApostrophe(answer), matched: list[i] };
    }
    return { ok: false };
  }

  /* ---- Verb tables ---- */
  var pastToBase = {}, baseSet = {};
  PSA.irregularAll.forEach(function (v) {
    baseSet[v.base] = true;
    v.past.split('/').forEach(function (p) { if (p !== v.base) pastToBase[p] = v.base; });
  });
  function regularPast(b) {
    if (/[^aeiou]y$/.test(b)) return b.slice(0, -1) + 'ied';
    if (/e$/.test(b)) return b + 'd';
    if (/^(stop|plan|drop|shop|slip|trip)$/.test(b)) return b + b.slice(-1) + 'ed';
    return b + 'ed';
  }
  PSA.regularVerbs.forEach(function (b) { baseSet[b] = true; pastToBase[regularPast(b)] = b; });
  var EDSTOP = /^(need|feed|seed|weed|deed|reed|heed|shed|sled|sped|bleed|breed|speed|indeed|hundred|naked|wicked|sacred|kindred|proceed|succeed|exceed|embed|bed|red|wed)$/;

  function baseOfPast(w) {
    if (pastToBase[w]) return pastToBase[w];
    if (baseSet[w]) return null;
    if (/..ed$/.test(w) && !EDSTOP.test(w)) {
      if (/ied$/.test(w)) return w.slice(0, -3) + 'y';
      var c = [w.slice(0, -2), w.slice(0, -1)];
      if (/([^aeiou])\1ed$/.test(w)) c.unshift(w.slice(0, -3));
      for (var i = 0; i < c.length; i++) if (baseSet[c[i]]) return c[i];
      return /[^aeiou]e?d$/.test(w) ? c[0] : null;
    }
    return null;
  }

  /* ---- Feedback diagnosis: returns a short, rule-based message or null ---- */
  function diagnose(answer, item) {
    var n = normalise(answer);
    if (!n) return null;
    var toks = n.split(' ');
    if (/\bdid\b/.test(n)) {
      if (/\b(was|were)\b/.test(n)) return "Don't use DID / DIDN'T with WAS / WERE. Questions start with Was / Were; negatives are wasn't / weren't.";
      for (var i = 0; i < toks.length; i++) {
        var b = baseOfPast(toks[i]);
        if (toks[i] !== 'did' && b) return "After DID / DIDN'T, use the base form of the verb: " + b.toUpperCase() + ', not ' + toks[i].toUpperCase() + '.';
      }
    }
    if (/\b(they|we|you)\s+(was|was not)\b/.test(n)) return 'Use WERE with they, we and you.';
    if (/\b(i|he|she|it)\s+(were|were not)\b/.test(n)) return 'Use WAS with I, he, she and it.';
    if (/^(was)\s+(you|we|they)\b/.test(n) || /\b(where|why|when|who|what|how)\s+was\s+(you|we|they)\b/.test(n)) return 'Use WERE with you, we and they.';
    if (/^(were)\s+(i|he|she|it)\b/.test(n)) return 'Use WAS with I, he, she and it.';
    if (item && item.base) return diagnoseVerb(n, item);
    if (/^there were (a|an|one)\b/.test(n)) return 'THERE WAS + singular noun (a / an / one).';
    return null;
  }

  function diagnoseVerb(n, item) {
    var base = item.base, expect = normalise(item.answers[0]);
    if (n === base) return 'That is the present form. Use the PAST simple.';
    var irr = PSA.irregularByBase[base];
    if (irr && /ed$/.test(n)) return base.toUpperCase() + ' is an irregular verb, so it does not take -ed. Check the irregular verb list!';
    if (!irr && n !== expect && /^(.*)(ed|d)$/.test(n)) return 'Almost! Check the spelling rule for ' + base.toUpperCase() + ' (see the hint).';
    if (!irr && !/ed$/.test(n)) return base.toUpperCase() + ' is a regular verb: the past ends in -ed / -d / -ied.';
    return null;
  }

  /* ---- Tiles ---- */
  function tilesCheck(words, answers) { return check(words.join(' '), answers); }

  /* ---- Writing analysis ---- */
  function countWords(t) { var m = String(t || '').trim().match(/[A-Za-zÀ-ɏ0-9'’-]+/g); return m ? m.length : 0; }
  var AMBIG = { read: 1, put: 1, cut: 1, hit: 1, let: 1, hurt: 1, cost: 1, shut: 1, beat: 1, set: 1 };
  var irrPast = {};
  PSA.irregularAll.forEach(function (v) {
    if (v.base === 'be') return;
    v.past.split('/').forEach(function (p) { if (p !== v.base && !AMBIG[v.base]) irrPast[p] = v.base; });
  });
  var ADJ_BEFORE = /^(was|were|wasn't|weren't|wasnt|werent|am|is|are|very|so|really|quite|too|felt|looked|seemed|got|became)$/;

  function sentences(t) { return String(t || '').split(/(?<=[.!?])["”']?\s+/).map(function (s) { return s.trim(); }).filter(Boolean); }

  function analyseWriting(text) {
    var low = String(text || '').toLowerCase().replace(/[‘’]/g, "'");
    var toks = low.match(/[a-z']+/g) || [];
    var irr = {}, reg = {}, be = false;
    toks.forEach(function (w, i) {
      var prev = toks[i - 1] || '';
      if (/^(was|were|wasn't|weren't)$/.test(w)) { be = true; return; }
      if (irrPast[w]) { irr[irrPast[w]] = true; return; }
      if (w.length >= 4 && /ed$/.test(w) && !EDSTOP.test(w) && !ADJ_BEFORE.test(prev) && !baseSet[w]) reg[w] = true;
    });
    var sents = sentences(text);
    var wasWere = sents.filter(function (s) { return /\b(was|were|wasn't|weren't)\b/i.test(s.replace(/[‘’]/g, "'")); }).length;
    var negatives = sents.filter(function (s) { return /\b(didn't|did not|wasn't|weren't|was not|were not)\b/i.test(s.replace(/[‘’]/g, "'")); }).length;
    var questions = (String(text || '').match(/\?/g) || []).length;
    var linkers = {};
    ['first', 'then', 'after that', 'finally'].forEach(function (l) { linkers[l] = new RegExp('\\b' + l + '\\b', 'i').test(text || ''); });
    var irrN = Object.keys(irr).length, regN = Object.keys(reg).length;
    return {
      words: countWords(text), irregular: irrN, regular: regN, irregularList: Object.keys(irr), regularList: Object.keys(reg),
      verbs: irrN + regN + (be ? 1 : 0), wasWere: wasWere, negatives: negatives, questions: questions, linkers: linkers,
      hasQuotes: /["“”]/.test(text || '')
    };
  }

  /* Question-line detection for the mystery notebook */
  function looksLikeQuestion(q) {
    return /^\s*(did|was|were|where|when|why|who|what|how|which)\b/i.test(q) && /\?\s*$/.test(q);
  }
  function questionWordOf(q) {
    var m = String(q).trim().toLowerCase().match(/^(did|was|were|where|when|why|who|what|how|which)\b/);
    return m ? m[1] : null;
  }

  PSA.v = {
    normalise: normalise, check: check, diagnose: diagnose, baseOfPast: baseOfPast, regularPast: regularPast,
    tilesCheck: tilesCheck, countWords: countWords, analyseWriting: analyseWriting, hasMissingApostrophe: hasMissingApostrophe,
    looksLikeQuestion: looksLikeQuestion, questionWordOf: questionWordOf, sentences: sentences
  };
})(typeof window !== 'undefined' ? window : globalThis);
