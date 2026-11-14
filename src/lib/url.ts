// Root-relative paths, prefixed with the site's base (GitHub Pages serves it under /<repo>/).
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const u = (path: string) => base + path;
