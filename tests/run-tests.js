/**
 * TEST SUITE
 *
 * Run with:  npm test
 *
 * These tests import the same modules the browser uses. The data and lib
 * layers are deliberately free of DOM access so they run directly in Node.
 */

import { EXERCISES, RELATED_MUSCLES, MUSCLE_LABELS } from "../public/js/data/exercises.js";
import { DAY_TYPES, SPLITS, WEEKDAYS, TRAINING_DAY_OPTIONS, restSeconds } from "../public/js/data/workouts.js";
import {
  MEALS, SLOTS, SLOT_LABELS, DIET_TYPES, NONVEG_DISHES, nonVegSlotForDay
} from "../public/js/data/meals.js";
import { GOALS, ACTIVITY_LEVELS, getGoal, getActivityLevel } from "../public/js/data/goals.js";

import {
  calcBMI, bmiCategory, calcBMR, calcTDEE, calcTargets,
  buildCalculations, macroSplitPercentages
} from "../public/js/lib/calculations.js";
import {
  generateWorkoutPlan, regenerateDay, replaceExercise, getAlternatives,
  completionPercentage, totalSets, estimatedDuration, todayName
} from "../public/js/lib/workoutEngine.js";
import { generateDietPlan, weeklyAverages } from "../public/js/lib/dietEngine.js";

/* ---------------- tiny test harness ---------------- */

let passed = 0;
const failures = [];
let currentSuite = "";

function suite(name) {
  currentSuite = name;
  console.log(`\n  ${name}`);
}

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`    ok  ${name}`);
  } catch (err) {
    failures.push(`${currentSuite} > ${name}: ${err.message}`);
    console.log(`    FAIL  ${name}`);
    console.log(`          ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || "assertion failed");
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message || "values differ"} — expected ${expected}, got ${actual}`);
  }
}

function assertBetween(value, min, max, message) {
  if (!(value >= min && value <= max)) {
    throw new Error(`${message || "out of range"} — ${value} not in [${min}, ${max}]`);
  }
}

/* ================= DATA INTEGRITY ================= */

suite("Data integrity: exercises");

test("every exercise has all required fields", () => {
  Object.entries(EXERCISES).forEach(([id, ex]) => {
    assert(typeof ex.name === "string" && ex.name.length > 0, `${id} missing name`);
    assert(typeof ex.primary === "string" && ex.primary.length > 0, `${id} missing primary`);
    assert(typeof ex.muscle === "string" && ex.muscle.length > 0, `${id} missing muscle`);
    assert(typeof ex.equipment === "string" && ex.equipment.length > 0, `${id} missing equipment`);
    assert(typeof ex.desc === "string" && ex.desc.length > 20, `${id} description too short`);
    assert(Array.isArray(ex.tips) && ex.tips.length >= 3, `${id} needs at least 3 form tips`);
    assert(Array.isArray(ex.mistakes) && ex.mistakes.length >= 3, `${id} needs at least 3 mistakes`);
    assert(Array.isArray(ex.alts), `${id} missing alts array`);
  });
});

test("every curated alternative points at a real exercise", () => {
  Object.entries(EXERCISES).forEach(([id, ex]) => {
    ex.alts.forEach((altId) => {
      assert(EXERCISES[altId], `${id} references unknown alternative '${altId}'`);
      assert(altId !== id, `${id} lists itself as an alternative`);
    });
  });
});

test("every primary muscle has a related-group and a label", () => {
  Object.entries(EXERCISES).forEach(([id, ex]) => {
    assert(RELATED_MUSCLES[ex.primary], `no RELATED_MUSCLES entry for '${ex.primary}' (${id})`);
    assert(MUSCLE_LABELS[ex.primary], `no MUSCLE_LABELS entry for '${ex.primary}' (${id})`);
  });
});

test("every exercise has at least one valid substitute", () => {
  Object.keys(EXERCISES).forEach((id) => {
    assert(getAlternatives(id).length > 0, `${id} has no possible substitute`);
  });
});

test("substitutes train the same or a related muscle group", () => {
  Object.keys(EXERCISES).forEach((id) => {
    const related = RELATED_MUSCLES[EXERCISES[id].primary];
    getAlternatives(id).forEach((altId) => {
      const altPrimary = EXERCISES[altId].primary;
      const curated = EXERCISES[id].alts.includes(altId);
      // Curated swaps may cross into a neighbouring group by design
      // (e.g. dips -> close-grip bench). Non-curated must stay in group.
      if (!curated) {
        assert(
          related.includes(altPrimary),
          `${id} -> ${altId} leaves the muscle group (${altPrimary})`
        );
      }
    });
  });
});

