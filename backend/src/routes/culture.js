const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all culture data
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM states_culture");
  res.json(result.rows);
});

// Get single festival by ID
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM states_culture WHERE id=$1",
    [req.params.id]
  );

  res.json(result.rows[0]);
});


module.exports = router;
