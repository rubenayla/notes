// layout.test.mjs — run with: node layout.test.mjs
//
// layout.js is a plain script (no import/export) so other modules can load
// it via a <script> tag from file://. Node can still `import()` it — with
// no ESM syntax inside, Node treats it as a normal CommonJS-ish script and
// the dynamic import resolves once it has run, at which point it has set
// globalThis.DiagramLayout.

import assert from "node:assert/strict";

await import("./layout.js");
const { mapDistance, progressToWindow, layout } = globalThis.DiagramLayout;
const DEFAULTS = globalThis.DiagramLayout._defaults;
// Lmax is derived, not tuned: 2*Lmax spans exactly the marker-to-edge room
// straight ahead (the calibration Ruben fixed: two max arrows in the same
// direction reach the very end of the display).
const LMAX = DEFAULTS.markerAnchorY * DEFAULTS.frameHeight / 2;

// Also exercise the real fixture for an integration sanity check (F1's
// cluster, F3's window size) without hand-copying its numbers into
// hardcoded expectations everywhere else in this file.
await import("./fixture.js");
const ROUTE = globalThis.ROUTE;

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
  } catch (err) {
    failed++;
    failures.push({ name, err });
  }
}

function approx(actual, expected, epsilon, msg) {
  epsilon = epsilon === undefined ? 1e-6 : epsilon;
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    (msg ? msg + " — " : "") + `expected ${actual} to be within ${epsilon} of ${expected}`
  );
}

// ---------------------------------------------------------------------
// F15 / F4: log-mapping anchor values
// ---------------------------------------------------------------------

test("mapDistance: d0 (10 m) maps to Lmin", () => {
  approx(mapDistance(10), 0);
});

test("mapDistance: d1 (50 km) maps to Lmax", () => {
  approx(mapDistance(50000), LMAX);
});

test("mapDistance: log-midpoint sqrt(d0*d1) maps to (Lmin+Lmax)/2 for gamma=1", () => {
  // sqrt(10 * 50000) = 707.106... m -> t = 1/2 exactly.
  approx(mapDistance(Math.sqrt(10 * 50000)), (0 + LMAX) / 2);
});

test("mapDistance: strictly monotone between the anchors", () => {
  const samples = [10, 20, 67, 150, 281, 685, 1500, 5000, 14327, 30000, 50000];
  for (let i = 1; i < samples.length; i++) {
    const lo = mapDistance(samples[i - 1]);
    const hi = mapDistance(samples[i]);
    assert.ok(hi > lo, `expected L(${samples[i]})=${hi} > L(${samples[i - 1]})=${lo}`);
  }
});

test("mapDistance: F16 city legs 67 m / 281 m / 685 m draw at strictly increasing lengths", () => {
  const L67 = mapDistance(67);
  const L281 = mapDistance(281);
  const L685 = mapDistance(685);
  assert.ok(L67 > 0, "67 m must sit above the floor, not clamp to Lmin");
  assert.ok(L67 < L281, `L(67)=${L67} must be < L(281)=${L281}`);
  assert.ok(L281 < L685, `L(281)=${L281} must be < L(685)=${L685}`);
  assert.ok(L685 < LMAX, "685 m must sit below the ceiling");
});

test("mapDistance: respects custom opts (d0/d1/Lmin/Lmax)", () => {
  const opts = { d0: 100, d1: 1000, Lmin: 10, Lmax: 50 };
  approx(mapDistance(100, opts), 10);
  approx(mapDistance(1000, opts), 50);
  approx(mapDistance(316.2277660168379 /* sqrt(100*1000) */, opts), 30);
});

// ---------------------------------------------------------------------
// F4: clamping below the floor and above the ceiling
// ---------------------------------------------------------------------

test("mapDistance: clamps below d0 to Lmin", () => {
  approx(mapDistance(5), 0);
  approx(mapDistance(1), 0);
});

test("mapDistance: clamps at/below zero to Lmin (no NaN, no -Infinity)", () => {
  approx(mapDistance(0), 0);
  approx(mapDistance(-50), 0);
});

