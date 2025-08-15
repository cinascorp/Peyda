#!/bin/bash

# C4ISR Military Tracking System - Build Verification Script
# This script verifies that all required files are present for Android APK building

echo "🔍 C4ISR Military Tracking System - Build Verification"
echo "======================================================"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found in current directory"
    exit 1
fi

echo "✅ index.html found"

# Check required directories
required_dirs=("styles" "js" "audio" "dist")
for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir/ directory found"
    else
        echo "❌ $dir/ directory missing"
        exit 1
    fi
done

# Check required CSS files
required_css=("styles/main.css" "styles/military-theme.css" "styles/3d-viewer.css")
for css in "${required_css[@]}"; do
    if [ -f "$css" ]; then
        echo "✅ $css found"
    else
        echo "❌ $css missing"
        exit 1
    fi
done

# Check required JavaScript files
required_js=("js/app.js" "js/config.js" "js/language.js" "js/data-sources.js" "js/flight-tracker.js" "js/threat-detection.js" "js/map-controller.js" "js/3d-globe.js" "js/gps-jamming.js" "js/notifications.js")
for js in "${required_js[@]}"; do
    if [ -f "$js" ]; then
        echo "✅ $js found"
    else
        echo "❌ $js missing"
        exit 1
    fi
done

# Check audio files
required_audio=("audio/threat-alert.mp3" "audio/system-alert.mp3")
for audio in "${required_audio[@]}"; do
    if [ -f "$audio" ]; then
        echo "✅ $audio found"
    else
        echo "❌ $audio missing"
        exit 1
    fi
done

# Check features page
if [ -f "dist/features.html" ]; then
    echo "✅ dist/features.html found"
else
    echo "❌ dist/features.html missing"
    exit 1
fi

# Check build scripts
required_build=("build-android.sh" "build-android.bat" "android-manifest.xml")
for build in "${required_build[@]}"; do
    if [ -f "$build" ]; then
        echo "✅ $build found"
    else
        echo "❌ $build missing"
        exit 1
    fi
done

# Check if build directory exists
if [ -d "build/android" ]; then
    echo "✅ build/android/ directory found"
    
    # Check build assets
    if [ -f "build/android/assets/index.html" ]; then
        echo "✅ build/android/assets/index.html found"
    else
        echo "❌ build/android/assets/index.html missing - run build script first"
    fi
else
    echo "⚠️  build/android/ directory not found - run build script first"
fi

echo ""
echo "🎯 Build Verification Complete!"
echo "=============================="

if [ -d "build/android/assets" ] && [ -f "build/android/assets/index.html" ]; then
    echo "✅ All files verified and build directory ready"
    echo "🚀 You can now use WebsiteToAPKBuilder to create your APK"
    echo ""
    echo "📁 Build files location: build/android/"
    echo "📱 Main app file: build/android/assets/index.html"
    echo "⚙️  Configuration: build/android/build-config.txt"
    echo "📖 Instructions: build/android/QUICK_START.md"
else
    echo "⚠️  Build directory not ready - run ./build-android.sh first"
    echo ""
    echo "To prepare for building:"
    echo "  ./build-android.sh"
fi

echo ""
echo "🔧 Next steps:"
echo "1. Test the web version in your browser"
echo "2. Run build script to prepare Android build"
echo "3. Use WebsiteToAPKBuilder to create APK"
echo "4. Install and test on Android device"