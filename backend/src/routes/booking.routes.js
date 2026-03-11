const express = require("express");
const router = express.Router();
const pool = require("../config/db");


// ================= GET ALL BOOKINGS (ADMIN) =================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.*, 
        p.name AS place_name,
        STRING_AGG(a.title, ', ') AS activities
      FROM bookings b
      LEFT JOIN agrotourism_places p 
        ON b.place_id = p.id
      LEFT JOIN booking_activities ba 
        ON b.id = ba.booking_id
      LEFT JOIN activities a 
        ON ba.activity_id = a.id
      GROUP BY b.id, p.name
      ORDER BY b.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});


// ================= CREATE BOOKING =================
router.post("/", async (req, res) => {
  const { user_id, place_id, guests, booking_date, total_price, activities } = req.body;

  try {
    const bookingResult = await pool.query(
      `INSERT INTO bookings 
       (user_id, place_id, guests, booking_date, total_price, status)
       VALUES ($1,$2,$3,$4,$5,'pending')
       RETURNING *`,
      [user_id, place_id, guests, booking_date, total_price]
    );

    const booking = bookingResult.rows[0];

    if (activities && activities.length > 0) {
      for (let activityId of activities) {
        await pool.query(
          `INSERT INTO booking_activities (booking_id, activity_id)
           VALUES ($1,$2)`,
          [booking.id, activityId]
        );
      }
    }

    res.json({ booking });

  } catch (err) {
    console.log("BOOKING ERROR:", err);
    res.status(500).json({ error: "Booking failed" });
  }
});


// ================= UPDATE STATUS =================
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


// ================= GET USER BOOKINGS (FIXED & MERGED) =================
router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      `
      SELECT 
        b.*,
        p.name AS place_name,
        STRING_AGG(a.title, ', ') AS activities
      FROM bookings b
      LEFT JOIN agrotourism_places p 
        ON b.place_id = p.id
      LEFT JOIN booking_activities ba 
        ON b.id = ba.booking_id
      LEFT JOIN activities a 
        ON ba.activity_id = a.id
      WHERE b.user_id = $1
      GROUP BY b.id, p.name
      ORDER BY b.id DESC
      `,
      [userId]
    );

    res.json(result.rows);

  } catch (error) {
    console.log("USER BOOKINGS ERROR:", error);
    res.status(500).json({ error: "Error fetching user bookings" });
  }
});

module.exports = router;