suite("Data integrity: workout templates");

test("every day type references real exercises", () => {
  Object.entries(DAY_TYPES).forEach(([key, dayType]) => {
    dayType.exs.forEach(([exId, sets, reps]) => {
      assert(EXERCISES[exId], `DAY_TYPES.${key} references unknown exercise '${exId}'`);
      assert(Number.isInteger(sets) && sets > 0, `DAY_TYPES.${key} bad sets for ${exId}`);
      assert(String(reps).length > 0, `DAY_TYPES.${key} missing reps for ${exId}`);
    });
  });
});

test("no day type repeats the same exercise twice", () => {
  Object.entries(DAY_TYPES).forEach(([key, dayType]) => {
    const ids = dayType.exs.map((r) => r[0]);
    assertEqual(new Set(ids).size, ids.length, `DAY_TYPES.${key} contains a duplicate exercise`);
  });
});

test("all splits define 3/4/5/6-day schedules of exactly 7 days", () => {
  Object.entries(SPLITS).forEach(([splitKey, split]) => {
    assert(split.label && split.blurb, `${splitKey} missing label or blurb`);
    TRAINING_DAY_OPTIONS.forEach((days) => {
      const schedule = split.schedules[days];
      assert(schedule, `${splitKey} has no ${days}-day schedule`);
      assertEqual(schedule.length, 7, `${splitKey}/${days} schedule length`);
    });
  });
});

test("each schedule contains exactly the promised number of training days", () => {
  Object.entries(SPLITS).forEach(([splitKey, split]) => {
    TRAINING_DAY_OPTIONS.forEach((days) => {
      const training = split.schedules[days].filter((d) => d !== "Rest");
      assertEqual(training.length, days, `${splitKey}/${days} training day count`);
    });
  });
});

test("every scheduled day type exists in DAY_TYPES", () => {
  Object.entries(SPLITS).forEach(([splitKey, split]) => {
    TRAINING_DAY_OPTIONS.forEach((days) => {
      split.schedules[days].forEach((typeKey) => {
        assert(DAY_TYPES[typeKey], `${splitKey}/${days} references unknown day type '${typeKey}'`);
      });
    });
  });
});

test("rest intervals scale with intensity", () => {
  assert(restSeconds(4, "6") > restSeconds(3, "15"), "heavy compounds should rest longer");
  assertBetween(restSeconds(4, "6"), 90, 180, "heavy compound rest");
  assertBetween(restSeconds(3, "15"), 45, 90, "high-rep accessory rest");
});

suite("Data integrity: meals and goals");

test("every diet type has 4 slots with at least 4 options each", () => {
  DIET_TYPES.forEach(({ id }) => {
    assert(MEALS[id], `no meal data for diet type '${id}'`);
    SLOTS.forEach((slot) => {
      const options = MEALS[id][slot];
      assert(Array.isArray(options), `${id}.${slot} missing`);
      assert(options.length >= 4, `${id}.${slot} needs at least 4 options, has ${options.length}`);
    });
  });
});

test("every meal has plausible macros that roughly match its calories", () => {
  Object.entries(MEALS).forEach(([dietType, slots]) => {
    Object.entries(slots).forEach(([slot, options]) => {
      options.forEach((meal) => {
        assert(meal.name && meal.name.length > 3, `${dietType}.${slot} meal missing name`);
        assertBetween(meal.kcal, 100, 800, `${meal.name} calories`);
        assert(meal.p >= 0 && meal.c >= 0 && meal.f >= 0, `${meal.name} has a negative macro`);

        // Calories from macros should be within 20% of the stated total
        const fromMacros = meal.p * 4 + meal.c * 4 + meal.f * 9;
        const drift = Math.abs(fromMacros - meal.kcal) / meal.kcal;
        assert(drift < 0.2, `${meal.name}: macros imply ${fromMacros} kcal vs stated ${meal.kcal}`);
      });
    });
  });
});

// Word-boundary matching matters here: "veggie" contains the letters "egg",
// and "eggplant" isn't an egg, so a naive substring test gives false alarms.
// Note: "keema" and "biryani" are deliberately NOT here — "Soya Keema" is
// soya mince and biryani can be vegetarian. The animal itself is the signal.
const MEAT_WORDS = /\b(chicken|beef|mutton|lamb|pork|salmon|tuna|cod|fish|turkey|sausage|steak|prawn)\b/i;
const EGG_WORDS = /\b(egg|eggs|omelette|omelet|bhurji anda|anda)\b/i;
const DAIRY_WORDS = /\b(paneer|curd|yogurt|yoghurt|cheese|milk|buttermilk|ghee|butter|kadhi|whey|lassi)\b/i;

