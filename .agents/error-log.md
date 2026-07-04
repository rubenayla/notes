<!-- consult selectively — grep, never read in full -->
# Error Log

Mistakes and the prevention rule added for each. Grep for the area you're working in before starting. Newest at the bottom.

## 2026-06-26 — Built a public page from scratch instead of from the author's prepared idea
**What:** Asked to create the "Dozenal" page, I wrote it from the thin `standards.md` snippet (a few lines) and published it. The author already had a rich, polished write-up at `~/vault/ideas/dozenal/README.md` — divisor-density argument with a generated plot, the base-11 plank-cutting comparison, verified fraction expansions, a basekit repo link. The published page was "way way waaay too short" and the author feared their work was lost.
**Root cause:** Didn't check for existing prepared content before writing. The vault `ideas/` folder is the inbox where the author drafts exactly this kind of thing; a 5-second `grep -ril dozenal ~/vault/ideas` would have found it. Same failure pattern as "search local sources before redoing work."
**Prevention:**
- Before writing a new notes/portfolio page on a topic, grep `~/vault/ideas/` and `~/vault` (and the target repo) for existing content first. The vault → notes pipeline means most "Proposed future standards" pages should be *promoted from* an existing vault idea, not written fresh.
- When a page is meant to publish an idea the author has clearly thought about, assume a draft exists until proven otherwise.
- Nothing was lost here (the public page is a separate file in the notes repo; the vault original was untouched) — but the wasted-work scare is avoidable by checking first.

## 2026-07-05 — Broke the "ONE connector" requirement to patch a local mismatch
**What:** On the DC-connector page, the user asked how a small (48 V) plug and a big (400 V) plug could mate. I "fixed" it by declaring two keyed sizes that *deliberately don't intermate* (XT30/60/90-style), and wrote that into the page — turning one universal connector into a family of incompatible plugs, the exact thing the design exists to replace. User: "You just decided to break the whole design and make it unusable. We're designing 1 (ONE) connector, not 20 incompatible pieces of shit."
**Root cause:** Resolved a local spec inconsistency (small vs big can't mate) by abandoning the top-level requirement (one connector) instead of re-deriving the fix *from* it. I never re-checked my patch against the stated goal. I had also earlier seeded the inconsistency (separate 12 mm / 26 mm "members" in the sizing tables) without flagging it against one-connector.
**Prevention:**
- When a design tension surfaces, re-state the top-level requirement first and derive the fix from it. A fix that violates the headline goal is wrong by definition, however locally tidy.
- The correct pattern for "one connector must span a huge range" is the **USB-C model**: one physical size built for the maximum, with voltage/current **negotiated electronically**. Never multiple physical sizes. (See root `history.md` 2026-07-05.)
- Grep this log and root `history.md` for "connector" before editing that page.

## 2026-07-05 — Almost wrote project history into `.agents/history.md` (wrong location)
**What:** Went to log the above into `.agents/history.md`. The documented standard is `history.md` at **topic/folder level or repo root**, never inside `.agents/`. This repo already had a misplaced `.agents/history.md`; migrated it to repo-root `history.md` and fixed the AGENTS.md pointer.
**Root cause:** Followed the `.agents/` = project-knowledge habit without checking the placement rule in `~/.claude/.agents/reference.md` (line 31: history.md lives at folder/topic level; repo-root as fallback). `error-log.md`, `tasks.md`, `notes.md` DO stay in `.agents/`; `history.md` does not.
**Prevention:** `history.md` → repo root or `<topic>/history.md`. Only error-log/tasks/notes/scratchpad live under `.agents/`. Check reference.md when unsure, don't pattern-match.

## 2026-07-05 — Derived tier limits from USB-C's spec instead of this design's own parts
**What:** On the DC-connector page, twice anchored the low tier's power on USB-C numbers: first accepted "240 W at 48 V" (USB-C EPR max) as the tier ceiling, then proposed derating to ~50 W (USB-C default class). User: "how the fuck are you going to limit it to such low power? then we could just use USB!" The connector's own contacts are rated 25 A — at 48 V that's 1.2 kW; the current rating is thermal and voltage-independent, and I never stated it until asked.
**Root cause:** Reasoned by analogy to a neighboring standard instead of from the design's own physical parts. Also presented power/current/heat conclusions without showing the current figure they rest on.
**Prevention:** Derive limits from this design's rated parts (contact current, insulation voltage), never from another standard's marketing numbers. Always state the current alongside any power claim (P = V·I — the user checks the arithmetic).

## 2026-07-05 — Restated a user requirement as a smaller number without flagging it
**What:** Said "handheld devices in the 240 W–2 kW band" while the stated connector limit is 10 kW. The 2 kW was a descriptive fact about today's appliances, but phrased as a band it read as a spec change. User: "It's annoying when you modify my requirements without explicitly asking. 10 kW is the upper limit." Follow-up insight (now in root history.md): today's appliance ceilings ARE the old plugs' ratings reflected back, so they must not be recycled as limits for a new connector.
**Root cause:** Mixed descriptive observations about today's devices into normative spec language without labeling which was which.
**Prevention:** Quote requirement numbers verbatim (10 kW is 10 kW). When mentioning a smaller empirical number near a requirement, label it explicitly as description ("today's devices happen to…"), or leave it out.
