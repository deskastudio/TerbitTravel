import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

// Validasi environment variables
const requiredEnvVars = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "API_URL"];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/user/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
        });

        if (!user) {
          // Buat user baru jika belum ada
          console.log("Creating new user via passport");
          user = await User.create({
            googleId: profile.id,
            nama: profile.displayName,
            email: profile.emails[0].value,
            foto: profile.photos[0].value,
            isVerified: true,
            password: Math.random().toString(36).slice(-8),
          });
        } else if (!user.googleId) {
          // Link Google account to existing email account
          user.googleId = profile.id;
          user.isVerified = true;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error("Google auth error:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
