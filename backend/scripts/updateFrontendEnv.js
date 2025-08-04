// scripts/updateFrontendEnv.js
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load backend environment variables
dotenv.config();

// Path to frontend .env file (adjust as needed based on your project structure)
const frontendEnvPath = path.resolve(process.cwd(), '../frontend/.env');

// Check if the frontend .env file exists
if (!fs.existsSync(frontendEnvPath)) {
  console.error(`❌ Frontend .env file not found at ${frontendEnvPath}`);
  process.exit(1);
}

// Get the tunnel URL from backend .env
const tunnelUrl = process.env.LOCALTUNNEL_URL || process.env.NGROK_URL;

if (!tunnelUrl) {
  console.error('❌ No tunnel URL found in backend .env');
  process.exit(1);
}

// Read the frontend .env file
let frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');

// Update the tunnel-related variables
const variables = [
  'VITE_API_URL',
  'VITE_API_BASE_URL'
];

variables.forEach(variable => {
  if (frontendEnv.includes(`${variable}=`)) {
    frontendEnv = frontendEnv.replace(
      new RegExp(`${variable}=.*`, 'g'),
      `${variable}=${tunnelUrl}`
    );
  }
});

// Write back to the frontend .env file
fs.writeFileSync(frontendEnvPath, frontendEnv);

console.log(`✅ Updated frontend .env with tunnel URL: ${tunnelUrl}`);
