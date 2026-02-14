const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const sendOtp = require("../utils/sendOtp");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *",
    [name, email, hashed]
  );

  res.json({ message: "Signup successful. Please login." });
};

// Login with OTP

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (result.rows.length === 0)
    return res.status(401).json({ message: "User not found" });

  const user = result.rows[0];

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(401).json({ message: "Invalid password" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 5 * 60000);

  await pool.query(
    "INSERT INTO otp_verifications (user_id, otp_code, expires_at) VALUES ($1,$2,$3)",
    [user.id, otp, expires]
  );

  await sendOtp(user.email, otp);

  res.json({ message: "OTP sent to email", userId: user.id });
// Login with JWT (no OTP)
  const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);
  res.json({ message: "Login successful", token });
};

// Verify OTP MFA

exports.verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;

  const result = await pool.query(
    "SELECT * FROM otp_verifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1",
    [userId]
  );

  if (result.rows.length === 0)
    return res.status(400).json({ message: "OTP not found" });

  const record = result.rows[0];

  if (record.otp_code !== otp || new Date() > record.expires_at)
    return res.status(400).json({ message: "Invalid or expired OTP" });

  await pool.query(
    "UPDATE users SET is_verified=true WHERE id=$1",
    [userId]
  );

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ message: "Login successful", token });
};

