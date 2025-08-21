// scripts/testAdminLogin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import AdminUser from "../src/models/adminUser.js";

dotenv.config();

async function testAdminLogin() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const email = "superadmin@gmail.com";
    const testPasswords = [
      "SuperAdmin123!",
      "admin123",
      "password",
      "dimas123",
      "admin",
      "123456",
    ];

    console.log(`\n🔍 Testing login for: ${email}`);

    // Find admin user
    const admin = await AdminUser.findOne({ email });

    if (!admin) {
      console.log("❌ Admin user not found");
      return;
    }

    console.log("✅ Admin user found:");
    console.log(`   📧 Email: ${admin.email}`);
    console.log(`   👤 Name: ${admin.name}`);
    console.log(`   🔑 Role: ${admin.role}`);
    console.log(`   ✅ Active: ${admin.isActive}`);
    console.log(`   🔒 Hashed Password: ${admin.password.substring(0, 20)}...`);

    console.log("\n🧪 Testing different passwords:");

    for (const password of testPasswords) {
      console.log(`\n  Testing password: "${password}"`);

      try {
        const isValid = await bcrypt.compare(password, admin.password);
        console.log(`  Result: ${isValid ? "✅ MATCH" : "❌ NO MATCH"}`);

        if (isValid) {
          console.log(`\n🎉 CORRECT PASSWORD FOUND: "${password}"`);
          console.log("Use this password to login to admin panel");
          break;
        }
      } catch (error) {
        console.log(`  Error: ${error.message}`);
      }
    }

    // Also test the method used in the controller
    console.log("\n🔍 Testing admin.comparePassword method:");
    for (const password of testPasswords) {
      try {
        const isValid = await admin.comparePassword(password);
        console.log(`  "${password}": ${isValid ? "✅ MATCH" : "❌ NO MATCH"}`);

        if (isValid) {
          console.log(`\n🎉 CORRECT PASSWORD WITH METHOD: "${password}"`);
          break;
        }
      } catch (error) {
        console.log(`  "${password}": Error - ${error.message}`);
      }
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

testAdminLogin();
