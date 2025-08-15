#!/bin/bash

# C4ISR Military Tracking System - Android Build Script
# This script helps prepare the project for WebsiteToAPKBuilder

echo "🚀 C4ISR Military Tracking System - Android Build Preparation"
echo "=============================================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Create necessary directories
echo "📁 Creating build directories..."
mkdir -p build/android
mkdir -p build/android/assets

# Copy project files to build directory
echo "📋 Copying project files..."
cp -r index.html build/android/assets/
cp -r dist/ build/android/assets/
cp -r styles/ build/android/assets/
cp -r js/ build/android/assets/
cp -r audio/ build/android/assets/

# Create build configuration file
echo "⚙️ Creating build configuration..."
cat > build/android/build-config.txt << EOF
# C4ISR Military Tracking System - Build Configuration
# Use this configuration in WebsiteToAPKBuilder

APP_NAME=C4ISR Military Tracking
PACKAGE_NAME=com.c4isr.military.tracking
VERSION_CODE=1
VERSION_NAME=2.0.0
MIN_SDK=21
TARGET_SDK=33

# Main URL (for WebsiteToAPKBuilder)
MAIN_URL=file:///android_asset/index.html
LOAD_MODE=assets

# Required Permissions
PERMISSIONS=INTERNET,ACCESS_NETWORK_STATE,ACCESS_FINE_LOCATION,ACCESS_COARSE_LOCATION,VIBRATE,WAKE_LOCK,FOREGROUND_SERVICE

# Build Settings
BUILD_TYPE=release
ARCHITECTURE=arm64
SIGNING=auto

# Features
FEATURES=hardware_acceleration,fullscreen,immersive_mode

# Notes
# 1. Set Main URL to: file:///android_asset/index.html
# 2. Choose "Load from assets" mode
# 3. Enable all listed permissions
# 4. Use ARM64 architecture for best performance
# 5. Sign with your keystore or generate new one
EOF

# Create quick start guide
echo "📖 Creating quick start guide..."
cat > build/android/QUICK_START.md << EOF
# Quick Start Guide for WebsiteToAPKBuilder

## Step 1: Download WebsiteToAPKBuilder
- Visit: https://websitetoapk.com/
- Download the latest version for your operating system

## Step 2: Open WebsiteToAPKBuilder
- Launch the application
- Click "New Project"

## Step 3: Configure Basic Settings
- **App Name**: C4ISR Military Tracking
- **Package Name**: com.c4isr.military.tracking
- **Version Code**: 1
- **Version Name**: 2.0.0
- **Min SDK**: 21 (Android 5.0)
- **Target SDK**: 33 (Android 13)

## Step 4: Set Main URL
- **Main URL**: \`file:///android_asset/index.html\`
- **Load Mode**: Select "Load from assets"

## Step 5: Configure Permissions
Enable these permissions:
- Internet Access
- Location Services
- Network State
- Vibration
- Wake Lock
- Foreground Service

## Step 6: Build Settings
- **Build Type**: Release
- **Architecture**: ARM64 (recommended)
- **Signing**: Use your keystore or generate new one

## Step 7: Build APK
- Click "Build APK"
- Wait for completion
- Download and install the generated APK

## Troubleshooting
- If build fails, check that all files are in the assets folder
- Ensure all permissions are enabled
- Verify the main URL is correct
- Check that the package name follows Android conventions
EOF

echo "✅ Build preparation complete!"
echo ""
echo "📱 Next steps:"
echo "1. Open WebsiteToAPKBuilder"
echo "2. Use the configuration in: build/android/build-config.txt"
echo "3. Follow the guide in: build/android/QUICK_START.md"
echo "4. Build your Android APK!"
echo ""
echo "📁 Build files are ready in: build/android/"
echo "🎯 Main application file: build/android/assets/index.html"