test("mapDistance: clamps above d1 to Lmax", () => {
  approx(mapDistance(100000), LMAX);
  approx(mapDistance(5000000), LMAX);
});

test("mapDistance: gamma reshapes the middle without moving the anchors", () => {
  const opts = { gamma: 2 };
  approx(mapDistance(10, opts), 0);
  approx(mapDistance(50000, opts), LMAX);
  // for any 0 < t < 1, gamma=2 pulls the value below the gamma=1 curve
  const withGamma2 = mapDistance(5000, opts);
  const withGamma1 = mapDistance(5000, { gamma: 1 });
  assert.ok(withGamma2 < withGamma1, "gamma=2 should sit below the gamma=1 curve mid-range");
});

// ---------------------------------------------------------------------
// progressToWindow: window selection and first-leg reduction
// ---------------------------------------------------------------------

// Synthetic, hand-computable step list (distance = leg BEFORE this
// maneuver, per fixture.js's convention). Cumulative distance to reach
// each maneuver: [0, 200, 250, 330, 1330, 1630].
const steps = [
  { distance: 0, type: "depart", modifier: "right", bearing_before: 0, bearing_after: 90, name: "Start St" },
  { distance: 200, type: "turn", modifier: "left", bearing_before: 90, bearing_after: 0, name: "A St" },
  { distance: 50, type: "turn", modifier: "right", bearing_before: 0, bearing_after: 90, name: "B St" },
  { distance: 80, type: "turn", modifier: "left", bearing_before: 90, bearing_after: 45, name: "C St" },
  { distance: 1000, type: "turn", modifier: "right", bearing_before: 45, bearing_after: 135, name: "D St" },
  { distance: 300, type: "arrive", modifier: null, bearing_before: 135, bearing_after: 0, name: "D St" }
];

test("progressToWindow: at progress=0, window is the next 3 maneuvers (indices 1,2,3)", () => {
  const w = progressToWindow(steps, 0, 3);
  assert.equal(w.currentIndex, 1);
  approx(w.remainingFirst, 200);
  assert.deepEqual(
    w.legs.map((l) => l.index),
    [1, 2, 3]
  );
  assert.deepEqual(
    w.legs.map((l) => l.distance),
    [200, 50, 80]
  );
});

test("progressToWindow: first leg's distance is reduced by progress into it", () => {
  const w = progressToWindow(steps, 60, 3);
  assert.equal(w.currentIndex, 1);
  approx(w.remainingFirst, 140);
  approx(w.legs[0].distance, 140);
  // trailing legs in the window keep their full distance
  approx(w.legs[1].distance, 50);
  approx(w.legs[2].distance, 80);
});

test("progressToWindow: advances currentIndex once a maneuver is passed", () => {
  // 220 m in: maneuver 1 (at 200 m) is behind us, maneuver 2 is at 250 m.
  const w = progressToWindow(steps, 220, 3);
  assert.equal(w.currentIndex, 2);
  approx(w.remainingFirst, 30);
  assert.deepEqual(
    w.legs.map((l) => l.index),
    [2, 3, 4]
  );
});

test("progressToWindow: window shrinks near the end of the route (fewer than n legs left)", () => {
  const w = progressToWindow(steps, 1600, 3);
  assert.equal(w.currentIndex, 5);
  approx(w.remainingFirst, 30);
  assert.equal(w.legs.length, 1);
  assert.equal(w.legs[0].index, 5);
});

test("progressToWindow: at/after the full route distance, settles on the arrival with 0 remaining", () => {
  const w = progressToWindow(steps, 1630, 3);
  assert.equal(w.currentIndex, 5);
  approx(w.remainingFirst, 0);
  assert.equal(w.legs.length, 1);

  const wOver = progressToWindow(steps, 5000, 3);
  assert.equal(wOver.currentIndex, 5);
  approx(wOver.remainingFirst, 0);
});

// ---------------------------------------------------------------------
// F1/F3 integration sanity check against the real fixture
// ---------------------------------------------------------------------

