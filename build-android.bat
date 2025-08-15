@echo off
REM C4ISR Military Tracking System - Android Build Script (Windows)
REM This script helps prepare the project for WebsiteToAPKBuilder

echo 🚀 C4ISR Military Tracking System - Android Build Preparation
echo ==============================================================

REM Check if we're in the right directory
if not exist "index.html" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

echo ✅ Project structure verified

REM Create necessary directories
echo 📁 Creating build directories...
if not exist "build\android\assets" mkdir "build\android\assets"

REM Copy project files to build directory
echo 📋 Copying project files...
copy "index.html" "build\android\assets\" >nul
xcopy "dist" "build\android\assets\dist\" /E /I /Y >nul
xcopy "styles" "build\android\assets\styles\" /E /I /Y >nul
xcopy "js" "build\android\assets\js\" /E /I /Y >nul
xcopy "audio" "build\android\assets\audio\" /E /I /Y >nul

REM Create build configuration file
echo ⚙️ Creating build configuration...
(
echo # C4ISR Military Tracking System - Build Configuration
echo # Use this configuration in WebsiteToAPKBuilder
echo.
echo APP_NAME=C4ISR Military Tracking
echo PACKAGE_NAME=com.c4isr.military.tracking
echo VERSION_CODE=1
echo VERSION_NAME=2.0.0
echo MIN_SDK=21
echo TARGET_SDK=33
echo.
echo # Main URL ^(for WebsiteToAPKBuilder^)
echo MAIN_URL=file:///android_asset/index.html
echo LOAD_MODE=assets
echo.
echo # Required Permissions
echo PERMISSIONS=INTERNET,ACCESS_NETWORK_STATE,ACCESS_FINE_LOCATION,ACCESS_COARSE_LOCATION,VIBRATE,WAKE_LOCK,FOREGROUND_SERVICE
echo.
echo # Build Settings
echo BUILD_TYPE=release
echo ARCHITECTURE=arm64
echo SIGNING=auto
echo.
echo # Features
echo FEATURES=hardware_acceleration,fullscreen,immersive_mode
echo.
echo # Notes
echo # 1. Set Main URL to: file:///android_asset/index.html
echo # 2. Choose "Load from assets" mode
echo # 3. Enable all listed permissions
echo # 4. Use ARM64 architecture for best performance
echo # 5. Sign with your keystore or generate new one
) > "build\android\build-config.txt"

REM Create quick start guide
echo 📖 Creating quick start guide...
(
echo # Quick Start Guide for WebsiteToAPKBuilder
echo.
echo ## Step 1: Download WebsiteToAPKBuilder
echo - Visit: https://websitetoapk.com/
echo - Download the latest version for your operating system
echo.
echo ## Step 2: Open WebsiteToAPKBuilder
echo - Launch the application
echo - Click "New Project"
echo.
echo ## Step 3: Configure Basic Settings
echo - **App Name**: C4ISR Military Tracking
echo - **Package Name**: com.c4isr.military.tracking
echo - **Version Code**: 1
echo - **Version Name**: 2.0.0
echo - **Min SDK**: 21 ^(Android 5.0^)
echo - **Target SDK**: 33 ^(Android 13^)
echo.
echo ## Step 4: Set Main URL
echo - **Main URL**: `file:///android_asset/index.html`
echo - **Load Mode**: Select "Load from assets"
echo.
echo ## Step 5: Configure Permissions
echo Enable these permissions:
echo - Internet Access
echo - Location Services
echo - Network State
echo - Vibration
echo - Wake Lock
echo - Foreground Service
echo.
echo ## Step 6: Build Settings
echo - **Build Type**: Release
echo - **Architecture**: ARM64 ^(recommended^)
echo - **Signing**: Use your keystore or generate new one
echo.
echo ## Step 7: Build APK
echo - Click "Build APK"
echo - Wait for completion
echo - Download and install the generated APK
echo.
echo ## Troubleshooting
echo - If build fails, check that all files are in the assets folder
echo - Ensure all permissions are enabled
echo - Verify the main URL is correct
echo - Check that the package name follows Android conventions
) > "build\android\QUICK_START.md"

echo ✅ Build preparation complete!
echo.
echo 📱 Next steps:
echo 1. Open WebsiteToAPKBuilder
echo 2. Use the configuration in: build\android\build-config.txt
echo 3. Follow the guide in: build\android\QUICK_START.md
echo 4. Build your Android APK!
echo.
echo 📁 Build files are ready in: build\android\
echo 🎯 Main application file: build\android\assets\index.html
echo.
pause