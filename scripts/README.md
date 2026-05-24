# Maintainer scripts

One-off migration scripts were removed after the curriculum and SEO batches landed. Use only the scripts below.

| Script                            | npm command                                               | When to use                                         |
| --------------------------------- | --------------------------------------------------------- | --------------------------------------------------- |
| `sync-curriculum.mjs`             | `npm run sync:curriculum`                                 | After editing `docs/curriculum-order.json`          |
| `generate-curriculum-v11.mjs`     | `npm run curriculum:generate`                             | Regenerate curriculum order (rare)                  |
| `apply-seo-meta.mjs`              | `seo:apply-top30`, `seo:apply-batch2`, `seo:apply-batch3` | Apply SEO JSON to lesson frontmatter                |
| `fix-yaml-newlines.mjs`           | (with batch apply)                                        | Fix broken YAML after batch SEO apply               |
| `generate-remaining-seo-meta.mjs` | `npm run seo:generate-batch3`                             | Generate SEO meta for lessons missing `quickAnswer` |
| `verify-no-practice-route.mjs`    | `npm run check:routes`                                    | CI guard — no `src/pages/python/practice/` folder   |
