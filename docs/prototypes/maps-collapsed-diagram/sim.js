// sim.js — slider-driven progress simulation (F9, F12).
//
// Plain script, no imports/exports. Sets globalThis.DiagramSim.
//
// DiagramSim.init({ route, slider, onProgress })
//   - route: the ROUTE object (only route.totalDistance is used here).
//   - slider: an <input type="range"> element, expected min=0 max=1 (any
//     step). Its value is mapped linearly to meters along the route:
//       progressMeters = slider.value * route.totalDistance
//   - onProgress(progressMeters): called once on init (honoring ?t= if
//     present) and again on every 'input' event on the slider.
//
// URL parameter ?t=0.35 sets the initial slider position (0..1, clamped)
// on load, so headless screenshot tools can reach a specific moment
// without scripting slider drags (F12).

(function () {
  'use strict';

  function clamp01(x) {
    if (Number.isNaN(x)) return 0;
    if (x < 0) return 0;
    if (x > 1) return 1;
    return x;
  }

  function readInitialT() {
    try {
      var params = new URLSearchParams(globalThis.location ? globalThis.location.search : '');
      if (params.has('t')) {
        var t = parseFloat(params.get('t'));
        if (!Number.isNaN(t)) return clamp01(t);
      }
    } catch (e) {
      // no URL/location available (e.g. non-browser context) — fall through
    }
    return null;
  }

  function init(config) {
    config = config || {};
    var route = config.route;
    var slider = config.slider;
    var onProgress = config.onProgress || function () {};

    if (!route || typeof route.totalDistance !== 'number') {
      throw new Error('DiagramSim.init requires config.route with a numeric totalDistance');
    }
    if (!slider) {
      throw new Error('DiagramSim.init requires config.slider (an <input type="range"> element)');
    }

    var totalDistance = route.totalDistance;

    function currentT() {
      var v = parseFloat(slider.value);
      return clamp01(Number.isNaN(v) ? 0 : v);
    }

    function emit() {
      var progressMeters = currentT() * totalDistance;
      onProgress(progressMeters);
    }

    // Honor ?t= on load (F12); otherwise use the slider's own current value.
    var initialT = readInitialT();
    if (initialT !== null) {
      slider.value = String(initialT);
    }

    slider.addEventListener('input', emit);

    // Fire once on load so the diagram renders the initial state.
    emit();

    return {
      getProgressMeters: function () {
        return currentT() * totalDistance;
      }
    };
  }

  globalThis.DiagramSim = { init: init };
})();
