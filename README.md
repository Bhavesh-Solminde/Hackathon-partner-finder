# HackDraft — Hackathon Partner Finder

> Find your perfect hackathon teammate. Discover developers by verified tech stack, AI-powered matching, and GitHub-proven skills.

![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-9.0-green?logo=mongodb)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Quick Start

```bash
# Prerequisites: Node.js 20+, MongoDB running locally or Atlas URI

# 1. Clone and navigate
git clone https://github.com/your-username/hackdraft.git
cd hackdraft

# 2. Install backend deps (including bcrypt & jsonwebtoken)
cd backend
npm install
npm install bcrypt jsonwebtoken

# 3. Create .env file in backend/ with required variables (see below)

# 4. Start backend
npm run dev

# 5. In new terminal: Install and start frontend
cd ../frontend
npm install
npm run dev

# Visit http://localhost:5173
```

**Required `.env` variables:** `MONGODB_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GEMINI_API_KEY`

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

### How It Works

1. **Sign Up** — Register with email/password or use Google/GitHub OAuth
2. **Link GitHub** — Connect your GitHub account to enable skill verification
3. **Sync Skills** — Click "Sync GitHub Stats" to scan your repositories and verify your tech stack
4. **Search or Scout** — Use keyword search with filters, or describe your ideal teammate in natural language
5. **View Profiles** — Click on any developer card to see their full verified skill stack
6. **Generate Icebreaker** — Use AI to generate a personalized opening message based on their GitHub profile

### Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React + Vite)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │  Zustand     │  │  React       │  │  Axios Instance     │  │
│  │  Stores      │→ │  Router DOM  │← │  (withCredentials)  │  │
│  │  (Auth/Match)│  │              │  │                     │  │
│  └──────────────┘  └──────────────┘  └─────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP (JWT cookies)
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Node.js + Express)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │  Passport.js │  │  JWT Auth    │  │  Controllers        │  │
│  │  (OAuth)     │→ │  Middleware  │→ │  (Auth/User/Match)  │  │
│  └──────────────┘  └──────────────┘  └─────────────────────┘  │
│         ↓                                      ↓                 │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │  GitHub API  │  │  Gemini AI   │  │  MongoDB            │  │
│  │  (GraphQL)   │  │  (2.5 Flash) │  │  (Mongoose)         │  │
│  └──────────────┘  └──────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Integrations:**
- **GitHub GraphQL API** — Fetches repository data and dependency manifests for skill verification
- **Google Gemini AI** — Powers natural language partner matching and icebreaker generation
- **Passport.js** — Handles OAuth flows for Google and GitHub authentication
- **JWT Cookies** — Stateless authentication with httpOnly cookies (access + refresh tokens)

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

**Note:** This is a monorepo with separate `frontend/` and `backend/` folders. Some dependencies (`bcrypt`, `jsonwebtoken`) are installed at the root level and need to be manually added to `backend/package.json` or installed in the backend folder for production deployments.

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

### OAuth Setup Guide

#### GitHub OAuth App

1. Go to **GitHub Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
2. Fill in:
   - **Application name:** HackDraft (or your preferred name)
   - **Homepage URL:** `http://localhost:5173`
   - **Authorization callback URL:** `http://localhost:8080/api/v1/auth/github/callback`
3. Click **Register application**
4. Copy the **Client ID** → paste into `GITHUB_CLIENT_ID` in `.env`
5. Click **Generate a new client secret** → copy → paste into `GITHUB_CLIENT_SECRET`
6. **Important:** The app automatically requests `read:user` and `repo` scopes for repository scanning

#### Google OAuth App

1. Go to **Google Cloud Console** → **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Add **Authorized JavaScript origins:** `http://localhost:5173`
5. Add **Authorized redirect URIs:** `http://localhost:8080/api/v1/auth/google/callback`
6. Click **Create**
7. Copy the **Client ID** → paste into `GOOGLE_CLIENT_ID` in `.env`
8. Copy the **Client Secret** → paste into `GOOGLE_CLIENT_SECRET`

