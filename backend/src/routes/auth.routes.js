import { Router } from "express";
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleUpdatePassword,
  refreshAccessToken,
  handleOAuthCallback,
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback,
  getMe,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ─── JWT Auth ────────────────────────────────────────────────────────────────
router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", verifyJWT, handleLogout);
router.post("/update-password", verifyJWT, handleUpdatePassword);
router.post("/refresh-token", refreshAccessToken);

// ─── Google OAuth ────────────────────────────────────────────────────────────
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback, handleOAuthCallback);

// ─── GitHub OAuth (linking — user must be logged in) ─────────────────────────
router.get("/github", verifyJWT, githubAuth);
router.get("/github/callback", githubCallback, handleOAuthCallback);

// ─── Session ─────────────────────────────────────────────────────────────────
router.get("/me", verifyJWT, getMe);

export default router;
