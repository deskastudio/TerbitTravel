// Check destination data in database
import mongoose from "mongoose";
import Destination from "../src/models/destination.js";

mongoose.connect("mongodb://localhost:27017/terbit_travel", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB");

  try {
    // Check the specific destination
    const destination = await Destination.findById("675c16e143fe5c7cb82da8df");
    console.log(
      "📊 Raw destination data:",
      JSON.stringify(destination, null, 2)
    );

    // Check with populate
    const destinationWithCategory = await Destination.findById(
      "675c16e143fe5c7cb82da8df"
    ).populate("category");
    console.log(
      "📊 With populate:",
      JSON.stringify(destinationWithCategory, null, 2)
    );

    // Check all destinations to see the pattern
    const allDestinations = await Destination.find().limit(3);
    console.log("📊 Sample destinations (first 3):");
    allDestinations.forEach((dest, index) => {
      console.log(`${index + 1}:`, {
        _id: dest._id,
        nama: dest.nama,
        category: dest.category,
        hasCategory: !!dest.category,
      });
    });
  } catch (error) {
    console.error("❌ Error:", error);
  }

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
  process.exit(0);
});
