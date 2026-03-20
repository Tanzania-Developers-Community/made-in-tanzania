# Contributing to Made in Tanzania

This repository represents Tanzanian engineering to the world. Every project listed here carries that weight. We keep the bar high because quality is how we show what Tanzania builds.

---

## The fastest way to add a project

**1. Edit `website/projects.json`**

Add your entry following this exact schema:

```jsonc
{
  "name": "Your Project Name",
  "description": "One clear sentence. What does it do? Who is it for?",
  "emoji": "🚀",
  "tech": ["Python", "REST"], // array of relevant tech tags
  "author": "yourgithubusername",
  "authorUrl": "https://github.com/yourgithubusername",
  "repo": "https://github.com/yourusername/your-project",
  "stars": 0,
  "letter": "Y", // first letter of the project name
}
```

**2. Validate your entry**

```bash
npm run validate
```

**3. Regenerate the README**

```bash
npm run build
```

**4. Open a Pull Request**

Title format: `[Project Name] → [Letter]`
Example: `[GoPesa] → [G]`

---

## Acceptance criteria

A project must meet **all** of the following:

| Criterion                                     | Why it matters                      |
| --------------------------------------------- | ----------------------------------- |
| Built by a Tanzanian developer or team        | This is the whole point             |
| Open-source with a license                    | No license = can't be used          |
| Has a clear README                            | We can't list what we can't explain |
| Solves a stated problem or has learning value | Not a demo or placeholder           |
| Repository is reachable (not 404)             | We run link checks on every PR      |

We do **not** gate on star count. Stars correlate with network size, not engineering quality. If your project is useful and built by a Tanzanian, it belongs here.

---

## What we'll reject

- Repos with no README or empty README
- Forks of other projects with no significant original work
- Projects with no commits in the last 3 years and no clear maintainer
- Duplicate entries for the same project
- Projects without an open-source license

If your project was rejected, we'll explain why in the PR review. You can always address the feedback and reopen.

---

## Adding a translation

We maintain translations in `i18n/`. Currently:

- `i18n/README.sw.md` — Kiswahili

To add a new language:

1. Copy `i18n/README.sw.md` as a template
2. Save as `i18n/README.[language-code].md` (use [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) codes)
3. Translate the content
4. Add a language link in the main `README.md` header section
5. Open a PR with title: `[i18n] Add [Language Name] translation`

For translations, we strongly prefer native or near-native speaker review. If you're not a native speaker, note that in your PR so the community can help verify.

---

## Improving the website

The website lives in `website/`. It's vanilla HTML/CSS/JS — no build step, no framework.

- `index.html` — structure
- `styles.css` — all styles
- `app.js` — data loading, rendering, search/filter
- `projects.json` — the data (this is also the source for the README)

If you're improving the website, please test it locally before opening a PR:

```bash
cd website
npx serve .
# or: python3 -m http.server 8080
```

---

## Communication norms

| Use for...                    | Where                                                    |
| ----------------------------- | -------------------------------------------------------- |
| Proposing a new project       | [Issues](../../issues) — use the "Add Project" template  |
| Suggesting repo improvements  | [Issues](../../issues) — use the "Improve Repo" template |
| Open-ended ideas, discussions | [Discussions](../../discussions)                         |
| Translation help              | [Discussions](../../discussions) → Translations category |
| Bug in the website            | [Issues](../../issues)                                   |

We prefer public discussion over DMs. When things are discussed openly, the whole community benefits.

---

## PR checklist

Before submitting, verify:

- [ ] My entry is in `website/projects.json`
- [ ] I ran `npm run validate` and it passed
- [ ] I ran `npm run build` and the README updated correctly
- [ ] The repo link works (not 404)
- [ ] The project has a README
- [ ] The project has an open-source license
- [ ] I placed it under the correct letter in projects.json
- [ ] PR title follows the format: `[Project Name] → [Letter]`

---

## Adding the badge to your project

Show the world where you're from:

```markdown
[![Made in Tanzania](https://img.shields.io/badge/made%20in-tanzania-008751.svg?style=flat-square)](https://github.com/Tanzania-Developers-Community/made-in-tanzania)
```

[![Made in Tanzania](https://img.shields.io/badge/made%20in-tanzania-008751.svg?style=flat-square)](https://github.com/Tanzania-Developers-Community/made-in-tanzania)

---

We're building a public asset, not a dump list.

Tanzania is building. Let's show it. 🇹🇿
