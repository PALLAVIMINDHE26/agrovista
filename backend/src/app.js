const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("AgroVista Backend API Running");
});

const pool = require("./config/db");

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// const pool = require("./config/db");

app.get("/users", async (req, res) => {
  const users = await pool.query("SELECT * FROM users");
  res.json(users.rows);
});


module.exports = app;
