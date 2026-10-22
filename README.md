# PAST SIMPLE — Time Travel Adventure

An offline, browser-based ESL grammar game for grades 7–8 (CEFR A2–B1). Pure HTML5, CSS3 and vanilla JavaScript: no frameworks, no server, no accounts, no external services.

## Run it
1. Unzip the folder.
2. Double-click **`index.html`** (works from `file://` in current Chrome, Edge, Firefox and Safari).
3. Optional: serve it with any static server, e.g. `python3 -m http.server` and open `http://localhost:8000`.

Progress is saved in the browser (localStorage) per nickname on that device. A nickname is the only thing asked for. If storage is blocked, the game still works for the session.

## The game
Repair the broken time machine by completing 5 missions (20 exercises):
| Level | Mission | Exercises |
|---|---|---|
| 1 | The Lost School Day — WAS / WERE | 1–6 |
| 2 | Yesterday's Portal — positive Past Simple | 7–10 |
| 3 | The Question Laboratory — negatives and questions | 11–15 |
| 4 | The Irregular Verb Forest | 16–18 |
| 5 | The Final Time Machine — mixed review | 19–20 |
| 6 (bonus) | The Time Master Challenge — harder practice, opens after missions 1–5 | 21–27 |

All missions and exercises are open from the start, so students can move freely between tasks (to restore step-by-step unlocking set `P.freeNavigation = false` in `js/progress.js`). The certificate still needs all 20 exercises of missions 1–5. The **bonus mission 6** (exercises 21–27: Irregular Verb Master, Wrong Form Detective, The Iceland Conversation, Write B's Question, Last or Ago?, The Secret of the Old Barn, Danish → English) stays locked until all five missions are complete, even with free navigation, and earns the 👑 Time Master badge.

Each level has an animated intro, visual grammar cards, exercises with hints and explanations, a results screen and the next-mission transition. Finished missions can be replayed and mistakes retried.

**Scoring:** 10 points for a correct first try, 5 after a retry, 0 for a revealed answer, never negative. Open tasks (speaking, writing, mystery) give completion credit. Stars: 3 / 2 / 1 by closed-answer accuracy. There is no timer except the optional rapid-recall round in Ex16.

## Teacher Mode (🧑‍🏫 button, top right)
All 20 exercises with answer keys and model answers, grammar summaries, objective, estimated time, pair-work instructions; play any exercise without saving; whiteboard display and presentation mode; printable worksheets and answer key; reset progress (with confirmation).

## Accessibility
Everything works with the keyboard (tiles: click/Enter to move, ←/→ to reorder, Backspace to remove — drag is optional). Visible focus, screen-reader announcements, reduced-motion (OS setting or 🐢 toggle), large-text presentation mode, sound off by default, responsive layout, print stylesheet.

## Files
```
index.html            entry point
css/                  style.css (theme/screens), game.css (exercises), responsive.css (modes, print)
js/questions.js       ALL content: levels, explanations, exercises, answers, hints
js/validation.js      answer normalisation, rule-based feedback, writing checker
js/progress.js        profiles, scoring, unlocking, badges, localStorage
js/game-engine.js     exercise runner + choice/rewrite/typing/gapfill/tiles/detective/boss
js/engine-*.js        gap stories, memory/verbs, speaking/writing/mystery
js/explain.js         grammar cards      js/illustrations.js  original SVG art
js/app.js, screens-play.js, teacher-mode.js   router, screens, teacher tools
assets/               exported SVG illustrations and icons
tools/                check-content.js (content tests), build-assets.js (export SVGs), make-content-map.js
content-map.md        exercise → source topic → implementation
```

## Editing content
Open `js/questions.js`. Each exercise has `items` with `answers` (all accepted variants), `hint` and `explain`. Answers ignore case, extra spaces and curly apostrophes, and accept contractions or full forms. After editing run `node tools/check-content.js` (should report 0 failures).

## Notes
Writing feedback is a word/pattern checker (verb counts, linkers, negatives, questions), not a grammar verdict; the teacher should read student texts. All wording and art are original.