test("progressToWindow: real fixture yields a 3-maneuver window from the start", () => {
  const w = progressToWindow(ROUTE.steps, 0, 3);
  assert.equal(w.legs.length, 3);
  assert.equal(w.currentIndex, 1);
});

test("progressToWindow: real fixture's 3-maneuver cluster (steps 9-11) appears together in one window", () => {
  // Progress to just before maneuver 9 puts steps[9,10,11] in the window.
  let acc = 0;
  for (let i = 0; i <= 9; i++) acc += ROUTE.steps[i].distance;
  const w = progressToWindow(ROUTE.steps, acc - 1, 3);
  assert.deepEqual(
    w.legs.map((l) => l.index),
    [9, 10, 11]
  );
});

// ---------------------------------------------------------------------
// layout(): geometry, turn glyphs
// ---------------------------------------------------------------------

test("layout: first segment starts at the origin, heading straight up", () => {
  const result = layout(steps, 0, { maxManeuvers: 3 });
  const seg0 = result.segments[0];
  approx(seg0.x1, 0);
  approx(seg0.y1, 0);
  approx(seg0.x2, 0, 1e-6, "heading up means no horizontal drift before any turn");
  assert.ok(seg0.y2 < 0, "moving up means negative Y");
});

test("layout: produces one segment per leg, with realDist/drawnLen carried through", () => {
  const result = layout(steps, 0, { maxManeuvers: 3 });
  assert.equal(result.segments.length, 3);
  approx(result.segments[0].realDist, 200);
  approx(result.segments[1].realDist, 50);
  approx(result.segments[2].realDist, 80);
  result.segments.forEach((s) => {
    approx(s.drawnLen, mapDistance(s.realDist, { maxManeuvers: 3 }));
  });
});

test("layout: turn field carries type/modifier/angleDeg for maneuvers, null at arrival", () => {
  const w = progressToWindow(steps, 1600, 3); // window = [arrival only]
  const result = layout(steps, 1600, { maxManeuvers: 3 });
  assert.equal(w.legs.length, 1);
  assert.equal(result.segments.length, 1);
  assert.equal(result.segments[0].turn, null);
});

test("layout: turn angles are always the real (never snapped) angle", () => {
  const skewSteps = [
    { distance: 0, type: "depart", modifier: "right", bearing_before: 0, bearing_after: 90, name: "Start" },
    { distance: 100, type: "turn", modifier: "right", bearing_before: 10, bearing_after: 105, name: "A" },
    { distance: 100, type: "arrive", modifier: null, bearing_before: 105, bearing_after: 105, name: "A" }
  ];
  const result = layout(skewSteps, 0, { maxManeuvers: 2 });
  approx(result.segments[0].turn.angleDeg, 95); // 105-10 = 95, kept exact
});

test("layout: bbox encloses every segment endpoint", () => {
  const result = layout(steps, 0, { maxManeuvers: 3 });
  let minX = 0, minY = 0, maxX = 0, maxY = 0;
  result.segments.forEach((s) => {
    minX = Math.min(minX, s.x1, s.x2);
    maxX = Math.max(maxX, s.x1, s.x2);
    minY = Math.min(minY, s.y1, s.y2);
    maxY = Math.max(maxY, s.y1, s.y2);
  });
  approx(result.bbox.minX, minX);
  approx(result.bbox.maxX, maxX);
  approx(result.bbox.minY, minY);
  approx(result.bbox.maxY, maxY);
});

// ---------------------------------------------------------------------
// F10: monotonicity — within a single leg, advancing progress never
// grows that leg's drawn length. (Crossing into the next maneuver
// swaps in a different leg entirely — F11's "drop off and appear" — so
// monotonicity is checked here strictly inside one leg's span.)
// ---------------------------------------------------------------------

test("layout: first segment's drawnLen is monotonically non-increasing as progress advances within one leg", () => {
  const legDistance = steps[1].distance; // 200 m
  const samples = [0, 10, 40, 75, 100, 140, 175, 199];
  let prevDrawnLen = Infinity;
  samples.forEach((p) => {
    assert.ok(p < legDistance, "sample must stay inside the leg to isolate this behavior");
    const result = layout(steps, p, { maxManeuvers: 3 });
    const drawnLen = result.segments[0].drawnLen;
    assert.ok(
      drawnLen <= prevDrawnLen + 1e-9,
      `drawnLen grew from ${prevDrawnLen} to ${drawnLen} at progress=${p}`
    );
    prevDrawnLen = drawnLen;
  });
});

