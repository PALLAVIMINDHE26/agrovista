const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../controllers/auth.controller");
const sendOtp = require('../utils/sendOtp');


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
const bcrypt = require("bcrypt");

router.post("/reset-password", async (req, res) => {
  const { userId, newPassword } = req.body;

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await pool.query(
    "UPDATE users SET password=$1 WHERE id=$2",
    [hashedPassword, userId]
  );

  res.json({ message: "Password updated successfully" });
});

module.exports = router;
