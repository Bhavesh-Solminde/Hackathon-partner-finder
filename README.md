# HackDraft — Hackathon Partner Finder

> Find your perfect hackathon teammate. Discover developers by verified tech stack, AI-powered matching, and GitHub-proven skills.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation & Running](#installation--running)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [GitHub Skill Verification](#github-skill-verification)
- [AI Scout](#ai-scout)
- [Trust Score System](#trust-score-system)
- [Pages & Routes](#pages--routes)

---

## Overview

**HackDraft** is a full-stack web application that solves the "finding teammates" problem at hackathons. Instead of relying on self-reported skills, HackDraft scans a developer's real GitHub repositories — detecting languages, frameworks, and libraries from actual dependency files — and builds a verified skill profile.

Users can then be discovered through:
- **Keyword Search** — search by name, skill, or role
- **Filter Search** — filter by canonical role (Frontend / Backend / Full Stack / Designer) and specific skills
- **AI Scout** — describe your ideal teammate in plain English and let Gemini AI find the best matches

---

## Features

| Feature | Description |
|---|---|
| **Email/Password Auth** | Register and log in with JWT-based sessions (httpOnly cookies) |
| **Google OAuth** | One-click sign in via Google |
| **GitHub OAuth** | One-click sign in via GitHub (also links account for stack scanning) |
| **GitHub Stack Verification** | Scans top 20 non-forked public repos via GitHub GraphQL API — detects 100+ packages across JS, Python, Go, Rust, Ruby, PHP, Dart |
| **Trust Score** | Score calculated automatically from the number of verified skills |
| **Keyword Search** | Regex search across name, role, and skill fields |
| **Role + Skill Filter Search** | Filter by canonical role; Full Stack devs appear in both Frontend and Backend results |
| **AI Scout** | Natural language query → Gemini 2.5 Flash → ranked developer matches with reasoning |
| **Icebreaker Generator** | AI-generated cold DM based on a target developer's verified skills |
| **Profile Management** | Update name, canonical role, and manual (unverified) skills |
| **User Detail Page** | View any developer's full verified skill stack and profile |
| **Token Refresh** | Sliding refresh token (10-day expiry) with silent re-authentication |

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 7 | Build tool & dev server |
| React Router DOM | 7 | Client-side routing |
| Tailwind CSS | 4 | Utility-first styling |
| Zustand | 5 | Global state management |
| Axios | 1.13 | HTTP client (with credentials) |
| Framer Motion | 12 | Animations |
| Lucide React | 0.564 | Icon library |
| clsx + tailwind-merge | latest | Conditional class utility (`cn()`) |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20+ | Runtime |
| Express | 5 | HTTP framework |
| MongoDB + Mongoose | 9 | Database & ODM |
| Passport.js | 0.7 | OAuth strategy handling |
| passport-google-oauth20 | 2 | Google OAuth 2.0 |
| passport-github2 | 0.1 | GitHub OAuth |
| JSON Web Tokens | 9 | Access & refresh token auth |
| bcrypt | 6 | Password hashing |
| Google Generative AI SDK | 0.21 | Gemini 2.5 Flash (AI Scout + Icebreaker) |
| Axios | 1.7 | GitHub GraphQL API calls |
| dotenv | 16 | Environment config |
| compression | 1.8 | Gzip response compression |
| nodemon | 3.1 | Dev auto-restart |

---

## Project Structure

```
hackathon-partner-finder/
├── package.json                  # Root npm workspace
│
├── backend/
│   └── src/
│       ├── server.js             # Entry point
│       ├── app.js                # Express app, CORS, middleware, routes
│       ├── env.js                # Typed environment variable loader
│       ├── controllers/
│       │   ├── auth.controller.js    # Register, login, logout, OAuth callbacks, token refresh
│       │   ├── user.controller.js    # Get/update profile, GitHub sync, get user by ID
│       │   └── match.controller.js   # Search, AI Scout, Icebreaker
│       ├── services/
│       │   ├── github.service.js     # GitHub GraphQL scanner (100+ package detections)
│       │   └── ai.service.js         # Gemini AI Scout + Icebreaker prompts
│       ├── models/
│       │   └── user.model.js         # User + Skill schema, JWT methods, bcrypt hook
│       ├── middlewares/
│       │   ├── auth.middleware.js    # verifyJWT — protects routes
│       │   └── error.middleware.js   # Global error handler
│       ├── passport/
│       │   ├── google.strategy.js    # Google OAuth strategy
│       │   └── github.strategy.js    # GitHub OAuth strategy
│       ├── routes/
│       │   ├── auth.routes.js        # /api/v1/auth
│       │   ├── user.routes.js        # /api/v1/users
│       │   └── match.routes.js       # /api/v1/match
│       └── utils/
│           ├── ApiError.js           # Structured error class
│           ├── ApiResponse.js        # Structured response class
│           └── asyncHandler.js       # Async try/catch wrapper
│
└── frontend/
    └── src/
        ├── App.jsx                   # Router, protected/public route wrappers
        ├── main.jsx                  # React entry point
        ├── pages/
        │   ├── landingPage.jsx       # Marketing landing page
        │   ├── LoginPage.jsx         # Email + OAuth login
        │   ├── RegisterPage.jsx      # Email registration
        │   ├── DashboardPage.jsx     # Post-login home
        │   ├── ProfilePage.jsx       # Edit profile, GitHub sync, verified skills
        │   ├── SearchPage.jsx        # Keyword + role + skill filter search
        │   ├── ScoutPage.jsx         # AI natural language partner finder
        │   ├── UserDetailPage.jsx    # Full developer profile view
        │   └── (unused stubs)
        ├── components/
        │   ├── Navbar.jsx            # Top navigation bar
        │   ├── UserCard.jsx          # Developer card (header strip, avatar overlap, skills)
        │   ├── Alert.jsx             # Reusable error/success alert
        │   └── OAuthButton.jsx       # Styled OAuth button
        ├── store/
        │   ├── authStore.js          # User session, checkAuth, login/logout actions
        │   └── matchStore.js         # Search, AI Scout, icebreaker actions
        └── lib/
            ├── axios.js              # Axios instance with baseURL + credentials
            └── utils.js              # cn() utility (clsx + tailwind-merge)
```

---

## Getting Started

### Prerequisites

- **Node.js** v20 or later
- **npm** v10 or later
- A running **MongoDB** instance (local or Atlas)
- GitHub OAuth App credentials
- Google OAuth App credentials
- Google **Gemini API** key

### Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
# Server
PORT=8080
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8080/api/v1/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:8080/api/v1/auth/github/callback

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

> **GitHub OAuth App setup:** In your GitHub App settings, set the Authorization callback URL to `http://localhost:8080/api/v1/auth/github/callback`. Request the `read:user` and `repo` scopes.

> **Google OAuth App setup:** In Google Cloud Console, add `http://localhost:8080/api/v1/auth/google/callback` as an authorized redirect URI.

### Installation & Running

```bash
# 1. Clone the repository
git clone https://github.com/your-username/hackdraft.git
cd hackdraft

# 2. Install all workspace dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# 3. Start the backend (from /backend)
cd backend
npm run dev

# 4. Start the frontend (from /frontend, in a new terminal)
cd frontend
npm run dev
```

The backend runs on `http://localhost:8080` and the frontend on `http://localhost:5173`.

---

## API Reference

All endpoints are prefixed with `/api/v1`. Protected routes require a valid `accessToken` cookie.

### Auth — `/api/v1/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | No | Register with email + password |
| `POST` | `/login` | No | Login, sets httpOnly cookies |
| `POST` | `/logout` | Yes | Clears tokens |
| `POST` | `/refresh-token` | No | Exchanges refresh token for new access token |
| `GET` | `/me` | Yes | Returns current authenticated user |
| `GET` | `/google` | No | Redirects to Google OAuth |
| `GET` | `/google/callback` | No | Google OAuth callback |
| `GET` | `/github` | No | Redirects to GitHub OAuth |
| `GET` | `/github/callback` | No | GitHub OAuth callback |

### Users — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/profile` | Yes | Get current user profile |
| `PUT` | `/profile` | Yes | Update name, role, manual skills |
| `POST` | `/sync` | Yes | Trigger GitHub repo scan & skill verification |
| `GET` | `/:id` | Yes | Get any user by ID |

### Match — `/api/v1/match`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/search?q=&role=&skills=` | Yes | Keyword + filter search |
| `POST` | `/scout` | Yes | AI natural language partner search |
| `POST` | `/icebreaker` | Yes | Generate AI icebreaker DM for a user |

---

## Authentication Flow

```
Register/Login → Access Token (1h, httpOnly cookie)
             └→ Refresh Token (10d, httpOnly cookie)

Protected Request → verifyJWT middleware → decode accessToken
                                         → attach user to req.user

Token Expired → frontend calls /auth/refresh-token
             → new accessToken issued silently
```

OAuth (Google / GitHub) follows the Passport.js callback pattern — on success, the same JWT cookies are set and the user is redirected to the frontend dashboard.

---

## GitHub Skill Verification

When a user clicks **Sync GitHub Stats**, the backend:

1. Calls the GitHub GraphQL API with the user's OAuth token
2. Fetches their **top 20 non-forked public repositories** (ordered by push date)
3. For each repo, fetches dependency manifests from multiple paths:
   - `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`, `Gemfile`, `composer.json`, `pubspec.yaml`, `pyproject.toml`, `Pipfile`, `Dockerfile`
   - Monorepo subfolders: `frontend/`, `client/`, `web/`, `backend/`, `server/`, `api/`, `apps/web/`, `apps/api/`, etc.
4. Matches detected package names against a dictionary of **100+ known libraries** across:
   - JavaScript/TypeScript frameworks (React, Next.js, Vue, Angular, Svelte, etc.)
   - Backend frameworks (Express, NestJS, FastAPI, Django, Flask, etc.)
   - Databases & ORMs (MongoDB, PostgreSQL, Prisma, Drizzle, Redis, Firebase, Supabase, etc.)
   - State management, testing tools, build tools, mobile (React Native, Flutter), AI/ML libraries
   - Go, Rust, Ruby, PHP, Dart ecosystem packages
5. Wipes old `GITHUB`-sourced skills and replaces with fresh results
6. Recalculates **Trust Score** (`verified skill count × 10`)

---

## AI Scout

The AI Scout uses **Gemini 2.5 Flash** to match natural language queries to real developer profiles.

**How it works:**

1. User submits a plain English query (e.g. *"I need a Python ML engineer who knows PyTorch and FastAPI"*)
2. Backend fetches the top 50 users with any skills, sorted by Trust Score
3. Each user's full skill list is sent to Gemini (verified skills are labeled `"React (verified)"` for weighting)
4. Gemini returns a JSON map of `{ userId → reasoning string }`
5. Backend fetches full user documents for matched IDs and merges in the reasoning
6. Frontend renders `UserCard` for each match with the AI reasoning displayed beneath

---

## Trust Score System

The Trust Score is a simple signal of how "proven" a developer's skills are:

```
Trust Score = (number of GitHub-verified skills) × 10
```

A developer with 8 verified skills from their repos scores **80**. Manual skills do not contribute to the Trust Score. Scores are recalculated on every GitHub sync.

The Trust Score is displayed on every `UserCard` and is used to sort search and AI scout results.

---

## Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing Page | Public |
| `/login` | Login | Public (redirects to `/dashboard` if logged in) |
| `/register` | Register | Public (redirects to `/dashboard` if logged in) |
| `/dashboard` | Dashboard | Protected |
| `/profile` | Profile Settings | Protected |
| `/search` | Search Partners | Protected |
| `/scout` | AI Scout | Protected |
| `/user/:id` | Developer Profile | Protected |

---

## Design System

HackDraft uses an **"Enterprise Industrial"** aesthetic — professional, high-contrast, corporate.

| Token | Value |
|-------|-------|
| Main background | `#15171e` |
| Surface / card | `#1d2127` |
| Borders | `#2e333b` |
| Primary accent | `#0088cc` (Corporate Blue) |
| AI accent | `purple-600` |
| Text main | `white` |
| Text muted | `zinc-400` |
| Monospace font | JetBrains Mono (stats, badges) |
| UI font | Inter |

---

## License

MIT
