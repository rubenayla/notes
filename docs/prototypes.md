# Prototypes

Working demos of ideas I'm building — runnable in the browser, no install.

## Collapsed maps diagram

A navigation overlay that shows the next few maneuvers as one clear diagram: distances are log-compressed so three turns within 100 m and a 10 km highway leg fit on the same screen, while every drawn angle stays exactly what you see through the windscreen. Legs are splines whose end tangents follow the real road bearings, the view is north-up so the picture never rotates under you, and maneuvers turn red as you approach them.

Current navigation apps show you one maneuver at a time; this shows the shape of what's coming — especially useful when several exits or turns arrive in quick succession.

- **[Diagram demo](prototypes/maps-collapsed-diagram/index.html)** — the diagram alone, with a progress slider and toggles.
- **[Map demo](prototypes/maps-collapsed-diagram/map.html)** — the diagram beside a real map (Leaflet + OpenStreetMap), playing a real Madrid route in real time at 1×/10×/60×.

The route is a fixed test fixture (Madrid centro → Monte de Viñuelas, 29.6 km, fetched from OSRM); progress is simulated with a slider or clock, not GPS. Prior art for the length distortion: LineDrive (Agrawala & Stolte, SIGGRAPH 2001), which proved non-uniform route scaling reads well — the sliding real-time window over upcoming maneuvers is the part that's new here.
