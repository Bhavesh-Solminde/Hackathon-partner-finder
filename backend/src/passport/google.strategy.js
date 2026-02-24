import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid";
import ENV from "../env.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // 1. Check if user already exists
        const existingUser = await User.findOne({
          email: profile.emails?.[0]?.value,
        });

        if (existingUser) {
          // Link Google to the existing account
          if (!existingUser.googleId) {
            existingUser.googleId = profile.id;
          }
          if (!existingUser.avatar && profile.photos?.[0]?.value) {
            existingUser.avatar = profile.photos[0].value;
          }
          await existingUser.save({ validateBeforeSave: false });
          return done(null, existingUser);
        }

        // 2. If not, create new user
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          password: uuidv4(), // We must set a password, so we make a random complex one
          avatar: profile.photos?.[0]?.value, // Google returns an avatar URL
          googleId: profile.id,
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);
