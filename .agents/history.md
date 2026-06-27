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

**Infra notes.** Cloudflare DNS for the zone. Added a `notes` CNAME → `rubenayla.github.io`. GitHub Pages source = GitHub Actions; custom domain set via API + `docs/CNAME`. `rubenayla.github.io/notes/` returns 301 → custom domain, confirming the wiring.

## 2026-06-07 — Design decision: the portfolio gets the apex (`rubenayla.xyz`), notes stays a subdomain

Considered putting the portfolio on `portfolio.rubenayla.xyz` and leaving the apex as a neutral hub. Decided against it. The governing principle: **give the apex to the dominant, highest-stakes facet; don't force parity on a real hierarchy.**

- The bare apex is the cleanest, most authoritative, most memorable URL, and it's the one that goes on the CV/LinkedIn. The content whose job is to win over the highest-stakes audience (recruiters/collaborators) is the portfolio — so it gets the best URL.
- The portfolio and the notes are **not co-equal**. Portfolio is primary; notes is a secondary, niche reference. The asymmetry (portfolio at apex, notes at `notes.`) correctly encodes that priority. Making them parallel sibling subdomains would flatten a real hierarchy and demote the most important page to look like "just a section."
- `portfolio.rubenayla.xyz` is strictly worse here: the apex can't sit empty, so you'd either build/maintain a separate hub page (inserting a click between recruiter and portfolio — recruiters have no patience for a router) or redirect apex → subdomain (extra hop, and the URL bar shows the longer subdomain anyway). Worst of both.
- No hub benefit is lost: the portfolio's homepage already *is* the personal front door (CV-style landing with links to GitHub/LinkedIn/CV/projects). You get the hub at the apex without sacrificing the apex.
- The only case that would flip this: several genuinely co-equal public sites (blog + conlang + invest + portfolio, none primary) → an apex hub routing to all earns its keep. Not the situation here: one career front door + satellites. When there's a clear primary, it takes the apex.

## 2026-06-07 — Gotcha: set the Cloudflare record to "DNS only" (grey cloud) when GitHub issues the Pages cert

