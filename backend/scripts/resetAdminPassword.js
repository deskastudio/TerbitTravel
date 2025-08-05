// scripts/resetAdminPassword.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import AdminUser from "../src/models/adminUser.js";

dotenv.config();

async function resetAdminPassword() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const email = "superadmin@gmail.com";
    const newPassword = "SuperAdmin123!";

    console.log(`\n🔍 Finding admin: ${email}`);

    // Find admin user
    const admin = await AdminUser.findOne({ email });

    if (!admin) {
      console.log("❌ Admin user not found");
      return;
    }

    console.log("✅ Admin user found, updating password...");

    // Update password using the model's method
    admin.password = newPassword;
    await admin.save();

    console.log("✅ Password updated successfully!");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 New Password: ${newPassword}`);
    console.log("\nYou can now login with these credentials.");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

resetAdminPassword();
