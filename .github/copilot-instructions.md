# Project Instructions: "Hackathon Partner Finder" (HackDraft)

**Role:** You are an expert AI developer working on "Hackathon Partner Finder".
**Model Behavior:** Powered by a High-Reasoning Model. Do not be lazy. Be architectural.

---

## 0. Reasoning & Planning (MANDATORY)

### Chain of Thought
* **STOP & THINK:** Before writing a single line of code, analyze the dependency tree.
* **Plan First:** If a task touches **>1 file**, outline your plan in 3 bullet points before executing.
* **No "Lazy" Fixes:** Do not just patch the error. Fix the root cause.
* **Architectural Check:** Does this change violate the **"No REST for Repo Scanning"** rule?

### Context Strategy (High-Capacity)
* **READ FULL FILES:** You have a massive context window. Always read the entire file (`read_file`) before editing to ensure you see imports and exported functions.
* **Cross-Reference:** Before modifying code, perform a project-wide search to find where the component or function is used in frontend or backend.

### Strict File Editing
* **Edits:** Apply changes using structured editing. Provide clear before/after blocks.
* **Precision:** Minimize usage of `// ...existing code...`. Provide 10–15 lines of context so the insertion is unambiguous.
* **Verification:** Ensure the project still runs without linting errors.

---

## 1. 📂 Monorepo Architecture

* **Root:** npm workspaces (No Docker for dev).
* **Frontend:** `./frontend` (React 19/latest, Vite, Tailwind v4).
* **Backend:** `./backend` (Node.js, Express, ES Modules).
* **Rule:** Explicit check—Are we in frontend or backend? **Do not mix imports.**

---

## 2. 🚫 Critical Tech Restrictions

* **Language:** JavaScript ONLY. (ES Modules).
* **Modules:** ES Modules (`import` / `export`) everywhere. **NO `require`.**
* **Backend Imports:** MUST include `.js` extension for local imports.
    * *Example:* `import { verify } from "../services/verify.js"`
* **Framework:** Vite + React Router (Not Next.js).
    * ❌ No `next/*` imports.
    * ✅ Use `react-router-dom` hooks (`useNavigate`, `useParams`).

---

## 3. 🎨 Frontend Rules (Vite + React 19)

### Aesthetic: "Enterprise Industrial" (Blue-Chip Tech)
* **Design Philosophy:** Professional, high-contrast, corporate. "Terminal" meets "LinkedIn".
* **Theme Strategy:**
    * **Main Background (Dark):** `#15171e`
    * **Surface/Header (Dark):** `#1d2127`
    * **Borders (Dark):** `#2e333b` or `#3e4249`
* **Color Palette:**
    * **Primary Accent:** `#0088cc` (Corporate Blue). Used for Buttons, Links, Verified Badges, and Focus Rings.
    * **AI Mode Accent:** `purple-600` (Used specifically for "AI Active" toggles).
    * **Text Main:** `text-white` (Dark) / `text-zinc-900` (Light).
    * **Text Muted:** `text-zinc-400` (Dark) / `text-zinc-500` (Light).
* **Visual Patterns:**
    * **Hero Background:** Abstract Corporate Pattern (CSS Linear Gradient Grid 1px opacity 0.03).
    * **Card Style:** "Header Strip" design (top 24px colored/distinct), Avatar overlapping the header (`-mt-10`), `hover:-translate-y-1`.
    * **Fonts:** `JetBrains Mono` for stats/badges, `Inter` (sans) for UI text.

### State & UI Engine
* **Zustand:** Global store (User session, Sync status).
* **Tailwind CSS v4:** Used with `clsx` / `tailwind-merge` (via `cn()` utility).

### Components
* **Custom Components Only:** **DO NOT** use Shadcn UI or Aceternity UI.
* **Directive:** Build components exactly matching the "UserCard" and "Badge" reference implementation provided in the design system.
* **Icons:** `lucide-react` (specifically `Terminal`, `ShieldCheck`, `Sparkles`, `Code2`, `Database`, `Layout`).

### API
* Use `axiosInstance` from `@/lib/axios` (handles `withCredentials`).

---

## 4. ⚙️ Backend Rules (Node + Express)

### Controller Pattern
**MANDATORY:** Wrap all controllers.
```javascript
import asyncHandler from "../utils/asyncHandler.js";

export const handler = asyncHandler(async (req, res, next) => {
  // Controller logic here
});