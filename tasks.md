<!-- read in full — kept under 150 lines -->
# Tasks

Shared task list. State lives in an inline marker on each bullet, not in which section it sits under — claim in place with `[→ YYYY-MM-DD agent:id]`, block with `[⏸ reason]`, finish with `[x YYYY-MM-DD]`. No moving lines between sections.

## Tasks
- [ ] **Extend the constant-grounded system to time + mass units**: the [fundamental distance unit](../docs/ideas/fundamental-distance-unit.md) is distance only. Add time and mass on the same rule (fundamental constant × 12^N, only the dozenal hop chosen), turning a lone unit into a full *system*. Prior art to mine and beat: the Harmonic System (time / mass / temperature). Gotcha: the Planck time inherits G's imprecision exactly like the Planck length, so the floor-vs-precision decision (and the minimal-time "floor" argument) repeats — see root `history.md` 2026-06-26 for the distance-unit reasoning to reuse.
- [ ] **Verify live site reachability**: confirm https://notes.rubenayla.xyz/ and /standards/ load in a browser (couldn't test from the dev machine — local network can't reach Cloudflare-proxied hosts). If 5xx, check Cloudflare SSL/TLS mode is "Full" (the apex zone setting should already cover it).
- [ ] **Tidy standards.md for the outside reader**: it moved over verbatim from the portfolio, where it was partly private scratch (hotkeys, screw-bit sizes). Pass over it with the Audience-priority lens — anything only the author can parse either gets explained or moves to the private vault.
- [x 2026-06-07] **Split notes out of portfolio**: created repo `rubenayla/notes`, MkDocs Material site, moved `standards.md` in, deployed to notes.rubenayla.xyz, one-directional link back to portfolio.
- [x 2026-06-07] **Seed agents files**: AGENTS.md + .agents/{tasks,history,error-log}.md.