test("vegetarian meals contain no meat, fish or egg", () => {
  Object.entries(MEALS.veg).forEach(([slot, options]) => {
    options.forEach((meal) => {
      assert(!MEAT_WORDS.test(meal.name), `veg ${slot} "${meal.name}" contains meat/fish`);
      assert(!EGG_WORDS.test(meal.name), `veg ${slot} "${meal.name}" contains egg`);
      assert(!meal.nonveg, `veg ${slot} "${meal.name}" is flagged non-veg`);
    });
  });
});

test("vegan meals contain no meat, egg or dairy", () => {
  Object.entries(MEALS.vegan).forEach(([slot, options]) => {
    options.forEach((meal) => {
      assert(!MEAT_WORDS.test(meal.name), `vegan ${slot} "${meal.name}" contains meat/fish`);
      assert(!EGG_WORDS.test(meal.name), `vegan ${slot} "${meal.name}" contains egg`);
      // "Soya Milk" and "Peanut Butter" are plant-based, so allow those
      const name = meal.name.toLowerCase();
      const plantException = /soya milk|soy milk|peanut butter|almond|coconut milk/.test(name);
      assert(
        !DAIRY_WORDS.test(meal.name) || plantException,
        `vegan ${slot} "${meal.name}" contains dairy`
      );
    });
  });
});

test("every non-veg dish is flagged and sits in lunch or dinner only", () => {
  const slots = Object.keys(NONVEG_DISHES);
  assertEqual(slots.sort().join(","), "dinner,lunch", "non-veg slots");

  slots.forEach((slot) => {
    const options = NONVEG_DISHES[slot];
    assert(options.length >= 4, `NONVEG_DISHES.${slot} needs at least 4 options`);
    options.forEach((dish) => {
      assert(dish.nonveg === true, `"${dish.name}" is missing the nonveg flag`);
      assert(
        MEAT_WORDS.test(dish.name) || EGG_WORDS.test(dish.name),
        `"${dish.name}" is in the non-veg list but reads vegetarian`
      );
      assertBetween(dish.kcal, 300, 800, `${dish.name} calories`);
      const fromMacros = dish.p * 4 + dish.c * 4 + dish.f * 9;
      const drift = Math.abs(fromMacros - dish.kcal) / dish.kcal;
      assert(drift < 0.2, `${dish.name}: macros imply ${fromMacros} kcal vs stated ${dish.kcal}`);
    });
  });
});

test("the non-veg slot alternates across the week", () => {
  const week = [0, 1, 2, 3, 4, 5, 6].map(nonVegSlotForDay);
  week.forEach((slot) => assert(slot === "lunch" || slot === "dinner", `bad slot ${slot}`));
  assert(week.includes("lunch") && week.includes("dinner"), "should use both lunch and dinner");
  for (let i = 0; i < week.length - 1; i++) {
    assert(week[i] !== week[i + 1], `days ${i} and ${i + 1} both use ${week[i]}`);
  }
});

test("every goal and activity level is well formed", () => {
  GOALS.forEach((g) => {
    assert(g.id && g.label && g.blurb, `goal ${g.id} missing fields`);
    assertBetween(g.calorieDelta, -800, 800, `goal ${g.id} calorieDelta`);
    assertBetween(g.proteinPerKg, 1.2, 2.5, `goal ${g.id} proteinPerKg`);
    assertBetween(g.fatPct, 0.15, 0.4, `goal ${g.id} fatPct`);
  });
  ACTIVITY_LEVELS.forEach((a) => {
    assertBetween(a.multiplier, 1.1, 2.0, `activity ${a.id} multiplier`);
  });
});

/* ================= CALCULATIONS ================= */

suite("Calculations");

test("BMI matches the known formula", () => {
  assertEqual(calcBMI(70, 175), 22.9, "70kg at 175cm");
  assertEqual(calcBMI(100, 200), 25, "100kg at 200cm");
});

test("BMI categories map to WHO thresholds", () => {
  assertEqual(bmiCategory(17), "Underweight");
  assertEqual(bmiCategory(22), "Healthy range");
  assertEqual(bmiCategory(27), "Overweight");
  assertEqual(bmiCategory(33), "Obese range");
});

