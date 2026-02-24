import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { aiScout, generateIcebreaker } from "../services/ai.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// ─── Search Users (Regex on skills / roles) ──────────────────────────────────
export const searchUsers = asyncHandler(async (req, res, next) => {
  const { q, role, skills } = req.query;

  const hasQuery = q && q.trim().length > 0;
  const hasRole = role && role.trim().length > 0;
  const hasSkills = skills && skills.trim().length > 0;

  if (!hasQuery && !hasRole && !hasSkills) {
    throw new ApiError(400, "Provide at least a search keyword, role, or skill filter.");
  }

  const andConditions = [{ _id: { $ne: req.user._id } }];

  if (hasQuery) {
    const regex = new RegExp(q.trim(), "i");
    andConditions.push({
      $or: [
        { "skills.name": regex },
        { role: regex },
        { name: regex },
      ],
    });
  }

  if (hasRole) {
    const escapedRole = role.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const roleRegex = new RegExp(escapedRole, "i");
    // Full Stack devs are considered both Frontend and Backend
    const roleCondition =
      role.toLowerCase() === "frontend" || role.toLowerCase() === "backend"
        ? { $or: [{ role: roleRegex }, { role: /full\s*stack/i }] }
        : { role: roleRegex };
    andConditions.push(roleCondition);
  }

  if (hasSkills) {
    andConditions.push({ "skills.name": new RegExp(skills.trim(), "i") });
  }

  const users = await User.find({ $and: andConditions })
    .select("-googleId -githubId -__v")
    .limit(50)
    .sort({ trustScore: -1 });

  res.status(200).json(new ApiResponse(200, "Users fetched successfully", { count: users.length, users }));
});

// ─── AI Scout ────────────────────────────────────────────────────────────────
export const scout = asyncHandler(async (req, res, next) => {
  const { query } = req.body;

  if (!query || query.trim().length === 0) {
    throw new ApiError(400, "Query is required.");
  }

  // Fetch top 50 users that have at least one skill (verified OR manual)
  const users = await User.find({ "skills.0": { $exists: true }, _id: { $ne: req.user._id } })
    .select("name role trustScore skills")
    .sort({ trustScore: -1 })
    .limit(50);

  if (users.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, "No users with skills found to match against.", { matches: {} })
    );
  }

  const matchMap = await aiScout(query, users);

  const matchedIds = Object.keys(matchMap);

  if (matchedIds.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, "No matches found for the given query.", { matches: [] })
    );
  }

  // Fetch full user documents for the matched IDs
  const matchedUsers = await User.find({ _id: { $in: matchedIds } })
    .select("-googleId -githubId -githubAccessToken -password -refreshToken -__v");

  // Merge reasoning from the AI into each user object
  const matches = matchedUsers.map((u) => ({
    ...u.toObject(),
    aiReasoning: matchMap[u._id.toString()] || "",
  }));

  res.status(200).json(new ApiResponse(200, "Matches generated successfully", { matches }));
});

// ─── Generate Icebreaker ────────────────────────────────────────────────────
export const icebreaker = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "Target userId is required.");
  }

  const targetUser = await User.findById(userId);

  if (!targetUser) {
    throw new ApiError(404, "Target user not found.");
  }

  const message = await generateIcebreaker(targetUser);

  res.status(200).json(new ApiResponse(200, "Icebreaker generated successfully", { message }));
});