test("layout: first segment's drawnLen is monotonically non-increasing along the real fixture's long leg", () => {
  // steps[16].distance = 14326.8 m — walk progress across it in fine steps.
  let acc = 0;
  for (let i = 0; i <= 15; i++) acc += ROUTE.steps[i].distance;
  const legStart = acc;
  const legLen = ROUTE.steps[16].distance;
  let prevDrawnLen = Infinity;
  for (let frac = 0; frac < 1; frac += 0.05) {
    const p = legStart + frac * legLen;
    const result = layout(ROUTE.steps, p, { maxManeuvers: 3 });
    const drawnLen = result.segments[0].drawnLen;
    assert.ok(drawnLen <= prevDrawnLen + 1e-9, `drawnLen grew at fraction ${frac}`);
    prevDrawnLen = drawnLen;
  }
});

// ---------------------------------------------------------------------
// F17: chord angles (default) vs instantaneous bearings
// ---------------------------------------------------------------------

// Cumulative distance (meters) to reach ROUTE step index `idx`.
function cumTo(idx) {
  let acc = 0;
  for (let i = 0; i <= idx; i++) acc += ROUTE.steps[i].distance;
  return acc;
}

test("layout: fixture step 5 (Plaza de la Independencia) is near-straight by chords", () => {
  // Instantaneous bearings say 129 -> 78, a 51-degree left turn; the chords
  // through the plaza are nearly collinear. Progress just before step 5
  // puts it first in the window (its turn is on segments[0]).
  const p = cumTo(5) - 1;
  const chords = layout(ROUTE.steps, p);
  assert.ok(
    Math.abs(chords.segments[0].turn.angleDeg) < 30,
    `chord angle should be roughly straight, got ${chords.segments[0].turn.angleDeg}`
  );
});

test("layout: angleSource='bearings' preserves the old instantaneous-bearing behavior", () => {
  const p = cumTo(5) - 1;
  const result = layout(ROUTE.steps, p, { angleSource: "bearings" });
  approx(result.segments[0].turn.angleDeg, -51); // 78 - 129
});

test("layout: steps without locations fall back to bearings under angleSource='chords'", () => {
  // The synthetic `steps` list has no .location fields.
  const result = layout(steps, 0, { maxManeuvers: 1 });
  approx(result.segments[0].turn.angleDeg, -90); // 0 - 90
});

// ---------------------------------------------------------------------
// F18: typed roundabout pairs merge into one maneuver
// ---------------------------------------------------------------------

test("mergeRoundabouts: fixture pairs 18/19, 20/21, 22/23 collapse to one step each", () => {
  const eff = globalThis.DiagramLayout._mergeRoundabouts(ROUTE.steps);
  assert.equal(eff.length, ROUTE.steps.length - 3);
  assert.ok(eff.every((s) => s.type !== "exit roundabout" && s.type !== "exit rotary"));
  const merged = eff.filter((s) => s.glyph === "roundabout");
  assert.equal(merged.length, 3);
  // located at the entry, labeled with the exit street, exit location kept
  assert.deepEqual(merged[0].location, ROUTE.steps[18].location);
  assert.deepEqual(merged[0].exit_location, ROUTE.steps[19].location);
  assert.equal(merged[1].name, ROUTE.steps[21].name);
});

test("mergeRoundabouts: inside-roundabout distance folds into the following leg, total preserved", () => {
  const eff = globalThis.DiagramLayout._mergeRoundabouts(ROUTE.steps);
  const rawTotal = ROUTE.steps.reduce((a, s) => a + s.distance, 0);
  const effTotal = eff.reduce((a, s) => a + s.distance, 0);
  approx(effTotal, rawTotal, 1e-6);
  // merged 18/19 keeps the entry's before-leg; the next leg (merged 20/21's
  // before-leg) gains step 19's inside distance
  const m18 = eff.findIndex((s) => s.glyph === "roundabout");
  approx(eff[m18].distance, ROUTE.steps[18].distance);
  approx(eff[m18 + 1].distance, ROUTE.steps[20].distance + ROUTE.steps[19].distance);
});

