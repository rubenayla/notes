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
