/* questions.js — ALL content data for PAST SIMPLE — TIME TRAVEL ADVENTURE.
   Exercise content is kept separate from the game engine. Edit here to change questions. */
(function (root) {
  'use strict';
  var PSA = (root.PSA = root.PSA || {});

  PSA.scoring = { first: 10, retry: 5, reveal: 0, completion: 20, bonus: 10 };

  /* ---------- Irregular verb reference (Appendix 2 of the supplied materials) ---------- */
  var IRR_RAW = [
    'be|was/were|been', 'beat|beat|beaten', 'become|became|become', 'begin|began|begun', 'bite|bit|bitten',
    'blow|blew|blown', 'break|broke|broken', 'bring|brought|brought', 'build|built|built', 'buy|bought|bought',
    'catch|caught|caught', 'choose|chose|chosen', 'come|came|come', 'cost|cost|cost', 'cut|cut|cut',
    'do|did|done', 'draw|drew|drawn', 'drink|drank|drunk', 'drive|drove|driven', 'eat|ate|eaten',
    'fall|fell|fallen', 'feel|felt|felt', 'fight|fought|fought', 'find|found|found', 'fly|flew|flown',
    'forget|forgot|forgotten', 'get|got|got', 'give|gave|given', 'go|went|gone', 'grow|grew|grown',
    'hang|hung|hung', 'have|had|had', 'hear|heard|heard', 'hide|hid|hidden', 'hit|hit|hit',
    'hold|held|held', 'hurt|hurt|hurt', 'keep|kept|kept', 'know|knew|known', 'leave|left|left',
    'lend|lent|lent', 'let|let|let', 'lie|lay|lain', 'light|lit|lit', 'lose|lost|lost',
    'make|made|made', 'mean|meant|meant', 'meet|met|met', 'pay|paid|paid', 'put|put|put',
    'read|read|read', 'ride|rode|ridden', 'ring|rang|rung', 'rise|rose|risen', 'run|ran|run',
    'say|said|said', 'see|saw|seen', 'sell|sold|sold', 'send|sent|sent', 'shine|shone|shone',
    'shoot|shot|shot', 'show|showed|shown', 'shut|shut|shut', 'sing|sang|sung', 'sit|sat|sat',
    'sleep|slept|slept', 'speak|spoke|spoken', 'spend|spent|spent', 'stand|stood|stood', 'steal|stole|stolen',
    'swim|swam|swum', 'take|took|taken', 'teach|taught|taught', 'tear|tore|torn', 'tell|told|told',
    'think|thought|thought', 'throw|threw|thrown', 'understand|understood|understood', 'wake|woke|woken',
    'wear|wore|worn', 'win|won|won', 'write|wrote|written'
  ];
  PSA.irregularAll = IRR_RAW.map(function (l) {
    var p = l.split('|');
    return { base: p[0], past: p[1], pp: p[2] };
  });
  PSA.irregularByBase = {};
  PSA.irregularAll.forEach(function (v) { PSA.irregularByBase[v.base] = v; });

  /* The 30 verbs presented in Level 4 */
  PSA.irregular30 = ['be', 'become', 'begin', 'break', 'bring', 'buy', 'come', 'do', 'drink', 'drive',
    'eat', 'find', 'forget', 'get', 'give', 'go', 'have', 'know', 'leave', 'make',
    'meet', 'read', 'run', 'say', 'see', 'speak', 'take', 'think', 'write', 'teach'];
  PSA.irregularGroups = [
    { title: 'Everyday actions', verbs: ['go', 'come', 'eat', 'drink', 'run', 'get'] },
    { title: 'Giving & taking', verbs: ['give', 'take', 'bring', 'buy', 'find', 'make'] },
    { title: 'Mind & words', verbs: ['think', 'know', 'say', 'speak', 'read', 'forget'] },
    { title: 'Movement & change', verbs: ['leave', 'meet', 'drive', 'begin', 'become', 'break'] },
    { title: 'Super verbs', verbs: ['be', 'do', 'have', 'see', 'write', 'teach'] }
  ];

  /* Regular verbs used in the game (for base-form detection in feedback) */
  PSA.regularVerbs = ['watch', 'visit', 'play', 'start', 'study', 'stop', 'work', 'dance', 'carry', 'live',
    'plan', 'try', 'open', 'cry', 'stay', 'like', 'rain', 'copy', 'enjoy', 'finish', 'arrive', 'ask', 'help',
    'listen', 'love', 'want', 'walk', 'clean', 'close', 'phone', 'call', 'cook', 'talk', 'wait', 'look',
    'smoke', 'push', 'pull', 'jump', 'laugh', 'answer', 'travel', 'move', 'use', 'wash', 'brush', 'turn',
    'follow', 'cross', 'pass', 'post', 'happen', 'need', 'learn', 'decide', 'invite', 'miss', 'save'];

  /* ---------- Levels: story, briefing and visual grammar explanation cards ---------- */
  PSA.levels = [
    {
      id: 1, icon: '🏫', scene: 'school', color: '#22e1ff', title: 'The Lost School Day', focus: 'WAS / WERE',
      story: 'ALERT! Your time machine crashed into last week\'s school day. The stabiliser is made of two tiny words: WAS and WERE. Fix them to move on!',
      exercises: [1, 2, 3, 4, 5, 6],
      explain: [
        { type: 'wwSplit', title: 'Past of the verb BE: WAS or WERE?' },
        { type: 'table', title: 'Present → Past', head: ['Present (now)', 'Past (before)'],
          rows: [['I <b>am</b> tired.', 'I <b>was</b> tired.'], ['She <b>is</b> at school.', 'She <b>was</b> at school.'], ['They <b>are</b> happy.', 'They <b>were</b> happy.']],
          note: 'Time words: yesterday, last night, last week, last weekend, on Monday…' },
        { type: 'structs', title: 'Positive, negative and question',
          items: [
            { cls: 'pos', label: 'Positive', formula: 'Subject + <b>was / were</b>', examples: ['I was late.', 'They were happy.'] },
            { cls: 'neg', label: 'Negative', formula: 'Subject + <b>wasn\'t / weren\'t</b> <small>(was not / were not)</small>', examples: ['I wasn\'t late.', 'They weren\'t happy.'] },
            { cls: 'que', label: 'Question', formula: '<b>Was / Were</b> + subject …?', examples: ['Was she late?', 'Were they happy?'] }
          ] },
        { type: 'table', title: 'Short answers', head: ['Yes, …', 'No, …'],
          rows: [['Yes, she <b>was</b>.', 'No, she <b>wasn\'t</b>.'], ['Yes, they <b>were</b>.', 'No, they <b>weren\'t</b>.'], ['Yes, I <b>was</b>.', 'No, I <b>wasn\'t</b>.']] },
        { type: 'callout', tone: 'warn', title: 'Golden rule: NO DID with was / were!',
          html: 'We do <b>not</b> use <b>did / didn\'t</b> to make questions or negatives with was/were.<br>✗ Did you were late? → ✓ <b>Were</b> you late?<br>✗ I didn\'t was late. → ✓ I <b>wasn\'t</b> late.' }
      ]
    },
    {
      id: 2, icon: '🌀', scene: 'portal', color: '#ff9f1c', title: 'Yesterday\'s Portal', focus: 'Positive Past Simple',
      story: 'The machine opens a swirling portal to yesterday. To pass through, you must turn present actions into past actions. Careful: some verbs change shape!',
      exercises: [7, 8, 9, 10],
      explain: [
        { type: 'timeline', title: 'Past Simple = finished actions in the past',
          examples: [['I play football every day.', 'I <b>played</b> football yesterday.'], ['She goes to school.', 'She <b>went</b> to school yesterday.']] },
        { type: 'spelling', title: 'Regular verbs: four spelling patterns',
          rows: [
            { rule: 'Most verbs: add <b>-ed</b>', pairs: [['work', 'worked'], ['play', 'played']] },
            { rule: 'Verbs ending in -e: add <b>-d</b>', pairs: [['dance', 'danced'], ['live', 'lived']] },
            { rule: 'Consonant + y: change <b>y → ied</b>', pairs: [['study', 'studied'], ['carry', 'carried']] },
            { rule: 'Short vowel + consonant: <b>double</b> the consonant + -ed', pairs: [['stop', 'stopped'], ['plan', 'planned']] }
          ],
          note: 'Vowel + y (play, stay) does NOT change: played, stayed.' },
        { type: 'verbpairs', title: 'Irregular verbs: learn them!', pairs: [['go', 'went'], ['see', 'saw'], ['eat', 'ate'], ['buy', 'bought'], ['have', 'had'], ['take', 'took'], ['write', 'wrote'], ['come', 'came']] },
        { type: 'callout', tone: 'tip', title: 'Same form for every subject',
          html: '<b>I / you / he / she / it / we / they</b> + <b>watched / went</b>. No -s in the past simple!' },
        { type: 'chips', title: 'Time expressions for the past', items: ['yesterday', 'last night', 'last week', 'last month', 'last year', 'three days ago', 'two years ago', 'this morning'] }
      ]
    },
    {
      id: 3, icon: '🧪', scene: 'lab', color: '#b388ff', title: 'The Question Laboratory', focus: 'Negatives & Questions',
      story: 'Welcome to the Question Laboratory! These machines only work with correct negatives and questions. Use DID and DIDN\'T carefully, and always follow them with the base verb.',
      exercises: [11, 12, 13, 14, 15],
      explain: [
        { type: 'structs', title: 'Three colour-coded structures',
          items: [
            { cls: 'pos', label: 'Positive', formula: 'Subject + <b>past simple verb</b>', examples: ['She watched a film.'] },
            { cls: 'neg', label: 'Negative', formula: 'Subject + <b>didn\'t</b> + <b>base verb</b>', examples: ['She didn\'t watch a film.'] },
            { cls: 'que', label: 'Question', formula: '<b>Did</b> + subject + <b>base verb</b>?', examples: ['Did she watch a film?'] }
          ] },
        { type: 'mistakes', title: 'Common mistakes',
          rows: [
            { bad: 'Did you went to school?', good: 'Did you go to school?', why: 'After DID use the base verb.' },
            { bad: 'She didn\'t watched the film.', good: 'She didn\'t watch the film.', why: 'DIDN\'T already shows the past.' }
          ] },
        { type: 'table', title: 'Short answers', head: ['Yes, …', 'No, …'],
          rows: [['Yes, I <b>did</b>.', 'No, I <b>didn\'t</b>.'], ['Yes, she <b>did</b>.', 'No, she <b>didn\'t</b>.'], ['Yes, they <b>did</b>.', 'No, they <b>didn\'t</b>.']] },
        { type: 'table', title: 'Question words + did', head: ['Question', 'Example'],
          rows: [['What', 'What <b>did</b> you do?'], ['Where', 'Where <b>did</b> they go?'], ['When', 'When <b>did</b> she arrive?'], ['Why', 'Why <b>did</b> he leave?'], ['Who', 'Who <b>did</b> you see?']] },
        { type: 'callout', tone: 'warn', title: 'Remember: was / were are different!',
          html: 'No DID with was/were: <b>Was</b> it cold? · It <b>wasn\'t</b> cold.' }
      ]
    },
    {
      id: 4, icon: '🌲', scene: 'forest', color: '#3ddc84', title: 'The Irregular Verb Forest', focus: 'Irregular Verbs',
      story: 'Deep in the Irregular Verb Forest, verbs change shape in mysterious ways. Learn them, and the trees will give back the missing machine parts.',
      exercises: [16, 17, 18],
      explain: [
        { type: 'callout', tone: 'tip', title: 'Irregular verbs do not take -ed',
          html: 'Learn them in small groups. Click a card to reveal the past form, then test yourself!' },
        { type: 'dictionary', title: 'Visual verb dictionary (30 verbs)' },
        { type: 'callout', tone: 'warn', title: 'Irregular verbs + did / didn\'t',
          html: 'Positive: She <b>went</b>. · Negative: She didn\'t <b>go</b>. · Question: Did she <b>go</b>?<br><b>read</b> is written the same in the past, but pronounced “red”.' }
      ]
    },
    {
      id: 5, icon: '⏳', scene: 'machine', color: '#ff5d8f', title: 'The Final Time Machine', focus: 'Mixed Practice',
      story: 'The final boss, GLITCH, is scrambling the machine\'s code. Beat all 12 grammar attacks to rebuild the time machine, then write about a day to remember to get home!',
      exercises: [19, 20],
      explain: [
        { type: 'flow', title: 'Which pattern do I need?' },
        { type: 'table', title: 'Quick reference', head: ['', 'BE (was / were)', 'All other verbs'],
          rows: [['Positive', 'She <b>was</b> late.', 'She <b>went</b> home.'], ['Negative', 'She <b>wasn\'t</b> late.', 'She <b>didn\'t go</b> home.'], ['Question', '<b>Was</b> she late?', '<b>Did</b> she <b>go</b> home?']] }
      ]
    },
    {
      id: 6, bonus: true, icon: '👑', scene: 'machine', color: '#ffd54f', title: 'The Time Master Challenge', focus: 'Past Simple Master Class',
      story: 'The time machine works, but the Time Council has one last test! Harder verbs, trickier questions and a longer story. Pass it and you become a TIME MASTER.',
      exercises: [21, 22, 23, 24, 25, 26, 27],
      explain: [
        { type: 'callout', tone: 'tip', title: 'Master class: three things to watch',
          html: '1. <b>Irregular verbs never take -ed</b>: ✗ gived, buyed, finded → ✓ <b>gave, bought, found</b>.<br>2. After <b>did / didn\'t</b> the main verb goes back to the base form: Did you <b>go</b>? · I didn\'t <b>see</b> it.<br>3. <b>was / were</b> never use did: Were you late? · I wasn\'t late.' },
        { type: 'table', title: 'Quick reference', head: ['', 'BE (was / were)', 'All other verbs'],
          rows: [['Positive', 'She <b>was</b> late.', 'She <b>went</b> home.'], ['Negative', 'She <b>wasn\'t</b> late.', 'She <b>didn\'t go</b> home.'], ['Question', '<b>Was</b> she late?', '<b>Did</b> she <b>go</b> home?']] },
        { type: 'table', title: 'Past time words: last or ago?', head: ['last + time', 'time + ago'],
          rows: [['I saw him <b>last week</b>.', 'I saw him <b>a week ago</b>.'], ['We left <b>last night</b>.', 'We left <b>two hours ago</b>.'], ['She moved <b>last year</b>.', 'She moved <b>three years ago</b>.']],
          note: 'last = the period before this one (last week, last year). ago = how far back from now (five minutes ago).' },
        { type: 'table', title: 'Irregular verbs that do not change', head: ['Base', 'Past'],
          rows: [['put', '<b>put</b>'], ['cut', '<b>cut</b>'], ['hit', '<b>hit</b>'], ['shut', '<b>shut</b>'], ['read', '<b>read</b> (said “red”)']] }
      ]
    }
  ];

  /* ---------- Exercises ---------- */
  var EX = (PSA.exercises = []);
  function id(ex, i) { return ex + '-' + (i + 1); }
  function A(s) { return Array.isArray(s) ? s : [s]; }

  /* EX 1 — WAS or WERE? (rapid choice) */
  EX.push({
    id: 1, level: 1, type: 'choice', icon: '⚡', title: 'WAS or WERE?', mechanic: 'Rapid-choice challenge',
    instructions: 'Choose the correct word to complete each sentence. One sentence at a time!',
    objective: 'Choose was or were according to the subject.', minutes: 6,
    pair: 'Partner A reads the sentence aloud with a beep for the gap; Partner B says was/were before the class answers. Swap every 3 sentences.',
    hint: 'Look at the subject: I / he / she / it → WAS. You / we / they (and plural nouns) → WERE.',
    items: [
      ['I ___ at home yesterday.', 'was', 'I goes with WAS.'],
      ['My friends ___ at the cinema.', 'were', '“My friends” = they, so use WERE.'],
      ['The weather ___ terrible last weekend.', 'was', '“The weather” = it, so use WAS.'],
      ['You ___ late for school.', 'were', 'YOU always goes with WERE.'],
      ['My parents ___ very tired.', 'were', '“My parents” = they, so use WERE.'],
      ['The film ___ really interesting.', 'was', '“The film” = it, so use WAS.'],
      ['There ___ twenty students in the room.', 'were', 'After THERE, look at the noun: “twenty students” is plural, so WERE.'],
      ['There ___ a big party on Friday.', 'was', '“a big party” is singular, so THERE WAS.'],
      ['My brother and I ___ in London.', 'were', '“My brother and I” = we, so use WERE.'],
      ['She ___ not happy with her test.', 'was', 'SHE goes with WAS (was not = wasn\'t).'],
      ['The shops ___ closed yesterday.', 'were', '“The shops” = they, so use WERE.'],
      ['Where ___ you last night?', 'were', 'YOU → WERE. In questions, was/were comes before the subject.']
    ].map(function (r, i) { return { id: id(1, i), prompt: r[0], options: ['was', 'were'], answer: r[1], explain: r[2] }; })
  });

  /* EX 2 — Negative transformation */
  EX.push({
    id: 2, level: 1, type: 'rewrite', icon: '✂️', title: 'Negative Transformation', mechanic: 'Sentence transformation',
    instructions: 'Rewrite each positive sentence as a negative sentence. Both wasn\'t and was not are accepted.',
    objective: 'Form negatives with was/were + not (no did).', minutes: 8,
    pair: 'Partner A reads a positive sentence; Partner B says the negative from memory; A checks on screen.',
    hint: 'Add NOT to was/were: was → wasn\'t, were → weren\'t. Do not use didn\'t.',
    task: 'Make it NEGATIVE',
    items: [
      ['I was nervous before the exam.', ['I wasn\'t nervous before the exam.'], 'I + was → wasn\'t.'],
      ['The students were ready.', ['The students weren\'t ready.'], 'Plural subject: were → weren\'t.'],
      ['It was cold yesterday.', ['It wasn\'t cold yesterday.'], 'It + was → wasn\'t.'],
      ['We were in the classroom.', ['We weren\'t in the classroom.'], 'We + were → weren\'t.'],
      ['My sister was at the party.', ['My sister wasn\'t at the party.'], 'Singular subject: was → wasn\'t.'],
      ['The tickets were expensive.', ['The tickets weren\'t expensive.'], 'Plural subject: were → weren\'t.'],
      ['There was a football match.', ['There wasn\'t a football match.'], 'There + singular noun: was → wasn\'t.'],
      ['The children were hungry.', ['The children weren\'t hungry.'], 'Plural subject: were → weren\'t.']
    ].map(function (r, i) { return { id: id(2, i), prompt: r[0], answers: r[1], explain: r[2] }; })
  });

  /* EX 3 — Question builder (drag & drop tiles) */
  EX.push({
    id: 3, level: 1, type: 'tiles', icon: '🧩', title: 'Question Builder', mechanic: 'Drag-and-drop word tiles',
    instructions: 'Build a correct question from the tiles. Drag them, or click / press Enter on a tile to move it. Watch out for trap tiles!',
    objective: 'Order words in was/were questions.', minutes: 8,
    pair: 'Pairs race: each builds the question on paper first, then checks with the game.',
    hint: 'Questions with was/were start with WAS or WERE (or a question word + was/were). No DID!',
    items: [
      [['were', 'you', 'tired', 'yesterday'], [], 'Were you tired yesterday?', 'Put WERE before the subject.'],
      [['were', 'your', 'friends', 'at', 'school', 'on', 'Monday'], [], 'Were your friends at school on Monday?', 'Plural subject → WERE first. Use ON before days.'],
      [['was', 'the', 'weather', 'nice', 'last', 'weekend'], ['did'], 'Was the weather nice last weekend?', 'Trap tile: DID is not used with was/were.'],
      [['where', 'were', 'you', 'last', 'Saturday'], [], 'Where were you last Saturday?', 'Question word + were + subject.'],
      [['was', 'your', 'teacher', 'angry', 'yesterday'], ['did'], 'Was your teacher angry yesterday?', 'Singular subject → WAS first. No DID.'],
      [['were', 'the', 'shops', 'open', 'on', 'Sunday'], [], 'Were the shops open on Sunday?', 'Plural subject → WERE first.'],
      [['why', 'was', 'your', 'brother', 'late'], ['did'], 'Why was your brother late?', 'Question word + was + subject. No DID.'],
      [['were', 'your', 'parents', 'at', 'home', 'last', 'night'], [], 'Were your parents at home last night?', 'Plural subject → WERE first.']
    ].map(function (r, i) { return { id: id(3, i), words: r[0], extra: r[1], answers: [r[2]], explain: r[3] }; })
  });

  /* EX 4 — Grammar error detective */
  EX.push({
    id: 4, level: 1, type: 'detective', icon: '🔍', title: 'Grammar Error Detective', mechanic: 'Find and fix the mistake',
    instructions: 'Click the wrong word(s) in the sentence, then rewrite the whole sentence correctly.',
    objective: 'Spot and correct was/were errors.', minutes: 8,
    pair: 'Detective pairs: A reads the faulty sentence aloud, B says the correction and the rule.',
    hint: 'Check the subject and the verb. Remember: no DID / DIDN\'T with was/were.',
    items: [
      ['She were very happy yesterday.', [1], ['She was very happy yesterday.'], 'SHE goes with WAS.'],
      ['Did you were at the cinema?', [0, 2], ['Were you at the cinema?'], 'No DID with was/were. Put WERE first: Were you…?'],
      ['We wasn\'t ready for the test.', [1], ['We weren\'t ready for the test.'], 'WE goes with WERE → weren\'t.'],
      ['Where was your friends?', [1], ['Where were your friends?'], '“Your friends” is plural → WERE.'],
      ['They didn\'t were at school.', [1, 2], ['They weren\'t at school.'], 'No DIDN\'T with was/were. Use weren\'t.'],
      ['Was you hungry after the match?', [0], ['Were you hungry after the match?'], 'YOU always goes with WERE.'],
      ['There were a big dog in the garden.', [1], ['There was a big dog in the garden.'], '“a big dog” is singular → THERE WAS.'],
      ['I weren\'t at the party.', [1], ['I wasn\'t at the party.'], 'I goes with WAS → wasn\'t.']
    ].map(function (r, i) { return { id: id(4, i), sentence: r[0], culprit: r[1], answers: r[2], explain: r[3] }; })
  });

  /* EX 5 — The Terrible School Trip (story with missing words) */
  var trip = [
    ['was', 'The weather = it → was. “Terrible” describes the weather.'],
    ['wasn\'t', 'It was terrible, so it wasn\'t sunny (negative, singular).'],
    ['were', '“dark clouds” is plural → there were.'],
    ['were', 'We → were.'],
    ['was', '“our bus” = it → was.'],
    ['weren\'t', 'The bus was late, so the teachers weren\'t happy (negative, plural).'],
    ['were', '“hundreds of visitors” is plural → there were.'],
    ['was', '“The museum” = it → was.'],
    ['were', '“the exhibitions” are plural → were.'],
    ['were', '“my friends and I” = we → were.'],
    ['wasn\'t', '“Unfortunately” → negative. The café = it → wasn\'t open.'],
    ['were', 'We → were.']
  ];
  EX.push({
    id: 5, level: 1, type: 'gapstory', icon: '🚌', title: 'The Terrible School Trip', mechanic: 'Interactive story with missing words',
    instructions: 'Complete the story by choosing was, wasn\'t, were or weren\'t for each gap. Then try the bonus mission!',
    objective: 'Use was/were (positive and negative) in context.', minutes: 10,
    pair: 'Read the finished story aloud in turns, one sentence each. Then compare your bonus “fantastic trip” sentences.',
    hint: 'Read the whole sentence. Check the subject (singular or plural) and the meaning (positive or negative?).',
    mode: 'select', options: ['was', 'wasn\'t', 'were', 'weren\'t'],
    panels: [{ scene: 'trip', text: 'Last Friday, our class went on a school trip. The weather {1} terrible. It {2} sunny, and there {3} dark clouds everywhere.\n\nWe {4} excited in the morning, but our bus {5} late. Our teachers {6} very happy about that!\n\nWhen we arrived at the museum, there {7} hundreds of visitors. The museum {8} very crowded, but the exhibitions {9} interesting.\n\nAt lunchtime, my friends and I {10} hungry. Unfortunately, the café {11} open. In the end, we {12} happy to get back to school.' }],
    gaps: trip.map(function (t, i) { return { id: '5-g' + (i + 1), n: i + 1, answers: [t[0]], explain: t[1] }; }),
    bonus: { minLines: 6, title: 'Bonus: make the trip FANTASTIC!',
      text: 'Rewrite at least six details so the trip becomes fantastic. Example: “The weather was terrible.” → “The weather was amazing!”',
      sample: ['The weather was fantastic.', 'It was sunny and there were no clouds.', 'Our bus was early.', 'Our teachers were very happy.', 'There weren\'t many visitors at the museum.', 'The café was open and the food was delicious.'] },
    model: 'The weather was fantastic. It was sunny and there weren\'t any clouds. We were excited and our bus was early. Our teachers were very happy. There weren\'t many visitors at the museum. The café was open.'
  });

  /* EX 6 — Weekend interview (speaking) */
  EX.push({
    id: 6, level: 1, type: 'speaking', icon: '🎤', title: 'Weekend Interview', mechanic: 'Speaking mission (pair work)',
    instructions: 'Interview a partner about their weekend. Ask at least six questions with was/were, tick them off, take notes, then report three facts.',
    objective: 'Ask and answer was/were questions in speech.', minutes: 12,
    pair: 'Partner A interviews B for 3 minutes; then swap. Each student reports three facts about their partner to the class.',
    hint: 'Use Was / Were + subject, or Where / Why + was / were + subject.',
    questions: ['Where were you on Saturday?', 'Was the weather good?', 'Were your friends there?', 'Were you tired?', 'Was your weekend interesting?', 'Why were you happy or unhappy?'],
    minQuestions: 6, factsNeeded: 3,
    solo: { who: 'Zed the robot', qa: [
      ['Where were you on Saturday?', 'I was at the Robot Park.'], ['Was the weather good?', 'No, it wasn\'t. It was windy and cold.'],
      ['Were your friends there?', 'Yes, they were. My friends were there all day.'], ['Were you tired?', 'Yes, I was. We were very busy.'],
      ['Was your weekend interesting?', 'Yes, it was! It was the best weekend this year.'], ['Why were you happy or unhappy?', 'I was happy because the football match was exciting.']] },
    starters: ['My partner was …', 'The weather wasn\'t …', 'His / Her friends were …'],
    model: 'My partner was at the park on Saturday. The weather wasn\'t good. His friends were there too.'
  });

  /* EX 7 — Regular verb factory */
  var rv = [
    ['work', 'worked', 'ed'], ['dance', 'danced', 'd'], ['study', 'studied', 'ied'], ['stop', 'stopped', 'dbl'],
    ['play', 'played', 'yed'], ['carry', 'carried', 'ied'], ['live', 'lived', 'd'], ['plan', 'planned', 'dbl'],
    ['try', 'tried', 'ied'], ['open', 'opened', 'ed2'], ['cry', 'cried', 'ied'], ['watch', 'watched', 'ed'],
    ['stay', 'stayed', 'yed'], ['like', 'liked', 'd'], ['rain', 'rained', 'ed2'], ['copy', 'copied', 'ied']
  ];
  PSA.spellingRules = {
    ed: 'Most verbs: just add -ed (work → worked).',
    d: 'Verbs ending in -e: add only -d (dance → danced).',
    ied: 'Consonant + y: change y to i and add -ed (study → studied).',
    dbl: 'Short vowel + one consonant: double the consonant and add -ed (stop → stopped).',
    yed: 'Vowel + y: keep the y and add -ed (play → played).',
    ed2: 'Two vowels (rain) or an unstressed ending (open): do not double, just add -ed.'
  };
  EX.push({
    id: 7, level: 2, type: 'typing', icon: '🏭', title: 'Regular Verb Factory', mechanic: 'Transform verbs into past forms',
    instructions: 'Type the Past Simple form of each verb. A spelling rule appears after every answer.',
    objective: 'Apply the four regular -ed spelling patterns.', minutes: 8,
    pair: 'Spelling race: one student says the verb, the other spells the past form aloud.',
    hint: 'Look at how the verb ends: -e, consonant + y, one vowel + consonant, or something else.',
    items: rv.map(function (r, i) { return { id: id(7, i), base: r[0], prompt: r[0], answers: [r[1]], rule: r[2], explain: PSA.spellingRules[r[2]] }; })
  });

  /* EX 8 — Complete the sentence */
  EX.push({
    id: 8, level: 2, type: 'gapfill', icon: '✏️', title: 'Complete the Sentence', mechanic: 'Grammar completion challenge',
    instructions: 'Write the Past Simple form of the verb in brackets.',
    objective: 'Use regular and irregular past forms in sentences.', minutes: 8,
    pair: 'Read each sentence aloud with the correct form. Your partner says if it is regular or irregular.',
    hint: 'Is the verb regular (add -ed) or irregular? Check the irregular verb list if you are not sure.',
    items: [
      ['I ___ (visit) my grandparents last weekend.', 'visit', 'visited', 'Regular verb: add -ed.'],
      ['My sister ___ (buy) a new jacket yesterday.', 'buy', 'bought', 'BUY is irregular: buy → bought.'],
      ['We ___ (watch) a documentary about sharks.', 'watch', 'watched', 'Regular verb: add -ed.'],
      ['Alex ___ (go) to the cinema with his friends.', 'go', 'went', 'GO is irregular: go → went.'],
      ['They ___ (play) basketball after school.', 'play', 'played', 'Vowel + y: keep the y, add -ed.'],
      ['The lesson ___ (start) at eight o\'clock.', 'start', 'started', 'Regular verb: add -ed.'],
      ['My dad ___ (make) pancakes on Sunday.', 'make', 'made', 'MAKE is irregular: make → made.'],
      ['She ___ (study) for three hours last night.', 'study', 'studied', 'Consonant + y: y → ied.'],
      ['We ___ (see) a famous actor in London.', 'see', 'saw', 'SEE is irregular: see → saw.'],
      ['The children ___ (stop) playing when it rained.', 'stop', 'stopped', 'Short vowel + consonant: double the p.'],
      ['I ___ (write) a long message to my friend.', 'write', 'wrote', 'WRITE is irregular: write → wrote.'],
      ['My parents ___ (drive) to Germany last summer.', 'drive', 'drove', 'DRIVE is irregular: drive → drove.']
    ].map(function (r, i) { return { id: id(8, i), prompt: r[0], base: r[1], answers: [r[2]], explain: r[3] }; })
  });

  /* EX 9 — Time travel transformation */
  EX.push({
    id: 9, level: 2, type: 'rewrite', icon: '🕰️', title: 'Time Travel Transformation', mechanic: 'Present sentence → past sentence',
    instructions: 'Rewrite each present sentence in the Past Simple. Use the time expression in brackets.',
    objective: 'Change habits in the present into finished actions in the past.', minutes: 10,
    pair: 'Partner A reads the present sentence; Partner B says the past sentence. Then swap.',
    hint: 'Change the verb to the Past Simple and use the time expression instead of every day / usually.',
    task: 'Write the full past sentence',
    items: [
      ['Emma meets her friends after school. (yesterday)', ['Emma met her friends after school yesterday.', 'Yesterday Emma met her friends after school.'], 'MEET is irregular: met.'],
      ['We go swimming on Saturdays. (last Saturday)', ['We went swimming last Saturday.', 'Last Saturday we went swimming.'], 'GO → went. No “on” before last Saturday.'],
      ['My brother plays computer games every evening. (last night)', ['My brother played computer games last night.', 'Last night my brother played computer games.'], 'Regular: play → played.'],
      ['I eat breakfast at 7.30. (this morning)', ['I ate breakfast at 7.30 this morning.', 'This morning I ate breakfast at 7.30.', 'I ate breakfast this morning at 7.30.'], 'EAT is irregular: ate.'],
      ['They take the bus to school. (yesterday)', ['They took the bus to school yesterday.', 'Yesterday they took the bus to school.'], 'TAKE is irregular: took.'],
      ['My teacher gives us homework. (last Friday)', ['My teacher gave us homework last Friday.', 'Last Friday my teacher gave us homework.'], 'GIVE is irregular: gave.'],
      ['I usually read before bed. (last night)', ['I read before bed last night.', 'Last night I read before bed.'], 'READ stays read in the past (pronounced “red”). Drop “usually”.'],
      ['The shop closes at six. (yesterday)', ['The shop closed at six yesterday.', 'Yesterday the shop closed at six.', 'The shop closed at 6 yesterday.', 'Yesterday the shop closed at 6.'], 'Regular verb ending in -e: close → closed.']
    ].map(function (r, i) { return { id: id(9, i), prompt: r[0], answers: r[1], explain: r[2] }; })
  });

  /* EX 10 — My unusual Saturday (creative writing) */
  EX.push({
    id: 10, level: 2, type: 'writing', icon: '📝', title: 'My Unusual Saturday', mechanic: 'Creative writing',
    instructions: 'Write 80–100 words about an unusual Saturday. Use first, then, after that and finally.',
    objective: 'Write a short narrative in the Past Simple.', minutes: 15,
    pair: 'Swap texts with a partner. Underline every past simple verb you can find and count the irregular ones.',
    hint: 'Start with “Last Saturday…” and use time words to order your story.',
    draftKey: 'draft10', minWords: 80, maxWords: 100,
    rules: { verbs: 6, irregular: 3, linkers: ['first', 'then', 'after that', 'finally'] },
    checks: ['verbs', 'irregular', 'linkers', 'words'],
    selfCheck: ['I used the Past Simple for finished actions.', 'I checked my irregular verbs.', 'I read my text aloud once.'],
    model: 'Last Saturday was really unusual. First, I woke up at six o\'clock because a loud robot knocked on my window. Then I ate pancakes with the robot and we talked about space. After that, we flew to the moon in his tiny spaceship. We saw a purple dog and took a lot of photos. Finally, we came back home and my mum made dinner for us. It was the best Saturday ever! I wrote everything in my diary, but nobody believed my story!'
  });

  /* EX 11 — Negative machine */
  var negHint = 'DIDN\'T + base verb. The main verb goes back to the base form (watched → watch).';
  EX.push({
    id: 11, level: 3, type: 'rewrite', icon: '🚫', title: 'Negative Machine', mechanic: 'Sentence transformation',
    instructions: 'Rewrite each sentence in the negative. Use didn\'t + the base verb.',
    objective: 'Form Past Simple negatives with didn\'t + base verb.', minutes: 10,
    pair: 'Partner A says a positive sentence, B answers “No, …didn\'t…” with the negative.',
    hint: negHint, task: 'Make it NEGATIVE',
    items: [
      ['I watched TV last night.', 'I didn\'t watch TV last night.', 'watched → watch'],
      ['She bought a new phone.', 'She didn\'t buy a new phone.', 'bought → buy'],
      ['We went to the beach.', 'We didn\'t go to the beach.', 'went → go'],
      ['He finished his homework.', 'He didn\'t finish his homework.', 'finished → finish'],
      ['They ate lunch at school.', 'They didn\'t eat lunch at school.', 'ate → eat'],
      ['My parents visited Paris.', 'My parents didn\'t visit Paris.', 'visited → visit'],
      ['I understood the question.', 'I didn\'t understand the question.', 'understood → understand'],
      ['The dog ran into the garden.', 'The dog didn\'t run into the garden.', 'ran → run'],
      ['We enjoyed the concert.', 'We didn\'t enjoy the concert.', 'enjoyed → enjoy'],
      ['She wrote a letter to her friend.', 'She didn\'t write a letter to her friend.', 'wrote → write']
    ].map(function (r, i) {
      return { id: id(11, i), prompt: r[0], answers: [r[1]], explain: 'DIDN\'T already shows the past, so the verb is in the base form: ' + r[2] + '.' };
    })
  });

  /* EX 12 — Question constructor (tiles) */
  EX.push({
    id: 12, level: 3, type: 'tiles', icon: '🛠️', title: 'Question Constructor', mechanic: 'Word tiles (drag or keyboard)',
    instructions: 'Build a Past Simple question from each prompt. Add DID yourself! Drag tiles, or click / press Enter to move them.',
    objective: 'Order Did + subject + base verb questions.', minutes: 10,
    pair: 'Take turns: A asks the question aloud, B answers with a short answer (Yes, I did. / No, I didn\'t.).',
    hint: 'Did + subject + base verb + the rest of the sentence.',
    items: [
      [['did', 'you', 'watch', 'the', 'football', 'match', 'yesterday'], 'Did you watch the football match yesterday?'],
      [['did', 'your', 'brother', 'finish', 'his', 'homework'], 'Did your brother finish his homework?'],
      [['did', 'they', 'go', 'to', 'the', 'party', 'on', 'Saturday'], 'Did they go to the party on Saturday?'],
      [['did', 'she', 'buy', 'the', 'tickets'], 'Did she buy the tickets?'],
      [['did', 'your', 'parents', 'enjoy', 'their', 'holiday'], 'Did your parents enjoy their holiday?'],
      [['did', 'he', 'take', 'your', 'phone'], 'Did he take your phone?'],
      [['did', 'you', 'see', 'the', 'new', 'film'], 'Did you see the new film?'],
      [['did', 'your', 'friends', 'arrive', 'on', 'time'], 'Did your friends arrive on time?'],
      [['did', 'Emma', 'study', 'for', 'the', 'exam'], 'Did Emma study for the exam?'],
      [['did', 'you', 'have', 'breakfast', 'this', 'morning'], 'Did you have breakfast this morning?']
    ].map(function (r, i) { return { id: id(12, i), words: r[0], extra: [], answers: [r[1]], explain: 'Did + subject + base verb: “' + r[1] + '”' }; })
  });

  /* EX 13 — Error hunter */
  EX.push({
    id: 13, level: 3, type: 'rewrite', icon: '🎯', title: 'Error Hunter', mechanic: 'Error correction',
    instructions: 'Each sentence has a mistake. Type the corrected sentence.',
    objective: 'Correct typical did/didn\'t errors.', minutes: 10,
    pair: 'Partner A reads the wrong sentence; B says the correct one and explains the rule.',
    hint: 'After did / didn\'t the verb is in the base form. With was/were there is no did.',
    task: 'Correct the mistake',
    items: [
      ['Did you went to the cinema?', ['Did you go to the cinema?'], 'After DID, use the base form: GO, not WENT.'],
      ['She didn\'t watched the film.', ['She didn\'t watch the film.'], 'DIDN\'T already shows the past, so use WATCH.'],
      ['Where did they went?', ['Where did they go?'], 'After DID, use the base form: GO.'],
      ['He didn\'t ate breakfast.', ['He didn\'t eat breakfast.'], 'After DIDN\'T, use EAT (not ate).'],
      ['Did she bought a new phone?', ['Did she buy a new phone?'], 'After DID, use BUY (not bought).'],
      ['We didn\'t saw the teacher.', ['We didn\'t see the teacher.'], 'After DIDN\'T, use SEE (not saw).'],
      ['What did you did yesterday?', ['What did you do yesterday?'], 'DID is the helper; the main verb is DO.'],
      ['They didn\'t played football.', ['They didn\'t play football.'], 'After DIDN\'T, use PLAY (not played).'],
      ['Did he was late?', ['Was he late?'], 'No DID with was/were. Make the question with WAS.'],
      ['I didn\'t was happy.', ['I wasn\'t happy.'], 'No DIDN\'T with was/were. Use wasn\'t.']
    ].map(function (r, i) { return { id: id(13, i), prompt: r[0], answers: r[1], explain: r[2] }; })
  });

  /* EX 14 — Copenhagen weekend conversation */
  var cph = [
    ['did you do', 'Question with DID: What + did + you + base verb (do).'],
    ['went', 'GO is irregular: went.'],
    ['did you like', 'Question: Did + you + base verb (like).'],
    ['had', 'HAVE is irregular: had.'],
    ['visited', 'Regular verb: visit → visited.'],
    ['ate', 'EAT is irregular: ate.'],
    ['did you see', 'Question: Did + you + base verb (see).'],
    [['didn\'t have', 'did not have'], 'Negative: didn\'t + base verb (have).'],
    ['did you stay', 'Question: Where + did + you + base verb (stay).'],
    ['was', 'BE in the past with “she”: was (no did).'],
    ['was the weather', 'BE question: Was + the weather (no did).'],
    ['rained', 'Regular verb: rain → rained.'],
    ['was', 'BE in the past with “Sunday” (it): was.'],
    ['did you come', 'Question: When + did + you + base verb (come).'],
    ['took', 'TAKE is irregular: took.']
  ];
  EX.push({
    id: 14, level: 3, type: 'gapstory', icon: '💬', title: 'Copenhagen Weekend Conversation', mechanic: 'Dialogue completion',
    instructions: 'Complete the conversation between Mia and Leo. Write the correct form of the verbs in brackets (some need two or three words).',
    objective: 'Mix questions, negatives and positives in a real conversation.', minutes: 12,
    pair: 'Read the finished dialogue aloud in pairs (Mia / Leo). Then change the city and make your own dialogue.',
    hint: 'Questions: did + subject + base verb. Negatives: didn\'t + base verb. BE: was / were (no did).',
    mode: 'type',
    lines: [
      { who: 'Mia', text: 'What {1} (you/do) last weekend?' },
      { who: 'Leo', text: 'I {2} (go) to Copenhagen with my family.' },
      { who: 'Mia', text: 'Really? {3} (you/like) it?' },
      { who: 'Leo', text: 'Yes, I {4} (have) a great time. We {5} (visit) a museum and {6} (eat) at a nice restaurant.' },
      { who: 'Mia', text: '{7} (you/see) the Little Mermaid?' },
      { who: 'Leo', text: 'No, we {8} (not/have) enough time.' },
      { who: 'Mia', text: 'Where {9} (you/stay)?' },
      { who: 'Leo', text: 'At my aunt\'s house. She {10} (be) really happy to see us.' },
      { who: 'Mia', text: '{11} (the weather/be) good?' },
      { who: 'Leo', text: 'Not really. It {12} (rain) on Saturday, but Sunday {13} (be) sunny.' },
      { who: 'Mia', text: 'When {14} (you/come) home?' },
      { who: 'Leo', text: 'We {15} (take) the train on Sunday evening.' }
    ],
    gaps: cph.map(function (c, i) { return { id: '14-g' + (i + 1), n: i + 1, answers: A(c[0]), explain: c[1] }; }),
    model: 'See the answer key: did you do · went · did you like · had · visited · ate · did you see · didn\'t have · did you stay · was · was the weather · rained · was · did you come · took'
  });

  /* EX 15 — Yesterday's mystery (detective role-play) */
  EX.push({
    id: 15, level: 3, type: 'mystery', icon: '🕵️', title: 'Yesterday\'s Mystery', mechanic: 'Detective role-play (pair or solo)',
    instructions: 'Student A invents an unusual event from yesterday. Student B investigates with at least eight questions (did, was/were, where, when, why, who). No partner? Investigate the solo case!',
    objective: 'Ask a range of Past Simple questions to find information.', minutes: 15,
    pair: 'A invents the event and answers in character. B asks at least eight questions and fills in the notes. Swap roles for a second case.',
    hint: 'Start with Did …? Was …? Were …? Where did …? When did …? Why did …? Who did …?',
    minQuestions: 8,
    starters: ['Did you …?', 'Was it …?', 'Were you …?', 'Where did …?', 'When did …?', 'Why did …?', 'Who did …?'],
    words: ['did', 'was', 'were', 'where', 'when', 'why', 'who'],
    solo: {
      title: 'The Case of the Missing Cake',
      intro: 'The teacher\'s birthday cake disappeared from the staff room at 3 p.m. yesterday! Interview Sam, the student who was in the school at that time, then choose who ate the cake.',
      suspect: 'Sam',
      qa: [
        ['Where were you at 3 o\'clock yesterday?', 'I was in the school library.'],
        ['Were you alone?', 'No, I wasn\'t. My friend Ella was with me.'],
        ['Did you see the cake?', 'Yes, I did. I saw it in the staff room at lunchtime.'],
        ['Who did you see near the staff room?', 'I saw Mr Brown. He was carrying a big box.'],
        ['When did you leave the library?', 'I left at half past three.'],
        ['Why did you go to the staff room?', 'I went there to give a book to Ms Green.'],
        ['Did you eat any cake?', 'No, I didn\'t. I don\'t like chocolate.'],
        ['What did Mr Brown do?', 'He put the box on the table and left quickly.'],
        ['Were the doors open?', 'Yes, they were. The window was open too.'],
        ['Did anyone else come?', 'Yes! A dog came in through the window.'],
        ['How did the dog get in?', 'It jumped through the open window.'],
        ['Did the dog eat the cake?', 'I don\'t know, but there was chocolate on its nose!']
      ],
      suspects: ['Sam', 'Ella', 'Mr Brown', 'The dog'], culprit: 'The dog'
    },
    model: 'Example questions: Where were you at 8 o\'clock? · Did you see anyone? · Who did you call? · When did it happen? · Why did you leave? · Were the doors open? · What did you do next? · Did anybody help you?'
  });

  /* EX 16 — Irregular verb memory challenge (3 modes) */
  var mem = ['go', 'buy', 'eat', 'see', 'make', 'take', 'write', 'find', 'think', 'teach', 'bring', 'drive', 'speak', 'begin', 'forget'];
  EX.push({
    id: 16, level: 4, type: 'memory', icon: '🧠', title: 'Irregular Verb Memory Challenge', mechanic: 'Match · Type · Timed recall',
    instructions: 'Three modes: 1) match each verb with its past form, 2) type the past form, 3) optional timed rapid recall. Wrong verbs come back for more practice!',
    objective: 'Memorise 15 key irregular past forms.', minutes: 15,
    pair: 'Verb tennis: A says an infinitive, B answers with the past form. Swap after each wrong answer.',
    hint: 'Use the Visual Dictionary (rule reminder) to review the groups.',
    verbs: mem,
    items: mem.map(function (b, i) { return { id: id(16, i), base: b, prompt: b, answers: [PSA.irregularByBase[b].past], explain: b + ' → ' + PSA.irregularByBase[b].past + (b === 'forget' ? ' (forgot)' : '') }; }),
    matchItems: mem.map(function (b, i) { return { id: '16m-' + (i + 1), base: b, past: PSA.irregularByBase[b].past }; }),
    timedSeconds: 60
  });

  /* EX 17 — The day everything went wrong (illustrated story) */
  var wrong = [['woke', 'wake'], ['forgot', 'forget'], ['got', 'get'], ['ran', 'run'], ['found', 'find'], ['wrote', 'write'], ['left', 'leave'], ['ate', 'eat'], ['took', 'take'], ['went', 'go'], ['saw', 'see'], ['thought', 'think'], ['came', 'come'], ['drove', 'drive'], ['said', 'say']];
  EX.push({
    id: 17, level: 4, type: 'gapstory', icon: '🚌', title: 'The Day Everything Went Wrong', mechanic: 'Illustrated story completion',
    instructions: 'Complete each part of the story with the Past Simple of the verbs in brackets. New pictures appear as you go.',
    objective: 'Use irregular past forms in a story.', minutes: 12,
    pair: 'Retell the story to a partner from the pictures, using the past simple. Then tell your own “day everything went wrong”.',
    hint: 'All the verbs are irregular! Check the irregular verb list if you are not sure.',
    mode: 'type', progressive: true,
    panels: [
      { scene: 'bedroom', text: 'Yesterday, I {1} (wake) up late because I {2} (forget) to set my alarm. I {3} (get) dressed quickly and {4} (run) downstairs.' },
      { scene: 'kitchen', text: 'In the kitchen, I {5} (find) a note from my mum. She {6} (write) that she {7} (leave) early for work.' },
      { scene: 'bus', text: 'I {8} (eat) a banana and {9} (take) my schoolbag. When I {10} (go) outside, I {11} (see) my bus driving away!' },
      { scene: 'neighbour', text: 'I {12} (think) about walking, but then my neighbour {13} (come) outside. She {14} (drive) me to school.' },
      { scene: 'classroom', text: 'When I finally arrived, my teacher {15} (say), “Why are you late again?”' }
    ],
    gaps: wrong.map(function (w, i) { return { id: '17-g' + (i + 1), n: i + 1, answers: [w[0]], explain: w[1] + ' → ' + w[0] + ' (irregular).' }; }),
    model: 'woke · forgot · got · ran · found · wrote · left · ate · took · went · saw · thought · came · drove · said'
  });

  /* EX 18 — Triple transformation (positive → negative → question) */
  var tri = [
    ['He ate a pizza.', 'He didn\'t eat a pizza.', 'Did he eat a pizza?', 'ate → eat'],
    ['They saw a film.', 'They didn\'t see a film.', 'Did they see a film?', 'saw → see'],
    ['We bought tickets.', 'We didn\'t buy tickets.', 'Did we buy tickets?', 'bought → buy'],
    ['She wrote a story.', 'She didn\'t write a story.', 'Did she write a story?', 'wrote → write'],
    ['I played football.', 'I didn\'t play football.', 'Did I play football?', 'played → play'],
    ['He took the bus.', 'He didn\'t take the bus.', 'Did he take the bus?', 'took → take'],
    ['They were happy.', 'They weren\'t happy.', 'Were they happy?', 'BE is different: no did / didn\'t!'],
    ['It was cold.', 'It wasn\'t cold.', 'Was it cold?', 'BE is different: no did / didn\'t!']
  ];
  var triItems = [];
  tri.forEach(function (r, i) {
    var be = i >= 6;
    triItems.push({ id: '18-' + (i + 1) + 'n', prompt: r[0], task: 'Write the NEGATIVE sentence', answers: [r[1]], explain: be ? 'With was/were the negative is wasn\'t / weren\'t. ' + r[3] : 'DIDN\'T + base verb (' + r[3] + ').' });
    triItems.push({ id: '18-' + (i + 1) + 'q', prompt: r[0], task: 'Write the QUESTION', answers: [r[2]], explain: be ? 'With was/were the question starts with Was / Were. ' + r[3] : 'DID + subject + base verb (' + r[3] + ').' });
  });
  EX.push({
    id: 18, level: 4, type: 'rewrite', icon: '🔺', title: 'Triple Transformation', mechanic: 'Positive → negative → question',
    instructions: 'For each positive sentence, write a negative sentence and then a question. The last two sentences are tricky: they use was/were!',
    objective: 'Control all three forms, and see that BE behaves differently.', minutes: 15,
    pair: 'Partner A says the positive sentence, B gives the negative, A gives the question. Swap roles for the next sentence.',
    hint: 'Most verbs: didn\'t + base / Did + subject + base. With was/were: wasn\'t, weren\'t, Was, Were.',
    items: triItems
  });

  /* EX 19 — Grammar boss battle */
  var boss = [
    ['She ___ at home yesterday.', ['was', 'were', 'is'], 'was', 'SHE + past of BE → was.'],
    ['___ you go to school on Monday?', ['Did', 'Were', 'Do'], 'Did', 'GO is an action verb, so the question uses DID.'],
    ['They ___ the new film last night.', ['saw', 'seen', 'see'], 'saw', 'Positive past: see → saw.'],
    ['I didn\'t ___ breakfast.', ['eat', 'ate', 'eaten'], 'eat', 'After didn\'t use the base form: eat.'],
    ['Where ___ your friends yesterday?', ['were', 'was', 'did'], 'were', '“your friends” = they → were. No did with BE.'],
    ['He ___ his homework last night.', ['did', 'done', 'do'], 'did', 'Past of DO is DID.'],
    ['___ the weather nice?', ['Was', 'Did', 'Were'], 'Was', '“The weather” = it → Was. No did with BE.'],
    ['We ___ visit the museum.', ['didn\'t', 'weren\'t', 'don\'t'], 'didn\'t', 'Negative past of an action verb: didn\'t + base verb.'],
    ['She ___ a new bike last week.', ['bought', 'buyed', 'buy'], 'bought', 'buy → bought (irregular).'],
    ['What ___ you do last weekend?', ['did', 'were', 'do'], 'did', 'Question word + DID + subject + base verb.'],
    ['My parents ___ at work last Friday.', ['were', 'was', 'did'], 'were', '“My parents” = they → were.'],
    ['He didn\'t ___ the answer.', ['know', 'knew', 'known'], 'know', 'After didn\'t use the base form: know.']
  ];
  EX.push({
    id: 19, level: 5, type: 'boss', icon: '👾', title: 'Grammar Boss Battle', mechanic: 'Boss battle: 12 multiple-choice attacks',
    instructions: 'Defeat GLITCH! Every correct answer rebuilds one part of the time machine. Wrong answers do not cost points: try again.',
    objective: 'Mixed review of was/were, did/didn\'t and irregular verbs.', minutes: 10,
    pair: 'Play as a team: discuss each question for 10 seconds before choosing.',
    hint: 'Is the verb BE (was/were)? Is it a question or a negative (did / didn\'t + base verb)?',
    parts: ['Left leg', 'Right leg', 'Base plate', 'Main body', 'Window', 'Clock face', 'Antenna', 'Time ring', 'Power core', 'Wiring', 'Control panel', 'Flux light'],
    items: boss.map(function (r, i) {
      /* spread the correct answer over A / B / C (fixed pattern, so worksheets match the game) */
      var pos = [1, 0, 2, 1, 2, 0, 0, 2, 1, 2, 0, 1][i];
      var others = r[1].filter(function (o) { return o !== r[2]; });
      var opts = others.slice(0, pos).concat([r[2]], others.slice(pos));
      return { id: id(19, i), prompt: r[0], options: opts, answer: r[2], explain: r[3] };
    })
  });

  /* EX 20 — Final creative mission */
  EX.push({
    id: 20, level: 5, type: 'writing', icon: '🏆', title: 'A Day to Remember', mechanic: 'Final creative mission',
    instructions: 'Write 100–120 words about a memorable day. Use the requirements checklist, save your draft, and print or export your text.',
    objective: 'Produce a complete text using all Past Simple forms.', minutes: 20,
    pair: 'Read your text to a partner. Your partner ticks the requirements checklist on paper and gives one compliment and one suggestion.',
    hint: 'Plan: where, who, what happened (5 irregular + 4 regular verbs), how you felt (was/were), what didn\'t happen.',
    draftKey: 'draft20', minWords: 100, maxWords: 120, rubric: true,
    rules: { irregular: 5, regular: 4, wasWere: 2, negatives: 2, questions: 2 },
    checks: ['irregular', 'regular', 'wasWere', 'negatives', 'questions', 'words'],
    selfCheck: ['I used five irregular verbs correctly.', 'I used four regular verbs with the right spelling.', 'My negatives use didn\'t + base verb or wasn\'t / weren\'t.', 'My questions use Did + base verb or Was / Were.'],
    model: 'Last summer I had a day to remember. In the morning, we visited the beach and my brother swam in the sea. I wasn\'t brave, so I stayed on the sand and watched the waves. At lunch we ate fish and chips. Then my dad asked, "Do you want to go on the boat?" I said, "Yes, but are we safe?" He laughed and answered, "Of course!" The boat trip was amazing. We sailed along the coast for an hour. We saw dolphins and took lots of photos. We didn\'t want to go home! In the evening we came back tired, but we were really happy.'
  });

  /* =====================================================================
     BONUS MISSION 6 — The Time Master Challenge (opens after missions 1–5)
     Harder practice based on the supplied PDFs: irregular-verb tables, tick/cross
     past forms, journey stories, "write B's question", last / ago and mixed conversations.
     ===================================================================== */

  /* EX 21 — Irregular verb master (type the past form of 20 verbs outside the Level 4 set) */
  var master = ['swim', 'sell', 'sit', 'lose', 'put', 'hear', 'win', 'tell', 'sleep', 'pay', 'catch', 'build', 'fall', 'fly', 'stand', 'understand', 'send', 'spend', 'cut', 'hit'];
  var sameForm = { put: 1, cut: 1, hit: 1 };
  EX.push({
    id: 21, level: 6, type: 'typing', icon: '🧠', title: 'Irregular Verb Master', mechanic: 'Type the past form (20 new verbs)',
    instructions: 'Type the Past Simple form of each irregular verb. These are NEW verbs, and some of them do not change at all!',
    objective: 'Recall 20 further irregular past forms from the verb list.', minutes: 12,
    pair: 'Verb tennis: A says the infinitive, B answers with the past form without looking. Swap after each mistake.',
    hint: 'Use the “Irregular verbs” button at the top of the screen to check the list. Remember: put, cut and hit stay the same.',
    items: master.map(function (b, i) {
      var past = PSA.irregularByBase[b].past;
      return { id: id(21, i), base: b, prompt: b, answers: [past], explain: b + ' → ' + past + (sameForm[b] ? ' (this verb does not change in the past)' : '') };
    })
  });

  /* EX 22 — Wrong form detective (tick / cross idea from the exercises) */
  EX.push({
    id: 22, level: 6, type: 'detective', icon: '🕵️', title: 'Wrong Form Detective', mechanic: 'Find and fix the wrong verb form',
    instructions: 'Each sentence has one wrong verb form. Click it, then type the whole sentence correctly. Careful: some mistakes come after did / didn\'t!',
    objective: 'Spot made-up irregular forms, spelling errors and verb forms after did / didn\'t.', minutes: 12,
    pair: 'Partner A reads the wrong sentence aloud, B says which word is wrong and gives the correct form and the rule.',
    hint: 'Irregular verbs never take -ed. After did / didn\'t use the base form. Short vowel + one consonant: double the consonant (stop → stopped).',
    items: [
      ['My uncle gived me a present.', [2], ['My uncle gave me a present.'], 'GIVE is irregular: gave (not gived).'],
      ['We sended a postcard to Granny.', [1], ['We sent a postcard to Granny.'], 'SEND is irregular: sent (not sended).'],
      ['She finded her keys under the bed.', [1], ['She found her keys under the bed.'], 'FIND is irregular: found (not finded).'],
      ['The bus stoped at the corner.', [2], ['The bus stopped at the corner.'], 'Short vowel + one consonant: double the p → stopped.'],
      ['The baby cryed all night.', [2], ['The baby cried all night.'], 'Consonant + y: change y to i → cried.'],
      ['Our team winned the match.', [2], ['Our team won the match.'], 'WIN is irregular: won (not winned).'],
      ['Did you sended the email?', [2], ['Did you send the email?'], 'After DID use the base form: send.'],
      ['She didn\'t winned the prize.', [2], ['She didn\'t win the prize.'], 'After DIDN\'T use the base form: win.'],
      ['Where did they meeted?', [3], ['Where did they meet?'], 'After DID use the base form: meet.'],
      ['I didn\'t buyed anything.', [2], ['I didn\'t buy anything.'], 'After DIDN\'T use the base form: buy.']
    ].map(function (r, i) { return { id: id(22, i), sentence: r[0], culprit: r[1], answers: r[2], explain: r[3] }; })
  });

  /* EX 23 — Holiday conversation (mixed positive / negative / question, typed) */
  var iceland = [
    ['did you go', 'Question: Where + did + you + base verb (go).'],
    ['went', 'GO is irregular: went.'],
    ['did you enjoy', 'Question: Did + you + base verb (enjoy).'],
    ['loved', 'Regular verb ending in -e: love → loved.'],
    ['swam', 'SWIM is irregular: swam.'],
    ['saw', 'SEE is irregular: saw.'],
    ['did you stay', 'Question: How long + did + you + base verb (stay).'],
    ['were', 'BE with “we”: were (no did).'],
    ['did you take', 'Question: Did + you + base verb (take).'],
    [['didn\'t work', 'did not work'], 'Negative: didn\'t + base verb (work).'],
    ['bought', 'BUY is irregular: bought.'],
    ['did you meet', 'Question: Did + you + base verb (meet).'],
    ['met', 'MEET is irregular: met.'],
    ['taught', 'TEACH is irregular: taught.'],
    [['didn\'t understand', 'did not understand'], 'Negative: didn\'t + base verb (understand).']
  ];
  EX.push({
    id: 23, level: 6, type: 'gapstory', icon: '🌋', title: 'The Iceland Conversation', mechanic: 'Dialogue completion (mixed forms)',
    instructions: 'Complete the conversation between Anna and Ben. Write the correct Past Simple form of the verbs in brackets: positive, negative or question. Some answers have two or three words.',
    objective: 'Choose between positive, negative and question forms in a long conversation.', minutes: 14,
    pair: 'Read the finished dialogue aloud in pairs (Anna / Ben). Then change the country and invent your own holiday dialogue.',
    hint: 'Questions: did + subject + base verb. Negatives: didn\'t + base verb. BE: was / were (no did). Many verbs here are irregular!',
    mode: 'type',
    lines: [
      { who: 'Anna', text: 'Where {1} (you/go) for your summer holiday?' },
      { who: 'Ben', text: 'We {2} (go) to Iceland.' },
      { who: 'Anna', text: 'Wow! {3} (you/enjoy) it?' },
      { who: 'Ben', text: 'Yes, we {4} (love) it! My brother and I {5} (swim) in a hot spring and we {6} (see) a huge waterfall.' },
      { who: 'Anna', text: 'How long {7} (you/stay) there?' },
      { who: 'Ben', text: 'We {8} (be) there for ten days.' },
      { who: 'Anna', text: '{9} (you/take) lots of photos?' },
      { who: 'Ben', text: 'Yes, I did, but my phone {10} (not/work) in the cold, so I {11} (buy) a new camera.' },
      { who: 'Anna', text: '{12} (you/meet) any interesting people?' },
      { who: 'Ben', text: 'Yes! We {13} (meet) a funny guide. He {14} (teach) us some Icelandic words, but we {15} (not/understand) them!' }
    ],
    gaps: iceland.map(function (c, i) { return { id: '23-g' + (i + 1), n: i + 1, answers: A(c[0]), explain: c[1] }; }),
    model: 'See the answer key: did you go · went · did you enjoy · loved · swam · saw · did you stay · were · did you take · didn\'t work · bought · did you meet · met · taught · didn\'t understand'
  });

  /* EX 24 — Write B's question */
  EX.push({
    id: 24, level: 6, type: 'rewrite', icon: '🎤', title: 'Write B\'s Question', mechanic: 'Build the question from cue words',
    instructions: 'Read what A says. Then write B\'s question using the words in brackets. Add did / was / were and change the verb to the base form.',
    objective: 'Form Wh- and yes/no questions from cue words, with and without did.', minutes: 14,
    pair: 'Role-play: A says the sentence, B asks the question from memory. Then swap roles and make up new sentences.',
    hint: 'Question word + DID + subject + base verb. With BE: question word + WAS / WERE + subject (no did).',
    task: 'Write B\'s question',
    items: [
      ['A: I went to London last month.  B: (who / you / go / with?)', ['Who did you go with?', 'Who did you go to London with?'], 'Who + did + you + base verb (go) + with.'],
      ['A: We were late for the meeting.  B: (what time / the meeting / start?)', ['What time did the meeting start?'], 'What time + did + subject + base verb (start).'],
      ['A: I played tennis this afternoon.  B: (you / win?)', ['Did you win?', 'Did you win the match?', 'Did you win the game?'], 'Did + you + base verb (win).'],
      ['A: I had a nice holiday.  B: (where / you / go?)', ['Where did you go?'], 'Where + did + you + base verb (go).'],
      ['A: My brother bought a new laptop.  B: (how much / it / cost?)', ['How much did it cost?'], 'How much + did + it + base verb (cost).'],
      ['A: We came home by taxi.  B: (how much / you / pay?)', ['How much did you pay?'], 'How much + did + you + base verb (pay).'],
      ['A: I wasn\'t at home last night.  B: (where / you / be?)', ['Where were you?', 'Where were you last night?'], 'BE question: Where + were + you. No did with was/were!'],
      ['A: I didn\'t sleep well last night.  B: (what time / you / go to bed?)', ['What time did you go to bed?'], 'What time + did + you + base verb (go).'],
      ['A: Mum made a big cake.  B: (it / be / delicious?)', ['Was it delicious?'], 'BE question: Was + it. No did with was/were!'],
      ['A: I lost my phone.  B: (when / you / lose / it?)', ['When did you lose it?'], 'When + did + you + base verb (lose).']
    ].map(function (r, i) { return { id: id(24, i), prompt: r[0], answers: r[1], explain: r[2] }; })
  });

  /* EX 25 — Last or ago? */
  EX.push({
    id: 25, level: 6, type: 'rewrite', icon: '⏱️', title: 'Last or Ago?', mechanic: 'Answer with a full past sentence',
    instructions: 'Answer each question with a full sentence in the Past Simple. Use last or ago with the time word in brackets: (week) → last week, (two hours) → two hours ago.',
    objective: 'Use last + time and time + ago with the Past Simple.', minutes: 12,
    pair: 'Partner A asks “When did you …?”, B answers with a real answer using last or ago. Swap after five questions.',
    hint: 'One time word (week, year, night, month) → last. A number of time (two hours, five minutes) → ago.',
    task: 'Answer with last or ago',
    items: [
      ['When did you speak to Anna? (week)', ['I spoke to Anna last week.', 'Last week I spoke to Anna.'], 'One time word → last week. SPEAK is irregular: spoke.'],
      ['When did they buy that car? (two years)', ['They bought that car two years ago.', 'Two years ago they bought that car.'], 'A number of time → two years ago. BUY → bought.'],
      ['When did the film start? (five minutes)', ['The film started five minutes ago.', 'Five minutes ago the film started.'], 'A number of time → five minutes ago.'],
      ['When did she leave school? (year)', ['She left school last year.', 'Last year she left school.'], 'One time word → last year. LEAVE → left.'],
      ['When did we clean the windows? (six months)', ['We cleaned the windows six months ago.', 'Six months ago we cleaned the windows.'], 'A number of time → six months ago.'],
      ['When did you see Tom? (night)', ['I saw Tom last night.', 'Last night I saw Tom.'], 'One time word → last night. SEE → saw.'],
      ['When did it stop raining? (two hours)', ['It stopped raining two hours ago.', 'Two hours ago it stopped raining.'], 'A number of time → two hours ago. Regular verb: stop → stopped.'],
      ['When did Max phone? (month)', ['Max phoned last month.', 'He phoned last month.', 'Last month Max phoned.', 'Max phoned me last month.', 'He phoned me last month.'], 'One time word → last month.']
    ].map(function (r, i) { return { id: id(25, i), prompt: r[0], answers: r[1], explain: r[2] }; })
  });

  /* EX 26 — The Secret of the Old Barn (longer story, typed past forms) */
  var barn = [
    ['spent', 'SPEND is irregular: spent.'],
    ['woke', 'WAKE is irregular: woke.'],
    ['crowed', 'Regular verb: crow → crowed.'],
    ['told', 'TELL is irregular: told.'],
    ['went', '“Nobody” is a positive word, so use the plain past of GO: went (no negative needed).'],
    ['did you want', 'Question: Did + you + base verb (want).'],
    ['said', 'SAY is irregular: said.'],
    ['carried', 'Consonant + y: carry → carried.'],
    ['walked', 'Regular verb: walk → walked.'],
    ['was', 'BE with “the door” (it): was.'],
    ['stepped', 'Short vowel + one consonant: double the p → stepped.'],
    [['didn\'t see', 'did not see'], 'Negative: didn\'t + base verb (see).'],
    ['found', 'FIND is irregular: found.'],
    [['what was', 'what\'s was'], 'BE question: What + was + subject. No did with was/were!'],
    ['opened', 'Regular verb: open → opened (no doubling).'],
    ['was', '“a rusty key” is singular: there was.'],
    ['ran', 'RUN is irregular: ran.'],
    ['showed', 'Regular verb: show → showed.'],
    ['laughed', 'Regular verb: laugh → laughed.'],
    ['said', 'SAY is irregular: said.'],
    ['hid', 'HIDE is irregular: hid.'],
    ['was', 'BE with “I”: was.'],
    [['didn\'t find', 'did not find'], 'Negative: didn\'t + base verb (find).'],
    ['had', 'HAVE is irregular: had.']
  ];
  barn[13][0] = ['what was'];
  EX.push({
    id: 26, level: 6, type: 'gapstory', icon: '🏚️', title: 'The Secret of the Old Barn', mechanic: 'Long story completion (24 gaps)',
    instructions: 'Complete the story with the Past Simple of the verbs in brackets. Watch out: you need positive forms, negatives, questions, was/were, irregular verbs and spelling changes!',
    objective: 'Control every Past Simple form in one longer, more complex text.', minutes: 18,
    pair: 'Read the finished story aloud, one paragraph each. Then retell it in your own words using at least six of the verbs.',
    hint: 'Check each gap: is it positive, negative (didn\'t + base) or a question (did + subject + base)? Is the verb BE (was/were) or irregular? Does the spelling change (carry, step)?',
    mode: 'type',
    panels: [{ text: 'Last summer, my cousin Jonas and I {1} (spend) two weeks at my grandparents\' farm near Aarhus. On the first morning we {2} (wake) up very early because a rooster {3} (crow) outside our window.\n\nAt breakfast, Grandpa {4} (tell) us a strange story about the old barn. “Nobody {5} (go) inside it for thirty years,” he said. “{6} (you/want) to see it?” Of course we {7} (say) yes!\n\nWe {8} (carry) a torch and {9} (walk) slowly across the yard. The door {10} (be) open, so we {11} (step) inside. At first we {12} (not/see) anything, but then Jonas {13} (find) an old wooden box behind some hay. “{14} (what/be) inside it?” I asked. Jonas {15} (open) it carefully. Inside, there {16} (be) a rusty key and a small map!\n\nWe {17} (run) back to the house and {18} (show) Grandpa. He {19} (laugh) and {20} (say), “I {21} (hide) them there when I {22} (be) a boy.” We {23} (not/find) any treasure, but we {24} (have) the best adventure of our lives.' }],
    gaps: barn.map(function (c, i) { return { id: '26-g' + (i + 1), n: i + 1, answers: A(c[0]), explain: c[1] }; }),
    model: 'See the answer key: spent · woke · crowed · told · went · did you want · said · carried · walked · was · stepped · didn\'t see · found · what was · opened · was · ran · showed · laughed · said · hid · was · didn\'t find · had'
  });

  /* EX 27 — Translate from Danish into English */
  EX.push({
    id: 27, level: 6, type: 'rewrite', icon: '🇩🇰', title: 'Danish → English', mechanic: 'Translate 10 sentences into the Past Simple',
    instructions: 'Translate each Danish sentence into English. Use the Past Simple: there are positive sentences, negatives and questions. The small words above the sentence help you.',
    objective: 'Transfer the Past Simple (positive, negative, question) from Danish into English.', minutes: 18,
    pair: 'Partner A reads the Danish sentence aloud, B translates it into English from memory. Then check together and swap roles.',
    hint: 'Negative: didn\'t + base verb. Question: Did + subject + base verb. With was/were: wasn\'t / weren\'t and Was / Were (no did).',
    items: [
      ['Min bror spiste pizza i går aftes.', 'Positive · brother, pizza, last night', ['My brother ate pizza last night.', 'Last night my brother ate pizza.', 'My brother ate pizza yesterday evening.', 'Yesterday evening my brother ate pizza.', 'My brother had pizza last night.', 'Last night my brother had pizza.'], 'SPISE → eat. Past: ate (irregular). “i går aftes” = last night / yesterday evening.'],
      ['Vi tog toget til København i sidste weekend.', 'Positive · train, Copenhagen, last weekend', ['We took the train to Copenhagen last weekend.', 'Last weekend we took the train to Copenhagen.', 'We went to Copenhagen by train last weekend.', 'Last weekend we went to Copenhagen by train.'], 'TAGE → take. Past: took (irregular). “i sidste weekend” = last weekend (no “in”).'],
      ['Hun skrev et langt brev til sin veninde.', 'Positive · letter, friend', ['She wrote a long letter to her friend.', 'She wrote a long letter to her best friend.'], 'SKRIVE → write. Past: wrote (irregular). “sin veninde” = her friend.'],
      ['Børnene var trætte efter turen.', 'Positive (be) · tired, trip', ['The children were tired after the trip.', 'The children were tired after the journey.', 'The kids were tired after the trip.', 'The kids were tired after the journey.'], '“Børnene” = they, so use were. BE needs no did.'],
      ['Jeg så ikke min lærer i går.', 'Negative · see, teacher, yesterday', ['I didn\'t see my teacher yesterday.', 'Yesterday I didn\'t see my teacher.'], 'Negative: didn\'t + base verb (see), not “didn\'t saw”.'],
      ['Vi lavede ikke vores lektier i går aftes.', 'Negative · do, homework, last night', ['We didn\'t do our homework last night.', 'Last night we didn\'t do our homework.', 'We didn\'t do our homework yesterday evening.', 'Yesterday evening we didn\'t do our homework.'], 'Negative: didn\'t + base verb (do). “lektier” = homework (no plural s in English).'],
      ['Det var ikke koldt i søndags.', 'Negative (be) · cold, last Sunday', ['It wasn\'t cold last Sunday.', 'Last Sunday it wasn\'t cold.', 'It wasn\'t cold on Sunday.', 'On Sunday it wasn\'t cold.'], 'BE negative: wasn\'t (no didn\'t). “i søndags” = last Sunday.'],
      ['Hvad lavede du i sidste weekend?', 'Question · what, do, last weekend', ['What did you do last weekend?'], 'Question: What + did + you + base verb (do).'],
      ['Købte din søster en ny telefon?', 'Question · buy, sister, new phone', ['Did your sister buy a new phone?'], 'Question: Did + subject + base verb (buy), not “Did she bought”.'],
      ['Var vejret flot i Aarhus?', 'Question (be) · weather, nice, Aarhus', ['Was the weather nice in Aarhus?', 'Was the weather good in Aarhus?', 'Was the weather beautiful in Aarhus?', 'Was the weather lovely in Aarhus?'], 'BE question: Was + the weather (it). No did with was/were.']
    ].map(function (r, i) { return { id: id(27, i), prompt: r[0], task: 'Translate into English  ·  ' + r[1], answers: r[2], explain: r[3] }; })
  });

  /* ---------- Teacher metadata, helpers ---------- */
  PSA.exerciseById = function (n) { return EX.filter(function (e) { return e.id === Number(n); })[0] || null; };
  PSA.levelById = function (n) { return PSA.levels.filter(function (l) { return l.id === Number(n); })[0] || null; };
  PSA.exercisesOfLevel = function (n) { return EX.filter(function (e) { return e.level === Number(n); }); };
  /* Bonus mission(s) open only after every core mission is complete; they are not part of the certificate. */
  PSA.coreLevels = function () { return PSA.levels.filter(function (l) { return !l.bonus; }); };
  PSA.coreExercises = function () { return EX.filter(function (e) { var l = PSA.levelById(e.level); return l && !l.bonus; }); };
  PSA.missionName = function (lv) { return lv.bonus ? 'BONUS MISSION' : 'MISSION ' + lv.id; };
  PSA.OPEN_TYPES = ['speaking', 'writing', 'mystery'];
  PSA.isOpen = function (ex) { return PSA.OPEN_TYPES.indexOf(ex.type) >= 0; };

  /* Verbs that can be regular (-ed) or irregular (-t) — bottom box of the irregular-verb list */
  PSA.irregularEither = [
    { base: 'burn', past: 'burned / burnt' }, { base: 'dream', past: 'dreamed / dreamt' },
    { base: 'learn', past: 'learned / learnt' }, { base: 'smell', past: 'smelled / smelt' }
  ];
/*__END__*/
})(typeof window !== 'undefined' ? window : globalThis);
