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
