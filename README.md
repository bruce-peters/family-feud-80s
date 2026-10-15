# 80s Family Feud

A simple Family Feud game made for an APUSH class Decades Project, with 1980s-themed survey questions. One window is the host's control panel. A second window is the audience board you put on the projector.

**Live:** https://family-feud-80s.vercel.app

## How to play

1. Open the site on the laptop and click **HOST PANEL**.
2. Click **AUDIENCE BOARD** (or open `/board`) in a second window or tab **in the same browser**, and drag it to the projector.
3. The host types a team's guess and presses **Check** (or Enter). A fuzzy match reveals the answer on both screens. If nothing matches, press **STRIKE ✕**. The host can also click a slot to reveal it by hand.
4. Use **Award → TEAM 1 / TEAM 2** to give a team the round's pot. **Next ▶ / ◀ Prev** change rounds. You can also rename teams, set the active team, toggle answer hints, and play sound effects (correct, buzzer, clap, intro).

The host and board sync through the browser's `BroadcastChannel` API. There is no server, so both windows must be in the same browser on the same computer. The question order is shuffled when the host panel loads.

## Run it locally

**Prerequisites:** Node.js 20.19+ or 22.12+ (required by Vite 8), npm. No environment variables or API keys are needed.

```bash
git clone https://github.com/bruce-peters/family-feud-80s.git
cd family-feud-80s
npm ci            # or: npm install
npm run dev       # http://localhost:5173
```

Other commands:

```bash
npm run build     # type-check (tsc -b) + production build into dist/
npm run preview   # serve the production build
npm run lint      # ESLint
```

## Project structure

```
src/
  routes/
    Landing.tsx      # start page: links to /host and /board
    Host.tsx         # host control panel (guess check, strikes, scoring, rounds, sounds)
    BoardView.tsx    # audience board for the projector
  components/        # Board, AnswerSlot, StrikeOverlay, TeamPanel, DotMatrixNumber
  data/trivia.json   # the survey questions: { question, answers: [{ text, points }] }
  lib/
    channel.ts       # BroadcastChannel sync between host and board windows
    match.ts         # fuzzy answer matching (normalization + Levenshtein distance)
    sounds.ts        # sound effect playback
  store.ts           # game state (zustand)
public/sounds/       # correct / buzzer / clap / intro MP3s
vercel.json          # SPA rewrite so /host and /board work on refresh
```

To change the questions, edit `src/data/trivia.json`.