test("progressToWindow: window through the roundabout cluster contains merged maneuvers only", () => {
  // Progress just before the roundabout entry at raw step 18.
  const p = cumTo(18) - 1;
  const w = progressToWindow(ROUTE.steps, p, 3);
  assert.equal(w.legs[0].step.type, "roundabout");
  assert.equal(w.legs[0].step.glyph, "roundabout");
  assert.ok(w.legs.every((l) => l.step.type !== "exit roundabout"));
  // every leg still exposes a location (map.html M5 markers rely on it)
  assert.ok(w.legs.every((l) => Array.isArray(l.step.location)));
});

test("layout: merged roundabout carries glyph 'roundabout' on its turn", () => {
  const p = cumTo(18) - 1;
  const result = layout(ROUTE.steps, p, {});
  assert.equal(result.segments[0].turn.glyph, "roundabout");
  // non-roundabout turns carry glyph null
  const cityResult = layout(ROUTE.steps, 0, {});
  assert.equal(cityResult.segments[0].turn.glyph, null);
});


// ---------------------------------------------------------------------
// Ahead-minimum + current-leg shrink (two-regime lengths)
// ---------------------------------------------------------------------

const tinySteps = [
  { distance: 0, type: 'depart', modifier: 'straight', bearing_before: 0, bearing_after: 0, name: 's' },
  { distance: 100, type: 'turn', modifier: 'right', bearing_before: 0, bearing_after: 90, name: 'a' },
  { distance: 6, type: 'turn', modifier: 'left', bearing_before: 90, bearing_after: 0, name: 'b' },
  { distance: 200, type: 'arrive', modifier: null, bearing_before: 0, bearing_after: 0, name: 'end' },
];

test("layout: an upcoming 6 m leg gets the LminAhead floor (28), not ~0", () => {
  const segs = layout(tinySteps, 0).segments;
  approx(segs[1].drawnLen, 28);
});

test("layout: current leg starts at exactly its ahead-length (no jump at handover)", () => {
  const segs = layout(tinySteps, 0).segments;
  approx(segs[0].drawnLen, Math.max(mapDistance(100), 28));
});

test("layout: current leg shrinks strictly and reaches ~0 on arrival", () => {
  const at = (p) => layout(tinySteps, p).segments[0].drawnLen;
  assert.ok(at(0) > at(50), `expected L(0)=${at(0)} > L(50)=${at(50)}`);
  assert.ok(at(50) > at(90), `expected L(50)=${at(50)} > L(90)=${at(90)}`);
  assert.ok(at(99.5) < 1, `expected near-arrival length < 1, got ${at(99.5)}`);
});

test("layout: three maneuvers meters apart keep glyphs separated by LminAhead", () => {
  const cluster = [
    { distance: 0, type: 'depart', modifier: 'straight', bearing_before: 0, bearing_after: 0, name: 's' },
    { distance: 500, type: 'turn', modifier: 'right', bearing_before: 0, bearing_after: 90, name: 'a' },
    { distance: 4, type: 'turn', modifier: 'left', bearing_before: 90, bearing_after: 0, name: 'b' },
    { distance: 3, type: 'turn', modifier: 'right', bearing_before: 0, bearing_after: 90, name: 'c' },
    { distance: 50, type: 'arrive', modifier: null, bearing_before: 0, bearing_after: 0, name: 'end' },
  ];
  const segs = layout(cluster, 0).segments;
  assert.ok(segs[1].drawnLen >= 28, `4 m leg drew at ${segs[1].drawnLen}`);
  assert.ok(segs[2].drawnLen >= 28, `3 m leg drew at ${segs[2].drawnLen}`);
});


// ---------------------------------------------------------------------
// Orientation, cumulative distances, roundabout exit/angle
// ---------------------------------------------------------------------

