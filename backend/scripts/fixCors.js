// scripts/fixCors.js
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log("🛠️ CORS Fix Tool");
console.log("===================");

// Paths
const backendEnvPath = path.resolve(process.cwd(), ".env");
const frontendEnvPath = path.resolve(process.cwd(), "../frontend/.env");
const indexJsPath = path.resolve(process.cwd(), "index.js");

// Read .env files
function readEnvFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error(`❌ Error membaca file ${filePath}: ${error.message}`);
    return null;
  }
}

// Update Backend .env file
function updateBackendEnv() {
  console.log("🔄 Memperbarui backend .env untuk CORS...");
  const backendEnv = readEnvFile(backendEnvPath);
  if (!backendEnv) return false;

  let updatedEnv = backendEnv;

  // Add CORS_DEBUG flag
  if (!updatedEnv.includes("CORS_DEBUG=")) {
    updatedEnv += "\nCORS_DEBUG=true";
  } else {
    updatedEnv = updatedEnv.replace(/CORS_DEBUG=.*/g, "CORS_DEBUG=true");
  }

  // Make sure frontend origins are in ALLOWED_ORIGINS
  const frontendEnv = readEnvFile(frontendEnvPath);
  if (frontendEnv) {
    let origins = [];

    // Extract current ALLOWED_ORIGINS
    const originsMatch = updatedEnv.match(/ALLOWED_ORIGINS=([^\n]*)/);
    if (originsMatch && originsMatch[1]) {
      origins = originsMatch[1].split(",");
    } else {
      origins = ["http://localhost:5173", "http://127.0.0.1:5173"];
    }

    // Extract frontend URL
    const frontendUrlMatch = frontendEnv.match(/VITE_FRONTEND_URL=([^\n]*)/);
    if (
      frontendUrlMatch &&
      frontendUrlMatch[1] &&
      !origins.includes(frontendUrlMatch[1])
    ) {
      origins.push(frontendUrlMatch[1]);
    }

    // Extract API URLs from frontend
    const apiUrlMatch = frontendEnv.match(/VITE_API_URL=([^\n]*)/);
    if (apiUrlMatch && apiUrlMatch[1] && !origins.includes(apiUrlMatch[1])) {
      origins.push(apiUrlMatch[1]);
    }

    const apiBaseUrlMatch = frontendEnv.match(/VITE_API_BASE_URL=([^\n]*)/);
    if (
      apiBaseUrlMatch &&
      apiBaseUrlMatch[1] &&
      !origins.includes(apiBaseUrlMatch[1])
    ) {
      origins.push(apiBaseUrlMatch[1]);
    }

    // Update or add ALLOWED_ORIGINS
    const uniqueOrigins = [...new Set(origins)]; // Remove duplicates
    if (originsMatch) {
      updatedEnv = updatedEnv.replace(
        /ALLOWED_ORIGINS=([^\n]*)/,
        `ALLOWED_ORIGINS=${uniqueOrigins.join(",")}`
      );
    } else {
      updatedEnv += `\nALLOWED_ORIGINS=${uniqueOrigins.join(",")}`;
    }
  }

  try {
    fs.writeFileSync(backendEnvPath, updatedEnv);
    console.log("✅ Backend .env updated dengan CORS settings");
    return true;
  } catch (error) {
    console.error(`❌ Error menulis file ${backendEnvPath}: ${error.message}`);
    return false;
  }
}

// Main execution
console.log("🔄 Memperbarui konfigurasi CORS...");
const success = updateBackendEnv();

if (success) {
  console.log("✨ CORS fix selesai!");
  console.log("\n🚀 Selanjutnya:");
  console.log('   1. Restart server dengan "npm run dev"');
  console.log(
    '   2. Jalankan tunnel di terminal terpisah dengan "npm run tunnel"'
  );
} else {
  console.log("❌ CORS fix gagal, cek error di atas");
}
