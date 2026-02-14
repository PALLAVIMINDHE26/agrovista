const express = require("express");
const router = express.Router();
const pool = require("../config/db");


// Get all bookings (Admin)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        bookings.id,
        users.email,
        bookings.guests,
        bookings.booking_date,
        bookings.status,
        bookings.total_price
      FROM bookings
      JOIN users ON bookings.user_id = users.id
      ORDER BY bookings.created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});
// Create new booking
router.post("/", async (req, res) => {
  try {
    const { user_id, place_id, guests, date, total_price } = req.body;

    await pool.query(
      `INSERT INTO bookings 
      (user_id, place_id, guests, booking_date, total_price, status)
      VALUES ($1,$2,$3,$4,$5,'pending')`,
      [user_id, place_id, guests, date, total_price]
    );

    res.json({ message: "Booking created successfully" });

  } catch (err) {
    console.log("BOOKING ERROR:", err);
    res.status(500).json({ error: "Booking failed" });
  }
});

// Update booking status (Admin confirm/cancel)
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    await pool.query(
      "UPDATE bookings SET status=$1 WHERE id=$2",
      [status, req.params.id]
    );

    res.json({ message: "Booking status updated successfully" });

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

// Get bookings for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT 
        b.*, 
        p.name AS place_name
       FROM bookings b
       JOIN agrotourism_places p 
       ON b.place_id = p.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );

    res.json(result.rows);

  } catch (error) {
    console.log("USER BOOKINGS ERROR:", error);
    res.status(500).json({ error: "Error fetching user bookings" });
  }
});


module.exports = router;
