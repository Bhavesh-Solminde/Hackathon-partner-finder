import dotenv from "dotenv";
dotenv.config();

/**
 * Environment variables configuration
 */
const ENV = {
  PORT: `${process.env.PORT}`,
  MONGODB_URI: `${process.env.MONGODB_URI}`,
  NODE_ENV: `${process.env.NODE_ENV}`,
  CORS_ORIGIN: process.env.CORS_ORIGIN || undefined,
  ACCESS_TOKEN_SECRET: `${process.env.ACCESS_TOKEN_SECRET}`,
  ACCESS_TOKEN_EXPIRY: `${process.env.ACCESS_TOKEN_EXPIRY}`,
  REFRESH_TOKEN_SECRET: `${process.env.REFRESH_TOKEN_SECRET}`,
  REFRESH_TOKEN_EXPIRY: `${process.env.REFRESH_TOKEN_EXPIRY}`,
  GOOGLE_CLIENT_ID: `${process.env.GOOGLE_CLIENT_ID}`,
  GOOGLE_CLIENT_SECRET: `${process.env.GOOGLE_CLIENT_SECRET}`,
  GOOGLE_CALLBACK_URL: `${process.env.GOOGLE_CALLBACK_URL}`,
  GITHUB_CLIENT_ID: `${process.env.GITHUB_CLIENT_ID}`,
  GITHUB_CLIENT_SECRET: `${process.env.GITHUB_CLIENT_SECRET}`,
  GITHUB_CALLBACK_URL: `${process.env.GITHUB_CALLBACK_URL}`,
  GEMINI_API_KEY: `${process.env.GEMINI_API_KEY}`,
};

export default ENV;
