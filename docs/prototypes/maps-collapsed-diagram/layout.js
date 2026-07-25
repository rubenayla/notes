// layout.js — plain script, no imports/exports. Sets globalThis.DiagramLayout.
//
// Pure math, no DOM. Loaded both as a <script> tag (file://, no build step)
// and via `await import('./layout.js')` from node for layout.test.mjs.
// Must not reference `document`, `window`, or any browser-only global.

(function () {
  "use strict";

  var DEFAULTS = {
    d0: 10,        // floor distance (m) -> Lmin (10 m: only prevents degenerate zero-length legs; city legs stay distinguishable)
    d1: 50000,     // ceiling distance (m) -> Lmax
    Lmin: 0,       // px — base curve floor; only the CURRENT leg is allowed to reach it (it shrinks to 0 as you arrive)
    // Lmax is DERIVED, not tuned: two ceiling-distance legs drawn in the
    // same direction span exactly the room from the marker to the frame
    // edge straight ahead. 2·Lmax = markerAnchorY · frameHeight. Every
    // other drawn length then follows from the log mapping. Overridable
    // per call; when absent it is recomputed from the (possibly
    // overridden) frame in withDefaults.
    Lmax: null,    // px — filled in below from the frame constants
    // Minimum drawn length for legs AHEAD of the driver. Upcoming legs are
    // information about the future and must stay readable: without a floor,
    // maneuvers a few meters apart draw their connecting leg at ~0 px and
    // the turn glyphs collapse into each other. The current leg is exempt —
    // it represents disappearing road and legitimately shrinks to zero; to
    // avoid a jump at the moment a leg becomes current, its length is the
    // ahead-length it just had, scaled by the log-shrink ratio (1 at
    // handover, 0 on arrival).
    LminAhead: 28, // px
    gamma: 1,
    // Leg shape:
    //   'spline'   (default) — each leg is a cubic Bezier whose end
    //              tangents follow the REAL road bearings at the
    //              maneuvers (prev step's bearing_after leaving, this
    //              step's bearing_before arriving), expressed as
    //              deviations from the leg's chord and applied on top of
    //              the drawn chord direction. The kink drawn at each
    //              glyph therefore equals the real local junction angle
    //              (what the windscreen shows), while gentle in-leg
    //              curvature reads as "the road bends here, but it does
    //              it for you". Endpoints and tangents are all absolute
    //              per-maneuver data, so under north-up surviving legs
    //              stay bit-identical across handovers (twitch-free, same
    //              proof as straight legs). The current leg keeps the
    //              curvature shape it had at handover while it shrinks —
    //              its start tangent represents the road leaving the
    //              previous maneuver, not the driver's live nose
    //              direction (which plain GPS cannot give us).
    //   'straight' — the pure schematic: straight lines between glyphs.
    legShape: 'spline',
    // Past this per-end deviation (degrees) the spline would loop or
    // S-curve inside a compressed leg (a hairpin encoded mid-leg); the
    // leg falls back to straight and the glyph carries the turn.
    splineMaxDeviation: 120,
    // The maneuver count is an OUTPUT, not an input: maneuvers are added
    // while their drawn position (computed with the current leg at its
    // full handover length, so the count never changes mid-leg) stays
    // inside the frame — the frame is the only limit. minManeuvers are
    // always drawn even if they clip (north-up can point a max-length
    // pair sideways, where the frame is narrower than 2·Lmax).
    // maxManeuvers exists for tests/tools that want a hard cap; the
    // product default is unlimited.
    minManeuvers: 2,
    maxManeuvers: Infinity,
    // The camera frame, owned here because the windowing rule needs it;
    // render.js reads these same values for its viewBox. Origin = marker.
    frameWidth: 660,      // user units
    frameHeight: 540,     // user units
    markerAnchorX: 0.5,   // marker sits at this fraction of the width
    markerAnchorY: 0.87,  // ... and of the height (content grows upward)
    // Diagram orientation:
    //   'north'   (default) — compass-stable: the diagram's shape never
    //             rotates as maneuvers complete. Chosen because a heading-up
    //             diagram spins at every completed maneuver, worst exactly
    //             in dense clusters — the moment stability matters most.
    //   'heading' — direction of travel points up (windscreen-matching);
    //             the whole diagram rotates when a maneuver completes.
    orientation: 'north',
    // Where turn angles come from:
    //   'chords'   (default) — signed difference between the bearing from the
    //              previous maneuver's location to this one and the bearing
    //              from this one to the next. This is the net direction
    //              change the driver perceives; it dissolves the artifact
    //              where OSRM's instantaneous bearings on a curved junction
    //              (any roundabout) read as a sharp turn.
    //   'bearings' — the old behavior: bearing_after - bearing_before as
    //              reported by the routing engine at the maneuver point.
    // Steps without location data fall back to 'bearings' automatically.
    angleSource: 'chords'
  };

  var EPS = 1e-6;

  function deriveLmax(o) {
    return (o.markerAnchorY * o.frameHeight) / 2;
  }
  DEFAULTS.Lmax = deriveLmax(DEFAULTS); // 234.9 with the default frame

  function withDefaults(opts) {
    var o = {};
    var k;
    for (k in DEFAULTS) o[k] = DEFAULTS[k];
    if (opts) {
      for (k in opts) {
        if (opts[k] !== undefined) o[k] = opts[k];
      }
      // Keep the calibration rule under frame overrides: unless the caller
      // pins Lmax explicitly, it follows the frame.
      if (opts.Lmax === undefined) o.Lmax = deriveLmax(o);
    }
    return o;
  }

  function clamp(x, lo, hi) {
    return Math.min(Math.max(x, lo), hi);
  }

  // ln(d/d0) / ln(d1/d0), clamped to [0,1]. d <= 0 (or non-finite) is
  // treated as being at/below the floor.
  function mapDistance(d, opts) {
    var o = withDefaults(opts);
    if (!(d > 0)) return o.Lmin;
    var t = clamp(Math.log(d / o.d0) / Math.log(o.d1 / o.d0), 0, 1);
    var tGamma = Math.pow(t, o.gamma);
    return o.Lmin + tGamma * (o.Lmax - o.Lmin);
  }

  // Normalize an angle (degrees) to (-180, 180].
  function normalizeAngle(a) {
    var r = ((a % 360) + 360) % 360; // [0, 360)
    if (r > 180) r -= 360;
    return r;
  }

  // --- roundabout merging ---------------------------------------------
  // A typed roundabout traversal arrives as a pair of steps: an entry
  // ('roundabout' / 'rotary') and a later matching exit ('exit roundabout' /
  // 'exit rotary', usually the very next step). For the diagram that pair is
  // ONE maneuver: located at the entry, glyph 'roundabout', exit direction
  // from the chord across the whole traversal, labeled with the exit street.
  // The distance driven inside the roundabout (the exit step's before-leg)
  // is folded into the leg AFTER the merged maneuver, so cumulative
  // distances — and therefore progress semantics — are unchanged.
  //
  // mergeRoundabouts(steps) returns the effective step list with merges
  // applied (the input array is returned untouched when there is nothing to
  // merge for a given position; merged/adjusted steps are shallow clones).
  // Merged steps carry two extra fields:
  //   glyph: 'roundabout'   — picked up by the renderer
  //   exit_location         — the exit step's [lon,lat], used as the start
  //                           point of the outgoing chord

  var ROUNDABOUT_ENTRY = { 'roundabout': true, 'rotary': true };
  var ROUNDABOUT_EXIT = { 'exit roundabout': true, 'exit rotary': true };

  var _mergeCache = typeof WeakMap === 'function' ? new WeakMap() : null;

  function cloneStep(step) {
    var c = {};
    for (var k in step) c[k] = step[k];
    return c;
  }

  function mergeRoundabouts(steps) {
    if (_mergeCache) {
      var hit = _mergeCache.get(steps);
      if (hit) return hit;
    }

    var out = [];
    var carry = 0; // inside-roundabout distance to fold into the next leg
    var i = 0;
    while (i < steps.length) {
      var step = steps[i];
      var j = -1;
      if (ROUNDABOUT_ENTRY[step.type]) {
        for (var k = i + 1; k < steps.length; k++) {
          if (ROUNDABOUT_EXIT[steps[k].type]) { j = k; break; }
          if (ROUNDABOUT_ENTRY[steps[k].type]) break; // another entry before an exit — leave unmerged
        }
      }

      if (j === -1) {
        if (carry > 0) {
          var adjusted = cloneStep(step);
          adjusted.distance = adjusted.distance + carry;
          carry = 0;
          out.push(adjusted);
        } else {
          out.push(step);
        }
        i++;
        continue;
      }

      var exit = steps[j];
      var merged = cloneStep(step);
      merged.distance = merged.distance + carry;
      merged.glyph = 'roundabout';
      merged.name = exit.name;
      merged.modifier = exit.modifier;
      // bearings fallback: net change across the whole traversal
      merged.bearing_after = exit.bearing_after;
      merged.exit_location = exit.location;
      out.push(merged);

      carry = 0;
      for (var m = i + 1; m <= j; m++) carry += steps[m].distance;
      i = j + 1;
    }
    // A trailing carry with no following step cannot occur in real data
    // (an exit-roundabout step is never the route's last step); if it did,
    // that distance is simply not drawn.

    if (_mergeCache) _mergeCache.set(steps, out);
    return out;
  }

  // --- chord angles ----------------------------------------------------
  // Bearing (degrees, 0 = north, clockwise) of the straight chord from
  // [lon,lat] a to b, equirectangular approximation (fine at route scale).
  function chordBearing(a, b) {
    var latMid = ((a[1] + b[1]) / 2) * Math.PI / 180;
    var dx = (b[0] - a[0]) * Math.cos(latMid);
    var dy = b[1] - a[1];
    return (Math.atan2(dx, dy) * 180) / Math.PI;
  }

  // Where the previous leg's chord leaves a step: a merged roundabout is
  // entered at .location but left at .exit_location.
  function chordOrigin(step) {
    return step.exit_location || step.location;
  }

  // Signed chord turn angle at effSteps[idx]: bearing(prev -> this) vs
  // bearing(this -> next). Returns null when any needed location is
  // missing (caller falls back to instantaneous bearings).
  function chordAngle(effSteps, idx) {
    var prev = effSteps[idx - 1];
    var step = effSteps[idx];
    var next = effSteps[idx + 1];
    if (!prev || !step || !next) return null;
    if (!prev.location || !step.location || !next.location) return null;
    var inBearing = chordBearing(chordOrigin(prev), step.location);
    var outBearing = chordBearing(chordOrigin(step), next.location);
    return normalizeAngle(outBearing - inBearing);
  }

  // Select the next n maneuvers given progress (meters) along the route.
  //
  // steps[i].distance is the leg BEFORE maneuver i (fixture.js convention).
  // steps[0] ("depart") always has distance 0 — it sits at the route start,
  // already "reached" the moment progress is >= 0. currentIndex is the
  // index of the next maneuver not yet reached; remainingFirst is how much
  // of the leg leading to it is still ahead.
  //
  // Typed roundabout pairs are merged first (see mergeRoundabouts), so a
  // window never contains an 'exit roundabout' step and indices refer to
  // the merged (effective) step list. Each leg's step still exposes
  // .location (the roundabout entry for merged ones), so map markers keep
  // working unchanged.
  function progressToWindow(steps, progressMeters, n) {
    return windowFromEffective(mergeRoundabouts(steps), progressMeters, n);
  }

  function windowFromEffective(steps, progressMeters, n) {
    n = n || DEFAULTS.maxManeuvers;
    var count = steps.length;

    var cumulative = new Array(count);
    var acc = 0;
    var i;
    for (i = 0; i < count; i++) {
      acc += steps[i].distance;
      cumulative[i] = acc;
    }

    var currentIndex = count - 1; // default: route fully consumed
    var found = false;
    for (i = 1; i < count; i++) {
      if (cumulative[i] > progressMeters + EPS) {
        currentIndex = i;
        found = true;
        break;
      }
    }
    // found === false means every maneuver from index 1 on has already
    // been reached; currentIndex stays at the last step (the arrival).

    var remainingFirst = cumulative[currentIndex] - progressMeters;
    remainingFirst = clamp(remainingFirst, 0, steps[currentIndex].distance);

    var legs = [];
    for (i = 0; i < n && currentIndex + i < count; i++) {
      var idx = currentIndex + i;
      var step = steps[idx];
      legs.push({
        step: step,
        index: idx,
        distance: i === 0 ? remainingFirst : step.distance
      });
    }

    return { currentIndex: currentIndex, remainingFirst: remainingFirst, legs: legs };
  }

  // Build the drawable segments for the current window.
  //
  // Position starts at the origin (0,0), the fixed marker; heading starts
  // straight up (negative Y, heading = 0 deg, clockwise-positive like
  // compass bearings). Each leg is drawn in the current heading, then the
  // heading rotates by that leg's maneuver turn angle before drawing the
  // next leg. The turn angle comes from chords between maneuver locations
  // by default (opts.angleSource = 'chords'), or from the routing engine's
  // instantaneous bearings ('bearings').
  function layout(steps, progressMeters, opts) {
    var o = withDefaults(opts);
    var effSteps = mergeRoundabouts(steps);
    var window_ = windowFromEffective(effSteps, progressMeters, o.maxManeuvers);
    var legs = window_.legs;

    // Frame bounds in layout coordinates (marker at the origin). A leg's
    // maneuver is included while its endpoint lands inside these bounds;
    // the fit test uses the current leg at its FULL handover length so the
    // included count is constant for the whole life of a leg (it can only
    // change at handover — no mid-leg pop-in or flicker).
    var frameLeft = -o.markerAnchorX * o.frameWidth;
    var frameRight = (1 - o.markerAnchorX) * o.frameWidth;
    var frameTop = -o.markerAnchorY * o.frameHeight;
    var frameBottom = (1 - o.markerAnchorY) * o.frameHeight;
    var FIT_EPS = 0.5; // the calibrated 2-max-legs case ends exactly ON the edge
    function insideFrame(px, py) {
      return px >= frameLeft - FIT_EPS && px <= frameRight + FIT_EPS &&
             py >= frameTop - FIT_EPS && py <= frameBottom + FIT_EPS;
    }

    var segments = [];
    var heading = 0; // degrees, 0 = up, clockwise positive
    var x = 0, y = 0;
    var minX = 0, minY = 0, maxX = 0, maxY = 0;

    function extend(px, py) {
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    }

    function aheadLength(d) {
      return Math.max(mapDistance(d, o), o.LminAhead);
    }

    var cumToManeuver = 0;
    var hx = 0, hy = 0; // handover-length position, for the fit test only
    var shownLegs = [];

    for (var i = 0; i < legs.length; i++) {
      var leg = legs[i];
      var step = leg.step;
      var legPrev = effSteps[leg.index - 1];
      var isCurrent = i === 0;

      // North-up: EVERY leg draws directly at its own absolute chord
      // bearing — never by accumulating turn angles. Accumulating looks
      // equivalent, but any error in one turn angle (the old 45-degree
      // angle snapping was such a source) shifts every leg after it, and
      // the moment a maneuver completes its error leaves the sum: the
      // whole diagram rotates at each handover. Absolute per-leg bearings
      // make handover stability structural. Steps without location data
      // keep the accumulated heading as a fallback.
      if (o.orientation === 'north' && legPrev && chordOrigin(legPrev) && step.location) {
        heading = chordBearing(chordOrigin(legPrev), step.location);
      }
      var drawnLen;
      var handoverLen;
      if (isCurrent) {
        // Shrinks continuously from the leg's ahead-length (at the moment
        // it became current) to 0 (on arrival), following the log curve.
        var fullDist = step.distance;
        var baseFull = mapDistance(fullDist, o);
        var ratio = baseFull > EPS
          ? mapDistance(leg.distance, o) / baseFull
          : (fullDist > EPS ? leg.distance / fullDist : 0);
        handoverLen = aheadLength(fullDist);
        drawnLen = handoverLen * clamp(ratio, 0, 1);
      } else {
        drawnLen = aheadLength(leg.distance);
        handoverLen = drawnLen;
      }

      var rad = (heading * Math.PI) / 180;
      var dirX = Math.sin(rad);
      var dirY = -Math.cos(rad);
      var nx = x + drawnLen * dirX;
      var ny = y + drawnLen * dirY;
      var hnx = hx + handoverLen * dirX;
      var hny = hy + handoverLen * dirY;

      // Count-as-output windowing: past the guaranteed minimum, a maneuver
      // is drawn only if it fits the frame (as of handover). The window is
      // contiguous — the first miss ends it.
      if (i >= o.minManeuvers && !insideFrame(hnx, hny)) break;

      var hasTurn = step.type !== "arrive" && step.modifier !== null && step.modifier !== undefined;
      var turn = null;
      var turnAngle = 0;
      if (hasTurn) {
        var rawAngle = null;
        if (o.angleSource !== "bearings") rawAngle = chordAngle(effSteps, leg.index);
        if (rawAngle === null) rawAngle = normalizeAngle(step.bearing_after - step.bearing_before);
        turnAngle = rawAngle;
        turn = {
          type: step.type,
          modifier: step.modifier,
          angleDeg: turnAngle,
          glyph: step.glyph || null,
          exit: step.exit !== undefined ? step.exit : null
        };
      }

      cumToManeuver += leg.distance;
      var segment = {
        x1: x,
        y1: y,
        x2: nx,
        y2: ny,
        realDist: leg.distance,
        distToManeuver: cumToManeuver, // meters from current position to this segment's maneuver
        drawnLen: drawnLen,
        isCurrent: isCurrent,
        turn: turn,
        label: step.name || ""
      };

      // Spline leg shape: end tangents follow the real road bearings,
      // expressed as deviations from the leg's REAL chord and applied on
      // top of the DRAWN chord direction (`heading`) — so they compose
      // correctly with north-up and heading-up alike.
      // Zero deviation (or missing data, or a hairpin past the threshold)
      // leaves the segment straight: no control points at all.
      if (o.legShape === 'spline' && drawnLen > EPS) {
        if (legPrev && legPrev.location && step.location &&
            legPrev.bearing_after !== undefined && step.bearing_before !== undefined) {
          var realChord = chordBearing(chordOrigin(legPrev), step.location);
          var devStart = normalizeAngle(legPrev.bearing_after - realChord);
          var devEnd = normalizeAngle(step.bearing_before - realChord);
          if (Math.abs(devStart) > o.splineMaxDeviation || Math.abs(devEnd) > o.splineMaxDeviation) {
            devStart = 0;
            devEnd = 0;
          }
          if (devStart !== 0 || devEnd !== 0) {
            var m = drawnLen / 3; // Hermite-style tangent handle, scales with the leg (degenerates cleanly as the current leg shrinks)
            var tsRad = ((heading + devStart) * Math.PI) / 180;
            var teRad = ((heading + devEnd) * Math.PI) / 180;
            segment.cx1 = x + m * Math.sin(tsRad);
            segment.cy1 = y - m * Math.cos(tsRad);
            segment.cx2 = nx - m * Math.sin(teRad);
            segment.cy2 = ny + m * Math.cos(teRad);
            // The curve lies inside the convex hull of the 4 points.
            extend(segment.cx1, segment.cy1);
            extend(segment.cx2, segment.cy2);
          }
        }
      }

      segments.push(segment);
      shownLegs.push(leg);

      extend(x, y);
      extend(nx, ny);

      x = nx;
      y = ny;
      hx = hnx;
      hy = hny;
      if (hasTurn) heading = normalizeAngle(heading + turnAngle);
    }

    if (segments.length === 0) {
      minX = minY = maxX = maxY = 0;
    }

    return {
      segments: segments,
      bbox: { minX: minX, minY: minY, maxX: maxX, maxY: maxY },
      // The maneuvers actually drawn (adaptive count) — the map page's
      // markers must mirror the diagram exactly, so it reads these instead
      // of re-deriving a window with its own count.
      shownLegs: shownLegs,
      currentIndex: window_.currentIndex
    };
  }

  globalThis.DiagramLayout = {
    mapDistance: mapDistance,
    progressToWindow: progressToWindow,
    layout: layout,
    // exposed for tests / debugging, not part of the required interface
    _normalizeAngle: normalizeAngle,
    _mergeRoundabouts: mergeRoundabouts,
    _chordBearing: chordBearing,
    _defaults: DEFAULTS
  };
})();
