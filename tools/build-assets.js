/* node tools/build-assets.js — exports the inline SVG illustrations as standalone files in assets/illustrations */
'use strict';
const fs = require('fs'), path = require('path');
global.window = global; require('../js/questions.js'); require('../js/illustrations.js');
const A = global.PSA.art, out = path.join(__dirname, '..', 'assets', 'illustrations');
fs.mkdirSync(out, { recursive: true });
function save(name, markup) {
  const s = markup.replace(/^<div[^>]*>|<\/div>$/g, '').replace('<svg ', '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/(<svg[^>]*>)/, '$1' + A.standaloneStyle);
  fs.writeFileSync(path.join(out, name + '.svg'), s);
}
save('time-machine', A.machine(12));
['school', 'portal', 'lab', 'forest'].forEach(n => save('level-' + n, A.scene(n)));
['trip', 'bedroom', 'kitchen', 'bus', 'neighbour', 'classroom'].forEach(n => save('story-' + n, A.story(n)));
['Mia', 'Leo'].forEach(n => save('avatar-' + n.toLowerCase(), A.avatar(n)));
save('chrono-robot', A.chrono()); save('glitch-boss', A.glitch());
const icons = path.join(__dirname, '..', 'assets', 'icons'); fs.mkdirSync(icons, { recursive: true });
fs.writeFileSync(path.join(icons, 'favicon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#1b1f6b"/><circle cx="32" cy="32" r="20" fill="#fff" stroke="#22e1ff" stroke-width="4"/><line x1="32" y1="32" x2="32" y2="18" stroke="#0b0d2a" stroke-width="4" stroke-linecap="round"/><line x1="32" y1="32" x2="42" y2="38" stroke="#ff9f1c" stroke-width="4" stroke-linecap="round"/></svg>');
fs.writeFileSync(path.join(icons, 'star.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2l3 7 7.5.6-5.7 4.9 1.8 7.3L12 17.8 5.4 21.8l1.8-7.3L1.5 9.6 9 9z" fill="#ffd54f" stroke="#0b0d2a" stroke-width="1.5" stroke-linejoin="round"/></svg>');
fs.writeFileSync(path.join(__dirname, '..', 'assets', 'sounds', 'README.txt'), 'Sound effects are generated with the Web Audio API (js/utils.js), so no audio files are needed. Sound is OFF by default; use the speaker button in the top bar.\n');
console.log('assets written to', out);
