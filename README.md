# notes — Rubén Jiménez Mejías

**Live site: <https://notes.rubenayla.xyz/>**

Opinionated standards, references, and conventions — the defaults I've settled on after enough time picking sides, published so anyone can read them and so I can point people at a stable link. Built with MkDocs Material, hosted on GitHub Pages.

It's the personal-reference companion to my portfolio at <https://rubenayla.xyz/> (repo `rubenayla/portfolio`). The link is **one-directional**: this site links to the portfolio, the portfolio never links here — keeping the hiring-facing surface clean.

> **Audience priority.** This is published for *other people* to read. Write for the outside reader first; me and agents are the least-important audience. Phrase entries so a stranger gets them, not as private scratch.

(Distinct from the private `vault` repo, which holds whole-life personal notes; this is the publishable slice.)

## Local Development

```bash
git clone https://github.com/rubenayla/notes.git
cd notes
uv sync
uv run mkdocs build && python3 -m http.server 8006 --directory site
```

Then visit `http://localhost:8006/`.

## Deployment

Auto-deploys to GitHub Pages via GitHub Actions on push to `main`. The custom domain (`notes.rubenayla.xyz`) is wired through `docs/CNAME` plus a Cloudflare CNAME record (`notes` → `rubenayla.github.io`).

### Setup GitHub Pages

1. Repository Settings → Pages
2. Build and deployment source: "GitHub Actions"
3. Push to `main` to trigger

## Structure

```
notes/
├─ docs/
│  ├─ index.md       # landing — what this is, link back to portfolio
│  ├─ standards.md   # opinionated standards + anti-standards
│  ├─ javascripts/   # mathjax config
│  └─ CNAME          # notes.rubenayla.xyz
├─ mkdocs.yml        # site config + nav
├─ pyproject.toml
└─ .github/workflows/ # GitHub Actions deploy
```

## License

MIT.
