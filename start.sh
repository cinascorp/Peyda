#!/bin/bash

# C4ISR Military Tracking System Startup Script
# This script helps launch the C4ISR system with proper configuration

echo "🚀 C4ISR Military Tracking System v2.0.0"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16.0.0 or higher."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16.0.0 or higher is required."
    echo "   Current version: $(node -v)"
    echo "   Please update Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies."
        exit 1
    fi
    echo "✅ Dependencies installed successfully."
else
    echo "✅ Dependencies already installed."
fi

echo ""
echo "🌐 Starting C4ISR System..."
echo "   The system will open in your default browser."
echo "   If it doesn't open automatically, navigate to: http://localhost:8080"
echo ""
echo "   Press Ctrl+C to stop the server."
echo ""

# Start the application
npm start