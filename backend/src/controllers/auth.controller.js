import passport from "passport";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ENV from "../env.js";

// ============================================================================
// Utilities
// ============================================================================

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const getAccessCookieOptions = () => ({
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 60 * 60 * 1000, // 1 hour
});

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
});

// ============================================================================
// Controllers
// ============================================================================

export const handleRegister = asyncHandler(async (req, res, next) => {
  if (!req.body) {
    throw new ApiError(400, "Request body is missing");
  }
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format! Please provide a valid email.");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists.");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Internal server error user could not be stored");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  return res
    .status(201)
    .cookie("accessToken", accessToken, getAccessCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshCookieOptions())
    .json(new ApiResponse(201, "User Registered successfully", createdUser));
});

export const handleLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    throw new ApiError(400, "email or password is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .cookie("accessToken", accessToken, getAccessCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshCookieOptions())
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

export const handleLogout = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .clearCookie("accessToken", getAccessCookieOptions())
    .clearCookie("refreshToken", getRefreshCookieOptions())
    .json(new ApiResponse(200, "User logged out successfully", {}));
});

export const handleUpdatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body || {};

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new password are required");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, "Password updated successfully", {}));
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "User not Authorised");
  }

  try {
    const decoded = jwt.verify(incomingRefreshToken, ENV.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded?._id);

    if (!user) {
      throw new ApiError(401, "User not found || Wrong refresh token");
    }

    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "User not Authorised || refresh token didnt match");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

    return res
      .status(201)
      .cookie("accessToken", accessToken, getAccessCookieOptions())
      .cookie("refreshToken", newRefreshToken, getRefreshCookieOptions())
      .json(
        new ApiResponse(201, "AccessToken generated successfully", {
          accessToken,
          refreshToken: newRefreshToken,
        })
      );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Refresh token has expired. Please log in again.");
    }
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid refresh token. Please log in again.");
    }
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export const handleOAuthCallback = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Authentication failed");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const frontendUrl = ENV.CORS_ORIGIN || "http://localhost:5173";
  // Determine which provider was used for the redirect hint
  const isGithub = !!user.githubId;
  const redirectUrl = isGithub
    ? `${frontendUrl}/dashboard?github_linked=true`
    : `${frontendUrl}/dashboard`;

  res
    .status(200)
    .cookie("accessToken", accessToken, getAccessCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshCookieOptions())
    .redirect(redirectUrl);
});

// ─── Google Auth: Redirect to Google consent screen ──────────────────────────
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// ─── Google Callback: Handle the redirect from Google ────────────────────────
export const googleCallback = passport.authenticate("google", {
  session: false,
  failureRedirect: `${ENV.CORS_ORIGIN || "http://localhost:5173"}/login?error=google_failed`,
});

// ─── GitHub Auth: Redirect to GitHub consent screen ──────────────────────────
export const githubAuth = passport.authenticate("github", {
  scope: ["read:user", "user:email"],
});

// ─── GitHub Callback: Handle the redirect from GitHub ────────────────────────
export const githubCallback = passport.authenticate("github", {
  session: false,
  failureRedirect: `${ENV.CORS_ORIGIN || "http://localhost:5173"}/dashboard?error=github_link_failed`,
});

// ─── Get Current User ────────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  res.status(200).json({ success: true, user: req.user });
});