#### Gemini API Key

1. Go to **Google AI Studio** ([https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))
2. Click **Create API Key**
3. Copy the key → paste into `GEMINI_API_KEY` in `.env`
4. **Note:** Gemini 2.5 Flash is free up to 1500 requests/day (as of 2024)

> **Production:** Remember to update all callback URLs to your production domain when deploying!

### Installation & Running

```bash
# 1. Clone the repository
git clone https://github.com/your-username/hackdraft.git
cd hackdraft

# 2. Install backend dependencies
cd backend
npm install

# IMPORTANT: Install missing dependencies
npm install bcrypt jsonwebtoken

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Create .env file in backend/ (see Environment Variables section above)

# 5. Start the backend (from /backend)
cd ../backend
npm run dev

# 6. Start the frontend (from /frontend, in a new terminal)
cd ../frontend
npm run dev
```

The backend runs on `http://localhost:8080` and the frontend on `http://localhost:5173`.

### Available NPM Scripts

**Backend** (`/backend`)
```bash
npm run dev       # Start development server with nodemon (auto-restart)
npm test          # Run tests (not yet implemented)
```

**Frontend** (`/frontend`)
```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Build production bundle
npm run preview   # Preview production build locally
npm run lint      # Run ESLint on source files
```

---

## API Reference

All endpoints are prefixed with `/api/v1`. Protected routes require a valid `accessToken` cookie.

### Response Format

All API responses follow a consistent structure using `ApiResponse` and `ApiError` utility classes:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response payload */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": [/* optional array of validation errors */]
}
```

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

### Security Considerations

- **httpOnly Cookies:** Both access and refresh tokens are stored in httpOnly cookies, preventing XSS attacks from stealing tokens
- **CORS:** Backend validates origin via `CORS_ORIGIN` environment variable
- **Password Hashing:** Passwords are hashed using bcrypt (10 salt rounds) before storage
- **Token Expiry:** Access tokens expire after 1 hour; refresh tokens after 10 days
- **Environment Variables:** All sensitive keys (JWT secrets, OAuth credentials, API keys) are stored in `.env` and never committed to version control
- **GitHub Token Storage:** GitHub OAuth access tokens are encrypted and stored securely in the database for repository scanning

**Production Recommendations:**
- Use HTTPS for all traffic
- Implement rate limiting (e.g., express-rate-limit)
- Add helmet.js for security headers
- Enable MongoDB connection encryption
- Rotate JWT secrets regularly
- Use a secrets manager (AWS Secrets Manager, Vault, etc.)

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

## Components Architecture

### Core Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `UserCard` | `/components/UserCard.jsx` | Developer profile card with "Header Strip" design, overlapping avatar (-mt-10), Trust Score badge, verified vs. manual skills |
| `Navbar` | `/components/Navbar.jsx` | Global navigation with auth-aware menu (Search, AI Scout, Profile for authenticated users) |
| `Alert` | `/components/Alert.jsx` | Reusable alert component supporting `error`, `success`, and `info` types with icons |
| `OAuthButton` | `/components/OAuthButton.jsx` | Styled OAuth provider button (currently supports Google) |

### State Management (Zustand)

| Store | Location | State | Actions |
|-------|----------|-------|---------|
| `authStore` | `/store/authStore.js` | `user`, `isAuthenticated`, `isCheckingAuth`, `isLoading`, `error` | `login()`, `register()`, `logout()`, `checkAuth()` |
| `matchStore` | `/store/matchStore.js` | `searchResults`, `scoutResults`, `icebreaker`, `isLoading`, `error` | `searchUsers()`, `aiScout()`, `generateIcebreaker()`, `clearResults()` |

### Route Protection Pattern

The app uses wrapper components to manage access control:

```jsx
<PublicRoute>    // Redirects authenticated users to /dashboard
<ProtectedRoute> // Redirects unauthenticated users to /login
```

Both wrappers show a loading spinner while checking authentication status via `authStore.checkAuth()`.

---

## Troubleshooting

### Backend won't start

**Issue:** `Error: Cannot find module 'bcrypt'` or `Cannot find module 'jsonwebtoken'`

**Solution:** These critical dependencies are missing from `package.json`. Install them manually:
```bash
cd backend
npm install bcrypt jsonwebtoken
```

### MongoDB connection fails

**Issue:** `MongoServerError: Authentication failed`

**Solution:** 
- Verify your `MONGODB_URI` in `.env` is correct
- Ensure network access is allowed in MongoDB Atlas (whitelist your IP or use `0.0.0.0/0` for development)
- Check that the database user has read/write permissions

### GitHub OAuth fails with "redirect_uri_mismatch"

**Solution:**
- In your GitHub OAuth App settings, ensure the Authorization callback URL matches **exactly**: `http://localhost:8080/api/v1/auth/github/callback`
- Restart the backend server after changing OAuth credentials

