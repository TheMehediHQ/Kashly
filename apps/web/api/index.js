/**
 * Vercel Serverless Function entrypoint for the Express API.
 *
 * `@moneyflow/api` (apps/api) exports the Express app and skips `listen()`
 * on Vercel (see the `process.env.VERCEL` guard in apps/api/index.js).
 *
 * vercel.json rewrites every /api/* request to this function, and Express
 * receives the original request path (e.g. /api/login), which matches the
 * routes defined in apps/api/index.js.
 */
const app = require("@moneyflow/api");

module.exports = app;
