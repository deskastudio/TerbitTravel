import mongoose from "mongoose";
import dotenv from "dotenv";
import BookingModel from "./src/models/booking.js";

dotenv.config();

async function debugBooking() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    console.log("\n🔍 Searching for recent bookings...");
    const recentBookings = await BookingModel.find({})
      .sort({ createdAt: -1 })
      .limit(10);

    console.log(`📊 Found ${recentBookings.length} recent bookings:`);
    recentBookings.forEach((booking, index) => {
      console.log(
        `${index + 1}. ID: ${booking.customId} | Status: ${
          booking.status
        } | Created: ${booking.createdAt}`
      );
    });

    console.log("\n🔍 Searching specifically for BOOK-08040923...");
    const targetBooking = await BookingModel.findOne({
      customId: "BOOK-08040923",
    });

    if (targetBooking) {
      console.log("✅ Found target booking:", {
        customId: targetBooking.customId,
        _id: targetBooking._id,
        status: targetBooking.status,
        paymentStatus: targetBooking.paymentStatus,
        createdAt: targetBooking.createdAt,
      });
    } else {
      console.log("❌ Booking BOOK-08040923 not found in database");

      // Search for similar IDs
      console.log("\n🔍 Searching for similar booking IDs...");
      const similarBookings = await BookingModel.find({
        customId: { $regex: "08040923", $options: "i" },
      });

      if (similarBookings.length > 0) {
        console.log(
          `🔍 Found ${similarBookings.length} bookings with similar IDs:`
        );
        similarBookings.forEach((booking) => {
          console.log(`- ${booking.customId} (${booking.status})`);
        });
      }
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 Database connection closed");
    process.exit(0);
  }
}

debugBooking();
