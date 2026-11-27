# CLAUDE.md: beyondzenith.com.au

Read this file before you change anything. Claude (the claude.ai app) and Claude Code both work on this
repo. This file is how they stay in step. Read `README.md` for the file layout.

## Sources of truth

| What | Where | Rule |
|---|---|---|
| The code | This repo on GitHub. Claude Code runs in the cloud and clones it from GitHub. Claude (app) works in Anastas's local clone `~/bz-preview` | GitHub is the meeting point. Work is not shared until it is pushed. |
| Design rules and tokens | Beyond Zenith design system (claude.ai artifact `fec264f6-45b0-47d6-b31c-8e5518adf4fb`). Copy in this repo: `design/tokens.css` | The design system wins. If the site and the system disagree, ask Anastas. Do not change the system from here. |
| Photos | Anastas's photo library on his Mac (`~/Claude/images/`). Only Claude (app) can reach it | Claude (app) chooses, crops and commits photos into `art/`. Claude Code uses only photos already in `art/`. If a page needs a new photo, stop and say so in the PR. Do not generate art or use stock photos. |
| Work status | The pull request description (both tools). Claude (app) also keeps a line in Anastas's vault | Say in the PR what changed, what is open and what needs a visual review. |

## Who does what

- **Claude (app):** design and copy decisions, photos (choose, crop, grade, commit to `art/`),
  design-system changes, SEO and content review, visual review of the Netlify deploy preview. It
  commits in `~/bz-preview` but cannot push: Anastas pushes its branches.
- **Claude Code (cloud):** code changes across many pages, new pages from an agreed brief, fixes from
  review comments, the checks below, pushing branches and opening pull requests.
- **Anastas:** approves copy, pushes Claude (app)'s branches, merges to `main` (merge = live:
  Netlify deploys every push to `main`).

## Keeping in sync (both tools, every time)

1. Start from the latest GitHub state: `git fetch`, then check out `main` or the job's branch and
   `git pull`. If there are uncommitted changes you did not make, stop and ask.
2. One branch for each job (`fix/…`, `content/…`, `design/…`). Only one tool works on a branch at a time.
3. Never commit to `main` directly. Never force-push.
4. End: commit with a clear message that says what changed and why. Do not leave changes uncommitted.
5. Handoff: the tool that made the branch pushes it (Claude (app): Anastas pushes) → a PR → Claude
   (app) reviews the Netlify deploy preview and writes its review in the PR or the chat → Claude Code
   fixes → Anastas merges. Delete the branch after the merge.
6. Never let both tools change the same branch at the same time. To continue the other tool's
   branch, pull it first.
7. Design system changed? Copy the new values into `design/tokens.css` and say in the commit which
   version you copied.

## Design rules (short form; the design system has the full text)

- **The law:** a cold dark field and exactly one warm light. Use the accent (`--star`) for one thing at a
  time: the dot above the i, the last step, a role line, a link hover. Never for large areas or body text.
- The site is the dark theme: `night` ground, `deep` for raised areas, `ink` text, `soft` secondary text,
  `dim` muted text. One `paper` band at most (the contact band).
- One font: Geist (`/fonts/geist-latin.woff2`), weights 400, 500, 600 only. Size with the fluid steps
  (`--step-display`, `--step-head`, `--step-lead`), not with fixed sizes.
- Square corners everywhere. No gradients, no shadows, no cards or borders to group content. Use space
  and type size. Exception: a `line` rule above each section on inner pages.
- The footer holds facts only: company name, ABN, city, links, the year. No sign-off lines.
- The home Contact heading uses `--step-display` (Anastas approved, 20 Nov 2026), like the other section headings.
- No icons, arrows or chevrons. Write the word ("Menu", "Contact").
- Motion is slow and settles, one time only. Respect `prefers-reduced-motion`.
- **Reuse the existing classes.** Inner pages: `s-head`, `crumbs`, `lede`, `byline`, `actions`, `s-band`,
  `s-sec`, `s-body`, `points`, `steps`, `others`, `s-contact`, `prose`, `posts`. Copy the head, nav, menu
  and footer from an existing page. Add CSS only when no class fits, and put it in `css/page.css`
  (inner pages) or the `<style>` in `index.html` (home page).
- New CSS uses the values in `design/tokens.css`. Where the site still has an older value (`--dim`,
  `--star-light`, `--paper-soft`, field line, heading weight 500), keep the site value until Anastas
  approves the change.

## Images

- Take photos from `~/Claude/images/`. A photo passes when it has exactly one warm light, and that light
  covers 2% of the frame or less. Check before use.
- Bands are 21:9 (4:3 on phones, so check that the light stays in the crop at 390 px; use
  `object-position` if it does not). Grade slightly towards `night`. Save a `.jpg`, a `.webp`, a
  `-1260` copy of each, and a 1200 × 627 `-og` image for link previews.
- Text never sits on a photo with a scrim. Alt text describes the photo plainly.

## Copy

- Short, plain sentences. "We" for the company, "you" for the client, "I" only in the founder's section.
- Australian English and the typographic apostrophe (’). Sentence case. No emoji, no exclamation marks,
  no adjectives about ourselves ("seamless", "trusted"). Name the mechanism instead.
- Do not add claims, numbers, client names, partner badges or prices. Clients are described, not named.
- Use copy that Anastas gives as written. If you must write copy, show it to him before you commit.
- **On hold (do not change until Anastas says):** the "Our work" text on `/industries/insurance/`,
  `/services/ai-consulting/` and `/industries/freight-and-logistics/` (legal check), and the
  "Since 2021" dates on the home page and `/services/ai-consulting/`.

## Checks before every commit

- Run the site locally (`python3 -m http.server`) and look at each changed page at 390 px and 1440 px.
- Each page: one `h1`; canonical URL matches `sitemap.xml`; title under 65 characters; meta
  description under 160 characters; og tags match the title and description.
- Every internal link returns 200. No broken images. No horizontal scroll at 390 px. No console errors.
- Text contrast passes WCAG AA. Touch targets at least 24 px high on phones (the design system aims
  for 44 px).
- New page: add it to `sitemap.xml`, the nav dropdown, the phone menu and the footer on every page.
- Copy changed or page added? Run `python3 scripts/build_llms_full.py` and commit the new `llms-full.txt`.
- Do not delete the IndexNow key file (`cf1d0140f6cfb37104bc0c313d9b63fd.txt`). `.github/workflows/indexnow.yml` pings IndexNow after each push to `main`.
- `netlify.toml` has a Content Security Policy: no inline scripts, no outside scripts or styles unless
  you update the policy.
- Never commit client documents, call notes, keys or tokens.
