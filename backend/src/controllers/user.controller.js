import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { verifyUserStack } from "../services/github.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// ─── Get Profile ─────────────────────────────────────────────────────────────
export const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken -githubAccessToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, "Profile fetched successfully", user));
});

// ─── Update Profile ──────────────────────────────────────────────────────────
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, role, skills } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (name) user.name = name;
  if (role) user.role = role;

  // Merge manually-added skills (don't wipe GITHUB-sourced ones)
  if (skills && Array.isArray(skills)) {
    const manualSkills = skills.map((s) => ({
      name: s.name,
      type: s.type || "TOOL",
      verified: false,
      evidence: "",
      source: "MANUAL",
    }));

    // Keep existing GITHUB-sourced skills, replace MANUAL ones
    const githubSkills = user.skills.filter((s) => s.source === "GITHUB");
    user.skills = [...githubSkills, ...manualSkills];
  }

  await user.save();
  res.status(200).json(new ApiResponse(200, "Profile updated successfully", user));
});

// ─── Sync GitHub Stats ───────────────────────────────────────────────────────
export const syncGithubStats = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Get the GitHub access token from user document
  const githubToken = user.githubAccessToken;

  if (!githubToken) {
    throw new ApiError(400, "No GitHub token found. Please link your GitHub account first.");
  }

  // Call the GitHub verification service
  const verifiedSkills = await verifyUserStack(githubToken);

  // Wipe existing GITHUB-sourced skills
  user.skills = user.skills.filter((s) => s.source !== "GITHUB");

  // Append newly verified skills
  user.skills.push(...verifiedSkills);

  // Recalculate trust score (verified skills count * 10)
  const verifiedCount = user.skills.filter((s) => s.verified).length;
  user.trustScore = verifiedCount * 10;

  // Update lastSynced
  user.lastSynced = new Date();

  await user.save();

  res.status(200).json(
    new ApiResponse(200, `Sync complete. ${verifiedSkills.length} skills verified.`, user)
  );
});

// ─── Unlink GitHub Account ──────────────────────────────────────────────────
export const unlinkGithub = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.githubId) {
    throw new ApiError(400, "GitHub account is not linked.");
  }

  // Clear all GitHub-related fields
  user.githubId = undefined;
  user.githubHandle = "";
  user.githubAccessToken = undefined;
  user.lastSynced = null;

  // Wipe GitHub-sourced verified skills
  user.skills = user.skills.filter((s) => s.source !== "GITHUB");

  // Recalculate trust score (only manual/unverified skills remain)
  const verifiedCount = user.skills.filter((s) => s.verified).length;
  user.trustScore = verifiedCount * 10;

  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken -githubAccessToken"
  );

  res.status(200).json(
    new ApiResponse(200, "GitHub account unlinked successfully.", updatedUser)
  );
});

// ─── Get User by ID ─────────────────────────────────────────────────────────────
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select(
    "-password -refreshToken -githubAccessToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
});
