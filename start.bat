@echo off
chcp 65001 >nul
title C4ISR Military Tracking System

echo.
echo 🚀 C4ISR Military Tracking System v2.0.0
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16.0.0 or higher.
    echo    Download from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node -v') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% LSS 16 (
    echo ❌ Node.js version 16.0.0 or higher is required.
    echo    Current version: 
    node -v
    echo    Please update Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node -v

REM Check if npm is available
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not available. Please install npm.
    echo.
    pause
    exit /b 1
)

echo ✅ npm version: 
npm -v

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo.
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies.
        echo.
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully.
) else (
    echo ✅ Dependencies already installed.
)

echo.
echo 🌐 Starting C4ISR System...
echo    The system will open in your default browser.
echo    If it doesn't open automatically, navigate to: http://localhost:8080
echo.
echo    Press Ctrl+C to stop the server.
echo.

REM Start the application
npm start

pause