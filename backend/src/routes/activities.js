const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { act } = require("react");

// Get all activities
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*,
        ROUND(AVG(ar.rating),1) AS average_rating
        FROM activities a
        LEFT JOIN activity_ratings ar 
        ON a.id = ar.activity_id
        AND ar.is_approved = true
        GROUP BY a.id
        ORDER BY a.id ASC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

// Get single activity
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM activities WHERE id = $1",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

// Get approved reviews for activity
router.get("/:id/reviews", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM activity_ratings
       WHERE activity_id = $1
       AND is_approved = true
       ORDER BY created_at DESC`,
      [req.params.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Add rating
router.post("/:id/rate", async (req, res) => {
  const { user_id, rating, review } = req.body;

  try {
    await pool.query(
      `INSERT INTO activity_ratings 
       (activity_id, user_id, rating, review)
       VALUES ($1,$2,$3,$4)`,
      [req.params.id, user_id, rating, review]
    );
    res.json({ message: "Rating submitted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Rating failed" });
  }
});

module.exports = router;
