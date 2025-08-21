import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

// Validasi environment variables
const requiredEnvVars = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

// Tentukan callback URL berdasarkan environment
const getCallbackURL = () => {
  // Prioritas: NGROK_URL > API_URL > localhost default
  if (process.env.NGROK_URL) {
    return `${process.env.NGROK_URL}/user/auth/google/callback`;
  }

  if (process.env.API_URL) {
    return `${process.env.API_URL}/user/auth/google/callback`;
  }

  // Default untuk development
  const port = process.env.PORT || 5000;
  return `http://localhost:${port}/user/auth/google/callback`;
};

const callbackURL = getCallbackURL();
console.log(`🔗 Google OAuth Callback URL: ${callbackURL}`);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL,
      passReqToCallback: true,
      scope: ["profile", "email"], // Explicitly request scopes
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log(
          `🔍 Google OAuth callback - Processing user: ${profile.emails[0].value}`
        );

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
        });

        if (!user) {
          // Buat user baru jika belum ada
          console.log("✨ Creating new user via Google OAuth");
          user = await User.create({
            googleId: profile.id,
            nama: profile.displayName,
            email: profile.emails[0].value,
            foto: profile.photos[0].value,
            isVerified: true,
            password: Math.random().toString(36).slice(-8),
          });
          console.log(`✅ New user created: ${user.email}`);
        } else if (!user.googleId) {
          // Link Google account to existing email account
          console.log("🔗 Linking Google account to existing user");
          user.googleId = profile.id;
          user.isVerified = true;
          if (profile.photos && profile.photos[0]) {
            user.foto = profile.photos[0].value;
          }
          await user.save();
          console.log(`✅ Google account linked to: ${user.email}`);
        } else {
          console.log(`✅ Existing Google user logged in: ${user.email}`);
        }

        return done(null, user);
      } catch (error) {
        console.error("💥 Google auth error:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log(`📝 Serializing user: ${user.id}`);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log(`🔓 Deserializing user: ${id}`);
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error("💥 Deserialize error:", error);
    done(error, null);
  }
});

export default passport;
