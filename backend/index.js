import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import setupSwagger from "./src/swagger.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import destinationRoutes from "./src/routes/destinationRoutes.js";
import hotelRoutes from "./src/routes/hotelRoutes.js";
import armadaRoutes from "./src/routes/armadaRoutes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/contact", contactRoutes);
app.use("/destination", destinationRoutes);
app.use("/hotel", hotelRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/armada", armadaRoutes);

//swager
setupSwagger(app);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Server Listening
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
