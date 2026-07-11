# FitFlow 🏋️

> **Train smarter. Live stronger.** — A full-stack SaaS platform for fitness coaching built with the MERN stack.

---

## What's Included

- **Frontend:** React 18 + Vite, hand-crafted CSS Modules, animated hero, all 9 pages
- **Backend:** Node.js + Express MVC, REST API, rate limiting, Helmet security headers
- **Database:** MongoDB + Mongoose — 5 collections with seed data
- **Auth:** JWT + bcrypt, protected routes on client and server
- **Chatbot:** Claude AI widget with rule-based fallback
- **Blog:** Markdown-rendered posts served from MongoDB

---

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas account (free tier works fine)
- Anthropic API key (optional — chatbot works without it)

---

## Quick Start

### 1. Clone & install

```bash
# Install all dependencies (root + server + client)
npm run install:all
```

### 2. Configure environment variables

**Server** — copy and edit `server/.env`:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/fitflow
JWT_SECRET=your_long_random_secret_here
PORT=5000
CLIENT_URL=http://localhost:5173
ANTHROPIC_API_KEY=sk-ant-...   # optional
NODE_ENV=development
```

**Client** — copy and edit `client/.env`:
```
VITE_API_URL=http://localhost:5000
```

### 3. Seed the database

```bash
npm run seed
```

This creates:
- 6 features
- 3 pricing plans (Free, Pro, Elite)
- 6 blog posts
- 1 demo user: `demo@fitflow.com` / `FitFlow2024!`

### 4. Run the app

```bash
npm run dev
```

This starts both the backend (`:5000`) and frontend (`:5173`) concurrently.

Open [http://localhost:5173](http://localhost:5173).

---

## Running Separately (two terminals)

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

---

## Project Structure

```
fitflow/
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── api/          # Axios calls to backend
│   │   ├── components/   # Navbar, Footer, ChatWidget, Toast...
│   │   ├── context/      # AuthContext (JWT)
│   │   ├── hooks/        # useReveal (scroll animations)
│   │   ├── pages/        # 9 pages + CSS Modules
│   │   └── styles/       # Design tokens, global CSS, animations
│   └── vite.config.js
├── server/               # Express backend
│   ├── config/           # MongoDB connection
│   ├── controllers/      # Business logic
│   ├── middleware/        # auth, errorHandler, validate
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers
│   ├── server.js         # Entry point
│   └── seed.js           # Database seeder
├── .env.example          # All env vars documented
├── DECISIONS.md          # Architecture decisions & assumptions
└── package.json          # Root scripts with concurrently
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | ✓ | Current user profile |
| GET | `/api/content/:section` | — | Homepage content (hero, testimonials) |
| GET | `/api/features` | — | Features list |
| GET | `/api/pricing` | — | Pricing plans |
| GET | `/api/posts` | — | Blog listing (paginated) |
| GET | `/api/posts/:slug` | — | Single post |
| POST | `/api/contact` | — | Submit contact form |
| POST | `/api/chat` | — | Chatbot (Claude or fallback) |

---

## Deployment

### Frontend → Vercel
1. Push `/client` to a GitHub repo (or the whole monorepo)
2. Import in Vercel, set **Root Directory** to `client`
3. Set env var: `VITE_API_URL=https://your-backend.onrender.com`
4. Deploy — `vercel.json` handles SPA routing

### Backend → Render
1. Create a new **Web Service** on Render
2. Connect your repo, set **Root Directory** to `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Set env vars: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL), `ANTHROPIC_API_KEY`

### Database → MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Whitelist `0.0.0.0/0` for Render (or use static IPs)
3. Copy the connection string to `MONGO_URI`

---

## Demo Credentials

After running `npm run seed`:
- **Email:** `demo@fitflow.com`
- **Password:** `FitFlow2024!`
- **Plan:** Pro

---

## License

MIT
