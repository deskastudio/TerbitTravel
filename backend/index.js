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
import consumeRoutes from "./src/routes/consumeRoutes.js";
import blogRoutes from "./src/routes/blogRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import packageRoutes from "./src/routes/packageRoutes.js";
import bannerRoutes from "./src/routes/bannerRoutes.js";
import galleryRoutes from "./src/routes/galleryRoutes.js";
import galleryCategoryRoutes from "./src/routes/galleryCategoryRoute.js";
import packageCategoryRoutes from "./src/routes/packageCategoryRoute.js";
import destinationCategoryRoutes from "./src/routes/destinationCategoryRoute.js";
import teamRoutes from "./src/routes/teamRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import cors from "cors";


// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];

// Middleware
app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Routes
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/contact", contactRoutes);
app.use("/destination", destinationRoutes);
app.use("/hotel", hotelRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/armada", armadaRoutes);
app.use("/consume", consumeRoutes);
app.use("/blog", blogRoutes);
app.use("/profiles", profileRoutes);
app.use("/reviews", reviewRoutes);
app.use("/package", packageRoutes);
app.use("/banner", bannerRoutes);
app.use("/gallery", galleryRoutes);
app.use("/gallery-category", galleryCategoryRoutes);
app.use("/package-category", packageCategoryRoutes);
app.use("/destination-category", destinationCategoryRoutes);
app.use("/team", teamRoutes);
app.use("/orders", orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Invalid token' });
  } else if (err.name === 'CrossOriginResourceSharingError') {
    res.status(403).json({ error: 'CORS error' });
  } else {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

//swagger
setupSwagger(app);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Server Listening
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});