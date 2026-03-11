const express = require("express");
const router = express.Router();
const pool = require("../config/db");


// Get all places 
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM agrotourism_places ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});

// Get place details by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM agrotourism_places WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching place:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new place (Admin)
router.post("/", async (req, res) => {
  const { name, state, description, rating, image_url } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO agrotourism_places 
       (name, state, description, rating, image_url)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [name, state, description, rating, image_url]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Create failed" });
  }
});

// Update place (Admin)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, state, description, rating, image_url } = req.body;

  try {
    await pool.query(
      `UPDATE agrotourism_places
       SET name=$1, state=$2, description=$3, rating=$4, image_url=$5
       WHERE id=$6`,
      [name, state, description, rating, image_url, id]
    );

    res.json({ message: "Updated successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Update failed" });
  }
});
// Delete place (Admin)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.query(
      "DELETE FROM agrotourism_places WHERE id = $1",
      [id]
    );

    res.json({ message: "Place deleted successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Delete failed" });
  }
});
// Get all bookings for a place (Admin) 
router.get("/:id/bookings", async (req, res) => {
  const { id } = req.params;  
  try {
    const result = await pool.query(
      `SELECT b.*, u.name AS user_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id   
        WHERE b.place_id = $1
        ORDER BY b.booking_date DESC`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch bookings for place" });
  }
});

module.exports = router;
