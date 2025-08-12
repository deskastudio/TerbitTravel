// scripts/set-tunnel-url.js
// This script is used to set the tunnel URL as an environment variable
// when the application is started with the tunnel.

import fs from 'fs';
import path from 'path';

// Function to get the tunnel URL from the backend .env file
const getTunnelUrl = () => {
  try {
    // Path to backend .env file
    const backendEnvPath = path.resolve(process.cwd(), '../../backend/.env');
    
    // Check if backend .env file exists
    if (!fs.existsSync(backendEnvPath)) {
      console.warn('⚠️ Backend .env file not found');
      return null;
    }
    
    // Read backend .env file
    const envContent = fs.readFileSync(backendEnvPath, 'utf8');
    
    // Try to find LOCALTUNNEL_URL or NGROK_URL in the backend .env file
    const localtunnelMatch = envContent.match(/LOCALTUNNEL_URL=([^\r\n]+)/);
    const ngrokMatch = envContent.match(/NGROK_URL=([^\r\n]+)/);
    
    return localtunnelMatch?.[1] || ngrokMatch?.[1] || null;
  } catch (error) {
    console.error('Error reading backend .env file:', error);
    return null;
  }
};

// Function to update frontend .env file with tunnel URL
const updateFrontendEnv = (tunnelUrl) => {
  if (!tunnelUrl) {
    console.warn('⚠️ No tunnel URL found, skipping frontend .env update');
    return;
  }
  
  try {
    // Path to frontend .env file
    const frontendEnvPath = path.resolve(process.cwd(), '../.env');
    
    // Check if frontend .env file exists, create it if not
    if (!fs.existsSync(frontendEnvPath)) {
      fs.writeFileSync(frontendEnvPath, '# Frontend environment variables\n');
    }
    
    // Read frontend .env file
    let envContent = fs.readFileSync(frontendEnvPath, 'utf8');
    
    // Update or add VITE_TUNNEL_URL
    if (envContent.includes('VITE_TUNNEL_URL=')) {
      envContent = envContent.replace(
        /VITE_TUNNEL_URL=([^\r\n]+)/,
        `VITE_TUNNEL_URL=${tunnelUrl}`
      );
    } else {
      envContent += `\nVITE_TUNNEL_URL=${tunnelUrl}`;
    }
    
    // Write updated content to frontend .env file
    fs.writeFileSync(frontendEnvPath, envContent);
    
    console.log(`✅ Frontend .env updated with tunnel URL: ${tunnelUrl}`);
  } catch (error) {
    console.error('Error updating frontend .env file:', error);
  }
};

// Main function
const main = () => {
  const tunnelUrl = getTunnelUrl();
  if (tunnelUrl) {
    console.log(`🔍 Found tunnel URL: ${tunnelUrl}`);
    updateFrontendEnv(tunnelUrl);
  } else {
    console.warn('⚠️ No tunnel URL found in backend .env file');
  }
};

// Run the main function
main();
