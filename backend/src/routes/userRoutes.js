const express = require("express");
const router = express.Router();
const pool = require("../config/db");


// ================= GET USER PROFILE =================
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.log("GET PROFILE ERROR:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});


// ================= UPDATE USER PROFILE =================
router.put("/:id", async (req, res) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2 
       WHERE id = $3 
       RETURNING id, name, email, role`,
      [name, email, req.params.id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.log("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;