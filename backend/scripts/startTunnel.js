// scripts/startTunnel.js
import { spawn } from "child_process";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const envFilePath = path.resolve(process.cwd(), ".env");

// Function to update backend .env file
function updateBackendEnv(tunnelUrl) {
  // Read the current .env file
  let envContent = fs.readFileSync(envFilePath, "utf8");

  // Update or add LOCALTUNNEL_URL
  if (envContent.includes("LOCALTUNNEL_URL=")) {
    envContent = envContent.replace(
      /LOCALTUNNEL_URL=.*/g,
      `LOCALTUNNEL_URL=${tunnelUrl}`
    );
  } else {
    envContent += `\nLOCALTUNNEL_URL=${tunnelUrl}`;
  }

  // Update or add API_URL
  if (envContent.includes("API_URL=")) {
    envContent = envContent.replace(/API_URL=.*/g, `API_URL=${tunnelUrl}`);
  } else {
    envContent += `\nAPI_URL=${tunnelUrl}`;
  }

  // Update NGROK_URL to LOCALTUNNEL_URL for backward compatibility
  if (envContent.includes("NGROK_URL=")) {
    envContent = envContent.replace(/NGROK_URL=.*/g, `NGROK_URL=${tunnelUrl}`);
  }

  // Update ALLOWED_ORIGINS if it exists
  if (envContent.includes("ALLOWED_ORIGINS=")) {
    // Extract current origins
    const originsMatch = envContent.match(/ALLOWED_ORIGINS=([^\n]*)/);
    if (originsMatch && originsMatch[1]) {
      let origins = originsMatch[1].split(",");

      // Filter out any previous tunnel URLs
      origins = origins.filter(
        (origin) =>
          !origin.includes("ngrok-free.app") && !origin.includes("loca.lt")
      );

      // Add the new tunnel URL
      origins.push(tunnelUrl);

      // Update the ALLOWED_ORIGINS line
      envContent = envContent.replace(
        /ALLOWED_ORIGINS=([^\n]*)/,
        `ALLOWED_ORIGINS=${origins.join(",")}`
      );
    }
  } else {
    // If ALLOWED_ORIGINS doesn't exist, create it with default values and the tunnel URL
    envContent += `\nALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,${tunnelUrl}`;
  }

  // Write back to the .env file
  fs.writeFileSync(envFilePath, envContent);

  console.log(`✅ Backend .env updated dengan tunnel URL: ${tunnelUrl}`);
}

// Function to update frontend .env file
function updateFrontendEnv(tunnelUrl) {
  // Path ke frontend .env
  const frontendEnvPath = path.resolve(process.cwd(), "../frontend/.env");

  // Periksa apakah file frontend .env ada
  if (!fs.existsSync(frontendEnvPath)) {
    console.log(`⚠️ Frontend .env tidak ditemukan di ${frontendEnvPath}`);
    return false;
  }

  // Baca file .env frontend
  let frontendEnv = fs.readFileSync(frontendEnvPath, "utf8");

  // Update variabel yang terkait dengan URL API
  const variables = ["VITE_API_URL", "VITE_API_BASE_URL"];

  let updated = false;
  variables.forEach((variable) => {
    if (frontendEnv.includes(`${variable}=`)) {
      frontendEnv = frontendEnv.replace(
        new RegExp(`${variable}=.*`, "g"),
        `${variable}=${tunnelUrl}`
      );
      updated = true;
    }
  });

  // Tulis kembali ke file .env frontend
  if (updated) {
    fs.writeFileSync(frontendEnvPath, frontendEnv);
    console.log(`✅ Frontend .env updated dengan tunnel URL: ${tunnelUrl}`);
    return true;
  } else {
    console.log(`⚠️ Tidak ada variabel yang diupdate di frontend .env`);
    return false;
  }
}

// Function to update both .env files
function updateEnv(tunnelUrl) {
  // Update backend .env
  updateBackendEnv(tunnelUrl);

  // Update frontend .env
  const frontendUpdated = updateFrontendEnv(tunnelUrl);

  console.log(`\n✨ URL tunnel berhasil diupdate pada:`);
  console.log(`   ✅ Backend .env`);
  if (frontendUpdated) {
    console.log(`   ✅ Frontend .env`);
  } else {
    console.log(
      `   ⚠️ Frontend .env tidak diupdate (file tidak ditemukan atau tidak ada variabel yang diupdate)`
    );
  }
}

// Start localtunnel
console.log(`🚀 Starting localtunnel for port ${PORT}...`);

// Get custom subdomain from command line if provided
const args = process.argv.slice(2);
let subdomain = "terbit-travel"; // Default subdomain
const subdomainIndex = args.findIndex(
  (arg) => arg === "--subdomain" || arg === "-s"
);
if (subdomainIndex !== -1 && args.length > subdomainIndex + 1) {
  subdomain = args[subdomainIndex + 1];
}

