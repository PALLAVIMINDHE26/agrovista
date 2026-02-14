const express = require("express");
const router = express.Router(); 

router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM blogs ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

module.exports = router;