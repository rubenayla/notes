<!-- read in full — kept under 150 lines -->
# notes — Agent Guide

Public notes of Rubén Jiménez Mejías — opinionated standards, references, and conventions. Static site built with MkDocs Material, hosted on GitHub Pages at https://notes.rubenayla.xyz/.

## Audience priority (the governing rule)
This site is published **for other people to read.** Write for the outside reader first; the author and agents are the least-important audience. Phrase every entry so a stranger gets it on its own — explain the *why*, name the thing precisely, don't leave it as private shorthand. A note that only the author can parse belongs in the private `vault`, not here.

## Link direction (notes → portfolio)
This site is the personal-reference companion to the recruiter-facing **portfolio** (`rubenayla/portfolio` → https://rubenayla.xyz/). Links flow **toward the showcase**: this site links *to* the portfolio (a `Portfolio ↗` nav entry). The portfolio keeps its *primary* surfaces (top nav, hero, page bodies) free of links here so the hiring skim stays clean — with one intentional exception: a single unobtrusive footer icon on the portfolio links to this site, found mainly by engaged engineers digging into the footer (for whom this site is a positive depth signal). Don't add prominent portfolio → notes links beyond that footer icon.

## Relationship to other repos
- **`rubenayla/portfolio`** (`~/repos/portfolio`) — recruiter-facing showcase. This notes site was split out of it on 2026-06-07 (the standards doc used to live there).
- **`rubenayla/vault`** (private) — whole-life personal notes. `notes` is the *publishable slice*; anything not meant for strangers stays in `vault`. The vault keeps a symlink `~/vault/standards.md` → `~/repos/notes/docs/standards.md`.

## Quick Reference
- Live: https://notes.rubenayla.xyz/
- Repo: https://github.com/rubenayla/notes
- Stack: MkDocs Material (Python, `uv`), deployed via GitHub Actions → Pages
- Domain: notes.rubenayla.xyz — GitHub Pages custom domain (`docs/CNAME`) + Cloudflare CNAME record (`notes` → `rubenayla.github.io`, proxied, mirroring the apex)

## Structure
```
docs/
  index.md       — landing: what this is, link back to portfolio
  standards.md   — opinionated standards + an Anti-Standards section
  javascripts/   — mathjax config (standards.md uses arithmatex)
  CNAME          — notes.rubenayla.xyz
mkdocs.yml       — site config, nav, theme (teal palette)
```

## Local Development
Avoid `mkdocs serve` (path-prefix issues, same as the portfolio repo). Instead:
```bash
uv run mkdocs build && python3 -m http.server 8006 --directory site
```
Then visit http://localhost:8006/. Build strict before pushing: `uv run mkdocs build --strict`.

## Deployment
Auto-deploys on push to `main` via `.github/workflows/deploy.yml` (GitHub Pages). Pages source is "GitHub Actions". The custom domain is set in repo Settings → Pages and via `docs/CNAME`.

## Adding content
1. Create `docs/<topic>.md`.
2. Add it under `nav:` in `mkdocs.yml`.
3. Write it for the outside reader (see Audience priority).

## Agent Files
- `.agents/tasks.md` — task board (TODO / In Progress / Done)
- `.agents/history.md` — dated record of decisions and context (grep, never read in full)
- `.agents/error-log.md` — mistakes and prevention rules

## standards.md conventions
- Entries are full sentences that name whose claim it is and whether it was verified — not bare comma-lists of specs (a spec scraped off the wrong model once became a "deciding factor"; full sentences force you to attribute the claim).
- The `Anti-Standards, do not use` section pairs each rejected default with the alternative to use instead and a `??? note "Why not"` collapsible. Follow that exact pattern when adding an entry; don't inline justification prose at the top of an item.
