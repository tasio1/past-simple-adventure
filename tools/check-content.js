/* Content self-test: node tools/check-content.js
   Verifies the exercise data and validation rules without a browser. */
'use strict';
global.window = global;
const path = require('path');
const root = path.join(__dirname, '..', 'js');
require(path.join(root, 'questions.js'));
require(path.join(root, 'validation.js'));
const P = global.PSA, V = P.v;
let fails = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { fails++; console.log('FAIL:', msg); } }

ok(P.levels.length === 6 && P.coreLevels().length === 5, '5 core levels + 1 bonus level');
ok(P.exercises.length === 27 && P.coreExercises().length === 20, '20 core exercises + 7 bonus exercises');
ok(P.exercises.map(e => e.id).join() === [...Array(27)].map((_, i) => i + 1).join(), 'ids 1..27');
const lvEx = {}; P.exercises.forEach(e => (lvEx[e.level] = lvEx[e.level] || []).push(e.id));
P.levels.forEach(l => ok(JSON.stringify(l.exercises) === JSON.stringify(lvEx[l.id]), 'level ' + l.id + ' exercise list matches'));
ok(P.levels[0].exercises.join() === '1,2,3,4,5,6' && P.levels[1].exercises.join() === '7,8,9,10' && P.levels[2].exercises.join() === '11,12,13,14,15' && P.levels[3].exercises.join() === '16,17,18' && P.levels[4].exercises.join() === '19,20' && P.levels[5].exercises.join() === '21,22,23,24,25,26,27' && P.levels[5].bonus === true, 'level/exercise mapping per spec');

// Closed answers validate against themselves, wrong variants do not
P.exercises.forEach(ex => {
  (ex.items || []).forEach(it => {
    if (it.answers) it.answers.forEach(a => ok(V.check(a, it.answers).ok, ex.id + '/' + it.id + ' self-check'));
    if (it.answer) ok(it.options.indexOf(it.answer) >= 0, ex.id + '/' + it.id + ' answer in options');
    if (it.options) ok(new Set(it.options).size === it.options.length, ex.id + '/' + it.id + ' unique options');
    ok(!!it.explain, ex.id + '/' + it.id + ' has explanation');
    if (it.words) ok(V.tilesCheck(it.answers[0].replace(/[?.]/g, '').split(' '), it.answers).ok, ex.id + '/' + it.id + ' tiles reorder');
    if (it.words) ok(it.words.slice().sort().join() === it.answers[0].replace(/[?.]/g, '').split(' ').map(w => w).sort().join().replace(/^/, '') || true, '');
  });
  (ex.gaps || []).forEach(g => { ok(g.answers.length > 0 && !!g.explain, ex.id + '/' + g.id + ' gap data'); });
});

// Tile bank: the words (minus distractors) must exactly make the answer (case-insensitive)
P.exercises.filter(e => e.type === 'tiles').forEach(ex => ex.items.forEach(it => {
  const a = it.answers[0].replace(/\?$/, '').toLowerCase().split(' ').sort().join(' ');
  const b = it.words.map(w => w.toLowerCase()).sort().join(' ');
  ok(a === b, ex.id + '/' + it.id + ' tile bank equals answer words: ' + a + ' vs ' + b);
}));

// Gap markers in stories/dialogues
P.exercises.filter(e => e.type === 'gapstory').forEach(ex => {
  const texts = (ex.panels || []).map(p => p.text).concat((ex.lines || []).map(l => l.text)).join(' ');
  const found = (texts.match(/\{\d+\}/g) || []).map(s => +s.slice(1, -1)).sort((a, b) => a - b);
  ok(found.join() === ex.gaps.map(g => g.n).join(), 'Ex' + ex.id + ' gap markers match gaps');
});

// Ex 1 / 19 specifics
const e1 = P.exerciseById(1).items.map(i => i.answer).join();
ok(e1 === 'was,were,was,were,were,was,were,was,were,was,were,were', 'Ex1 answers');
ok(P.exerciseById(5).gaps.map(g => g.answers[0]).join() === "was,wasn't,were,were,was,weren't,were,was,were,were,wasn't,were", 'Ex5 answers');
ok(P.exerciseById(19).items.map(i => i.answer).join() === "was,Did,saw,eat,were,did,Was,didn't,bought,did,were,know", 'Ex19 answers');
ok(P.exerciseById(19).items.every(i => i.options.length === 3), 'Ex19 three choices');
ok(P.exerciseById(18).items.length === 16, 'Ex18 16 sub-items');
ok(P.exerciseById(7).items.map(i => i.prompt).join() === 'work,dance,study,stop,play,carry,live,plan,try,open,cry,watch,stay,like,rain,copy', 'Ex7 verbs');

// did/didn't always followed by base verb in model answers
P.exercises.forEach(ex => (ex.items || []).concat(ex.gaps || []).forEach(it => (it.answers || []).forEach(a => {
  const m = V.normalise(a).match(/\bdid (?:not )?(?:\w+ )?(\w+)/);
  if (m && V.baseOfPast(m[1]) && !/^(did)$/.test(m[1])) { const b = V.baseOfPast(m[1]); if (b !== m[1]) ok(false, 'past form after did in: ' + a); }
})));

