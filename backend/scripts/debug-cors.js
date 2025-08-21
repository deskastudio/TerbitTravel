// scripts/debug-cors.js
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: path.join(__dirname, "..", ".env") });

console.log("🔍 CORS Debug Helper");
console.log("-----------------");

// Read allowed origins
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || "";
const allowedOrigins = allowedOriginsEnv
  .split(",")
  .filter((origin) => origin.trim() !== "");

console.log("📋 Current allowed origins:");
allowedOrigins.forEach((origin) => console.log(`  - ${origin}`));

// Check if localhost:5173 and 127.0.0.1:5173 are both included
const hasLocalhost = allowedOrigins.some((origin) =>
  origin.includes("localhost:5173")
);
const has127001 = allowedOrigins.some((origin) =>
  origin.includes("127.0.0.1:5173")
);

console.log("\n📋 CORS Check:");
console.log(
  `  - localhost:5173: ${hasLocalhost ? "✅ Present" : "❌ Missing"}`
);
console.log(`  - 127.0.0.1:5173: ${has127001 ? "✅ Present" : "❌ Missing"}`);

// Check if the localtunnel URL is present
const localtunnelUrl = process.env.LOCALTUNNEL_URL;
const hasLocaltunnel = allowedOrigins.some(
  (origin) => origin === localtunnelUrl
);

console.log(
  `  - Localtunnel (${localtunnelUrl}): ${
    hasLocaltunnel ? "✅ Present" : "❌ Missing"
  }`
);

// Add missing origins
let updatedOrigins = [...allowedOrigins];

if (!hasLocalhost) {
  updatedOrigins.push("http://localhost:5173");
  console.log("\n✅ Added http://localhost:5173 to allowed origins");
}

if (!has127001) {
  updatedOrigins.push("http://127.0.0.1:5173");
  console.log("\n✅ Added http://127.0.0.1:5173 to allowed origins");
}

if (localtunnelUrl && !hasLocaltunnel) {
  updatedOrigins.push(localtunnelUrl);
  console.log(`\n✅ Added ${localtunnelUrl} to allowed origins`);
}

// Remove duplicates
updatedOrigins = [...new Set(updatedOrigins)];

// Check if we need to update
if (updatedOrigins.length !== allowedOrigins.length) {
  // Update .env file
  const envPath = path.join(__dirname, "..", ".env");
  let envContent = fs.readFileSync(envPath, "utf8");

  // Replace ALLOWED_ORIGINS line
  const newAllowedOrigins = updatedOrigins.join(",");

  if (envContent.includes("ALLOWED_ORIGINS=")) {
    envContent = envContent.replace(
      /ALLOWED_ORIGINS=.*/,
      `ALLOWED_ORIGINS=${newAllowedOrigins}`
    );
  } else {
    envContent += `\nALLOWED_ORIGINS=${newAllowedOrigins}`;
  }

  // Write back to .env
  fs.writeFileSync(envPath, envContent);

  console.log("\n✅ Updated .env file with new allowed origins");
  console.log(`  New value: ALLOWED_ORIGINS=${newAllowedOrigins}`);

  console.log(
    "\n⚠️ Note: You need to restart the server for changes to take effect"
  );
} else {
  console.log("\n✓ CORS configuration looks good, no changes needed");
}

console.log("\n🔍 CORS Debug Helper completed");

// Enable debug mode
console.log("\n📋 CORS Debug Mode:");
console.log(
  `  - Current setting: ${
    process.env.CORS_DEBUG === "true" ? "✅ Enabled" : "❌ Disabled"
  }`
);

if (process.env.CORS_DEBUG !== "true") {
  // Update .env file to enable debug mode
  const envPath = path.join(__dirname, "..", ".env");
  let envContent = fs.readFileSync(envPath, "utf8");

  // Replace or add CORS_DEBUG line
  if (envContent.includes("CORS_DEBUG=")) {
    envContent = envContent.replace(/CORS_DEBUG=.*/, "CORS_DEBUG=true");
  } else {
    envContent += "\nCORS_DEBUG=true";
  }

  // Write back to .env
  fs.writeFileSync(envPath, envContent);

  console.log("✅ Enabled CORS debug mode in .env file");
  console.log(
    "⚠️ Note: You need to restart the server for this change to take effect"
  );
} else {
  console.log("✓ CORS debug mode already enabled");
}
