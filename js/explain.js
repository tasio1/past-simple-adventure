/* explain.js — renders the visual grammar explanation cards (used by missions, rule reminder and Teacher Mode). */
(function (root) {
  'use strict';
  var PSA = root.PSA, h = PSA.h;

  function card(title, cls) { return h('section', { class: 'card ' + (cls || '') }, title ? h('h3', null, title) : null); }

  var R = {
    wwSplit: function (c) {
      var k = card(c.title, 'ww');
      function box(cls, word, subs) { return h('div', { class: 'ww-box ' + cls }, h('div', { class: 'ww-word' }, word), h('div', { class: 'ww-subj' }, subs.map(function (s) { return h('span', null, s); }))); }
      k.appendChild(h('div', { class: 'ww-split' }, box('was', 'WAS', ['I', 'he', 'she', 'it']), box('were', 'WERE', ['you', 'we', 'they'])));
      k.appendChild(h('p', { class: 'muted' }, 'There ', h('b', null, 'was'), ' + one thing · There ', h('b', null, 'were'), ' + many things'));
      return k;
    },
    table: function (c) {
      var k = card(c.title);
      var t = h('table', { class: 'gtable' }, h('thead', null, h('tr', null, c.head.map(function (x) { return h('th', null, x); }))),
        h('tbody', null, c.rows.map(function (r) { return h('tr', null, r.map(function (x) { return h('td', { html: x }); })); })));
      k.appendChild(h('div', { class: 'table-wrap' }, t));
      if (c.note) k.appendChild(h('p', { class: 'muted' }, c.note));
      return k;
    },
    structs: function (c) {
      var k = card(c.title);
      c.items.forEach(function (s) {
        k.appendChild(h('div', { class: 'struct ' + s.cls }, h('div', { class: 'struct-label' }, s.label), h('div', { class: 'struct-formula', html: s.formula }),
          h('div', { class: 'struct-ex' }, s.examples.map(function (e) { return h('span', { class: 'ex-pill' }, e); }))));
      });
      return k;
    },
    mistakes: function (c) {
      var k = card(c.title, 'warn');
      c.rows.forEach(function (r) {
        k.appendChild(h('div', { class: 'mistake' }, h('div', { class: 'bad' }, '✗ ', h('s', null, r.bad)), h('div', { class: 'good' }, '✓ ' + r.good), h('div', { class: 'why muted' }, r.why)));
      });
      return k;
    },
    callout: function (c) { var k = card(c.title, 'callout ' + (c.tone || 'tip')); k.appendChild(h('div', { html: c.html })); return k; },
    timeline: function (c) {
      var k = card(c.title);
      k.appendChild(h('div', { class: 'timeline', 'aria-label': 'Timeline: past to now' }, h('span', { class: 'tl-label past' }, 'PAST'), h('div', { class: 'tl-line' }, h('i', { class: 'tl-dot d1' }), h('i', { class: 'tl-dot d2' }), h('i', { class: 'tl-dot d3' })), h('span', { class: 'tl-label now' }, 'NOW')));
      k.appendChild(h('p', null, 'The Past Simple tells us about ', h('b', null, 'finished'), ' actions and situations in the past. We often say when: ', h('i', null, 'yesterday, last night, two years ago…')));
      c.examples.forEach(function (e) { k.appendChild(h('div', { class: 'conv' }, h('span', { class: 'conv-a' }, e[0]), h('span', { class: 'arrow' }, ' → '), h('span', { class: 'conv-b', html: e[1] }))); });
      return k;
    },
    spelling: function (c) {
      var k = card(c.title);
      c.rows.forEach(function (r) {
        k.appendChild(h('div', { class: 'spell-row' }, h('div', { class: 'spell-rule', html: r.rule }),
          h('div', { class: 'spell-pairs' }, r.pairs.map(function (p) { return h('span', { class: 'pair' }, p[0], ' → ', h('b', null, p[1])); }))));
      });
      if (c.note) k.appendChild(h('p', { class: 'muted' }, c.note));
      return k;
    },
    verbpairs: function (c) {
      var k = card(c.title);
      k.appendChild(h('div', { class: 'pair-grid' }, c.pairs.map(function (p) { return h('span', { class: 'pair big' }, p[0], ' → ', h('b', null, p[1])); })));
      return k;
    },
    chips: function (c) { var k = card(c.title); k.appendChild(h('div', { class: 'chip-row' }, c.items.map(function (i) { return h('span', { class: 'tag' }, i); }))); return k; },
    flow: function (c) {
      var k = card(c.title);
      function box(cls, t, s) { return h('div', { class: 'flow-box ' + cls }, h('b', null, t), s ? h('small', null, s) : null); }
      k.appendChild(h('div', { class: 'flow' },
        box('q', 'Is the verb BE?', 'am / is / are → was / were'),
        h('div', { class: 'flow-split' },
          h('div', { class: 'flow-col' }, h('div', { class: 'flow-label yes' }, 'YES'), box('be', 'was / were', 'Positive: She was late.'), box('be', 'wasn\'t / weren\'t', 'Negative: She wasn\'t late.'), box('be', 'Was / Were + subject?', 'Question: Was she late?')),
          h('div', { class: 'flow-col' }, h('div', { class: 'flow-label no' }, 'NO'), box('act', 'past form', 'Positive: She went home.'), box('act', 'didn\'t + base verb', 'Negative: She didn\'t go home.'), box('act', 'Did + subject + base verb?', 'Question: Did she go home?')))));
      return k;
    },
    dictionary: function (c) { return dictionary(c); }
  };

  /* Visual dictionary with hide / reveal and practice groups (Level 4) */
  function dictionary(c) {
    var k = card(c.title, 'dict');
    var groups = PSA.irregularGroups, current = -1, cards = [];
    var tabs = h('div', { class: 'mode-tabs' }), grid = h('div', { class: 'dict-grid' });
    var controls = h('div', { class: 'actions' },
      h('button', { type: 'button', class: 'btn small', onClick: function () { setAll(true); } }, '👁 Reveal all'),
      h('button', { type: 'button', class: 'btn small ghost', onClick: function () { setAll(false); } }, '🙈 Hide all'));
    function setAll(v) { cards.forEach(function (b) { toggle(b, v); }); }
    function toggle(b, v) {
      var on = v === undefined ? b.getAttribute('aria-pressed') !== 'true' : v;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.querySelector('.d-past').style.visibility = on ? 'visible' : 'hidden';
    }
    function draw() {
      PSA.clear(tabs); PSA.clear(grid); cards = [];
      [{ title: 'All 30' }].concat(groups).forEach(function (g, i) {
        tabs.appendChild(h('button', { type: 'button', class: 'mode-tab' + (current === i - 1 ? ' active' : ''), onClick: function () { current = i - 1; draw(); } }, i === 0 ? 'All 30' : 'Group ' + i));
      });
      var verbs = current < 0 ? PSA.irregular30 : groups[current].verbs;
      if (current >= 0) grid.appendChild(h('div', { class: 'dict-title' }, groups[current].title));
      verbs.forEach(function (b) {
        var v = PSA.irregularByBase[b];
        var btn = h('button', { type: 'button', class: 'dict-card', 'aria-pressed': 'false', 'aria-label': b + ': click to show the past simple' },
          h('span', { class: 'd-base' }, b), h('span', { class: 'd-arrow' }, '→'), h('span', { class: 'd-past', style: 'visibility:hidden' }, v.past + (b === 'read' ? ' (red)' : '')));
        btn.addEventListener('click', function () { toggle(btn); });
        cards.push(btn); grid.appendChild(btn);
      });
    }
    draw();
    k.appendChild(tabs); k.appendChild(controls); k.appendChild(grid);
    k.appendChild(h('p', { class: 'muted' }, 'Tip: hide all, say the past form out loud, then click to check.'));
    return k;
  }

  PSA.renderExplain = function (level) {
    var wrap = h('div', { class: 'explain-grid' });
    level.explain.forEach(function (c) { var f = R[c.type]; if (f) wrap.appendChild(f(c)); });
    return wrap;
  };
})(typeof window !== 'undefined' ? window : globalThis);
