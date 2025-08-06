// Fix destinations without category
import mongoose from "mongoose";
import Destination from "../src/models/destination.js";
import DestinationCategory from "../src/models/destinationCategory.js";

mongoose.connect("mongodb://localhost:27017/terbit_travel", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", async () => {
  console.log("🔌 Connected to MongoDB");

  try {
    // Check destinations without category
    const destinationsWithoutCategory = await Destination.find({
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: "" },
      ],
    });

    console.log(
      `📊 Found ${destinationsWithoutCategory.length} destinations without category:`
    );
    destinationsWithoutCategory.forEach((dest) => {
      console.log(`  - ${dest.nama} (${dest._id})`);
    });

    if (destinationsWithoutCategory.length === 0) {
      console.log("✅ All destinations already have categories!");
      await mongoose.disconnect();
      process.exit(0);
      return;
    }

    // Get or create default category
    let defaultCategory = await DestinationCategory.findOne({ title: "Umum" });

    if (!defaultCategory) {
      console.log('📝 Creating default category "Umum"...');
      defaultCategory = await DestinationCategory.create({
        title: "Umum",
      });
      console.log("✅ Default category created:", defaultCategory._id);
    } else {
      console.log("✅ Using existing default category:", defaultCategory._id);
    }

    // Update destinations without category
    const updateResult = await Destination.updateMany(
      {
        $or: [
          { category: { $exists: false } },
          { category: null },
          { category: "" },
        ],
      },
      {
        $set: { category: defaultCategory._id },
      }
    );

    console.log(
      `✅ Updated ${updateResult.modifiedCount} destinations with default category`
    );

    // Verify the update
    const verificationsWithoutCategory = await Destination.find({
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: "" },
      ],
    });

    console.log(
      `📊 Remaining destinations without category: ${verificationsWithoutCategory.length}`
    );

    // Show updated destinations
    const updatedDestinations = await Destination.find({
      category: defaultCategory._id,
    }).populate("category");
    console.log("📋 Destinations with default category:");
    updatedDestinations.forEach((dest) => {
      console.log(`  - ${dest.nama} → ${dest.category.title}`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
  }

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB");
  process.exit(0);
});
