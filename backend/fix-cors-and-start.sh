#!/bin/bash
# This script fixes CORS issues and sets up localtunnel for development

# Make sure we're in the backend directory
cd "$(dirname "$0")/.."

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Run CORS fix script
echo "🔧 Running CORS fix script..."
node scripts/fixCors.js

# Run localtunnel setup
echo "🚀 Setting up localtunnel..."
node scripts/startTunnel.js

# Wait for localtunnel to be set up
echo "⏱️ Waiting for tunnel to be established..."
sleep 5

# Start the backend server
echo "🌐 Starting backend server..."
npm start
