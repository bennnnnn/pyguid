# Google Search Console setup

Manual steps to connect PyGuide to Google Search Console (GSC) and submit the sitemap.

## 1. Add a property

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add a property for your live site URL:
   - **GitHub Pages:** `https://bennnnnn.github.io/pyguid/`
   - **Custom domain:** use your production domain (must match `SITE_URL` at build time).

## 2. Verify ownership

Choose one verification method:

- **HTML file upload** — add the file to `public/` and redeploy.
- **DNS TXT record** — recommended for custom domains.
- **Google Analytics / Tag Manager** — if already installed.

## 3. Submit the sitemap

After the site is verified and deployed:

1. In GSC, go to **Sitemaps**.
2. Submit: `sitemap-index.xml` (full URL, e.g. `https://bennnnnn.github.io/pyguid/sitemap-index.xml`).

The sitemap is generated at build time by `@astrojs/sitemap`. The `robots.txt` endpoint points crawlers to the same URL using `SITE_URL` from the environment.

## 4. Set `SITE_URL` for production

When deploying to a custom domain, set the site URL so canonical links, Open Graph URLs, and `robots.txt` stay correct:

```bash
SITE_URL=https://your-domain.com npm run build
```

Or configure `site` in `astro.config.mjs` / your CI environment to match the live domain.

## 5. Monitor monthly

Check these reports after a few weeks of indexing:

- **Pages** — indexed vs not indexed; fix 404s and redirect issues.
- **Enhancements** — FAQ rich results on enriched lesson pages.
- **Performance** — top queries, CTR, and pages with thin meta (descriptions under ~120 characters).

## Related files

- `src/pages/robots.txt.ts` — dynamic sitemap URL
- `astro.config.mjs` — sitemap integration and redirects
- `docs/PLATFORM-PLAN.md` — broader launch checklist
