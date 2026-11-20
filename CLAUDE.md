# CLAUDE.md: beyondzenith.com.au

Read this file before you change anything. Claude (the claude.ai app) and Claude Code both work on this
repo. This file is how they stay in step. Read `README.md` for the file layout.

## Sources of truth

| What | Where | Rule |
|---|---|---|
| The code | This repo, `main` on GitHub. Local clone: `~/bz-preview` | The only copy. Do not edit any other copy (the old one in `~/Claude/beyond zenith/site/` is retired). |
| Design rules and tokens | Beyond Zenith design system (claude.ai artifact `fec264f6-45b0-47d6-b31c-8e5518adf4fb`). Copy in this repo: `design/tokens.css` | The design system wins. If the site and the system disagree, ask Anastas. Do not change the system from here. |
| Photos | `~/Claude/images/` (Anastas's own generated photos) | Use these. Do not generate new art or use stock photos. |
| Work status | `~/Claude/05 - Operations/Beyond Zenith.md` (Brand and website) | Write one line there after each job: branch, commit, what changed, what is open. |

## Who does what

- **Claude (app):** design and copy decisions, image choice and grading, design-system checks, SEO
  and content review, visual review of the Netlify deploy preview. It edits files and commits on a
  branch. It cannot push.
- **Claude Code:** push, pull request, merge; changes across many pages; running the checks below.
- **Anastas:** approves copy, merges to `main` (merge = live: Netlify deploys every push to `main`).

## Keeping in sync (both tools, every time)

1. Start: `git status` must be clean. Then `git fetch` and `git pull` (or check out the job's branch).
   If there are uncommitted changes you did not make, stop and ask.
2. One branch for each job (`fix/…`, `content/…`, `design/…`). Only one tool works on a branch at a time.
3. Never commit to `main` directly. Never force-push.
4. End: commit with a clear message that says what changed and why. Do not leave changes uncommitted.
5. Handoff: Claude commits → Claude Code (or Anastas) pushes and opens the PR → Claude reviews the
   Netlify preview → Anastas merges.
6. Update the status line in the vault (see above).
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
- `netlify.toml` has a Content Security Policy: no inline scripts, no outside scripts or styles unless
  you update the policy.
- Never commit client documents, call notes, keys or tokens.
