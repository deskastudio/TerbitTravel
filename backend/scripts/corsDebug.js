// scripts/corsDebug.js
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log(chalk.blue('🔍 CORS Debug Tool'));
console.log(chalk.yellow('====================================='));

// Path ke file
const backendPath = path.resolve(process.cwd(), '.env');
const frontendPath = path.resolve(process.cwd(), '../frontend/.env');

// Function untuk membaca file .env
function readEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error(chalk.red(`❌ Error membaca file ${filePath}: ${error.message}`));
    return null;
  }
}

// Function untuk mengekstrak origin dari file .env
function extractOrigins(content) {
  const origins = [];
  
  // Extract ALLOWED_ORIGINS
  const allowedOriginsMatch = content.match(/ALLOWED_ORIGINS=([^\n]*)/);
  if (allowedOriginsMatch && allowedOriginsMatch[1]) {
    const allowedOrigins = allowedOriginsMatch[1].split(',');
    origins.push(...allowedOrigins);
  }
  
  // Extract LOCALTUNNEL_URL
  const localtunnelMatch = content.match(/LOCALTUNNEL_URL=([^\n]*)/);
  if (localtunnelMatch && localtunnelMatch[1]) {
    origins.push(localtunnelMatch[1]);
  }
  
  // Extract NGROK_URL
  const ngrokMatch = content.match(/NGROK_URL=([^\n]*)/);
  if (ngrokMatch && ngrokMatch[1]) {
    origins.push(ngrokMatch[1]);
  }
  
  // Extract API_URL
  const apiMatch = content.match(/API_URL=([^\n]*)/);
  if (apiMatch && apiMatch[1]) {
    origins.push(apiMatch[1]);
  }
  
  return [...new Set(origins)]; // Remove duplicates
}

// Function untuk menampilkan informasi
function displayInfo(backendContent, frontendContent) {
  console.log(chalk.green('✅ Backend Environment:'));
  
  if (!backendContent) {
    console.log(chalk.red('  ❌ Backend .env file tidak ditemukan'));
    return;
  }
  
  // Extract backend origin values
  const backendOrigins = extractOrigins(backendContent);
  
  console.log(chalk.cyan('  🌐 ALLOWED_ORIGINS:'));
  backendOrigins.forEach((origin, index) => {
    console.log(chalk.white(`    ${index + 1}. ${origin}`));
  });
  
  // Check for tunnel URL
  const tunnelUrlMatch = backendContent.match(/LOCALTUNNEL_URL=([^\n]*)/);
  if (tunnelUrlMatch) {
    console.log(chalk.cyan('  🔗 Tunnel URL:'));
    console.log(chalk.white(`    ${tunnelUrlMatch[1]}`));
  }
  
  // Frontend information
  console.log(chalk.green('\n✅ Frontend Environment:'));
  
  if (!frontendContent) {
    console.log(chalk.red('  ❌ Frontend .env file tidak ditemukan'));
    return;
  }
  
  // Check for API URL
  const apiUrlMatch = frontendContent.match(/VITE_API_URL=([^\n]*)/);
  if (apiUrlMatch) {
    console.log(chalk.cyan('  🔗 API URL:'));
    console.log(chalk.white(`    ${apiUrlMatch[1]}`));
  }
  
  // Check for API Base URL
  const baseUrlMatch = frontendContent.match(/VITE_API_BASE_URL=([^\n]*)/);
  if (baseUrlMatch) {
    console.log(chalk.cyan('  🔗 API Base URL:'));
    console.log(chalk.white(`    ${baseUrlMatch[1]}`));
  }
  
  // Check for consistency
  console.log(chalk.yellow('\n🔍 CORS Configuration Check:'));
  
  // Extract all URLs from frontend
  const frontendUrls = [];
  const apiUrl = apiUrlMatch ? apiUrlMatch[1] : null;
  const baseUrl = baseUrlMatch ? baseUrlMatch[1] : null;
  
  if (apiUrl) frontendUrls.push(apiUrl);
  if (baseUrl) frontendUrls.push(baseUrl);
  
  const allUrlsAllowed = frontendUrls.every(url => backendOrigins.includes(url));
  
  if (allUrlsAllowed) {
    console.log(chalk.green('  ✅ Semua URL frontend terdaftar di ALLOWED_ORIGINS backend'));
  } else {
    console.log(chalk.red('  ❌ Beberapa URL frontend tidak terdaftar di ALLOWED_ORIGINS backend:'));
    frontendUrls.forEach(url => {
      if (!backendOrigins.includes(url)) {
        console.log(chalk.red(`    - ${url}`));
      }
    });
  }
  
  // Additional checks
  const hasHttpsBackend = backendOrigins.some(url => url.startsWith('https:'));
  const hasHttpsOrigin = frontendUrls.some(url => url.startsWith('https:'));
  
  if (hasHttpsBackend !== hasHttpsOrigin) {
    console.log(chalk.yellow('  ⚠️ Perhatian: Mixing HTTP dan HTTPS dapat menyebabkan masalah CORS'));
  }
  
  // Final recommendations
  console.log(chalk.blue('\n🛠️ Rekomendasi:'));
  
  if (!allUrlsAllowed) {
    console.log(chalk.yellow('  - Tambahkan semua URL frontend ke ALLOWED_ORIGINS di backend'));
  }
  
  console.log(chalk.yellow('  - Pastikan withCredentials: true di axios jika menggunakan cookies'));
  console.log(chalk.yellow('  - Periksa konfigurasi header CORS di server'));
  
  console.log(chalk.blue('\n✅ Cara Fix CORS:'));
  console.log(chalk.white('  1. Restart server backend dengan: npm run dev'));
  console.log(chalk.white('  2. Dalam tab terminal lain, jalankan: npm run tunnel'));
  console.log(chalk.white('  3. Pastikan URL tunnel sama di kedua .env files'));
}

// Main
const backendContent = readEnvFile(backendPath);
const frontendContent = readEnvFile(frontendPath);

displayInfo(backendContent, frontendContent);