test("layout: distToManeuver is cumulative across the window", () => {
  const segs = layout(tinySteps, 0).segments;
  approx(segs[0].distToManeuver, 100);
  approx(segs[1].distToManeuver, 106);
  approx(segs[2].distToManeuver, 306);
});

test("layout: north orientation draws the first leg at its true bearing", () => {
  // Two maneuvers due EAST of each other (same latitude): heading should be ~90°.
  const eastSteps = [
    { distance: 0, type: 'depart', modifier: 'straight', bearing_before: 0, bearing_after: 90, name: 's', location: [-3.700, 40.400] },
    { distance: 500, type: 'turn', modifier: 'left', bearing_before: 90, bearing_after: 0, name: 'a', location: [-3.694, 40.400] },
    { distance: 300, type: 'arrive', modifier: null, bearing_before: 0, bearing_after: 0, name: 'end', location: [-3.694, 40.403] },
  ];
  const north = layout(eastSteps, 0, { orientation: 'north' }).segments[0];
  // east = +x, no vertical movement
  assert.ok(north.x2 > north.x1 + 1, `expected first leg to point east (+x), got dx=${north.x2 - north.x1}`);
  assert.ok(Math.abs(north.y2 - north.y1) < Math.abs(north.x2 - north.x1) * 0.05, "expected ~no vertical movement");
  const headingUp = layout(eastSteps, 0, { orientation: 'heading' }).segments[0];
  assert.ok(headingUp.y2 < headingUp.y1, "heading-up first leg must point up (-y)");
});

test("layout: roundabout keeps its real exit angle and carries the exit number", () => {
  const raSteps = [
    { distance: 0, type: 'depart', modifier: 'straight', bearing_before: 0, bearing_after: 0, name: 's', location: [-3.700, 40.400] },
    { distance: 400, type: 'roundabout', modifier: 'right', bearing_before: 0, bearing_after: 20, name: '', exit: 2, location: [-3.700, 40.4036] },
    { distance: 30, type: 'exit roundabout', modifier: 'right', bearing_before: 100, bearing_after: 115, name: 'out', exit: 2, location: [-3.6998, 40.4038] },
    { distance: 200, type: 'arrive', modifier: null, bearing_before: 115, bearing_after: 115, name: 'end', location: [-3.6975, 40.4030] },
  ];
  const segs = layout(raSteps, 0, { orientation: 'heading' }).segments;
  const ra = segs[0].turn;
  assert.ok(ra.glyph === 'roundabout', "first maneuver should be the merged roundabout");
  assert.ok(ra.exit === 2, `exit number should pass through, got ${ra.exit}`);
  assert.ok(Math.abs(ra.angleDeg % 45) > 1, `roundabout angle should be the real one, got ${ra.angleDeg}`);
});

// ---------------------------------------------------------------------
// F26: count-as-output windowing + frame-derived Lmax calibration
// ---------------------------------------------------------------------

test("calibration: Lmax is derived from the frame (2*Lmax = marker-to-edge room)", () => {
  approx(DEFAULTS.Lmax, DEFAULTS.markerAnchorY * DEFAULTS.frameHeight / 2);
});

// Straight steps with no locations: chord angles unavailable, bearings say
// "no turn", north-up falls back to heading 0 (straight up) — so drawn
// lengths stack vertically and endpoint positions are easy to reason about.
function straightSteps(distances) {
  const steps = [{ distance: 0, type: 'depart', modifier: 'straight', bearing_before: 0, bearing_after: 0, name: 's' }];
  distances.forEach((d, i) => {
    steps.push({ distance: d, type: 'turn', modifier: 'straight', bearing_before: 0, bearing_after: 0, name: 'm' + i });
  });
  steps.push({ distance: 1000, type: 'arrive', modifier: null, bearing_before: 0, bearing_after: 0, name: 'end' });
  return steps;
}

test("layout: two ceiling legs in the same direction reach exactly the frame edge, and show exactly 2", () => {
  const segs = layout(straightSteps([50000, 50000, 50000]), 0).segments;
  assert.equal(segs.length, 2, `expected exactly 2 maneuvers, got ${segs.length}`);
  approx(segs[1].y2, -DEFAULTS.markerAnchorY * DEFAULTS.frameHeight);
});