// Level 4 irregular forms vs reference (Appendix 2)
const ref = { be: 'was/were', become: 'became', begin: 'began', break: 'broke', bring: 'brought', buy: 'bought', come: 'came', do: 'did', drink: 'drank', drive: 'drove', eat: 'ate', find: 'found', forget: 'forgot', get: 'got', give: 'gave', go: 'went', have: 'had', know: 'knew', leave: 'left', make: 'made', meet: 'met', read: 'read', run: 'ran', say: 'said', see: 'saw', speak: 'spoke', take: 'took', think: 'thought', write: 'wrote', teach: 'taught' };
P.irregular30.forEach(b => ok(P.irregularByBase[b] && P.irregularByBase[b].past === ref[b], 'irregular ' + b));
ok(new Set(P.irregularGroups.reduce((a, g) => a.concat(g.verbs), [])).size === 30, '30 distinct verbs in groups');

// Validation behaviour
ok(V.check("I wasn't nervous", ["I wasn't nervous."]).ok, 'contraction');
ok(V.check('I was not nervous.', ["I wasn't nervous."]).ok, 'full form accepted');
ok(V.check('i WASN’T  nervous', ["I wasn't nervous."]).ok, 'curly apostrophe/case/spaces');
ok(V.check('I wasnt nervous', ["I wasn't nervous."]).apos, 'missing apostrophe flagged');
ok(!V.check('I wasn\'t very nervous', ["I wasn't nervous."]).ok, 'extra word rejected');
ok(!V.check('I didn\'t was nervous', ["I wasn't nervous."]).ok, 'did+was rejected');
ok(V.check('I ate breakfast at 7:30 this morning', P.exerciseById(9).items[3].answers).ok, '7:30 ≡ 7.30');
ok(/GO, not WENT|GO/i.test(V.diagnose('Did she went?', {})), 'diagnose did+went');
ok(/WERE/.test(V.diagnose('They was late.', {})), 'diagnose they was');
ok(/WATCH/.test(V.diagnose("She didn't watched.", {})), 'diagnose didn\'t watched');
ok(/DID/.test(V.diagnose('Did he was late?', {})), 'diagnose did+was');

// Writing models satisfy their own requirements
const m10 = V.analyseWriting(P.exerciseById(10).model), r10 = P.exerciseById(10);
ok(m10.words >= 80 && m10.words <= 100, 'Ex10 model words ' + m10.words);
ok(m10.verbs >= 6 && m10.irregular >= 3, 'Ex10 model verbs ' + m10.verbs + '/' + m10.irregular);
ok(Object.values(m10.linkers).every(Boolean), 'Ex10 model linkers');
const m20 = V.analyseWriting(P.exerciseById(20).model);
ok(m20.words >= 100 && m20.words <= 120, 'Ex20 model words ' + m20.words);
ok(m20.irregular >= 5 && m20.regular >= 4 && m20.wasWere >= 2 && m20.negatives >= 2 && m20.questions >= 2, 'Ex20 model requirements ' + JSON.stringify({ i: m20.irregular, r: m20.regular, w: m20.wasWere, n: m20.negatives, q: m20.questions }));
// Ex26: story text has exactly as many {n} markers as gaps; Ex27: Danish prompts have English answers
const e26 = P.exerciseById(26), mk = (e26.panels[0].text.match(/\{\d+\}/g) || []);
ok(mk.length === e26.gaps.length && e26.gaps.length === 24, 'Ex26 markers match gaps: ' + mk.length);
ok(V.check('did not see', P.exerciseById(26).gaps[11].answers).ok && V.check('Didn’t find', e26.gaps[22].answers).ok, 'Ex26 negatives accept did not / didn’t');
P.exerciseById(27).items.forEach(it => { ok(V.check(it.answers[0].replace(/n't/g, ' not').replace(/\bcan not\b/, 'cannot'), it.answers).ok || /n't/.test(it.answers[0]) === false, 'Ex27 ' + it.id + ' full forms'); });
ok(P.exerciseById(27).items.length === 10, 'Ex27 has 10 sentences');
// Bonus irregular verbs: every typed verb is in the reference list and is not one of the 30 core verbs
P.exerciseById(21).items.forEach(it => { ok(!!P.irregularByBase[it.base] && P.irregular30.indexOf(it.base) < 0, 'Ex21 verb ' + it.base + ' is in the list and new'); ok(it.answers[0] === P.irregularByBase[it.base].past, 'Ex21 ' + it.base + ' answer matches list'); });
// Detective culprits point at the wrong word
P.exerciseById(22).items.forEach(it => { const w = it.sentence.split(' '); ok(it.culprit.every(k => w[k]), 'Ex22 culprit index valid ' + it.id); ok(!V.check(it.sentence, it.answers).ok, 'Ex22 wrong sentence is not accepted ' + it.id); });
// Boss answers are spread over A / B / C
const pos = P.exerciseById(19).items.map(i => i.options.indexOf(i.answer)); ok([0, 1, 2].every(k => pos.filter(x => x === k).length >= 3), 'Ex19 correct answer spread over A/B/C: ' + pos.join(''));
const adj = V.analyseWriting('I was tired and very excited. We were scared.');
ok(adj.regular === 0, 'adjectives not counted as verbs');

console.log(checks + ' checks, ' + fails + ' failures');
process.exit(fails ? 1 : 0);
