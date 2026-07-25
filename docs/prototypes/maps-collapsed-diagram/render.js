// render.js — plain script, no imports/exports. Sets globalThis.DiagramRender.
//
// DiagramRender.draw(svgEl, layoutResult, opts)
//   Clears svgEl and redraws the collapsed-diagram from a layoutResult:
//     { segments: [{ x1, y1, x2, y2, realDist, drawnLen, turn, label }...],
//       bbox: { minX, minY, maxX, maxY } }
//   `turn` is either null (no maneuver at this segment's end, e.g. arrival)
//   or { type, modifier, angleDeg }. See ../README.md for the coordinate
//   convention: position marker at (0,0), initial heading straight up.
//
// Visual language: one continuous thick rounded line (like a highlighted
// map route), an arrowhead where it currently ends, small joint dots at
// each maneuver, a fixed "you are here" marker pinned at the origin, and a
// distance label per leg that never overlaps the line (offset to the side,
// white halo behind the text) or another label.
//
// F8 (fixed marker): the viewBox is not simply fitted to the content's
// bbox each frame — that would let the origin (the marker) drift on screen
// whenever the bbox's shape changes between frames. Instead the marker
// (always at local (0,0)) is anchored at a FIXED fraction of the viewBox
// (opts.markerAnchorX/Y), and the viewBox's width:height ratio is held
// fixed at opts.viewportWidth/opts.viewportHeight on every draw. Under
// preserveAspectRatio="xMidYMid meet" with a fixed-size <svg> element and a
// fixed viewBox aspect ratio, that combination makes the marker's on-screen
// pixel position provably constant regardless of how big the viewBox has
// to grow to fit content (see history.md for the derivation) — so all that
// changes frame to frame is zoom, never the marker's screen position. This
// also gives F7 (rescale-to-fit) for free: when content would overflow,
// both viewBox dimensions grow together (uniform zoom-out around the fixed
// marker anchor) instead of an independent per-axis fit.
//
// F7 (rescale-to-fit, overflow-safe): the box sized to fit content must
// include label extents, not just the route line's bbox — a label sitting
// off to the side of the last segment can stick out past the line's bbox
// by more than the generic padding. Labels are measured (via a scratch
// canvas 2d context, same font/size as the rendered SVG text) and their
// bounding boxes are folded into the content extent before the viewBox
// size is chosen, so long-distance labels ("14.0 km") never clip.
//
// F14 (label collision): label anchors are first placed by the same
// perpendicular-offset-from-the-line rule as before (so they stay off the
// route), then a small pairwise rectangle-separation pass nudges any two
// overlapping labels apart until none overlap. With at most a handful of
// labels on screen (layout.js caps the maneuver count) this converges in
// a few iterations.

