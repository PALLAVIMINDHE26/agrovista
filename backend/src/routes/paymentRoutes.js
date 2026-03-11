const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const pool = require("../config/db");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + bookingId,
    };

    const order = await razorpay.orders.create(options);

    // Save order_id in booking
    await pool.query(
      "UPDATE bookings SET order_id = $1 WHERE id = $2",
      [order.id, bookingId]
    );

    res.json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// ✅ Verify Payment
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    // Update booking as paid
    await pool.query(
      `UPDATE bookings 
       SET payment_status = 'paid', 
           payment_id = $1 
       WHERE order_id = $2`,
      [razorpay_payment_id, razorpay_order_id]
    );

    res.json({ success: true });

  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
});

module.exports = router;