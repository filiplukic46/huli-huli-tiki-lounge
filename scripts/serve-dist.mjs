// Serves the production build for local QA (wraps the awwwards skill's static server).
import { serve } from 'file:///C:/Users/Admin/.claude/skills/awwwards/scripts/serve.mjs';
const port = +(process.env.PORT || process.argv[2] || 4400);
const s = await serve(new URL('../dist', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'), port);
console.log(`serving dist at http://127.0.0.1:${s.address().port}/`);
