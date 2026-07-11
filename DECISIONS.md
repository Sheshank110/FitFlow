# DECISIONS.md — FitFlow Build Assumptions

## Design
- **Color palette:** Deep charcoal (#0D0D0D) + electric orange-red (#FF4D1C) + lime-green (#B6FF4A). Chosen to be energetic and distinctive, avoiding the default SaaS blue/purple look.
- **Font pairing:** `Bebas Neue` (display) + `DM Sans` (body) via Google Fonts. Bebas Neue gives an athletic/editorial feel; DM Sans is clean and highly legible.
- **Hero animation:** Staggered text entrance using CSS keyframes + animated SVG gradient mesh background. Chosen over parallax for better mobile performance. Respects `prefers-reduced-motion`.
- **Layout:** Asymmetric editorial layout with alternating dark/light sections to break monotony.

## Architecture
- **Monorepo structure:** Separate `/client` and `/server` with a root `package.json` using `concurrently` for unified `npm run dev`.
- **No TypeScript:** Per spec — JavaScript throughout.
- **CSS Modules:** Used for component-scoped styles to avoid global collisions while keeping the hand-crafted feel.
- **React Router v6:** Used for client-side routing with `<Outlet>` layout pattern.

## Auth
- **JWT stored in localStorage:** Acceptable for this use case; for higher security production apps, httpOnly cookies would be preferred. Noted here for the developer to consider upgrading.
- **JWT expiry:** 7 days. Refresh tokens not implemented to keep scope manageable; flagged for production hardening.
- **bcrypt rounds:** 12 — balances security and performance.

## Chatbot
- **Model:** `claude-3-haiku-20240307` — fast and cost-effective for FAQ-style queries. Upgrade to Sonnet/Opus in the `.env` if needed.
- **System prompt:** Focused on FitFlow product knowledge. Claude is instructed to stay on-topic and hand off to human support for billing/account issues.
- **Fallback:** Keyword-based rule matcher covering the 10 most common fitness coaching FAQs. Returns helpful responses even with no API key.

## Content
- **Seeded data:** Pricing, features, blog posts, and a default admin user are seeded via `server/seed.js`. The seed script is idempotent (checks before inserting).
- **Blog:** Simple content model with a `body` field (plain text/markdown string). Rendering markdown to HTML on the client using `marked`. No CMS integrated — content is managed directly in MongoDB.
- **Images:** Hero and section images use high-quality Unsplash URLs (fitness-themed) to avoid placeholder blobs. Replace with owned assets for production.

## API
- **Rate limiting:** 100 req/15min general; 10 req/15min on `/api/chat` and auth endpoints to prevent abuse.
- **Pagination:** Blog listing supports `?page=1&limit=6` query params.
- **No file uploads:** Avatar/image upload not implemented; flagged as a future enhancement.

## Deployment
- **Frontend:** Configured for Vercel deploy (`vercel.json` in `/client`).
- **Backend:** Configured for Render/Railway — no special config needed beyond env vars and `npm start`.
- **CORS:** In production, set `CLIENT_URL` to your Vercel frontend URL in the server's env vars.
