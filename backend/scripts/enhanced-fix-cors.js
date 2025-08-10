// scripts/enhanced-fix-cors.js
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log("🛠️ Enhanced CORS Fix Tool");
console.log("=========================");

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

    // Add localtunnel URLs if they exist
    if (
      process.env.LOCALTUNNEL_URL &&
      !origins.includes(process.env.LOCALTUNNEL_URL)
    ) {
      origins.push(process.env.LOCALTUNNEL_URL);
    }

    // Always add these core development URLs
    [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
      "http://localhost:5000",
    ].forEach((url) => {
      if (!origins.includes(url)) {
        origins.push(url);
      }
    });

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

// Add CORS Fix to Index.js
function enhanceIndexJs() {
  console.log("🔄 Memperbarui CORS middleware di index.js...");

  try {
    let indexContent = fs.readFileSync(indexJsPath, "utf8");

    // Check if we already enhanced the CORS
    if (indexContent.includes("// Enhanced CORS fix")) {
      console.log("✅ CORS middleware sudah dienhance sebelumnya");
      return true;
    }

    // Find the CORS middleware
    const corsMatch = indexContent.match(
      /app\.use\(\s*cors\(\{[\s\S]*?\}\)\s*\);/
    );
    if (!corsMatch) {
      console.error("❌ Tidak dapat menemukan konfigurasi CORS di index.js");
      return false;
    }

    // Replace with our enhanced version
    const oldCorsConfig = corsMatch[0];
    const newCorsConfig = `// Enhanced CORS fix
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ CORS allowed: No origin (server-to-server)');
      return callback(null, true);
    }

    // Get allowed origins from environment
    const allowedOrigins = [
      ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://localhost:5000',
    ];
    
    // Debug info
    if (process.env.CORS_DEBUG === 'true') {
      console.log(\`🔍 CORS Check - Request Origin: "\${origin}"\`);
    }

    // In development, allow all origins for easier testing
    if (process.env.NODE_ENV !== 'production') {
      if (process.env.CORS_DEBUG === 'true') {
        console.log(\`✅ CORS allowed (dev mode): \${origin}\`);
      }
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      if (process.env.CORS_DEBUG === 'true') {
        console.log(\`✅ CORS allowed: \${origin}\`);
      }
      return callback(null, true);
    }
    
    // Special case for tunnels
    if (origin.includes('.loca.lt') || origin.includes('ngrok')) {
      if (process.env.CORS_DEBUG === 'true') {
        console.log(\`✅ CORS allowed (tunnel): \${origin}\`);
      }
      return callback(null, true);
    }
    
    console.log(\`❌ CORS rejected: \${origin} is not allowed\`);
    return callback(new Error('CORS policy: Not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Add extra CORS headers as backup
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});`;

    indexContent = indexContent.replace(corsMatch[0], newCorsConfig);
    fs.writeFileSync(indexJsPath, indexContent);

    console.log("✅ CORS middleware di index.js berhasil diperbarui");
    return true;
  } catch (error) {
    console.error(`❌ Error memperbarui index.js: ${error.message}`);
    return false;
  }
}

// Add CORS diagnostic routes
function addCorsCheckRoutes() {
  console.log("🔄 Menambahkan CORS diagnostic routes...");

  const corsRoutesPath = path.resolve(process.cwd(), "src/routes/corsCheck.js");

  // Check if file already exists
  if (fs.existsSync(corsRoutesPath)) {
    console.log("✅ CORS diagnostic routes sudah ada");
    return true;
  }

  // Create directory if it doesn't exist
  const routesDir = path.dirname(corsRoutesPath);
  if (!fs.existsSync(routesDir)) {
    try {
      fs.mkdirSync(routesDir, { recursive: true });
    } catch (error) {
      console.error(`❌ Error membuat directory routes: ${error.message}`);
      return false;
    }
  }

  // Create the CORS check route file
  const corsRouteContent = `import express from 'express';

const router = express.Router();

// CORS test endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS check successful',
    origin: req.headers.origin || 'No origin header',
    headers: {
      'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin') || 'Not set',
      'Access-Control-Allow-Methods': res.getHeader('Access-Control-Allow-Methods') || 'Not set',
      'Access-Control-Allow-Headers': res.getHeader('Access-Control-Allow-Headers') || 'Not set',
    },
    time: new Date().toISOString()
  });
});

// Special preflight test endpoint
router.options('/preflight-test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CORS preflight check passed'
  });
});

router.post('/preflight-test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS preflight check passed - POST request successful',
    receivedData: req.body,
    time: new Date().toISOString()
  });
});

// Special endpoint for payment simulation
router.post('/payment-test', (req, res) => {
  const responseData = {
    success: true,
    snap_token: \`SNAP-TEST-\${Date.now()}\`,
    redirect_url: \`https://app.sandbox.midtrans.com/snap/v2/vtweb/\${Date.now()}\`,
    order_id: \`ORDER-TEST-\${Date.now()}\`,
    message: 'Payment test successful',
    receivedData: req.body,
    time: new Date().toISOString()
  };
  
  res.json(responseData);
});

export default router;`;

  try {
    fs.writeFileSync(corsRoutesPath, corsRouteContent);
    console.log("✅ CORS diagnostic routes berhasil dibuat");

    // Now update index.js to include this route
    let indexContent = fs.readFileSync(indexJsPath, "utf8");

    // Check if route already imported
    if (indexContent.includes("corsCheck")) {
      console.log("✅ CORS routes sudah diimpor di index.js");
      return true;
    }

    // Find the import section
    const lastImport = indexContent.match(/import .* from ["'].*["'];/g);
    if (!lastImport) {
      console.error("❌ Tidak dapat menemukan import section di index.js");
      return false;
    }

    // Add our import
    const importLine = lastImport[lastImport.length - 1];
    indexContent = indexContent.replace(
      importLine,
      `${importLine}\nimport corsCheckRoutes from "./src/routes/corsCheck.js";`
    );

    // Find where routes are added
    const routesMatch = indexContent.match(
      /app\.use\(['"]\/[^'"]*['"], .*Router\);/
    );
    if (!routesMatch) {
      console.error("❌ Tidak dapat menemukan routes section di index.js");
      return false;
    }

    // Add our route
    const routeLine = routesMatch[0];
    indexContent = indexContent.replace(
      routeLine,
      `${routeLine}\n\n// CORS diagnostic routes\napp.use("/api/cors", corsCheckRoutes);`
    );

    fs.writeFileSync(indexJsPath, indexContent);
    console.log("✅ CORS routes berhasil ditambahkan ke index.js");
    return true;
  } catch (error) {
    console.error(`❌ Error menambahkan CORS routes: ${error.message}`);
    return false;
  }
}

// Main execution
console.log("🔄 Menjalankan CORS fixes...");

let success = updateBackendEnv();
success = enhanceIndexJs() && success;
success = addCorsCheckRoutes() && success;

if (success) {
  console.log("\n✨ CORS fixes selesai diterapkan!");
  console.log("\n🚀 Selanjutnya:");
  console.log('   1. Restart server dengan "npm start"');
  console.log("   2. Test CORS dengan browser atau curl:");
  console.log(
    '      curl -i http://localhost:5000/api/cors/test -H "Origin: http://localhost:5173"'
  );
} else {
  console.log("\n⚠️ Beberapa CORS fixes gagal, cek pesan error di atas");
  console.log("🔄 Restart server untuk menerapkan fixes yang berhasil");
}
