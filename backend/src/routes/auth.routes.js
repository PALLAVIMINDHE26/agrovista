const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../controllers/auth.controller");
const sendOtp = require('../utils/sendOtp');
const jwt    = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.post("/verify-otp", auth.verifyOtp);

// Forgot Password - Send OTP
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const userResult = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (userResult.rows.length === 0) {
    return res.status(404).json({ message: "Email not found" });
  }

  const user = userResult.rows[0];
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await pool.query(
    "INSERT INTO otp_verifications (user_id, otp) VALUES ($1,$2)",
    [user.id, otp]
  );

  // reuse your existing email sending function here
  await sendOtp(user.email, otp);

  res.json({ message: "OTP sent to email", userId: user.id });
});

// Verify OTP for password reset

router.post("/verify-reset-otp", async (req, res) => {
  const { userId, otp } = req.body;

  const result = await pool.query(
    "SELECT * FROM otp_verifications WHERE user_id=$1 AND otp=$2 ORDER BY created_at DESC LIMIT 1",
    [userId, otp]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  res.json({ message: "OTP verified" });
});

// Update password
// const bcrypt = require("bcrypt");

router.post("/reset-password", async (req, res) => {
  const { userId, newPassword } = req.body;

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await pool.query(
    "UPDATE users SET password=$1 WHERE id=$2",
    [hashedPassword, userId]
  );

  res.json({ message: "Password updated successfully" });
});

// ============================================================
// GOOGLE OAUTH — paste this at BOTTOM of auth.routes.js
// before module.exports = router;
// ============================================================
// const jwt          = require("jsonwebtoken");
// const bcrypt       = require("bcrypt");
const passport     = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name  = profile.displayName;

        // Check if user exists
        let result = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        if (result.rows.length === 0) {
          // Create new user
          const randomPassword = Math.random().toString(36).slice(-10);
          const hashed = await bcrypt.hash(randomPassword, 10);
          result = await pool.query(
            `INSERT INTO users (name, email, password, role)
             VALUES ($1, $2, $3, 'user') RETURNING *`,
            [name, email, hashed]
          );
        }

        return done(null, result.rows[0]);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

// Route 1 — Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Route 2 — Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    try {
      const user  = req.user;
      const token = jwt.sign(
        {
          userId: user.id,
          name:   user.name,
          email:  user.email,
          role:   user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Redirect to frontend with token
      res.redirect(
        `http://localhost:5173/google-callback?token=${token}`
      );
    } catch (err) {
      console.error("Google callback error:", err);
      res.redirect("http://localhost:5173/login?error=google_failed");
    }
  }
);
module.exports = router;
