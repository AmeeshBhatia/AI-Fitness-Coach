# AI Fitness Coach

A personalised fitness web app that generates workout splits, 7-day meal plans and progress tracking from a user's body stats and goal.

**Zero dependencies.** No `npm install` needed — just Node.

---

## Quick start

```bash
cd ai-fitness-coach
npm start
```

Then open **http://localhost:3000**

To use a different port:

```bash
PORT=4000 npm start
```

To run the test suite (54 tests):

```bash
npm test
```

### Opening in VS Code

1. **File → Open Folder** → select `ai-fitness-coach`
2. Open a terminal (`` Ctrl+` ``) and run `npm start`
3. Or press **F5** and choose "Start server" (a launch config is included)

> **Why a server instead of just opening `index.html`?**
> The app uses native ES modules (`import`/`export`). Browsers block module
> loading over `file://` for security, so the page must be served over HTTP.
> `server.js` is a ~90-line zero-dependency static server that does exactly that.
> The Live Server VS Code extension also works — it's preconfigured to serve `/public`.

---

## Project structure

```
ai-fitness-coach/
├── package.json           # scripts only, no dependencies
├── server.js              # zero-dependency static file server
├── README.md
├── .vscode/               # launch configs, editor settings, extension hints
├── tests/
│   └── run-tests.js       # 54 tests, run with `npm test`
└── public/
    ├── index.html         # markup for every screen
    ├── css/
    │   └── styles.css     # complete stylesheet
    └── js/
        ├── app.js         # entry point — wires modules, boots the UI
        ├── data/          # content: no logic, no DOM
        │   ├── exercises.js   # 40 exercises w/ form tips & substitutions
        │   ├── workouts.js    # day templates + 20 weekly schedules
        │   ├── meals.js       # meal database for 3 diet types
        │   └── goals.js       # goal & activity-level definitions
        ├── lib/           # pure logic: no DOM, unit-testable in Node
        │   ├── calculations.js  # BMI, BMR, TDEE, macro targets
        │   ├── workoutEngine.js # plan generation, smart replacement
        │   ├── dietEngine.js    # 7-day meal plan + calorie scaling
        │   └── store.js         # state + localStorage persistence
        └── ui/            # DOM rendering only
            ├── router.js        # screen switching + tab bar
            ├── dom.js           # helpers ($, esc, renderOptions, modals)
            ├── onboarding.js    # the whole setup flow
            ├── todayView.js     # dashboard
            ├── workoutView.js   # weekly schedule + exercise list
            ├── dietView.js      # 7-day meal plan
            ├── progressView.js  # weight logging & trends
            ├── libraryView.js   # searchable exercise guide
            └── exerciseModal.js # exercise detail modal
```

The **data / lib / ui** separation is the important part: `lib` and `data`
contain no DOM access at all, which is why the test suite can import and
exercise them directly in Node with no browser or test framework.

---

## Features

### Onboarding
Height, weight, age, optional gender, and activity level. Users can skip
entirely and get a workout-only plan.

### Calculations
- **BMI** with WHO category
- **BMR** via the Mifflin-St Jeor equation (the current clinical standard)
- **TDEE** = BMR × activity multiplier (1.2 sedentary → 1.725 very active)
- **Target calories** adjusted by goal (e.g. −500 for fat loss, +300 for muscle)
- **Macros**: protein set per kg bodyweight, fat as a % of calories, carbs fill the rest
- A hard floor of 1200 kcal so no goal can prescribe an unsafe intake

### Workout plans
5 splits × 4 frequencies = **20 validated weekly schedules**:

| Split | 3 day | 4 day | 5 day | 6 day |
|---|---|---|---|---|
| Push Pull Legs | ✓ | ✓ | ✓ | ✓ |
| Bro Split | ✓ | ✓ | ✓ | ✓ |
| Upper Lower | ✓ | ✓ | ✓ | ✓ |
| Full Body | ✓ | ✓ | ✓ | ✓ |
| Arnold Split | ✓ | ✓ | ✓ | ✓ |

Each session lists exercise order, sets, reps, rest interval, and target muscle,
plus an estimated duration. Days can be regenerated, and sessions marked complete.

### Smart exercise replacement
Tapping **Replace** cycles through valid substitutes, preferring curated swaps
(Bench Press → Dumbbell Press) and falling back to other exercises hitting the
same muscle group. It never introduces a duplicate into the same session, and
the button disables itself when no valid swap remains.

### Diet planner
7-day plans for vegetarian, non-vegetarian and vegan, with per-meal and daily
calories/protein/carbs/fat. Portions scale to hit the calorie target; when a
target is too high for portion scaling alone (roughly 3000+ kcal), the engine
adds top-up snacks rather than inflating meals to unrealistic sizes.

### Progress tracking
Weekly weight logs with optional photo note, showing change since last log,
BMI change, total change, and workout completion percentage. Logging a new
weight also updates the stored profile so future BMI maths stay accurate.

### Exercise guide
All 40 exercises are searchable and filterable by muscle group, each with a
description, target muscle, equipment, three or more form tips and three or
more common mistakes.

### Persistence
Everything is saved to `localStorage`, so closing the tab and returning drops
the user straight back into their plan. **Reset All Data** in Settings clears it.

---

## Testing

```bash
npm test
```

The suite covers data integrity (every exercise reference resolves, no duplicate
exercises in a session, vegan meals contain no animal products, macro figures
reconcile with stated calories), calculation correctness (BMR and BMI verified
against hand-computed values, goal directions, the calorie floor, no negative
carbs at extreme inputs), all 20 split/frequency combinations, replacement and
regeneration invariants over repeated iterations, diet plans across five calorie
targets, and four end-to-end user journeys.

---

## Notes on extending this

**No AI API is used.** Plans come from the template/rule engine in `lib/`, so the
app runs offline at zero cost. If you later want live AI generation, the clean
place to add it is `workoutEngine.js` / `dietEngine.js` — swap the template
lookup for an API call behind the same function signatures and nothing in the
UI layer needs to change. Keep the template path as a fallback for when the API
is unavailable or rate-limited.

**Adding an exercise:** add an entry to `data/exercises.js` with a `primary`
muscle key that already exists in `RELATED_MUSCLES`. It's immediately available
in the library and as a substitution target. Run `npm test` to confirm.

**Adding meals:** add entries to the relevant `data/meals.js` slot array. The
tests will verify the macros reconcile with the stated calories.

**Going multi-user:** the app is entirely client-side. To add accounts you'd
add a backend and replace `lib/store.js` with an API-backed version — it's the
only module that touches persistence.

---

## Browser support

Any browser with ES module support: Chrome/Edge 61+, Firefox 60+, Safari 11+.
The layout is mobile-first and centred on desktop.

---

## Live demo

https://ai-fitness-coach-lemon.vercel.app

Deployed on Vercel from the `main` branch. Every push redeploys automatically.