test("layout: a compressed cluster shows every maneuver that fits the frame (no fixed cap)", () => {
  // 8 legs of 40 m (~38 px each) + the arrive leg all stack inside the
  // frame — every one is drawn; the frame is the only limit.
  const segs = layout(straightSteps([40, 40, 40, 40, 40, 40, 40, 40]), 0).segments;
  assert.equal(segs.length, 9, `expected all 9 legs (8 turns + arrive), got ${segs.length}`);
});

test("layout: an explicit maxManeuvers opt still caps (tests/tools only)", () => {
  const segs = layout(straightSteps([40, 40, 40, 40, 40, 40, 40, 40]), 0, { maxManeuvers: 4 }).segments;
  assert.equal(segs.length, 4, `expected the explicit cap of 4, got ${segs.length}`);
});

test("layout: the shown count never changes mid-leg (fit test uses handover length)", () => {
  const steps = straightSteps([5000, 40, 40, 40, 40]);
  const atHandover = layout(steps, 0).segments.length;
  const midLeg = layout(steps, 4000).segments.length;
  assert.equal(midLeg, atHandover,
    `count changed mid-leg: ${atHandover} at handover, ${midLeg} at 4000 m in`);
});

test("layout: minManeuvers are always drawn even when the second lands outside the frame", () => {
  // Right turn after a ceiling leg, then another ceiling leg: with a narrow
  // frame the second endpoint is outside, but the guaranteed pair still draws.
  const steps = [
    { distance: 0, type: 'depart', modifier: 'straight', bearing_before: 0, bearing_after: 0, name: 's' },
    { distance: 50000, type: 'turn', modifier: 'right', bearing_before: 0, bearing_after: 90, name: 'a' },
    { distance: 50000, type: 'turn', modifier: 'right', bearing_before: 90, bearing_after: 180, name: 'b' },
    { distance: 1000, type: 'arrive', modifier: null, bearing_before: 180, bearing_after: 180, name: 'end' },
  ];
  const result = layout(steps, 0, { frameWidth: 200 });
  assert.equal(result.segments.length, 2, `expected the guaranteed 2, got ${result.segments.length}`);
  assert.ok(result.segments[1].x2 > 100, "second endpoint should be past the narrow frame's right edge (it clips)");
});

test("layout: shownLegs mirrors the drawn segments and carries the step indices", () => {
  const result = layout(straightSteps([40, 40, 40, 40, 40, 40, 40, 40]), 0);
  assert.equal(result.shownLegs.length, result.segments.length);
  assert.equal(result.shownLegs[0].index, result.currentIndex);
});

// ---------------------------------------------------------------------
// F29: spline legs — end tangents follow the real road bearings
// ---------------------------------------------------------------------

// Two maneuvers due east of each other (chord bearing 90°), with the road
// leaving the first at 130° (deviation +40°) and arriving at the second
// at 60° (deviation −30°).
const splineSteps = [
  { distance: 0, type: 'depart', modifier: 'straight', bearing_before: 130, bearing_after: 130, name: 's', location: [-3.700, 40.400] },
  { distance: 500, type: 'turn', modifier: 'left', bearing_before: 60, bearing_after: 0, name: 'a', location: [-3.694, 40.400] },
  { distance: 300, type: 'arrive', modifier: null, bearing_before: 0, bearing_after: 0, name: 'end', location: [-3.694, 40.403] },
];

test("layout: spline control points follow the real-bearing deviations from the chord", () => {
  const seg = layout(splineSteps, 0).segments[0];
  assert.ok(seg.cx1 !== undefined, "expected a curved segment (control points present)");
  const m = seg.drawnLen / 3;
  // start tangent at drawn-chord 90° + dev 40° = 130°
  approx(seg.cx1, m * Math.sin(130 * Math.PI / 180), 0.5);
  approx(seg.cy1, -m * Math.cos(130 * Math.PI / 180), 0.5);
  // end tangent at 90° − 30° = 60°: cp2 = end − m·dir(60°)
  approx(seg.x2 - seg.cx2, m * Math.sin(60 * Math.PI / 180), 0.5);
  approx(seg.y2 - seg.cy2, -m * Math.cos(60 * Math.PI / 180), 0.5);
});

