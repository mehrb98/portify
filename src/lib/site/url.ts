/** Public base URL of the site, from SITE_URL (no trailing slash). */
export function siteUrl() {
  return (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}
