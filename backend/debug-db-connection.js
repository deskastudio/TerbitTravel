import mongoose from "mongoose";
import dotenv from "dotenv";
import BookingModel from "./src/models/booking.js";

dotenv.config();

async function testDBConnection() {
  try {
    console.log("🔗 Testing MongoDB connection...");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);

    // Test write permissions
    console.log("\n🔧 Testing write permissions...");

    const testBooking = new BookingModel({
      customId: `TEST-${Date.now()}`,
      customerInfo: {
        nama: "Test User",
        email: "test@example.com",
        noTelp: "081234567890",
      },
      packageId: new mongoose.Types.ObjectId(), // Random valid ObjectId
      jumlahPeserta: 1,
      tanggalAwal: new Date(),
      tanggalAkhir: new Date(),
      harga: 100000,
      status: "pending_verification",
      paymentStatus: "pending",
    });

    console.log("📝 Attempting to save test booking...");
    const savedBooking = await testBooking.save();
    console.log("✅ Test booking saved successfully:", savedBooking.customId);

    // Verify it was saved
    console.log("\n🔍 Verifying saved booking...");
    const verification = await BookingModel.findOne({
      customId: savedBooking.customId,
    });

    if (verification) {
      console.log("✅ Verification successful - booking found in database");

      // Clean up - delete test booking
      await BookingModel.deleteOne({ customId: savedBooking.customId });
      console.log("🧹 Test booking cleaned up");
    } else {
      console.log("❌ Verification failed - booking not found");
    }

    // Test schema validation
    console.log("\n🔍 Testing schema validation...");
    try {
      const invalidBooking = new BookingModel({
        // Missing required fields intentionally
      });
      await invalidBooking.save();
      console.log("⚠️ Invalid booking saved (this should not happen)");
    } catch (validationError) {
      console.log("✅ Schema validation working:", validationError.message);
    }
  } catch (error) {
    console.error("❌ Database test failed:", error);

    if (error.name === "ValidationError") {
      console.log("\n📋 Validation errors:");
      Object.keys(error.errors).forEach((field) => {
        console.log(`  - ${field}: ${error.errors[field].message}`);
      });
    }

    if (error.code === 11000) {
      console.log("\n⚠️ Duplicate key error - customId already exists");
    }
  } finally {
    await mongoose.connection.close();
    console.log("🔒 Database connection closed");
    process.exit(0);
  }
}

testDBConnection();
