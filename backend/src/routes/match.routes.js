import { Router } from "express";
import { searchUsers, scout, icebreaker } from "../controllers/match.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All match routes require authentication
router.use(verifyJWT);

// ─── Search ──────────────────────────────────────────────────────────────────
router.get("/search", searchUsers);

// ─── AI Scout ────────────────────────────────────────────────────────────────
router.post("/scout", scout);

// ─── Icebreaker Generator ───────────────────────────────────────────────────
router.post("/icebreaker", icebreaker);

export default router;
