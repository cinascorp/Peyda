# C4ISR Military Tracking System

A comprehensive Command, Control, Communications, Computers, Intelligence, Surveillance, and Reconnaissance (C4ISR) system for military aircraft tracking and threat detection.

## 🌟 Features

- **Real-time Flight Tracking**: Monitor aircraft positions, altitude, speed, and heading
- **Multi-Source Integration**: FlightRadar24, OpenSky Network, ADSB.lol, KiwiSDR
- **AI-Powered Threat Detection**: Intelligent threat assessment and alerting
- **Advanced Mapping**: 2D and 3D visualization with multiple map layers
- **Multi-Language Support**: English, Persian (فارسی), Swedish (Svenska)
- **Security Features**: GPS jamming detection, stealth mode operations
- **Mobile Optimized**: Responsive design for field operations
- **Real-time Alerts**: Audio and visual notifications for threats

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0.0 or higher
- Modern web browser with WebGL support
- Internet connection for data sources

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd c4isr-military-tracking-system

# Install dependencies
npm install

# Start development server
npm start
```

### Development
```bash
# Start with live reload
npm run dev

# Build for production
npm run build
```

## 📱 Building Android APK

### Using WebsiteToAPKBuilder

1. **Download WebsiteToAPKBuilder**
   - Visit: https://websitetoapk.com/
   - Download the latest version for your OS

2. **Configure Build Settings**
   - **App Name**: C4ISR Military Tracking
   - **Package Name**: com.c4isr.military.tracking
   - **Version Code**: 1
   - **Version Name**: 2.0.0
   - **Min SDK**: 21 (Android 5.0)
   - **Target SDK**: 33 (Android 13)

3. **Set Main URL**
   - **Main URL**: `file:///android_asset/index.html`
   - **Load Mode**: Load from assets

4. **Configure Permissions**
   - Internet Access
   - Location Services
   - Network State
   - Vibration
   - Wake Lock
   - Foreground Service

5. **Build Configuration**
   - **Build Type**: Release
   - **Signing**: Use your keystore or generate new one
   - **Architecture**: ARM64 (recommended)

6. **Generate APK**
   - Click "Build APK"
   - Wait for build completion
   - Download and install the generated APK

### Manual APK Creation

If you prefer manual creation:

1. **Use Android Studio**
   - Import the project
   - Use the provided `android-manifest.xml`
   - Build APK from Build menu

2. **Use Command Line**
   ```bash
   # Install Android SDK
   # Use Gradle to build
   ./gradlew assembleRelease
   ```

## 🏗️ Project Structure

```
c4isr-military-tracking-system/
├── index.html              # Main application entry point
├── dist/
│   └── features.html       # Features information page
├── styles/
│   ├── main.css           # Core application styles
│   ├── military-theme.css # Military-themed styling
│   └── 3d-viewer.css     # 3D globe viewer styles
├── js/
│   ├── app.js             # Main application controller
│   ├── config.js          # Configuration settings
│   ├── language.js        # Multi-language support
│   ├── data-sources.js    # Data source management
│   ├── flight-tracker.js  # Flight tracking system
│   ├── threat-detection.js # AI threat detection
│   ├── map-controller.js  # Map system controller
│   ├── 3d-globe.js       # 3D globe renderer
│   ├── gps-jamming.js    # GPS jamming detection
│   └── notifications.js   # Notification system
├── audio/
│   ├── threat-alert.mp3  # Threat alert sound
│   └── system-alert.mp3  # System alert sound
├── android-manifest.xml   # Android manifest for APK building
├── package.json           # Node.js dependencies
└── README.md             # This file
```

## 🔧 Configuration

### Data Sources
Configure your data source API keys in `js/config.js`:

```javascript
const CONFIG = {
    FLIGHTRADAR24: {
        API_KEY: 'your_api_key_here',
        BASE_URL: 'https://api.flightradar24.com'
    },
    OPENSKY: {
        USERNAME: 'your_username',
        PASSWORD: 'your_password'
    },
    // ... other sources
};
```

### Map Configuration
Set your map provider API keys:

```javascript
const MAP_CONFIG = {
    LEAFLET: {
        TILE_LAYER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    },
    GOOGLE_MAPS: {
        API_KEY: 'your_google_maps_api_key'
    }
};
```

## 🎯 Usage

### Main Interface
1. **Language Selection**: Choose your preferred language
2. **Data Sources**: Enable/disable flight data sources
3. **Map View**: Switch between 2D and 3D views
4. **Filters**: Apply altitude, speed, and aircraft type filters
5. **Threat Monitoring**: Monitor real-time threat levels

### Features Page
- Click the info button (ℹ️) in the header
- View comprehensive system capabilities
- Access detailed feature information

### Threat Detection
- Automatic threat assessment for all flights
- Real-time alerts for high-risk situations
- Pattern recognition for suspicious behavior

## 🐛 Troubleshooting

### Common Issues

1. **Map Not Loading**
   - Check internet connection
   - Verify map API keys
   - Clear browser cache

2. **No Flight Data**
   - Verify data source API keys
   - Check network connectivity
   - Review browser console for errors

3. **3D Globe Not Working**
   - Ensure WebGL is enabled
   - Update graphics drivers
   - Check browser compatibility

4. **Audio Not Playing**
   - Check device volume
   - Verify audio file permissions
   - Test with different browsers

### Debug Mode
Enable debug logging in `js/config.js`:

```javascript
const DEBUG = true;
```

### Performance Issues
- Reduce map update frequency
- Disable unused data sources
- Use hardware acceleration
- Optimize for mobile devices

## 🔒 Security Considerations

- **API Keys**: Keep your API keys secure
- **HTTPS**: Use HTTPS in production
- **Permissions**: Request minimal required permissions
- **Data Privacy**: Follow data protection regulations

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly controls
- Optimized for mobile browsers
- Offline capability support

## 🌐 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers with WebGL support

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the configuration options

## 🔄 Updates

- Regular security updates
- New data source integrations
- Performance improvements
- Feature enhancements

## 📊 System Requirements

### Development
- Node.js 16.0.0+
- Modern web browser
- 4GB RAM minimum
- 2GB free disk space

### Production
- Web server with HTTPS
- 8GB RAM recommended
- 5GB free disk space
- High-speed internet connection

### Android
- Android 5.0 (API 21) or higher
- 2GB RAM minimum
- 100MB free storage
- GPS and internet connectivity

---

**Note**: This is a military-grade tracking system. Ensure compliance with local regulations and obtain necessary permissions before deployment. 