test("BMR matches Mifflin-St Jeor by hand", () => {
  // 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
  assertEqual(calcBMR(80, 180, 30, "male"), 1780, "male");
  // 800 + 1125 - 150 - 161 = 1614
  assertEqual(calcBMR(80, 180, 30, "female"), 1614, "female");
  // unspecified sits between the two
  const unspecified = calcBMR(80, 180, 30, "");
  assert(unspecified > 1614 && unspecified < 1780, "unspecified should sit between male and female");
});

test("TDEE applies the activity multiplier", () => {
  assertEqual(calcTDEE(2000, "sedentary"), 2400);
  assertEqual(calcTDEE(2000, "moderate"), 3100);
  // unknown ids fall back to moderate rather than producing NaN
  assertEqual(calcTDEE(2000, "nonsense"), 3100);
});

test("goal direction is respected for calorie targets", () => {
  const tdee = 2800;
  assert(calcTargets(tdee, "lose_fat", 80).target < tdee, "lose_fat should be a deficit");
  assert(calcTargets(tdee, "build_muscle", 80).target > tdee, "build_muscle should be a surplus");
  assert(calcTargets(tdee, "strength", 80).target > tdee, "strength should be a slight surplus");
  assertEqual(calcTargets(tdee, "stay_fit", 80).target, tdee, "stay_fit should be maintenance");
});

test("protein target follows the goal's per-kg prescription", () => {
  assertEqual(calcTargets(2800, "lose_fat", 80).protein, 160, "2.0 g/kg at 80kg");
  assertEqual(calcTargets(2800, "stay_fit", 80).protein, 128, "1.6 g/kg at 80kg");
});

test("macro calories reconcile with the calorie target", () => {
  GOALS.forEach((goal) => {
    const t = calcTargets(2800, goal.id, 80);
    const fromMacros = t.protein * 4 + t.carbs * 4 + t.fat * 9;
    const drift = Math.abs(fromMacros - t.target) / t.target;
    assert(drift < 0.03, `${goal.id}: macros imply ${fromMacros} kcal vs target ${t.target}`);
  });
});

test("calorie floor protects very small deficits", () => {
  // Tiny person on an aggressive deficit must never drop below 1200
  const t = calcTargets(1300, "lose_fat", 45);
  assert(t.target >= 1200, `target fell to ${t.target}`);
});

test("no goal produces negative carbohydrate", () => {
  GOALS.forEach((goal) => {
    // Worst case: heavy person on a low calorie target
    const t = calcTargets(1600, goal.id, 120);
    assert(t.carbs >= 0, `${goal.id} produced negative carbs (${t.carbs})`);
  });
});

test("buildCalculations runs the whole chain", () => {
  const calc = buildCalculations(
    { height: 178, weight: 82, age: 24, gender: "male", activity: "moderate" },
    "build_muscle"
  );
  assertEqual(calc.bmi, 25.9);
  assertEqual(calc.bmiCategory, "Overweight");
  assertBetween(calc.bmr, 1700, 1900, "bmr");
  assertBetween(calc.tdee, 2600, 3000, "tdee");
  assert(calc.target > calc.tdee, "build_muscle target should exceed maintenance");
  assertEqual(calc.protein, 148, "1.8 g/kg at 82kg");
});

test("buildCalculations returns null when details are missing", () => {
  assertEqual(buildCalculations(null, "lose_fat"), null);
  assertEqual(buildCalculations({ height: 170 }, "lose_fat"), null);
});

test("macro split percentages total about 100", () => {
  const pct = macroSplitPercentages({ protein: 150, carbs: 300, fat: 70 });
  const total = pct.protein + pct.carbs + pct.fat;
  assertBetween(total, 99, 101, "percentage total");
});

/* ================= WORKOUT ENGINE ================= */

suite("Workout engine");

test("generates a valid plan for all 20 split/frequency combinations", () => {
  Object.keys(SPLITS).forEach((splitKey) => {
    TRAINING_DAY_OPTIONS.forEach((days) => {
      const { schedule, plan } = generateWorkoutPlan(splitKey, days);

      assertEqual(schedule.length, 7, `${splitKey}/${days} schedule length`);
      assertEqual(Object.keys(plan).length, 7, `${splitKey}/${days} plan length`);

      WEEKDAYS.forEach((weekday) => {
        const day = plan[weekday];
        assert(day, `${splitKey}/${days} missing ${weekday}`);
        assert(day.typeLabel, `${splitKey}/${days}/${weekday} missing label`);

        if (day.typeKey === "Rest") {
          assertEqual(day.exercises.length, 0, `rest day should have no exercises`);
        } else {
          assert(day.exercises.length >= 4, `${weekday} has only ${day.exercises.length} exercises`);
          day.exercises.forEach((ex, i) => {
            assert(EXERCISES[ex.id], `unknown exercise '${ex.id}'`);
            assertEqual(ex.order, i + 1, "exercise order should be sequential");
            assert(ex.rest > 0, "rest interval must be positive");
            assert(Number(ex.sets) > 0, "sets must be positive");
          });
        }
      });
    });
  });
});

