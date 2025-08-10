import dotenv from "dotenv";
dotenv.config();

console.log("Testing environment variables:");
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("MONGODB_URI length:", process.env.MONGODB_URI?.length || 0);

// Test simple MongoDB connection
import mongoose from "mongoose";

async function testConnection() {
  try {
    console.log("🔄 Attempting connection to Atlas...");

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });

    console.log("✅ Connected to MongoDB Atlas successfully!");

    // Test BookingModel
    const BookingModel = (await import("./src/models/booking.js")).default;
    const count = await BookingModel.countDocuments();
    console.log(`📊 Total bookings: ${count}`);

    if (count > 0) {
      const sample = await BookingModel.findOne({});
      console.log("📋 Sample booking:", {
        orderNumber: sample.orderNumber,
        status: sample.status,
        _id: sample._id,
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();
