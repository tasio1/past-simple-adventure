/* Generates content-map.md from js/questions.js. Run: node tools/make-content-map.js */
global.window = global; require('../js/questions.js');
const P = global.PSA, fs = require('fs');
const src = {
  1:['was-were.pdf','WAS/WERE with every subject'],2:['was-were.pdf','Negative form wasn\'t / weren\'t'],3:['was-were.pdf','Questions with Was/Were'],
  4:['was-were.pdf','Spotting WAS/WERE agreement errors'],5:['was-were.pdf','WAS/WERE in a short narrative'],6:['was-were.pdf','Talking about yesterday / last weekend with was/were'],
  7:['Past simple 1.pdf','Regular verbs: -ed, -d, consonant+y → -ied, doubling'],8:['Past simple 1.pdf','Regular verbs in sentences'],9:['past simple 2.pdf','Positive Past Simple sentences incl. irregular verbs'],
  10:['Past simple 1.pdf / 2.pdf','Writing about a past event with time linkers'],
  11:['past simple 2.pdf','Negatives with didn\'t + base form'],12:['past simple 2.pdf','Questions with Did + subject + base form'],13:['past simple 2.pdf','Error correction after did / didn\'t'],
  14:['past simple 3.pdf','Mixed dialogue: questions and short answers'],15:['past simple 3.pdf','Asking past questions (Wh- and yes/no) to find facts'],
  16:['list of irregular verbs.pdf','30 core irregular verbs: base → past'],17:['list of irregular verbs.pdf / past simple 3.pdf','Irregular verbs in a story'],18:['list of irregular verbs.pdf','Positive, negative, question forms of irregular verbs'],
  19:['all PDFs','Mixed review of was/were, regular, irregular, did/didn\'t'],20:['all PDFs','Free writing that uses all structures'],
  21:['list of irregular verbs.pdf / past simple 2.pdf','20 further irregular verbs (swim, sell, win, put, cut …): base → past'],22:['past simple 2.pdf','Wrong past forms (tick / cross idea) and base form after did / didn\'t'],
  23:['past simple 2.pdf / past simple 3.pdf','Long conversation mixing positive, negative and question forms'],24:['Past simple 1.pdf','Writing B\'s question from cue words (with did and with was/were)'],
  25:['past simple 2.pdf','Time words: last + time and time + ago'],26:['all PDFs','Longer story: all Past Simple forms in one complex text (typed gaps)'],27:['all PDFs','Translating Danish sentences into the Past Simple: positive, negative, question']};
let o = '# Content map\n\nEvery exercise, its source topic (original wording; no textbook pages are reproduced) and how the game implements it.\n\n';
P.levels.forEach(l => {
  o += `## ${l.bonus ? 'Bonus mission (opens after missions 1–5)' : 'Level ' + l.id}: ${l.title}\n\nFocus: ${l.focus}\n\n| Ex | Title | Source PDF | Topic | Game implementation | Items | Open task |\n|---|---|---|---|---|---|---|\n`;
  P.exercisesOfLevel(l.id).forEach(e => {
    const n = (e.items || e.gaps || e.questions || e.matchItems || []).length;
    o += `| ${e.id} | ${e.title} | ${src[e.id][0]} | ${src[e.id][1]} | ${e.mechanic} (\`${e.type}\`) | ${n || '–'} | ${P.isOpen(e) ? 'yes' : 'no'} |\n`;
  });
  o += '\n';
});
o += '## Grammar explanation cards\n\nEach level opens with visual cards defined in `PSA.levels[n].explain` (rendered by `js/explain.js`): ' + P.levels.map(l => `L${l.id} ${l.explain.length} cards`).join(', ') + '.\n\n## Irregular verbs\n\nThe full reference list (`PSA.irregularAll`) comes from `list of irregular verbs.pdf`. The 30 verbs used in Ex16–18 are in `PSA.irregular30` and `PSA.irregularGroups`.\n';
fs.writeFileSync(__dirname + '/../content-map.md', o); console.log('content-map.md written');