test("training day count in generated plans matches the user's choice", () => {
  Object.keys(SPLITS).forEach((splitKey) => {
    TRAINING_DAY_OPTIONS.forEach((days) => {
      const { plan } = generateWorkoutPlan(splitKey, days);
      const training = WEEKDAYS.filter((d) => plan[d].typeKey !== "Rest");
      assertEqual(training.length, days, `${splitKey}/${days}`);
    });
  });
});

test("unknown splits and frequencies throw rather than silently failing", () => {
  let threw = false;
  try { generateWorkoutPlan("not_a_split", 4); } catch { threw = true; }
  assert(threw, "unknown split should throw");

  threw = false;
  try { generateWorkoutPlan("ppl", 9); } catch { threw = true; }
  assert(threw, "unsupported day count should throw");
});

test("regenerating a day keeps the prescription and yields valid exercises", () => {
  const { plan } = generateWorkoutPlan("ppl", 6);
  const before = plan.Monday;

  for (let i = 0; i < 30; i++) {
    const after = regenerateDay(before);

    assertEqual(after.typeKey, before.typeKey, "day type should not change");
    assertEqual(after.exercises.length, before.exercises.length, "exercise count should not change");

    after.exercises.forEach((ex, idx) => {
      assert(EXERCISES[ex.id], `regenerate produced unknown exercise '${ex.id}'`);
      assertEqual(ex.sets, before.exercises[idx].sets, "sets should be preserved");
      assertEqual(ex.reps, before.exercises[idx].reps, "reps should be preserved");
    });

    const ids = after.exercises.map((e) => e.id);
    assertEqual(new Set(ids).size, ids.length, "regenerate produced a duplicate exercise");
  }
});

test("regenerating a rest day is a no-op", () => {
  const { plan } = generateWorkoutPlan("ppl", 3);
  const rest = plan.Tuesday;
  assertEqual(rest.typeKey, "Rest", "expected Tuesday to be a rest day on 3-day PPL");
  assertEqual(regenerateDay(rest), rest, "rest day should be returned unchanged");
});

test("replacing an exercise swaps to a valid, non-duplicate substitute", () => {
  const { plan } = generateWorkoutPlan("ppl", 6);
  let day = plan.Monday;
  const originalId = day.exercises[0].id;

  day = replaceExercise(day, 0);
  const newId = day.exercises[0].id;

  assert(newId !== originalId, "replacement should change the exercise");
  assert(EXERCISES[newId], "replacement must be a real exercise");

  const ids = day.exercises.map((e) => e.id);
  assertEqual(new Set(ids).size, ids.length, "replacement created a duplicate in the session");
});

test("repeated replacement cycles without corrupting the session", () => {
  const { plan } = generateWorkoutPlan("bro", 5);
  let day = plan.Monday;

  for (let i = 0; i < 40; i++) {
    const index = i % day.exercises.length;
    day = replaceExercise(day, index);

    assertEqual(day.exercises.length, plan.Monday.exercises.length, "exercise count changed");
    day.exercises.forEach((ex) => assert(EXERCISES[ex.id], `invalid exercise '${ex.id}'`));

    const ids = day.exercises.map((e) => e.id);
    assertEqual(new Set(ids).size, ids.length, `duplicate after ${i + 1} replacements`);
  }
});

test("replacement is safe on an out-of-range index", () => {
  const { plan } = generateWorkoutPlan("ppl", 6);
  const day = plan.Monday;
  assertEqual(replaceExercise(day, 99), day, "should return the day unchanged");
});

test("completion percentage reflects training days only", () => {
  const { plan } = generateWorkoutPlan("ppl", 6); // 6 training days, Sunday rest

  assertEqual(completionPercentage(plan, {}), 0, "nothing done");
  assertEqual(completionPercentage(plan, { Monday: true }), 17, "1 of 6");
  assertEqual(completionPercentage(plan, {
    Monday: true, Tuesday: true, Wednesday: true
  }), 50, "3 of 6");
  assertEqual(completionPercentage(plan, {
    Monday: true, Tuesday: true, Wednesday: true,
    Thursday: true, Friday: true, Saturday: true
  }), 100, "all 6");

  // Ticking a rest day must not push completion above 100
  assertEqual(completionPercentage(plan, {
    Monday: true, Tuesday: true, Wednesday: true,
    Thursday: true, Friday: true, Saturday: true, Sunday: true
  }), 100, "rest day should not count");
});

