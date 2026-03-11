const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ---------------- USERS ----------------

// Get all users
router.get("/users", async (req, res) => {
  const result = await pool.query("SELECT id, email, role FROM users");
  res.json(result.rows);
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
  res.json({ message: "User deleted successfully" });
});

// ---------------- PLACES ----------------

// Get all places
router.get("/places", async (req, res) => {
  const result = await pool.query("SELECT * FROM agrotourism_places");
  res.json(result.rows);
});

// Add place
router.post("/places", async (req, res) => {
  const { name, description, state, district } = req.body;

  await pool.query(
    "INSERT INTO agrotourism_places (name, description, state, district) VALUES ($1,$2,$3,$4)",
    [name, description, state, district]
  );

  res.json({ message: "Place added successfully" });
});

// Delete place
router.delete("/places/:id", async (req, res) => {
  await pool.query(
    "DELETE FROM agrotourism_places WHERE id=$1",
    [req.params.id]
  );

  res.json({ message: "Place deleted successfully" });
});

// ---------------- BOOKINGS ----------------

router.get("/activity-analytics", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
       a.title,
       COUNT(ba.activity_id) AS bookings_count,
       SUM(b.total_price) AS revenue
       FROM activities a
       LEFT JOIN booking_activities ba ON a.id = ba.activity_id
       LEFT JOIN bookings b ON b.id = ba.booking_id
       GROUP BY a.title
       ORDER BY bookings_count DESC;
      `);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});


// -------- DASHBOARD STATS --------

router.get("/stats", async (req, res) => {
  try {
    const users = await pool.query("SELECT COUNT(*) FROM users");
    const bookings = await pool.query(
      "SELECT COUNT(*) FROM bookings WHERE status='pending' OR status='confirmed'"
    );
    const tours = await pool.query("SELECT COUNT(*) FROM agrotourism_places");
    const revenue = await pool.query(
      "SELECT COALESCE(SUM(total_price),0) FROM bookings WHERE status='confirmed'"
    );

    res.json({
      totalUsers: users.rows[0].count,
      activeBookings: bookings.rows[0].count,
      totalTours: tours.rows[0].count,
      totalRevenue: revenue.rows[0].coalesce
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});
// -------- PENDING REVIEWS --------
router.get("/pending-reviews", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM activity_ratings
       WHERE is_approved = false
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});
// Approve review
router.put("/reviews/:id/approve", async (req, res) => {
  try {
    await pool.query(
      `UPDATE activity_ratings
       SET is_approved = true
       WHERE id = $1`,
      [req.params.id]
    );

    res.json({ message: "Review approved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Approval failed" });
  }
});

module.exports = router;
