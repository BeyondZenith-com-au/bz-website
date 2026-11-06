# beyondzenith.com.au

Static website for Beyond Zenith Software Pty Ltd. No build step.

- `index.html`: the whole site
- `404.html`: page Netlify shows for an unknown URL
- `favicon.svg`: site icon
- `anastas.jpg`: portrait for the About section (640 × 800, 4:5)
- `art/`: photographs for the hero, Services and How we work sections (1536 px wide)
- `brand/mark-signature.png`: logo used by the email signature, must stay at this path
- `brand/og-image.jpg`: image that shows when a link to the site is shared (1200 × 630)
- `robots.txt`, `sitemap.xml`: for search engines. Update `lastmod` in the sitemap when the content changes.
- `netlify.toml`: security headers, image caching, and the `www` to apex redirect

Deploys automatically to Netlify on every push to `main`.

Don't commit client documents, call notes, keys or tokens.
