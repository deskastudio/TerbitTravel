import mongoose from "mongoose";
import BookingModel from "./src/models/booking.js";
import dotenv from "dotenv";

dotenv.config();

console.log("🔄 Starting MongoDB Atlas connection test...");
console.log(
  "📍 Database URI:",
  process.env.MONGODB_URI ? "Atlas URI loaded" : "No URI found"
);

const connectPromise = mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // 10 second timeout
});

Promise.race([
  connectPromise,
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Connection timeout")), 12000)
  ),
])
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");

    try {
      const bookingCount = await BookingModel.countDocuments();
      console.log(`📊 Total bookings in database: ${bookingCount}`);

      if (bookingCount > 0) {
        const bookings = await BookingModel.find({})
          .limit(3)
          .select("customId status packageId");
        console.log("\n📋 Sample bookings:");
        bookings.forEach((booking, index) => {
          console.log(
            `${index + 1}. Order: ${booking.customId}, Status: ${
              booking.status
            }, Package: ${booking.packageId}`
          );
        });

        // Check specific booking
        const specificBooking = await BookingModel.findOne({
          customId: "BOOK-23113978",
        });
        if (specificBooking) {
          console.log("\n✅ Found BOOK-23113978:", specificBooking.customId);
        } else {
          console.log("\n❌ BOOK-23113978 not found");
          // Show first booking as alternative
          const firstBooking = await BookingModel.findOne({});
          if (firstBooking) {
            console.log(
              `🔄 Alternative booking to test: ${firstBooking.customId}`
            );
          }
        }
      } else {
        console.log("📝 No bookings found in database");
      }
    } catch (error) {
      console.error("❌ Error querying bookings:", error.message);
    }

    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
