/* illustrations.js — original SVG illustrations (inline strings; no external images). */
(function (root) {
  'use strict';
  var PSA = (root.PSA = root.PSA || {});
  var I = (PSA.art = {});

  function svg(vb, inner, cls, label) {
    return '<svg class="art ' + (cls || '') + '" viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (label || 'illustration') + '" focusable="false">' + inner + '</svg>';
  }

  /* ---- Time machine, built from 12 parts (index = part number). n = how many parts are built. ---- */
  I.machine = function (n, opts) {
    opts = opts || {};
    var all = n === undefined || n >= 12;
    function part(i, inner) { return '<g class="mpart ' + (all || i < n ? 'on' : 'off') + '" data-part="' + i + '">' + inner + '</g>'; }
    var parts = [
      part(2, '<rect x="52" y="196" width="136" height="14" rx="4" fill="#5c6bc0" stroke="#0b0d2a" stroke-width="3"/>'),
      part(0, '<path d="M74 190 L58 226 L76 226 L88 190Z" fill="#7986cb" stroke="#0b0d2a" stroke-width="3"/>'),
      part(1, '<path d="M166 190 L182 226 L164 226 L152 190Z" fill="#7986cb" stroke="#0b0d2a" stroke-width="3"/>'),
      part(3, '<rect x="66" y="88" width="108" height="110" rx="18" fill="#3949ab" stroke="#0b0d2a" stroke-width="3"/><rect x="74" y="96" width="92" height="12" rx="6" fill="#5c6bc0" opacity=".7"/>'),
      part(7, '<ellipse class="spin-slow" cx="120" cy="150" rx="86" ry="14" fill="none" stroke="#ff9f1c" stroke-width="6" stroke-dasharray="26 10"/>'),
      part(4, '<circle cx="120" cy="136" r="28" fill="#0b1d3a" stroke="#22e1ff" stroke-width="4"/><path d="M104 126 Q120 112 136 124" stroke="#fff" stroke-width="3" fill="none" opacity=".5"/>'),
      part(8, '<circle class="pulse" cx="120" cy="138" r="13" fill="#ff9f1c"/><circle cx="120" cy="138" r="6" fill="#fff6d6"/>'),
      part(10, '<rect x="82" y="170" width="76" height="20" rx="5" fill="#1a1f4d" stroke="#0b0d2a" stroke-width="2"/><circle cx="96" cy="180" r="4" fill="#3ddc84"/><circle cx="112" cy="180" r="4" fill="#ff5d8f"/><circle cx="128" cy="180" r="4" fill="#22e1ff"/><rect x="138" y="176" width="14" height="8" rx="2" fill="#ff9f1c"/>'),
      part(5, '<circle cx="120" cy="64" r="26" fill="#fff" stroke="#0b0d2a" stroke-width="4"/><line x1="120" y1="64" x2="120" y2="46" stroke="#0b0d2a" stroke-width="4" stroke-linecap="round"/><line class="hand" x1="120" y1="64" x2="134" y2="72" stroke="#ff5d8f" stroke-width="4" stroke-linecap="round"/>'),
      part(6, '<line x1="120" y1="38" x2="120" y2="14" stroke="#9fa8da" stroke-width="4"/><circle class="blink" cx="120" cy="12" r="6" fill="#ff5d8f"/>'),
      part(9, '<path d="M66 120 Q40 120 40 150 Q40 176 66 176" fill="none" stroke="#3ddc84" stroke-width="5"/><path d="M174 120 Q200 120 200 150 Q200 176 174 176" fill="none" stroke="#3ddc84" stroke-width="5"/>'),
      part(11, '<polygon class="pulse" points="78,84 60,66 96,66" fill="#22e1ff" stroke="#0b0d2a" stroke-width="2"/>')
    ];
    return svg('0 0 240 240', '<g class="' + (opts.float === false ? '' : 'float') + '">' + parts.join('') + '</g>', 'machine', 'time machine' + (all ? '' : ', ' + n + ' of 12 parts built'));
  };

  /* ---- Level banner scenes ---- */
  var sky = '<defs><linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1f6b"/><stop offset="1" stop-color="#3b2a8f"/></linearGradient></defs><rect width="400" height="220" fill="url(#gSky)"/><g fill="#fff" opacity=".8"><circle cx="30" cy="30" r="2"/><circle cx="120" cy="18" r="1.5"/><circle cx="250" cy="34" r="2"/><circle cx="350" cy="20" r="1.5"/><circle cx="310" cy="70" r="1.5"/></g>';

  I.scene = function (name) {
    var s = {
      school: sky + '<rect x="80" y="90" width="240" height="110" fill="#ff9f1c" stroke="#0b0d2a" stroke-width="4"/><polygon points="70,92 200,40 330,92" fill="#e65100" stroke="#0b0d2a" stroke-width="4"/><circle cx="200" cy="78" r="16" fill="#fff" stroke="#0b0d2a" stroke-width="3"/><line x1="200" y1="78" x2="200" y2="68" stroke="#0b0d2a" stroke-width="3"/><line class="hand" x1="200" y1="78" x2="208" y2="82" stroke="#ff5d8f" stroke-width="3"/><rect x="180" y="150" width="40" height="50" fill="#5d4037" stroke="#0b0d2a" stroke-width="3"/><g fill="#22e1ff" stroke="#0b0d2a" stroke-width="3"><rect x="100" y="110" width="40" height="30"/><rect x="260" y="110" width="40" height="30"/><rect x="100" y="156" width="40" height="30"/><rect x="260" y="156" width="40" height="30"/></g><rect x="0" y="200" width="400" height="20" fill="#2e7d32"/><text x="200" y="215" text-anchor="middle" font-size="12" fill="#fff" font-weight="700">LAST WEEK</text>',
      portal: sky + '<g transform="translate(200 110)"><ellipse class="spin-slow" rx="90" ry="90" fill="none" stroke="#ff9f1c" stroke-width="8" stroke-dasharray="40 14"/><ellipse class="spin-rev" rx="68" ry="68" fill="none" stroke="#22e1ff" stroke-width="7" stroke-dasharray="26 12"/><ellipse class="spin-slow" rx="46" ry="46" fill="none" stroke="#b388ff" stroke-width="6" stroke-dasharray="18 10"/><circle class="pulse" r="26" fill="#fff" opacity=".85"/></g><text x="200" y="212" text-anchor="middle" font-size="13" fill="#fff" font-weight="700">YESTERDAY →</text>',
      lab: sky + '<rect x="0" y="170" width="400" height="50" fill="#37474f"/><rect x="40" y="165" width="320" height="10" fill="#90a4ae"/><g class="float"><path d="M150 60 h30 v40 l26 56 a10 10 0 0 1 -9 14 h-64 a10 10 0 0 1 -9 -14 l26 -56z" fill="#b388ff" opacity=".9" stroke="#0b0d2a" stroke-width="4"/><circle cx="165" cy="140" r="5" fill="#fff" opacity=".8"/><circle cx="180" cy="128" r="3" fill="#fff" opacity=".8"/></g><g font-weight="800" font-size="34" fill="#ff9f1c"><text class="blink" x="260" y="90">?</text><text class="blink" x="300" y="130" fill="#22e1ff">?</text><text class="blink" x="90" y="110" fill="#3ddc84">?</text></g><text x="320" y="62" font-size="14" fill="#fff" font-weight="800">DID?</text>',
      forest: sky + '<rect x="0" y="180" width="400" height="40" fill="#1b5e20"/><g stroke="#0b0d2a" stroke-width="3"><g><rect x="62" y="130" width="14" height="52" fill="#6d4c41"/><polygon points="40,140 69,60 98,140" fill="#2e7d32"/><polygon points="46,110 69,40 92,110" fill="#43a047"/></g><g><rect x="196" y="120" width="16" height="62" fill="#6d4c41"/><polygon points="170,130 204,40 238,130" fill="#2e7d32"/><polygon points="176,96 204,28 232,96" fill="#43a047"/></g><g><rect x="322" y="132" width="14" height="50" fill="#6d4c41"/><polygon points="300,142 329,64 358,142" fill="#2e7d32"/><polygon points="306,112 329,44 352,112" fill="#43a047"/></g></g><g font-size="12" font-weight="800" fill="#fff"><text x="46" y="136">go→went</text><text x="176" y="118">see→saw</text><text x="300" y="138">eat→ate</text></g>'
    };
    if (name === 'machine') return '<div class="art-machine">' + I.machine(12) + '</div>';
    return svg('0 0 400 220', s[name] || s.school, 'scene scene-' + name, 'scene illustration');
  };

  /* ---- Story scenes (Ex 5 and Ex 17) ---- */
  I.story = function (name) {
    var bg = '<rect width="400" height="200" fill="#1c2260"/>';
    var sc = {
      trip: bg + '<rect x="0" y="150" width="400" height="50" fill="#37474f"/><g fill="#78909c" stroke="#0b0d2a" stroke-width="3"><ellipse cx="90" cy="40" rx="50" ry="22"/><ellipse cx="190" cy="56" rx="60" ry="24"/><ellipse cx="310" cy="38" rx="50" ry="22"/></g><g stroke="#22e1ff" stroke-width="3" stroke-linecap="round"><line x1="80" y1="74" x2="74" y2="90"/><line x1="190" y1="90" x2="184" y2="108"/><line x1="300" y1="70" x2="294" y2="88"/></g><g class="drive"><rect x="130" y="96" width="140" height="56" rx="10" fill="#ff9f1c" stroke="#0b0d2a" stroke-width="4"/><g fill="#22e1ff" stroke="#0b0d2a" stroke-width="2"><rect x="142" y="106" width="28" height="22"/><rect x="178" y="106" width="28" height="22"/><rect x="214" y="106" width="28" height="22"/></g><circle cx="165" cy="154" r="12" fill="#263238" stroke="#0b0d2a" stroke-width="3"/><circle cx="240" cy="154" r="12" fill="#263238" stroke="#0b0d2a" stroke-width="3"/></g>',
      bedroom: bg + '<rect x="0" y="150" width="400" height="50" fill="#4e342e"/><rect x="40" y="96" width="170" height="60" rx="8" fill="#5c6bc0" stroke="#0b0d2a" stroke-width="4"/><rect x="40" y="86" width="40" height="30" rx="8" fill="#fff" stroke="#0b0d2a" stroke-width="3"/><circle cx="300" cy="80" r="40" fill="#fff" stroke="#0b0d2a" stroke-width="4"/><line x1="300" y1="80" x2="300" y2="54" stroke="#0b0d2a" stroke-width="4"/><line x1="300" y1="80" x2="320" y2="86" stroke="#ff5d8f" stroke-width="4"/><text x="300" y="150" text-anchor="middle" font-size="16" font-weight="800" fill="#ff9f1c" class="blink">8:45 !</text><text x="130" y="84" font-size="18" fill="#fff" class="float">Zzz</text>',
      kitchen: bg + '<rect x="0" y="150" width="400" height="50" fill="#6d4c41"/><rect x="60" y="110" width="280" height="14" fill="#a1887f" stroke="#0b0d2a" stroke-width="3"/><rect x="80" y="124" width="10" height="46" fill="#8d6e63"/><rect x="310" y="124" width="10" height="46" fill="#8d6e63"/><rect x="120" y="70" width="70" height="40" fill="#fff9c4" stroke="#0b0d2a" stroke-width="3" transform="rotate(-4 155 90)"/><g stroke="#8d6e63" stroke-width="2"><line x1="130" y1="82" x2="176" y2="80"/><line x1="130" y1="92" x2="180" y2="90"/><line x1="130" y1="102" x2="160" y2="100"/></g><path d="M250 106 q22 -30 40 -4" fill="none" stroke="#fdd835" stroke-width="12" stroke-linecap="round"/>',
      bus: bg + '<rect x="0" y="150" width="400" height="50" fill="#37474f"/><g class="drive-away"><rect x="190" y="84" width="160" height="62" rx="10" fill="#ff9f1c" stroke="#0b0d2a" stroke-width="4"/><g fill="#22e1ff" stroke="#0b0d2a" stroke-width="2"><rect x="204" y="94" width="28" height="24"/><rect x="240" y="94" width="28" height="24"/><rect x="276" y="94" width="28" height="24"/></g><circle cx="222" cy="148" r="12" fill="#263238" stroke="#0b0d2a" stroke-width="3"/><circle cx="318" cy="148" r="12" fill="#263238" stroke="#0b0d2a" stroke-width="3"/></g><g class="run"><circle cx="70" cy="96" r="14" fill="#ffcc80" stroke="#0b0d2a" stroke-width="3"/><rect x="58" y="110" width="24" height="30" rx="6" fill="#22e1ff" stroke="#0b0d2a" stroke-width="3"/><line x1="64" y1="140" x2="56" y2="160" stroke="#0b0d2a" stroke-width="5"/><line x1="78" y1="140" x2="90" y2="160" stroke="#0b0d2a" stroke-width="5"/></g><text x="150" y="70" font-size="26" font-weight="800" fill="#ff5d8f" class="blink">!</text>',
      neighbour: bg + '<rect x="0" y="150" width="400" height="50" fill="#37474f"/><g class="drive"><path d="M110 150 v-30 q0 -16 16 -16 h30 l22 -26 h60 l22 26 h30 q16 0 16 16 v30z" fill="#3ddc84" stroke="#0b0d2a" stroke-width="4"/><circle cx="160" cy="152" r="14" fill="#263238" stroke="#0b0d2a" stroke-width="3"/><circle cx="280" cy="152" r="14" fill="#263238" stroke="#0b0d2a" stroke-width="3"/><path d="M200 104 l14 -18 h36 l14 18z" fill="#b3e5fc" stroke="#0b0d2a" stroke-width="2"/></g><text x="60" y="80" font-size="40">👋</text>',
      classroom: bg + '<rect x="0" y="150" width="400" height="50" fill="#5d4037"/><rect x="60" y="30" width="200" height="96" rx="6" fill="#1b5e20" stroke="#8d6e63" stroke-width="6"/><text x="160" y="86" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">LATE AGAIN?</text><circle cx="320" cy="84" r="16" fill="#ffcc80" stroke="#0b0d2a" stroke-width="3"/><rect x="304" y="100" width="32" height="50" rx="8" fill="#ff5d8f" stroke="#0b0d2a" stroke-width="3"/><text x="330" y="60" font-size="24" fill="#fff" class="blink">?!</text>'
    };
    return svg('0 0 400 200', sc[name] || sc.classroom, 'scene story-' + name, 'story picture');
  };

  /* ---- Characters ---- */
  I.avatar = function (who) {
    var skin = '#ffcc80', hair = '#5d4037', shirt = '#22e1ff', extra = '';
    if (who === 'Mia') { hair = '#b71c1c'; shirt = '#ff5d8f'; extra = '<path d="M20 40 q-10 30 4 50" fill="' + hair + '"/><path d="M80 40 q10 30 -4 50" fill="' + hair + '"/>'; }
    if (who === 'Leo') { hair = '#212121'; shirt = '#3ddc84'; }
    return svg('0 0 100 110', extra + '<path d="M18 110 q0 -30 32 -30 q32 0 32 30z" fill="' + shirt + '" stroke="#0b0d2a" stroke-width="3"/><circle cx="50" cy="48" r="28" fill="' + skin + '" stroke="#0b0d2a" stroke-width="3"/><path d="M22 44 q4 -28 28 -28 q24 0 28 28 q-18 -14 -56 0z" fill="' + hair + '" stroke="#0b0d2a" stroke-width="3"/><circle cx="40" cy="52" r="3.5" fill="#0b0d2a"/><circle cx="60" cy="52" r="3.5" fill="#0b0d2a"/><path d="M40 64 q10 8 20 0" stroke="#0b0d2a" stroke-width="3" fill="none" stroke-linecap="round"/>', 'avatar', who);
  };
  I.chrono = function () {
    return svg('0 0 120 130', '<g class="float"><line x1="60" y1="8" x2="60" y2="26" stroke="#9fa8da" stroke-width="4"/><circle class="blink" cx="60" cy="8" r="6" fill="#ff5d8f"/><rect x="26" y="26" width="68" height="54" rx="14" fill="#7986cb" stroke="#0b0d2a" stroke-width="4"/><rect x="36" y="38" width="48" height="28" rx="8" fill="#0b1d3a"/><circle class="blink" cx="50" cy="52" r="6" fill="#22e1ff"/><circle class="blink" cx="70" cy="52" r="6" fill="#22e1ff"/><rect x="34" y="86" width="52" height="34" rx="10" fill="#3949ab" stroke="#0b0d2a" stroke-width="4"/><circle cx="60" cy="103" r="8" fill="#ff9f1c"/></g>', 'chrono', 'Chrono the robot');
  };
  I.glitch = function (hp) {
    return svg('0 0 140 140', '<g class="shake-slow"><path d="M20 120 q-10 -70 50 -90 q60 20 50 90 q-20 12 -50 0 q-30 12 -50 0z" fill="#ff5d8f" stroke="#0b0d2a" stroke-width="4"/><rect x="40" y="62" width="16" height="22" fill="#fff" stroke="#0b0d2a" stroke-width="3"/><rect x="82" y="62" width="16" height="22" fill="#fff" stroke="#0b0d2a" stroke-width="3"/><rect x="45" y="70" width="6" height="10" fill="#0b0d2a"/><rect x="87" y="70" width="6" height="10" fill="#0b0d2a"/><path d="M46 100 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8" fill="none" stroke="#0b0d2a" stroke-width="4"/><path d="M52 30 l-8 -18 l18 10z M88 30 l8 -18 l-18 10z" fill="#ffd54f" stroke="#0b0d2a" stroke-width="3"/></g>', 'glitch', 'Glitch, the boss');
  };
  I.chips = function () { return ''; };

  /* CSS shared with exported standalone SVG files */
  I.standaloneStyle = '<style>@keyframes f{50%{transform:translateY(-6px)}}@keyframes s{to{transform:rotate(360deg)}}@keyframes p{50%{opacity:.5}}.float{animation:f 3s ease-in-out infinite}.spin-slow{animation:s 12s linear infinite;transform-box:fill-box;transform-origin:center}.spin-rev{animation:s 8s linear infinite reverse;transform-box:fill-box;transform-origin:center}.pulse,.blink{animation:p 1.6s ease-in-out infinite}.mpart.off{opacity:.12}</style>';
})(typeof window !== 'undefined' ? window : globalThis);