test("completion percentage handles a missing plan", () => {
  assertEqual(completionPercentage(null, {}), 0);
});

test("set counts and duration estimates are sensible", () => {
  const { plan } = generateWorkoutPlan("ppl", 6);
  const push = plan.Monday;

  assertBetween(totalSets(push), 12, 30, "total sets in a push session");
  assertBetween(estimatedDuration(push), 30, 100, "estimated minutes");
  assertEqual(totalSets(plan.Sunday), 0, "rest day sets");
  assertEqual(estimatedDuration(plan.Sunday), 0, "rest day duration");
});

test("todayName maps JS weekdays onto a Monday-first week", () => {
  assertEqual(todayName(new Date("2026-07-20T12:00:00")), "Monday");
  assertEqual(todayName(new Date("2026-07-25T12:00:00")), "Saturday");
  assertEqual(todayName(new Date("2026-07-26T12:00:00")), "Sunday");
  assert(WEEKDAYS.includes(todayName()), "today should be a valid weekday");
});

/* ================= DIET ENGINE ================= */

suite("Diet engine");

test("generates 7 days with the four core meals for every diet type", () => {
  DIET_TYPES.forEach(({ id }) => {
    const plan = generateDietPlan(id, 2500);
    assertEqual(Object.keys(plan).length, 7, `${id} day count`);

    for (let day = 0; day < 7; day++) {
      const dayPlan = plan[day];
      assert(dayPlan.meals.length >= 4, `${id} day ${day} meal count`);

      // The first four entries are always the core slots, in order
      const coreSlots = dayPlan.meals.slice(0, 4).map((m) => m.slot);
      assertEqual(coreSlots.join(","), SLOTS.join(","), `${id} day ${day} core slot order`);

      // Anything beyond the core four is a calorie top-up snack
      dayPlan.meals.slice(4).forEach((m) => {
        assertEqual(m.slot, "extra", `${id} day ${day} unexpected extra slot '${m.slot}'`);
      });

      dayPlan.meals.forEach((m) => {
        assert(SLOT_LABELS[m.slot], `${id} day ${day} slot '${m.slot}' has no label`);
        assert(m.name && m.name.length > 3, `${id} day ${day} meal missing name`);
        assert(m.kcal > 0 && m.p >= 0 && m.c >= 0 && m.f >= 0, `${id} day ${day} bad macros`);
      });
    }
  });
});

test("non-veg plans contain exactly ONE non-veg meal per day", () => {
  [1600, 2200, 2800, 3200].forEach((target) => {
    [0, 1, 2, 3].forEach((offset) => {
      const plan = generateDietPlan("nonveg", target, offset);
      for (let day = 0; day < 7; day++) {
        const meals = plan[day].meals;
        const flagged = meals.filter((m) => m.nonveg);

        assertEqual(
          flagged.length, 1,
          `nonveg ${target}kcal offset${offset} day${day}: ${flagged.length} non-veg meals ` +
          `(${meals.map((m) => m.name).join(" | ")})`
        );

        // and it must sit in the expected slot
        assertEqual(flagged[0].slot, nonVegSlotForDay(day), `day${day} non-veg slot`);

        // every other meal must read vegetarian
        meals.filter((m) => !m.nonveg).forEach((m) => {
          assert(!MEAT_WORDS.test(m.name), `day${day} veg meal "${m.name}" contains meat`);
          assert(!EGG_WORDS.test(m.name), `day${day} veg meal "${m.name}" contains egg`);
        });
      }
    });
  });
});

test("top-up snacks never add a second non-veg meal", () => {
  // High targets trigger extra snacks; those come from the veg snack pool
  const plan = generateDietPlan("nonveg", 3600, 0);
  for (let day = 0; day < 7; day++) {
    const extras = plan[day].meals.filter((m) => m.slot === "extra");
    extras.forEach((m) => assert(!m.nonveg, `top-up "${m.name}" is non-veg`));
    assertEqual(plan[day].meals.filter((m) => m.nonveg).length, 1, `day${day} non-veg count`);
  }
});

