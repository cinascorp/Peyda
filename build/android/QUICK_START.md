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
- **Main URL**: `file:///android_asset/index.html`
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