GitHub Pages provisions its HTTPS cert (Let's Encrypt) by running an ACME challenge directly against the custom domain. If the Cloudflare record is **proxied (orange cloud)**, Cloudflare intercepts the challenge and GitHub's verification fails — and GitHub then sits on the stale failure without auto-retrying (cert state stays `null` indefinitely). Symptom this session: site wouldn't load; `gh api repos/<o>/<r>/pages` showed `https_certificate.state = null` for 15+ min.

Fix sequence that worked:
1. Cloudflare → DNS → toggle the record to **grey cloud (DNS only)** so traffic reaches GitHub directly (`dig` should then return `185.199.108–111.153`, not Cloudflare's `188.114.x`).
2. Force GitHub to re-verify by removing + re-adding the custom domain (it won't retry on its own):
   `echo '{"cname":null}' | gh api --method PUT repos/<o>/<r>/pages --input -` then re-PUT with the real cname.
   Cert state then advances `null` → `authorization_pending` → `approved` within minutes.
3. Enable enforcement: `echo '{"https_enforced":true}' | gh api --method PUT repos/<o>/<r>/pages --input -`.

Same failure also fires when **renaming a Pages repo** that has a proxied custom domain (the rename triggers a cert re-issue the proxy blocks — it took the apex `rubenayla.xyz` down this same day; see `~/repos/portfolio/.agents/error-log.md` 2026-06-07).

Rule of thumb: **"DNS only when doing DNS"** — keep the Pages record grey for cert issuance (and ideally leave it grey; that's GitHub's recommended setup). CAA was *not* the blocker here — the zone (via the `github.io` CNAME) already authorizes `letsencrypt.org`. Separately, a Cloudflare **redirect rule** on the zone was catching the proxied subdomain and bouncing it to the apex; grey cloud also sidesteps that (rules only apply to proxied traffic).

## 2026-06-26 — Link rule refined: a single footer link portfolio → notes is now allowed

The 2026-06-07 split set the link rule as strictly **one-directional** — notes → portfolio, *never* the reverse — to keep the recruiter-facing surface clean. The author decided to relax it: the portfolio now carries one **unobtrusive footer social icon** ("Notes", `fontawesome/solid/book`) linking here. Both `AGENTS.md` files were updated to match, so the docs no longer contradict the live site.

**Why the absolute rule was too strict.** The rule's real goal is protecting the *primary skim surface* a recruiter sees in 30 seconds — hero, projects, CV button. A footer icon isn't on that path: the person who digs into footer links is an engaged engineer or hiring manager who already wants more depth, and for *that* reader the notes site is a **positive** signal (opinionated first-principles rigor), not a distraction. So the link is invisible to the audience it could cost and visible to the audience it helps. The refined rule keeps the intent precise: **primary surfaces (top nav, hero, page bodies) stay notes-free; a single subtle footer link is the one allowed exception.** Prominent portfolio → notes links are still out.

This was a deliberate author decision (the author explicitly asked for the link), not a rule violation — recorded here rather than in an error log.

Also formalized the same day: the **publishing pipeline** (vault → notes → portfolio), sorted by how finished a piece is — raw/private in `vault`, living/public reference in `notes`, finished/curated showcase in `portfolio`. Pieces graduate rightward; a polished essay can graduate from a notes exploration to a portfolio/writing page, with notes linking *up* to it. Full description in `~/vault/AGENTS.md` ("Publishing pipeline").

## 2026-06-26 — Distance unit for the dozenal "Future standards" system: keep Planck × 12^N, discard the harmon

Worked out from first principles how to define the distance unit for the aspirational dozenal measurement system (a "Future standards" candidate, not a current pick). **Decision: keep the author's own unit — Planck length × 12^N — and discard the existing Harmonic System's "harmon."**

**Hard rule adopted for the system:** a fundamental unit must be defined purely from physical constants; the *only* permitted human choice is the integer power of twelve (12^N) that scales it to human convenience. No frozen/arbitrary reference values, no fitting to legacy units.

**Size of the unit** — Planck length (ℓ_P = 1.616×10⁻³⁵ m) × 12^N:
- N = 31 → 4.6 cm · **N = 32 → 0.553 m** (the natural human-scale base unit) · N = 33 → 6.63 m.

**Physics established along the way (condensed reasoning):**
- The SI's "exact" *h* and *k_B* are **conventions**, fixed by fiat in the 2019 redefinition. Fixing them created no physical accuracy — it relocated the uncertainty (e.g. into the realization of the kilogram). So "exactness" is not a reason to favour a constant.
- Only **dimensionless** constants (fine-structure α, mass ratios) are convention-free physics. Every **dimensional** constant (c, ħ, G, k_B) is a conversion factor whose value reflects an arbitrary unit choice. *k_B* is **redundant, not arbitrary**: temperature is energy in disguise (k_B = 1 in natural units); the arbitrary thing is the temperature unit, and the length unit is dimensionally independent of it.
- **G is the worst-measured constant in physics** (~2×10⁻⁵ relative uncertainty; gravity is too weak and has no exact macroscopic quantum effect to exploit, unlike EM's Josephson / quantum-Hall). So anything tied to the Planck length (ℓ_P = √(ħG/c³)) inherits ~10⁻⁵ realizability. **Accepted trade-off:** ~10⁻⁵ is far beyond any human/engineering need (nobody measures length better than ppm), so for a human-scale unit the G-imprecision is irrelevant; fundamentality wins. The *definition* is exact; the *realization* sharpens as G is measured better — honest, not faked, precision.

**Why the Harmonic System (Dozenal Wiki / "Universal Unit System", asahi-net dd6t-sg) was discarded** despite being genuinely physics-based:
- Its length unit, the **harmon = 272.35 mm**, is strictly defined as (dozenal `1,001,700;`) ÷ Rydberg constant = 2,988,720 / R∞ — anchored to the **Rydberg constant** (a *precise* atomic constant, ~10⁻¹²; G only sets the rough "conceptual" scale, not the operational definition). So it is precise and physics-based.
- But the multiplier `1,001,700;` is **not a single clean power of twelve.** A clean 12⁶ (= `1,000,000;`) gives (1/R∞)×12⁶ = 272.09 mm. The harmon nudges that by **+0.09%** to flatter legacy units (100 yd ≈ 240 harmons, cubic half-harmon ≈ 2/3 US gallon, ~1/10⁷dozenal of Earth's meridian). That deliberate fudge toward yards/gallons is exactly the arbitrary fit the hard rule forbids.

**Decided: the Planck anchor.** Unit ≡ **12^N Planck lengths** — a convention-free specification whose only chosen input is the integer N (the count of ×12 "order-of-magnitude" hops to human scale); the Planck length is fixed by nature (ħ, G, c) and 12 is principled, not arbitrary (smallest highly-composite number → cleanest halves/thirds/quarters). The author's framing: "12 is fundamental, the parameters of the universe are fundamental; the only arbitrary thing is the number of ×12 hops — nothing more."

Rejected the precise atomic alternatives (Rydberg / Bohr / electron Compton, ~10⁻¹⁰) because they reference a contingent particle rather than pure spacetime-gravity — maximal fundamentality is weighted over realizable precision, accepting that the unit's metre-value is only ~5 figures (G-limited): exact by definition, sharpening as G improves, and far beyond any human-scale need anyway. Kept for the record if precision ever trumps purity: (1/R∞) × 12⁶ = 272.09 mm, the harmon minus its legacy fudge.

Sources: [The Harmonic System — Dozenal Wiki](https://dozenal.fandom.com/wiki/The_Harmonic_System) · [Universal Unit System (asahi-net dd6t-sg)](http://www.asahi-net.or.jp/~dd6t-sg/univunit-e/).
