# Flight Tracker - ردیاب پرواز

A lightweight, real-time flight tracking system that displays aircraft positions on an interactive map using free, open APIs.

## 🌍 Features / ویژگی‌ها

- **Real-time Flight Tracking**: Monitor aircraft positions in real-time
- **Multiple Data Sources**: Integrates with FlightRadar24, OpenSky Network, and ADSB.lol
- **Bilingual Support**: English and Persian (فارسی) interface
- **Lightweight Design**: Optimized for performance without heavy dependencies
- **Free APIs**: No paid subscriptions required
- **Military Aircraft Detection**: Special focus on military and commercial aircraft

## ردیابی پرواز در لحظه
## موقعیت هواپیماها را به صورت لحظه‌ای رصد کنید -
## منابع داده چندگانه
## پشتیبانی دو زبانه: رابط کاربری انگلیسی و فارسی (فارسی) -
## طراحی سبک
## بهینه شده برای عملکرد بدون وابستگی‌های سنگین -
## تشخیص هواپیماهای نظامی
## تمرکز ویژه بر تفکیک ریزپرنده ها از هواپیماهای نظامی و تجاری


## 🚀 Quick Start / شروع سریع

### Option 1: Direct Browser Usage
1. Open `index.html` in any modern web browser
2. The system will automatically initialize and start tracking flights
3. Use the sidebar controls to customize your view

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📡 Data Sources / منابع داده

### 1. FlightRadar24
- **Base URL**: `data-cloud.flightradar24.com/zones/fcgi/js`
- **Type**: JavaScript data files
- **Update Rate**: Every 5 seconds
- **Coverage**: Global commercial and private aircraft

### 2. OpenSky Network
- **Base URL**: `https://opensky-network.org/api/states/all`
- **Type**: REST API
- **Update Rate**: Every 10 seconds
- **Coverage**: Global ADS-B data from network of receivers

### 3. ADSB.lol
- **Base URL**: `https://api.adsb.lol/v2/mil`
- **Type**: REST API
- **Update Rate**: Every 8 seconds
- **Coverage**: Military aircraft and special operations

## 🎛️ Controls / کنترل‌ها

### Data Sources Panel
- **FlightRadar24**: Toggle commercial flight data
- **OpenSky Network**: Toggle global ADS-B data
- **ADSB.lol**: Toggle military aircraft data

### Filters
- **Altitude Range**: Filter aircraft by altitude (0-60,000 ft)
- **Speed Range**: Filter by speed (0-2000 knots)
- **Aircraft Type**: Filter by military, commercial, or private

### Map Layers
- **Satellite**: High-resolution satellite imagery
- **Terrain**: Topographic map overlay

## 🔧 Technical Details / جزئیات فنی

### Architecture
- **Frontend**: Pure HTML5, CSS3, and JavaScript (ES6+)
- **Mapping**: Leaflet.js for lightweight, mobile-friendly maps
- **Data Fetching**: Native Fetch API with automatic retry logic
- **Language Support**: Built-in translation system with RTL support

### Performance Features
- **HTTP/3 Ready**: Optimized for modern network protocols
- **Efficient Updates**: Smart data caching and incremental updates
- **Memory Management**: Automatic cleanup of old flight data
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Browser Compatibility
- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

## 🌐 Language Support / پشتیبانی زبانی

### English (Default)
Full interface in English with standard aviation terminology.

### فارسی (Persian)
Complete Persian translation with RTL (right-to-left) text support:
- تمام رابط کاربری به فارسی ترجمه شده
- پشتیبانی از متن راست به چپ (RTL)
- اصطلاحات هوانوردی به فارسی

## 📱 Mobile Usage / استفاده موبایل

The system is fully responsive and optimized for mobile devices:
- Touch-friendly controls
- Optimized map interactions
- Efficient data usage
- Offline capability for cached data

## 🔒 Privacy & Security / حریم خصوصی و امنیت

- **No User Data Collection**: The system doesn't store personal information
- **Local Processing**: All flight data processing happens in your browser
- **Secure APIs**: Uses HTTPS for all external API calls
- **No Tracking**: No analytics or user behavior tracking

## 🚨 Troubleshooting / عیب‌یابی

### Common Issues

**Loading Screen Stuck**
- Check browser console for JavaScript errors
- Ensure all external resources are accessible
- Try refreshing the page

**No Flight Data**
- Verify internet connection
- Check if APIs are responding (see browser console)
- Try enabling different data sources

**Map Not Loading**
- Ensure Leaflet.js is accessible
- Check if map tiles are loading
- Verify browser supports HTML5 Canvas

### Debug Mode
Open browser console (F12) to see detailed logging:
- API response status
- Flight data processing
- Error messages and warnings

## 🛠️ Development / توسعه

### Project Structure
```
├── index.html          # Main application file
├── styles/             # CSS stylesheets
├── js/                 # JavaScript modules
├── README.md           # This file
└── package.json        # Node.js dependencies
```

### Adding New Data Sources
1. Add source configuration in the `initializeDataSources()` method
2. Implement `fetch[SourceName]()` method
3. Add source checkbox in HTML
4. Update status indicators

### Customizing the Interface
- Modify CSS variables in the `<style>` section
- Add new language translations in `initializeTranslations()`
- Extend filter options in the sidebar

## 📊 API Rate Limits / محدودیت‌های API

### OpenSky Network
- **Free Tier**: 30 requests per minute
- **Authentication**: Optional (increases limits)
- **Data**: Global ADS-B states

### ADSB.lol
- **Free Tier**: 45 requests per minute
- **Authentication**: Not required
- **Data**: Military aircraft focus

### FlightRadar24
- **Free Tier**: Limited access
- **Authentication**: Not available
- **Data**: Commercial flight tracking

## 🌟 Future Enhancements / بهبودهای آینده

- [ ] Weather overlay integration
- [ ] Flight path history
- [ ] Aircraft photo database
- [ ] Alert system for specific aircraft
- [ ] Export flight data
- [ ] 3D globe view
- [ ] Audio alerts for military aircraft
- [ ] Flight prediction algorithms

## 🤝 Contributing / مشارکت

Contributions are welcome! Please feel free to:
- Report bugs and issues
- Suggest new features
- Submit pull requests
- Improve translations
- Optimize performance

## 📄 License / مجوز

This project is open source and available under the MIT License.

## 🙏 Acknowledgments / تشکر

- **Leaflet.js**: Open-source mapping library
- **OpenSky Network**: Free ADS-B data
- **ADSB.lol**: Military aircraft data
- **FlightRadar24**: Commercial flight information

## 📞 Support / پشتیبانی

For support and questions:
- Check the troubleshooting section above
- Review browser console for error messages
- Ensure all dependencies are accessible
- Verify API endpoints are responding

---

**نکته مهم**: این سیستم برای اهداف آموزشی و تحقیقاتی طراحی شده است. لطفاً از داده‌های پرواز به صورت مسئولانه استفاده کنید.

**Important Note**: This system is designed for educational and research purposes. Please use flight data responsibly. 