test("layout: legShape 'straight' and steps without locations both draw straight (no control points)", () => {
  const straightMode = layout(splineSteps, 0, { legShape: 'straight' }).segments[0];
  assert.ok(straightMode.cx1 === undefined, "legShape 'straight' must not attach control points");
  const noLoc = layout(straightSteps([500, 500]), 0).segments[0];
  assert.ok(noLoc.cx1 === undefined, "steps without locations must fall back to straight");
});

test("layout: a hairpin deviation past splineMaxDeviation falls back to straight", () => {
  const hairpin = splineSteps.map(s => ({ ...s }));
  hairpin[0].bearing_after = 90 + 170; // leaves the maneuver almost backwards vs the chord
  const seg = layout(hairpin, 0).segments[0];
  assert.ok(seg.cx1 === undefined, "deviation > threshold must draw straight (the glyph carries the turn)");
});

test("layout: spline handles scale with the shrinking current leg (no jump, no NaN)", () => {
  for (const p of [0, 100, 250, 400, 495]) {
    const seg = layout(splineSteps, p).segments[0];
    if (seg.cx1 === undefined) continue; // fully shrunk legs may drop the curve
    const handle = Math.hypot(seg.cx1 - seg.x1, seg.cy1 - seg.y1);
    approx(handle, seg.drawnLen / 3, 0.01);
    assert.ok(isFinite(seg.cx2) && isFinite(seg.cy2), "control points must stay finite");
  }
});

test("layout: bbox includes spline control points", () => {
  const result = layout(splineSteps, 0);
  const seg = result.segments[0];
  assert.ok(result.bbox.minX <= Math.min(seg.cx1, seg.cx2) + 1e-6);
  assert.ok(result.bbox.maxY >= Math.max(seg.cy1, seg.cy2) - 1e-6);
});

// ---------------------------------------------------------------------
// F32: north-up handovers are rotation-free
// ---------------------------------------------------------------------

test("layout: north-up leg keeps its exact drawn bearing across a handover", () => {
  // Real geometry with a ~27-degree turn. Every leg must sit at its own
  // absolute chord bearing — any error introduced by accumulating turn
  // angles would rotate the diagram the moment a maneuver completes.
  const handoverSteps = [
    { distance: 0, type: 'depart', modifier: 'straight', bearing_before: 90, bearing_after: 90, name: 's', location: [-3.700, 40.400] },
    { distance: 500, type: 'turn', modifier: 'left', bearing_before: 90, bearing_after: 27, name: 'a', location: [-3.694, 40.400] },
    { distance: 400, type: 'turn', modifier: 'right', bearing_before: 27, bearing_after: 90, name: 'b', location: [-3.692, 40.403] },
    { distance: 200, type: 'arrive', modifier: null, bearing_before: 90, bearing_after: 90, name: 'end', location: [-3.690, 40.4045] },
  ];
  const bearingOf = seg => Math.atan2(seg.x2 - seg.x1, -(seg.y2 - seg.y1)) * 180 / Math.PI;

  const before = layout(handoverSteps, 499); // leg to 'b' is segments[1]
  const after = layout(handoverSteps, 501);  // leg to 'b' is now segments[0]
  approx(bearingOf(after.segments[0]), bearingOf(before.segments[1]), 1e-9,
    "surviving leg rotated at handover");
});

// ---------------------------------------------------------------------
// report
// ---------------------------------------------------------------------

if (failed > 0) {
  console.error(`\n${failed} test(s) failed:\n`);
  failures.forEach(({ name, err }) => {
    console.error(`✗ ${name}`);
    console.error(`  ${err.message}\n`);
  });
  console.error(`${passed} passed, ${failed} failed`);
  process.exit(1);
} else {
  console.log(`${passed} passed, 0 failed`);
}