(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';

  // layout.js owns the frame geometry (its windowing rule needs it and it
  // derives Lmax from it); the renderer's viewBox reads the same values so
  // the two can never disagree. layout.js is always loaded first.
  var LAYOUT_DEFAULTS = (globalThis.DiagramLayout && globalThis.DiagramLayout._defaults) || {};

  var DEFAULTS = {
    padding: 32,            // user-space padding around content bbox
    viewportWidth: 300,     // aspect ratio for the legacy fit-to-content camera
    viewportHeight: 420,
    // Fixed camera (default): the viewBox is a constant frame. Constant
    // frame = constant scale, so drawn lengths are comparable across
    // frames — the same 107 m leg is the same size on screen no matter
    // what shares the window with it. The frame and the log mapping are
    // calibrated together in layout.js: two ceiling-distance legs in the
    // same direction reach exactly the frame edge straight ahead
    // (2·Lmax = markerAnchorY·frameHeight), and layout.js only includes
    // maneuvers that fit, so overflow is limited to the guaranteed-minimum
    // pair pointing sideways — which clips, never rescales.
    fitToContent: false,    // true restores the old per-frame auto-zoom
    frameWidth: LAYOUT_DEFAULTS.frameWidth || 660,
    frameHeight: LAYOUT_DEFAULTS.frameHeight || 540,
    markerAnchorX: LAYOUT_DEFAULTS.markerAnchorX || 0.5,   // marker's fixed screen fraction (F8)
    markerAnchorY: LAYOUT_DEFAULTS.markerAnchorY || 0.87,  // content grows upward
    // Proximity tint: the current leg and the maneuver glyph at its end
    // blend from routeColor toward alertColor as the maneuver approaches.
    alertColor: '#d92b2b',
    alertFar: 300,          // m — tint starts
    alertNear: 50,          // m — fully alertColor at/below this
    routeColor: '#1a56db',
    routeStrokeWidth: 14,
    jointRadius: 5,
    jointFill: '#ffffff',
    roundaboutRadius: 15,      // fixed glyph size, independent of leg length
    roundaboutStrokeWidth: 6,
    posDotRadius: 9,
    posDotRingRadius: 15,
    posDotFill: '#1a56db',
    posDotRingColor: '#ffffff',
    labelFontSize: 15,
    labelFontWeight: 600,
    labelColor: '#111318',
    labelHaloColor: '#ffffff',
    labelHaloWidth: 4,
    labelOffset: 16,         // distance from the line to the label anchor
    background: null         // optional fill for a backdrop rect, e.g. '#f5f6f8'
  };

  var uidCounter = 0;

  function uid(svg, suffix) {
    if (!svg.id) svg.id = 'diagram-' + (++uidCounter);
    return svg.id + '-' + suffix;
  }

  function clamp(x, lo, hi) {
    return Math.min(Math.max(x, lo), hi);
  }

  // Linear blend between two #rrggbb colors, u in [0,1].
  function mixColor(a, b, u) {
    function toRgb(h) {
      h = h.replace('#', '');
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    var A = toRgb(a), B = toRgb(b);
    var c = A.map(function (v, i) { return Math.round(v + (B[i] - v) * u); });
    return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
  }

  function el(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) {
      if (attrs[k] !== null && attrs[k] !== undefined) node.setAttribute(k, attrs[k]);
    }
    return node;
  }

  // F5: meters below 1 km, kilometers with one decimal above.
  function formatDistance(m) {
    if (m === null || m === undefined || !isFinite(m)) return '';
    if (m >= 1000) return (m / 1000).toFixed(1) + ' km';
    return Math.round(m) + ' m';
  }

  // --- label text measurement (F7) -------------------------------------
  // A scratch canvas 2d context measures glyph width in the same numeric
  // units as SVG font-size (both are just a number sized against the
  // current coordinate system), so this approximates the rendered label's
  // width in user units well enough to size the viewBox around it.
  var _measureCtx = null;
  function measureTextWidth(text, fontSize, fontWeight) {
    if (!_measureCtx) {
      _measureCtx = document.createElement('canvas').getContext('2d');
    }
    _measureCtx.font = fontWeight + ' ' + fontSize + 'px system-ui, -apple-system, sans-serif';
    return _measureCtx.measureText(text).width;
  }

  // A segment is a cubic Bezier when layout.js attached control points
  // (spline leg shape), a straight line otherwise.
  function segIsCurved(seg) {
    return seg.cx1 !== undefined;
  }

  // SVG path continuation for one segment (the 'M' is the caller's).
  function segPathTail(seg) {
    if (segIsCurved(seg)) {
      return ' C ' + seg.cx1 + ',' + seg.cy1 + ' ' + seg.cx2 + ',' + seg.cy2 +
             ' ' + seg.x2 + ',' + seg.y2;
    }
    return ' L ' + seg.x2 + ',' + seg.y2;
  }

  // Build the label anchor (before collision resolution) for one segment,
  // offset perpendicular from the leg. Curved legs use the Bezier's
  // midpoint and tangent at t=0.5 so the label follows the curve instead
  // of sitting on top of it.
  function baseLabelPosition(seg, opts) {
    var mx, my, dx, dy;
    if (segIsCurved(seg)) {
      mx = (seg.x1 + 3 * seg.cx1 + 3 * seg.cx2 + seg.x2) / 8;
      my = (seg.y1 + 3 * seg.cy1 + 3 * seg.cy2 + seg.y2) / 8;
      dx = seg.x2 + seg.cx2 - seg.cx1 - seg.x1; // ∝ tangent at t=0.5
      dy = seg.y2 + seg.cy2 - seg.cy1 - seg.y1;
    } else {
      mx = (seg.x1 + seg.x2) / 2;
      my = (seg.y1 + seg.y2) / 2;
      dx = seg.x2 - seg.x1;
      dy = seg.y2 - seg.y1;
    }
    var len = Math.hypot(dx, dy) || 1;
    var ux = dx / len, uy = dy / len;
    var px = uy, py = -ux; // perpendicular, consistently to one side
    var offset = opts.routeStrokeWidth / 2 + opts.labelOffset;
    return { x: mx + px * offset, y: my + py * offset };
  }

  // F14: pairwise rectangle separation. Mutates each label's cx/cy in
  // place until no two boxes overlap (or the iteration budget runs out —
  // with ~3 labels plus the marker this always settles well inside the
  // budget). `obstacles` are fixed boxes (e.g. the position marker) that
  // push labels away but never move themselves.
  function resolveLabelCollisions(labels, obstacles) {
    var MARGIN = 2;
    var all = labels.concat(obstacles || []);
    for (var iter = 0; iter < 16; iter++) {
      var moved = false;
      for (var i = 0; i < all.length; i++) {
        for (var j = i + 1; j < all.length; j++) {
          var a = all[i], b = all[j];
          if (a.fixed && b.fixed) continue;
          var dx = b.cx - a.cx;
          var dy = b.cy - a.cy;
          var overlapX = (a.halfW + b.halfW) - Math.abs(dx);
          var overlapY = (a.halfH + b.halfH) - Math.abs(dy);
          if (overlapX > 0 && overlapY > 0) {
            moved = true;
            var axis = overlapX < overlapY ? 'x' : 'y';
            var overlap = axis === 'x' ? overlapX : overlapY;
            var d = axis === 'x' ? dx : dy;
            var sign = d === 0 ? 1 : (d > 0 ? 1 : -1);
            // Split the push between the two boxes, all of it going to
            // whichever side isn't fixed.
            var shareA = a.fixed ? 0 : (b.fixed ? 1 : 0.5);
            var shareB = b.fixed ? 0 : (a.fixed ? 1 : 0.5);
            var push = overlap + MARGIN;
            if (axis === 'x') {
              a.cx -= sign * push * shareA;
              b.cx += sign * push * shareB;
            } else {
              a.cy -= sign * push * shareA;
              b.cy += sign * push * shareB;
            }
          }
        }
      }
      if (!moved) break;
    }
  }

  function draw(svgEl, layoutResult, opts) {
    opts = Object.assign({}, DEFAULTS, opts || {});

    while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
    svgEl.setAttribute('xmlns', SVG_NS);

    var segments = (layoutResult && layoutResult.segments) || [];
    var bbox = (layoutResult && layoutResult.bbox) || { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    var pad = opts.padding;

    // --- label placement + measurement, before the viewBox is sized, so
    // labels can push the required content extent (F7 + F14) ---
    var labels = segments.map(function (seg) {
      var pos = baseLabelPosition(seg, opts);
      var text = formatDistance(seg.realDist);
      var textWidth = measureTextWidth(text, opts.labelFontSize, opts.labelFontWeight);
      return {
        text: text,
        cx: pos.x,
        cy: pos.y,
        halfW: textWidth / 2 + opts.labelHaloWidth / 2 + 2,
        halfH: opts.labelFontSize / 2 + opts.labelHaloWidth / 2 + 2
      };
    });
    var markerObstacle = {
      cx: 0, cy: 0,
      halfW: opts.posDotRingRadius + 2,
      halfH: opts.posDotRingRadius + 2,
      fixed: true
    };
    resolveLabelCollisions(labels, [markerObstacle]);

    // --- content extent: route bbox + every (resolved) label box ---
    var minX = bbox.minX, maxX = bbox.maxX, minY = bbox.minY, maxY = bbox.maxY;
    labels.forEach(function (l) {
      minX = Math.min(minX, l.cx - l.halfW);
      maxX = Math.max(maxX, l.cx + l.halfW);
      minY = Math.min(minY, l.cy - l.halfH);
      maxY = Math.max(maxY, l.cy + l.halfH);
    });

    // --- viewBox: marker fixed at (markerAnchorX, markerAnchorY) of the
    // box, box width:height ratio held fixed at viewportWidth:viewportHeight
    // (F8). Grow uniformly (both dimensions together) to fit content (F7).
    var FX = opts.markerAnchorX, FY = opts.markerAnchorY;
    var vbW, vbH;
    if (opts.fitToContent) {
      var R = opts.viewportWidth / opts.viewportHeight;
      var leftNeed = -minX + pad;
      var rightNeed = maxX + pad;
      var upNeed = -minY + pad;
      var downNeed = maxY + pad;
      vbH = Math.max(
        leftNeed / (FX * R),
        rightNeed / ((1 - FX) * R),
        upNeed / FY,
        downNeed / (1 - FY),
        opts.viewportHeight
      );
      vbW = R * vbH;
    } else {
      // Fixed camera: constant scale on every frame (see DEFAULTS note).
      vbW = opts.frameWidth;
      vbH = opts.frameHeight;
    }
    var vbX = -FX * vbW;
    var vbY = -FY * vbH;

    svgEl.setAttribute('viewBox', vbX + ' ' + vbY + ' ' + vbW + ' ' + vbH);
    svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svgEl.setAttribute('role', 'img');
    svgEl.setAttribute('aria-label', ariaSummary(segments));

    var defs = el('defs', {});
    svgEl.appendChild(defs);

    if (opts.background) {
      svgEl.appendChild(el('rect', {
        x: vbX, y: vbY, width: vbW, height: vbH, fill: opts.background
      }));
    }

    if (!segments.length) {
      drawPositionMarker(svgEl, opts);
      return;
    }

    // --- arrowhead marker, scaled with the route stroke width ---
    var arrowId = uid(svgEl, 'arrow');
    var arrow = el('marker', {
      id: arrowId,
      viewBox: '0 0 10 10',
      refX: 7.5, refY: 5,
      markerWidth: 2.6, markerHeight: 2.6,
      orient: 'auto-start-reverse'
    });
    arrow.appendChild(el('path', { d: 'M0,0 L10,5 L0,10 L3.2,5 Z', fill: opts.routeColor }));
    defs.appendChild(arrow);

    // --- the route line: one continuous path so rounded joins are
    // automatic; curved (spline) segments emit cubic Bezier commands. The
    // marker-end arrowhead orients along the path's end tangent, so on a
    // curved last leg it points where the road actually arrives. ---
    var d = 'M ' + segments[0].x1 + ',' + segments[0].y1;
    for (var i = 0; i < segments.length; i++) {
      d += segPathTail(segments[i]);
    }
    svgEl.appendChild(el('path', {
      d: d,
      fill: 'none',
      stroke: opts.routeColor,
      'stroke-width': opts.routeStrokeWidth,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'marker-end': 'url(#' + arrowId + ')'
    }));

    // --- proximity tint, per maneuver ---
    // Each segment's urgency comes from the CUMULATIVE distance to ITS
    // maneuver (distToManeuver), not just the first leg's: three turns
    // packed inside the alert zone are all "danger now" and all go red,
    // while a long leg right after them stays blue. Urgency is 0 at
    // alertFar meters out, 1 at alertNear.
    function segUrgency(seg) {
      var d = seg.distToManeuver !== undefined ? seg.distToManeuver : seg.realDist;
      return clamp((opts.alertFar - d) / (opts.alertFar - opts.alertNear), 0, 1);
    }
    function segColor(seg) {
      return mixColor(opts.routeColor, opts.alertColor, segUrgency(seg));
    }
    for (var ov = 0; ov < segments.length; ov++) {
      var oseg = segments[ov];
      if (segUrgency(oseg) > 0 && oseg.drawnLen > 0.5) {
        svgEl.appendChild(el('path', {
          d: 'M ' + oseg.x1 + ',' + oseg.y1 + segPathTail(oseg),
          fill: 'none',
          stroke: segColor(oseg),
          'stroke-width': opts.routeStrokeWidth,
          'stroke-linecap': 'round'
        }));
      }
    }

    // --- maneuver glyphs at segment endpoints ---
    // Each segment's end vertex IS its maneuver's location. A merged
    // roundabout (turn.glyph === 'roundabout') draws as a small circle on
    // the path — the next segment leaves it in the exit direction. Fixed
    // size, independent of leg length. Other maneuvers get the usual small
    // joint dot (internal vertices only; the path's last vertex keeps just
    // the arrowhead).
    for (var j = 0; j < segments.length; j++) {
      var seg = segments[j];
      var glyphStroke = segColor(seg);
      if (seg.turn && seg.turn.glyph === 'roundabout') {
        svgEl.appendChild(el('circle', {
          cx: seg.x2, cy: seg.y2, r: opts.roundaboutRadius,
          fill: opts.jointFill, stroke: glyphStroke,
          'stroke-width': opts.roundaboutStrokeWidth
        }));
        if (seg.turn.exit !== null && seg.turn.exit !== undefined) {
          // Exit count inside the circle — the key datum at a roundabout.
          svgEl.appendChild(el('text', {
            x: seg.x2, y: seg.y2,
            'text-anchor': 'middle',
            'dominant-baseline': 'central',
            'font-size': 15,
            'font-weight': 700,
            'font-family': 'system-ui, sans-serif',
            fill: glyphStroke
          })).textContent = String(seg.turn.exit);
        }
      } else if (j < segments.length - 1) {
        svgEl.appendChild(el('circle', {
          cx: seg.x2, cy: seg.y2, r: opts.jointRadius,
          fill: opts.jointFill, stroke: glyphStroke, 'stroke-width': 2
        }));
      }
    }

    // --- per-leg distance labels, collision-resolved above, halo for contrast ---
    var labelGroup = el('g', { 'font-family': 'system-ui, -apple-system, sans-serif' });
    for (var s = 0; s < segments.length; s++) {
      var lbl = labels[s];
      labelGroup.appendChild(el('text', {
        x: lbl.cx, y: lbl.cy,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'font-size': opts.labelFontSize,
        'font-weight': opts.labelFontWeight,
        fill: opts.labelColor,
        stroke: opts.labelHaloColor,
        'stroke-width': opts.labelHaloWidth,
        'stroke-linejoin': 'round',
        'paint-order': 'stroke'
      })).textContent = lbl.text;
    }
    svgEl.appendChild(labelGroup);

    drawPositionMarker(svgEl, opts);
  }

  function drawPositionMarker(svgEl, opts) {
    // F8: fixed "you are here" marker, always at the origin in local
    // coordinates — kept at a fixed screen position by draw()'s viewBox
    // math above, not by anything in this function.
    var group = el('g', {});
    group.appendChild(el('circle', {
      cx: 0, cy: 0, r: opts.posDotRingRadius,
      fill: 'none', stroke: opts.posDotRingColor, 'stroke-width': 3
    }));
    group.appendChild(el('circle', {
      cx: 0, cy: 0, r: opts.posDotRadius,
      fill: opts.posDotFill, stroke: opts.posDotRingColor, 'stroke-width': 2
    }));
    svgEl.appendChild(group);
  }

  function ariaSummary(segments) {
    if (!segments.length) return 'Route diagram: no upcoming maneuvers';
    var first = segments[0];
    var count = segments.length;
    return 'Route diagram: next ' + count + (count === 1 ? ' maneuver' : ' maneuvers') +
      ', ' + formatDistance(first.realDist) + ' to the next turn';
  }

  globalThis.DiagramRender = { draw: draw, formatDistance: formatDistance };
})();