// Wait for server to be ready
const waitForServer = async (port, maxRetries = 30) => {
  console.log(
    `🔍 Menunggu server di port ${port} siap sebelum membuat tunnel...`
  );

  let retries = 0;

  // Function to wait a bit before retrying
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  while (retries < maxRetries) {
    try {
      console.log(
        `⏳ Menunggu server startup... (Percobaan ${retries + 1}/${maxRetries})`
      );
      // Wait 1 second before retry
      await wait(1000);
      retries++;

      // If we've waited long enough, assume server is starting up and continue
      if (retries >= 5) {
        console.log(`✅ Melanjutkan dengan membuat tunnel untuk port ${port}`);
        return true;
      }
    } catch (err) {
      console.log(`⏳ Server belum siap, menunggu...`);
    }
  }

  console.log(`⚠️ Timeout menunggu server. Mencoba membuat tunnel anyway...`);
  return true;
};

// Wait a bit then start the tunnel
waitForServer(PORT).then(() => {
  console.log(`🌐 Using subdomain: ${subdomain}`);
  startTunnel();
});

function startTunnel() {
  // Build the lt command with arguments
  // Untuk Windows, kita perlu menggunakan pendekatan berbeda
  const isWindows = process.platform === "win32";
  let ltProcess;

  if (isWindows) {
    console.log(`💻 Mendeteksi platform Windows, menyesuaikan perintah...`);
    // Di Windows, kita gunakan cmd /c untuk menjalankan npx
    const command = `npx lt --port ${PORT} --subdomain ${subdomain}`;
    ltProcess = spawn("cmd", ["/c", command], { stdio: "pipe" });
  } else {
    const ltArgs = ["lt", "--port", PORT, "--subdomain", subdomain];
    ltProcess = spawn("npx", ltArgs, { stdio: "pipe" });
  }

  ltProcess.stdout.on("data", (data) => {
    const output = data.toString();
    console.log(`🔄 localtunnel: ${output}`);

    // Extract the tunnel URL
    const urlMatch = output.match(/your url is: (https?:\/\/[^\s]+)/);
    if (urlMatch && urlMatch[1]) {
      const tunnelUrl = urlMatch[1].trim();
      console.log(`✨ Tunnel URL: ${tunnelUrl}`);
      console.log(`🌐 Aplikasi Anda sekarang dapat diakses di: ${tunnelUrl}`);

      // Update both .env files with the new URL
      updateEnv(tunnelUrl);

      console.log(
        `\n� Semua konfigurasi URL telah diperbarui secara otomatis!`
      );
      console.log(
        `   Backend dan frontend sekarang menggunakan URL: ${tunnelUrl}`
      );
    }
  });

  ltProcess.stderr.on("data", (data) => {
    const errorMsg = data.toString();
    console.error(`❌ localtunnel error: ${errorMsg}`);

    // Check for common errors
    if (
      errorMsg.includes("domain in use") ||
      errorMsg.includes("unavailable")
    ) {
      console.log(`\n🚫 Subdomain "${subdomain}" sudah digunakan.`);
      console.log(`💡 Coba gunakan subdomain lain dengan perintah:`);
      console.log(`   npm run tunnel -- --subdomain nama-subdomain-lain`);

      // Automatically retry with a random suffix
      const randomSuffix = Math.floor(Math.random() * 1000);
      const newSubdomain = `${subdomain}-${randomSuffix}`;
      console.log(
        `\n🔄 Mencoba otomatis dengan subdomain alternatif: ${newSubdomain}...`
      );

      // Kill current process and start new one with different subdomain
      ltProcess.kill();

      if (isWindows) {
        // Di Windows, kita gunakan cmd /c untuk menjalankan npx
        const command = `npx lt --port ${PORT} --subdomain ${newSubdomain}`;
        const newLtProcess = spawn("cmd", ["/c", command], {
          stdio: "inherit",
        });

        // Replace the current process
        ltProcess = newLtProcess;
      } else {
        const newLtProcess = spawn(
          "npx",
          ["lt", "--port", PORT, "--subdomain", newSubdomain],
          { stdio: "inherit" }
        );

        // Replace the current process
        ltProcess = newLtProcess;
      }
    }
  });

  ltProcess.on("close", (code) => {
    if (code !== 0) {
      console.log(`⛔ localtunnel process berhenti dengan kode ${code}`);
      console.log(
        `💡 Jika mengalami masalah dengan subdomain, coba gunakan subdomain lain:`
      );
      console.log(`   npm run tunnel -- --subdomain nama-subdomain-lain`);
    } else {
      console.log(`⛔ localtunnel process berhenti dengan kode ${code}`);
    }
  });

  // Handle termination signals to clean up
  process.on("SIGINT", () => {
    ltProcess.kill("SIGINT");
    console.log("👋 Shutting down localtunnel...");
    process.exit();
  });

  process.on("SIGTERM", () => {
    ltProcess.kill("SIGTERM");
    console.log("👋 Shutting down localtunnel...");
    process.exit();
  });
} // Tutup function startTunnel
