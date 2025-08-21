import mongoose from "mongoose";
import dotenv from "dotenv";
import BookingModel from "./src/models/booking.js";

dotenv.config();

async function debugPaymentFlow() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Test booking save and immediate verification
    const testBookingId = `BOOK-TEST-${Date.now()}`;

    console.log(
      `\n🧪 Testing booking save/verification flow with ID: ${testBookingId}`
    );

    const testBooking = new BookingModel({
      customId: testBookingId,
      packageId: "66b123456789012345678901", // Dummy ObjectId
      jumlahPeserta: 1,
      harga: 100000,
      status: "pending",
      paymentStatus: "pending",
      customerInfo: {
        nama: "Test Customer",
        email: "test@example.com",
        telepon: "081234567890",
      },
      createdAt: new Date(),
    });

    console.log("💾 Attempting to save booking...");
    await testBooking.save();
    console.log("✅ Booking saved successfully");

    // Immediate verification (like in payment controller)
    console.log("\n🔍 Starting verification attempts...");
    for (let i = 0; i < 5; i++) {
      const verification = await BookingModel.findOne({
        customId: testBookingId,
      });
      if (verification) {
        console.log(
          `✅ Verification successful on attempt ${
            i + 1
          }: Found booking ${testBookingId}`
        );

        // Clean up test booking
        await BookingModel.deleteOne({ customId: testBookingId });
        console.log("🧹 Test booking cleaned up");

        return { success: true, attempts: i + 1 };
      }
      console.log(`❌ Verification attempt ${i + 1} failed, waiting 100ms...`);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log("💥 All verification attempts failed!");
    return { success: false, attempts: 5 };
  } catch (error) {
    console.error("❌ Error in debug flow:", error);
    return { success: false, error: error.message };
  } finally {
    await mongoose.connection.close();
    console.log("🔒 Database connection closed");
    process.exit(0);
  }
}

debugPaymentFlow();