### Frontend CORS errors

**Issue:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Verify `CORS_ORIGIN=http://localhost:5173` in backend `.env`
- Ensure the frontend is running on port 5173 (or update CORS_ORIGIN accordingly)
- Check that `axiosInstance` in `frontend/src/lib/axios.js` has `withCredentials: true`

### AI Scout returns empty results

**Issue:** Gemini API returns no matches or errors

**Solution:**
- Verify your `GEMINI_API_KEY` is valid and has quota remaining
- Check the backend logs for Gemini API error messages
- Ensure at least a few users in the database have verified skills

---

## Deployment

### Backend Deployment (Production)

1. **Environment Variables:**
   ```env
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-domain.com
   MONGODB_URI=<production-mongodb-uri>
   # ... other vars
   ```

2. **Build & Run:**
   ```bash
   cd backend
   npm install
   npm install bcrypt jsonwebtoken  # Critical!
   node src/server.js
   ```

3. **Recommended Platforms:**
   - Render, Railway, Fly.io (Node.js hosting)
   - MongoDB Atlas (database)

### Frontend Deployment (Production)

1. **Update API Base URL:**
   
   Edit `frontend/src/lib/axios.js`:
   ```javascript
   const axiosInstance = axios.create({
     baseURL: "https://your-backend-domain.com/api/v1",
     withCredentials: true,
   });
   ```

2. **Build:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy:**
   - Output is in `frontend/dist/`
   - Deploy to Vercel, Netlify, or any static host
   - Configure rewrites to serve `index.html` for all routes (SPA mode)

4. **Update OAuth Callback URLs:**
   - In Google Cloud Console and GitHub OAuth App settings, add production callback URLs
   - Example: `https://your-backend-domain.com/api/v1/auth/google/callback`

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

## Known Issues & Roadmap

### Known Issues

- ❌ `bcrypt` and `jsonwebtoken` are not listed in `backend/package.json` dependencies (manual install required)
- ❌ No email verification for email/password registration
- ❌ No password reset flow
- ❌ No rate limiting on API endpoints
- ❌ GitHub sync does not handle private repositories (requires additional OAuth scopes)

### Roadmap

- [ ] **Real-time Messaging** — In-app chat between matched developers
- [ ] **Team Formation** — Create multi-person teams for larger hackathons
- [ ] **Hackathon Event Integration** — Import events from Devpost, MLH, etc.
- [ ] **Email Notifications** — Alert users when they match with someone via AI Scout
- [ ] **Advanced Filtering** — Filter by years of experience, location, availability
- [ ] **Skill Endorsements** — Let other users endorse skills (like LinkedIn)
- [ ] **GitHub Contribution Graph** — Visualize commit activity over time
- [ ] **Multi-language Support** — i18n for global hackathon community

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style (ES Modules, async/await, functional components)
- Use the existing utility classes (`ApiError`, `ApiResponse`, `asyncHandler`)
- Keep components small and reusable
- Update the README if adding new features or changing architecture
- Ensure all new routes are documented in the API Reference section

---

## License

MIT
