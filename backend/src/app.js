import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import passport from "passport";
import ENV from "./env.js";

// ─── Route Imports ───────────────────────────────────────────────────────────
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import matchRoutes from "./routes/match.routes.js";

// ─── Passport Strategies ─────────────────────────────────────────────────────
import "./passport/google.strategy.js";
import "./passport/github.strategy.js";

const app = express();

app.use(compression());

// CORS configuration - support multiple origins for development
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  ENV.CORS_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Initialize JSON middleware once
const jsonParser = express.json({ limit: "16kb" });

app.use(jsonParser);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(passport.initialize());

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "HackDraft API" });
});

// ─── Mount Routes ────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/match", matchRoutes);

// ── Global Error Handler ──
// Catches errors from next(error) in middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (statusCode === 500) {
    console.error("Unhandled server error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    data: null,
  });
});

export default app;