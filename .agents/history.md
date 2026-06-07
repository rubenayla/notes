<!-- consult selectively — grep, never read in full -->
# History

Dated record of decisions, context, and findings (oldest first). Append at the end.

## 2026-06-07 — Repo created by splitting it out of the portfolio

This site began as the `standards.md` doc inside the portfolio repo. Timeline of that repo's name:
- Originally `rubenayla/portfolio`.
- 2026-05-21: renamed to `rubenayla/ruben` to make it a "personal hub" (portfolio + writing + standards + references + CV in one site).
- 2026-06-07: that consolidation was reversed. The portfolio went back to being recruiter-facing only (renamed `ruben` → `portfolio` again), and the personal standards/notes were split out into this new `rubenayla/notes` repo.

**Why the split.** A standards doc (connectors, hotkeys, screw bits, CAD prefs, an Anti-Standards list) reads as "me", and the author wanted that kept separate from the portfolio a recruiter sees. Decided: portfolio owns the prime domain `rubenayla.xyz` (it's the link on LinkedIn); notes goes to the subdomain `notes.rubenayla.xyz`. Link is one-directional (notes → portfolio, never the reverse) so the hiring surface stays clean.

**Naming deliberation.** Considered `ruben`, `notes`, `public-notes`. Landed on `notes`. The deciding principle came from the author: the site is published *for other people to read*, so it should be named for the outside reader, not for author/agent bookkeeping. The `public-` prefix only means something internally (contrast with the private `vault`), so it optimizes for the least-important audience; `notes` also matches the subdomain exactly. This "outside reader first" principle is now the governing rule in AGENTS.md.

**What triggered all this.** A question about whether 4mm banana plugs were in the Anti-Standards list. They were (blanket "Banana plugs — not reliable"). On review, the category isn't inherently unreliable — quality 4mm banana is the lab-bench standard and carries 20–32 A; cheap spring-wire plugs are the unreliable ones. So banana was moved *out* of Anti-Standards into the connectors standards list, scoped to bench/test power with an XT90S boundary for vibration/mobile. That edit (and noticing the doc deserved to live separately) led to the repo split.

**Infra notes.** Cloudflare DNS for the zone (proxied, orange cloud). Added a `notes` CNAME → `rubenayla.github.io`. GitHub Pages source = GitHub Actions; custom domain set via API + `docs/CNAME`. `rubenayla.github.io/notes/` returns 301 → custom domain, confirming the wiring. HTTPS at the edge is Cloudflare's, so GitHub's `https_enforced=false` is fine.