test("vegetarian and vegan plans never contain a non-veg meal", () => {
  ["veg", "vegan"].forEach((type) => {
    [1800, 2400, 3200].forEach((target) => {
      const plan = generateDietPlan(type, target);
      for (let day = 0; day < 7; day++) {
        plan[day].meals.forEach((m) => {
          assert(!m.nonveg, `${type} day${day} "${m.name}" flagged non-veg`);
          assert(!MEAT_WORDS.test(m.name), `${type} day${day} "${m.name}" contains meat`);
          assert(!EGG_WORDS.test(m.name), `${type} day${day} "${m.name}" contains egg`);
        });
      }
    });
  });
});

test("plans are recognisably Indian and budget-oriented", () => {
  // Guard against the meal DB drifting back to salmon-and-quinoa territory
  const staples = /(dal|dahl|rajma|chole|chana|paneer|tofu|soya|roti|rice|poha|upma|idli|sambar|khichdi|paratha|chilla|curd|sprouts|peanut|besan|bhurji|baingan|lauki|kadhi|murmura|jaggery|biryani|tikka|keema)/i;
  DIET_TYPES.forEach(({ id }) => {
    const plan = generateDietPlan(id, 2400);
    for (let day = 0; day < 7; day++) {
      plan[day].meals.forEach((m) => {
        assert(staples.test(m.name), `${id} day${day} "${m.name}" doesn't look like an Indian staple`);
      });
    }
  });
});

test("moderate targets need no top-up snacks", () => {
  DIET_TYPES.forEach(({ id }) => {
    const plan = generateDietPlan(id, 2200);
    for (let day = 0; day < 7; day++) {
      assertEqual(plan[day].meals.length, 4, `${id} day ${day} should need no top-ups at 2200 kcal`);
    }
  });
});

test("high targets are met by adding snacks, not inflating meals", () => {
  const plan = generateDietPlan("veg", 3200);
  let sawTopUp = false;

  for (let day = 0; day < 7; day++) {
    const meals = plan[day].meals;
    if (meals.length > 4) sawTopUp = true;
    meals.forEach((m) => {
      assertBetween(m.kcal, 100, 1100, `meal "${m.name}" at a 3200 kcal target`);
    });
  }
  assert(sawTopUp, "a 3200 kcal vegetarian target should require top-up snacks");
});

test("daily totals equal the sum of the day's meals", () => {
  DIET_TYPES.forEach(({ id }) => {
    const plan = generateDietPlan(id, 2400);
    for (let day = 0; day < 7; day++) {
      const { meals, totals } = plan[day];
      const sum = meals.reduce(
        (t, m) => ({ kcal: t.kcal + m.kcal, p: t.p + m.p, c: t.c + m.c, f: t.f + m.f }),
        { kcal: 0, p: 0, c: 0, f: 0 }
      );
      assertEqual(totals.kcal, sum.kcal, `${id} day ${day} calorie total`);
      assertEqual(totals.p, sum.p, `${id} day ${day} protein total`);
      assertEqual(totals.c, sum.c, `${id} day ${day} carb total`);
      assertEqual(totals.f, sum.f, `${id} day ${day} fat total`);
    }
  });
});

test("plans land near the calorie target across realistic targets", () => {
  [1600, 2000, 2400, 2800, 3200].forEach((target) => {
    DIET_TYPES.forEach(({ id }) => {
      const plan = generateDietPlan(id, target);
      for (let day = 0; day < 7; day++) {
        const kcal = plan[day].totals.kcal;
        const drift = Math.abs(kcal - target) / target;
        assert(drift < 0.2, `${id} at ${target} kcal: day ${day} came out at ${kcal}`);
      }
    });
  });
});

test("portion scaling stays within realistic bounds at extreme targets", () => {
  // A 6000 kcal target must not prescribe a comical portion size
  const plan = generateDietPlan("nonveg", 6000);
  for (let day = 0; day < 7; day++) {
    plan[day].meals.forEach((m) => {
      assertBetween(m.kcal, 100, 1300, `meal "${m.name}" at a 6000 kcal target`);
    });
  }
});

test("regenerating with a new offset changes the meals", () => {
  const first = generateDietPlan("veg", 2400, 0);
  const second = generateDietPlan("veg", 2400, 1);

  let differences = 0;
  for (let day = 0; day < 7; day++) {
    first[day].meals.forEach((meal, i) => {
      if (meal.name !== second[day].meals[i].name) differences++;
    });
  }
  assert(differences > 0, "changing the offset should change at least one meal");
});

