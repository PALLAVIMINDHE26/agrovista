const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const adminMiddleware = require("../middleware/adminMiddleware");

// Get all places
router.get("/places", async (req, res) => {
  const result = await pool.query("SELECT * FROM agrotourism_places");
  res.json(result.rows);
});

// Get packages for a place
router.get("/packages/:placeId", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM packages WHERE place_id=$1",
    [req.params.placeId]
  );
  res.json(result.rows);
});

// Add new place (ADMIN ONLY)
router.post("/add-place", adminMiddleware, async (req, res) => {
  const { name, description, state, district, latitude, longitude, features } =
    req.body;

  await pool.query(
    `INSERT INTO agrotourism_places 
     (name, description, state, district, latitude, longitude, features)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [name, description, state, district, latitude, longitude, features]
  );

  res.json({ message: "Place added successfully" });
});

// Delete place
router.delete("/delete-place/:id", adminMiddleware, async (req, res) => {
  await pool.query("DELETE FROM agrotourism_places WHERE id=$1", [
    req.params.id,
  ]);

  res.json({ message: "Place deleted successfully" });
});

module.exports = router;
