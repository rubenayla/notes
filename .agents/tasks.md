<!-- read in full — kept under 150 lines -->
# Tasks

Shared task board. Claim a task by moving it to In Progress with `[YYYY-MM-DD agent:id]` before starting. Mark Done with date when verified.

## TODO
- **Verify live site reachability**: confirm https://notes.rubenayla.xyz/ and /standards/ load in a browser (couldn't test from the dev machine — local network can't reach Cloudflare-proxied hosts). If 5xx, check Cloudflare SSL/TLS mode is "Full" (the apex zone setting should already cover it).
- **Tidy standards.md for the outside reader**: it moved over verbatim from the portfolio, where it was partly private scratch (hotkeys, screw-bit sizes). Pass over it with the Audience-priority lens — anything only the author can parse either gets explained or moves to the private vault.

## In Progress

## Done
- [2026-06-07] **Split notes out of portfolio**: created repo `rubenayla/notes`, MkDocs Material site, moved `standards.md` in, deployed to notes.rubenayla.xyz, one-directional link back to portfolio.
- [2026-06-07] **Seed agents files**: AGENTS.md + .agents/{tasks,history,error-log}.md.
