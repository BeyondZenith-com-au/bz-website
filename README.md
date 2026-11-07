# beyondzenith.com.au

Static website for Beyond Zenith Software Pty Ltd. No build step.

- `index.html`: the whole site
- `site.js`: scroll effects and the contact form script
- `services/<name>/index.html`: one page for each service (delivery teams, data platforms, technical advisory). They use `css/page.css`. Add each new page to `sitemap.xml`.
- `privacy.html`: privacy policy, linked from the footer and the contact form
- `404.html`: page Netlify shows for an unknown URL
- `thanks.html`: page shown after the contact form is sent without JavaScript. The form uses Netlify Forms (form name `contact`).
- `favicon.svg`: site icon
- `anastas.jpg`, `anastas.webp`: portrait for the About section (640 × 800, 4:5)
- `art/`: photographs for the hero, Services and How we work sections (1536 px wide). Each photo has a `.webp` copy that browsers load first. If you replace a photo, replace both files.
- `fonts/`: Geist font, hosted here so that visitors do not connect to Google. Licence in `fonts/OFL.txt`.
- `brand/mark-signature.png`: logo used by the email signature, must stay at this path
- `brand/og-image.jpg`: image that shows when a link to the site is shared (1200 × 630)
- `.well-known/security.txt`: how to report a security problem. **Update the `Expires` date before 7 November 2027.**
- `robots.txt`, `sitemap.xml`: for search engines. Update `lastmod` in the sitemap when the content changes.
- `netlify.toml`: security headers (including a Content Security Policy), caching, and the `www` to apex redirect. The policy blocks scripts and styles from other sites, and all inline scripts. If you add a script or an outside service, update the policy.

Deploys automatically to Netlify on every push to `main`.

Don't commit client documents, call notes, keys or tokens.
