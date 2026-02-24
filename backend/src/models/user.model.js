import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../env.js";

// ─── Skill Sub-document ──────────────────────────────────────────────────────
const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["LANG", "LANGUAGE", "FRAMEWORK", "DB", "LIBRARY", "TOOL"],
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    evidence: {
      type: String,
      default: "",
    },
    source: {
      type: String,
      enum: ["MANUAL", "GITHUB"],
      default: "MANUAL",
    },
  },
  { _id: false }
);

// ─── User Schema ─────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "developer",
      trim: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    githubHandle: {
      type: String,
      default: "",
    },
    githubAccessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    trustScore: {
      type: Number,
      default: 0,
    },
    lastSynced: {
      type: Date,
      default: null,
    },
    skills: [skillSchema],
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    ENV.ACCESS_TOKEN_SECRET,
    {
      expiresIn: ENV.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    ENV.REFRESH_TOKEN_SECRET,
    {
      expiresIn: ENV.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);
export default User;
