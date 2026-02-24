import { Router } from "express";
import {
  getProfile,
  updateProfile,
  syncGithubStats,
  getUserById,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All user routes require authentication
router.use(verifyJWT);

// ─── Profile ────────────────────────────────────────────────────────────────
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// ─── GitHub Sync ────────────────────────────────────────────────────────────
router.post("/sync", syncGithubStats);

// ─── Get User by ID ─────────────────────────────────────────────────────────
router.get("/:id", getUserById);

export default router;
