import type { APIRoute } from "astro";
import { getSiteUrl } from "../lib/site";

export const GET: APIRoute = () => {
  const siteUrl = getSiteUrl(import.meta.env.SITE);
  const body = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap-index.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
