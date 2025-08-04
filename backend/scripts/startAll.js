// scripts/startAll.js
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🚀 Starting TerbitTravel Application...');
console.log('======================================');

// Update CORS settings
console.log('🔧 Memperbarui pengaturan CORS...');

// Function to execute a command and return a promise
function executeCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Running: ${command} ${args.join(' ')}`);
    
    const childProcess = spawn(command, args, { 
      stdio: 'inherit', 
      shell: true,
      ...options 
    });
    
    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    childProcess.on('error', (error) => {
      reject(error);
    });
  });
}

// Run fixCors.js first
executeCommand('node', ['scripts/fixCors.js'])
  .then(() => {
    console.log('✅ CORS settings updated successfully');
    console.log('\n🚀 Starting server and tunnel...');
    
    // Use concurrently to run dev and tunnel
    const isWindows = process.platform === 'win32';
    let command, args;
    
    if (isWindows) {
      // Di Windows, gunakan syntax yang cocok dengan PowerShell
      command = 'npx';
      args = ['concurrently', '--kill-others', 'npm:dev', 'npm:tunnel'];
    } else {
      command = 'npx';
      args = ['concurrently', 'npm:dev', 'npm:tunnel'];
    }
    
    console.log(`🔄 Running: ${command} ${args.join(' ')}`);
    
    // This will keep the process running and output visible
    const childProc = spawn(command, args, { 
      stdio: 'inherit',
      shell: true
    });
    
    // Handle process termination
    childProc.on('close', (code) => {
      console.log(`\n👋 Application stopped with code ${code}`);
    });
  })
  .catch((error) => {
    console.error(`❌ Error: ${error.message}`);
    console.error('\n💡 Alternatif: Jalankan secara manual dengan dua terminal terpisah:');
    console.error('   Terminal 1: npm run dev');
    console.error('   Terminal 2: npm run tunnel');
    process.exit(1);
  });