test("consecutive days are not identical", () => {
  DIET_TYPES.forEach(({ id }) => {
    const plan = generateDietPlan(id, 2400);
    for (let day = 0; day < 6; day++) {
      const a = plan[day].meals.map((m) => m.name).join("|");
      const b = plan[day + 1].meals.map((m) => m.name).join("|");
      assert(a !== b, `${id}: day ${day} and ${day + 1} are identical`);
    }
  });
});

test("unknown diet types throw", () => {
  let threw = false;
  try { generateDietPlan("carnivore", 2400); } catch { threw = true; }
  assert(threw, "unknown diet type should throw");
});

test("weekly averages sit within the daily range", () => {
  const plan = generateDietPlan("nonveg", 2600);
  const avg = weeklyAverages(plan);

  const dailyCalories = Object.values(plan).map((d) => d.totals.kcal);
  assertBetween(avg.kcal, Math.min(...dailyCalories), Math.max(...dailyCalories), "average calories");
  assert(avg.p > 0 && avg.c > 0 && avg.f > 0, "average macros should be positive");
});

/* ================= END-TO-END FLOW ================= */

suite("End-to-end user journeys");

test("full onboarding: details -> goal -> plan -> diet -> tracking", () => {
  const profile = { height: 178, weight: 82, age: 24, gender: "male", activity: "moderate" };
  const calc = buildCalculations(profile, "build_muscle");
  assert(calc, "calculations should be produced");

  const { plan } = generateWorkoutPlan("ppl", 6);
  const diet = generateDietPlan("nonveg", calc.target);

  // Complete three sessions
  const completed = { Monday: true, Tuesday: true, Wednesday: true };
  assertEqual(completionPercentage(plan, completed), 50, "3 of 6 sessions");

  // Diet should track the calculated target
  const drift = Math.abs(diet[0].totals.kcal - calc.target) / calc.target;
  assert(drift < 0.2, `diet day 0 (${diet[0].totals.kcal}) vs target ${calc.target}`);

  // Progress logging maths
  const startWeight = 82;
  const newWeight = 83.1;
  const newBmi = calcBMI(newWeight, profile.height);
  assert(newBmi > calc.bmi, "gaining weight should raise BMI");
  assertEqual(Math.round((newWeight - startWeight) * 10) / 10, 1.1, "weight delta");
});

test("skip-onboarding path produces a workout plan with no diet data", () => {
  // Skipping means no profile, so no calculations
  assertEqual(buildCalculations(null, null), null, "no calculations without a profile");

  // A workout plan should still generate fine
  const { plan } = generateWorkoutPlan("upper_lower", 4);
  const training = WEEKDAYS.filter((d) => plan[d].typeKey !== "Rest");
  assertEqual(training.length, 4, "4 training days");

  // And the diet engine still works if they add preferences later,
  // falling back to a sensible default target
  const diet = generateDietPlan("veg", null);
  assertEqual(Object.keys(diet).length, 7, "fallback diet plan");
  assert(diet[0].totals.kcal > 1200, "fallback plan should be a usable calorie level");
});

test("fat-loss journey: deficit, protein held high, BMI trending down", () => {
  const profile = { height: 165, weight: 78, age: 35, gender: "female", activity: "light" };
  const calc = buildCalculations(profile, "lose_fat");

  assert(calc.target < calc.tdee, "should be in a deficit");
  assertEqual(calc.protein, Math.round(2.0 * 78), "2.0 g/kg protein");

  const startBmi = calc.bmi;
  const afterBmi = calcBMI(74, 165);
  assert(afterBmi < startBmi, "losing weight should lower BMI");

  const diet = generateDietPlan("veg", calc.target);
  Object.values(diet).forEach((day) => {
    assert(day.totals.kcal < calc.tdee, "every day should sit under maintenance");
  });
});

test("switching split rebuilds the schedule cleanly", () => {
  const first = generateWorkoutPlan("bro", 5);
  const second = generateWorkoutPlan("full_body", 3);

  assertEqual(WEEKDAYS.filter((d) => first.plan[d].typeKey !== "Rest").length, 5);
  assertEqual(WEEKDAYS.filter((d) => second.plan[d].typeKey !== "Rest").length, 3);
  assert(first.plan.Monday.typeKey !== second.plan.Monday.typeKey, "day types should differ");
});

/* ================= SUMMARY ================= */

console.log("\n" + "-".repeat(52));
if (failures.length > 0) {
  console.log(`  ${passed} passed, ${failures.length} FAILED\n`);
  failures.forEach((f) => console.log(`  FAIL  ${f}`));
  console.log("");
  process.exit(1);
} else {
  console.log(`  All ${passed} tests passed.`);
  console.log("-".repeat(52) + "\n");
}
