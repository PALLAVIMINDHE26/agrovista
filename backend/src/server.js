const app = require("./app");
const agrotourismRoutes = require("./routes/agrotourism");
const cultureRoutes = require("./routes/culture");
const placeRoutes = require("./routes/place.routes");
const bookingRoutes = require("./routes/booking.routes");
const adminRoutes = require("./routes/admin.routes");
const blogRoutes = require("./routes/blog.routes");

const PORT = process.env.PORT || 5000;

app.use("/api/agrotourism", agrotourismRoutes);
app.use("/api/culture", cultureRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

