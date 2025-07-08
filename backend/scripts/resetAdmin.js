// scripts/resetAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import AdminUser from "../src/models/adminUser.js";
import bcrypt from "bcryptjs";

dotenv.config();

const resetAdminPassword = async () => {
  try {
    console.log("🔄 Starting admin password reset...");
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get email from command line or use default
    const email = process.argv[3] || "superadmin@travedia.com";
    const newPassword = process.argv[4] || "SuperAdmin123!";

    console.log(`🔍 Searching for admin: ${email}`);

    // Find admin
    const admin = await AdminUser.findOne({ email });
    
    if (!admin) {
      console.log("❌ Admin not found");
      console.log("📋 Available admins:");
      
      const allAdmins = await AdminUser.find({}).select('email role');
      allAdmins.forEach(a => {
        console.log(`   • ${a.email} (${a.role})`);
      });
      return;
    }

    // Reset password
    console.log("🔑 Resetting password...");
    admin.password = newPassword; // Will be hashed by pre-save middleware
    await admin.save();

    console.log("🎉 Password reset successfully!");
    console.log("═══════════════════════════════════");
    console.log("📧 Email:", email);
    console.log("🔐 New Password:", newPassword);
    console.log("🔑 Role:", admin.role);
    console.log("═══════════════════════════════════");

  } catch (error) {
    console.error("❌ Error resetting password:", error.message);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(0);
  }
};

resetAdminPassword();