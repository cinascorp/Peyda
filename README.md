# پیدا - سامانه رصد و ردیابی پهپادهای نظامی
# Peyda - Military UAV Tracking System

![Military UAV Tracker](https://img.shields.io/badge/Military-UAV%20Tracker-red) ![Persian](https://img.shields.io/badge/Language-Persian%2FFarsi-green) ![Real%20Time](https://img.shields.io/badge/Real%20Time-Tracking-blue)

## نمای کلی / Overview

سامانه پیدا یک اپلیکیشن نظامی پیشرفته برای رصد و ردیابی پهپادها و هواپیماهای نظامی در زمان واقعی است. این سامانه از چندین منبع داده استفاده کرده و قابلیت‌های تشخیص تهدید، فیلترینگ و نمایش اطلاعات تفصیلی را ارائه می‌دهد.

Peyda is an advanced military application for real-time drone and military aircraft tracking. The system uses multiple data sources and provides threat detection, filtering, and detailed information display capabilities.

## ویژگی‌های کلیدی / Key Features

### 🚁 ردیابی پهپاد / Drone Tracking
- تشخیص خودکار پهپادهای نظامی (شاهد، مهاجر، کرار، یاسر، آبابیل)
- ارزیابی سطح تهدید (بحرانی، بالا، متوسط، پایین)
- نمایش اطلاعات تفصیلی هر پهپاد

### 🎖️ امکانات نظامی / Military Features
- رصد هواپیماهای نظامی و جنگنده‌ها
- تشخیص هواپیماهای ایرانی
- سیستم هشدار برای تهدیدات بحرانی
- واسط کاربری نظامی با تم تاریک

### 📊 داشبورد تحلیلی / Analytics Dashboard
- آمار لحظه‌ای از انواع هواپیما
- نمایش سطوح تهدید
- فیلترهای پیشرفته
- نمایش مختصات و زوم

### 🗺️ نقشه تعاملی / Interactive Map
- نقشه‌های ماهواره‌ای و خیابانی
- نمادهای مختلف برای انواع هواپیما
- قابلیت زوم و پان
- نمایش مسیر پرواز

## منابع داده / Data Sources

1. **ADS-B.lol** - داده‌های نظامی
2. **FlightRadar24** - اطلاعات پرواز تجاری
3. **OpenSky Network** - داده‌های عمومی
4. **داده‌های شبیه‌سازی شده** - پهپادهای نمونه

## نصب و راه‌اندازی / Installation & Setup

### پیش‌نیازها / Prerequisites
```bash
node >= 14.0.0
npm یا yarn
```

### مراحل نصب / Installation Steps

1. **کلون کردن پروژه / Clone the project:**
```bash
git clone https://github.com/military/peyda-uav-tracker.git
cd peyda-uav-tracker
```

2. **نصب وابستگی‌ها / Install dependencies:**
```bash
npm install
```

3. **اجرای برنامه / Run the application:**
```bash
npm start
```

یا برای توسعه / Or for development:
```bash
npm run dev
```

4. **دسترسی به برنامه / Access the application:**
```
http://localhost:8080
```

## نحوه استفاده / Usage Guide

### واسط کاربری / User Interface

#### پنل کنترل / Control Panel
- **آمار لحظه‌ای**: نمایش تعداد پهپادها، هواپیماهای نظامی، غیرنظامی و ناشناس
- **فیلتر نمایش**: امکان فیلتر کردن بر اساس نوع هواپیما
- **سطح تهدید**: نمایش تعداد تهدیدات در سطوح مختلف
- **آخرین به‌روزرسانی**: نمایش زمان آخرین بروزرسانی داده‌ها

#### نقشه / Map
- **کنترل‌های نقشه**: تغییر نوع نقشه، زوم، قطب‌نما
- **نمادها**: هر نوع هواپیما با رنگ و نماد خاص
- **اطلاعات تفصیلی**: کلیک روی هر نماد برای مشاهده جزئیات

### رنگ‌ها و نمادها / Colors & Symbols
- 🟦 **آبی**: هواپیماهای غیرنظامی
- 🟥 **قرمز**: هواپیماهای نظامی
- 🟧 **نارنجی**: جنگنده‌ها
- 🟩 **سبز**: هواپیماهای ایرانی
- ⚫ **مشکی**: پهپادها
- 🟨 **زرد**: اشیاء ناشناس

### سطوح تهدید / Threat Levels
- 🔴 **بحرانی**: پهپادهای خطرناک (شاهد، کرار)
- 🟠 **بالا**: اشیاء ناشناس، پهپادهای کم ارتفاع
- 🟡 **متوسط**: هواپیماهای نظامی، پهپادهای معمولی
- 🟢 **پایین**: هواپیماهای غیرنظامی

## ساختار پروژه / Project Structure

```
peyda-uav-tracker/
├── uav.html              # فایل اصلی برنامه
├── package.json          # تنظیمات پروژه
├── README.md            # مستندات
└── .git/               # کنترل نسخه
```

## امکانات پیشرفته / Advanced Features

### فیلترینگ / Filtering
- نمایش همه انواع هواپیما
- فیلتر بر اساس نوع (پهپاد، نظامی، غیرنظامی، ناشناس)
- فعال/غیرفعال کردن لایه‌های مختلف

### سیستم هشدار / Alert System
- هشدار خودکار برای تهدیدات بحرانی
- نمایش پیام‌های هشدار
- ناپدید شدن خودکار هشدارها

### به‌روزرسانی زمان واقعی / Real-time Updates
- بروزرسانی خودکار هر 15 ثانیه
- نمایش زمان آخرین بروزرسانی
- شمارنده زمان

## مشکلات رایج / Troubleshooting

### مشکل CORS
اگر با خطای CORS مواجه شدید، از یک وب سرور محلی استفاده کنید:
```bash
npm run start
```

### عدم نمایش داده‌ها
- اتصال اینترنت را بررسی کنید
- فایروال را غیرفعال کنید
- از VPN استفاده کنید

### مشکلات عملکرد
- مرورگرهای جدید استفاده کنید
- افزونه‌های مرورگر را غیرفعال کنید
- کش مرورگر را پاک کنید

## توسعه و مشارکت / Development & Contribution

### توسعه محلی / Local Development
```bash
git clone <repository-url>
cd peyda-uav-tracker
npm install
npm run dev
```

### ساختار کد / Code Structure
- **HTML/CSS**: واسط کاربری و استایل‌ها
- **JavaScript**: منطق برنامه و تعامل با API
- **ArcGIS API**: نمایش نقشه و عملیات مکانی

## امنیت / Security

⚠️ **نکات امنیتی مهم:**
- این برنامه برای استفاده نظامی طراحی شده
- از شبکه‌های امن استفاده کنید
- داده‌های حساس را رمزگذاری کنید
- دسترسی‌ها را محدود کنید

## مجوز / License

این پروژه تحت مجوز MIT منتشر شده است. برای اطلاعات بیشتر فایل LICENSE را مطالعه کنید.

## تماس و پشتیبانی / Contact & Support

برای گزارش مشکلات، پیشنهادات یا سوالات:
- **ایمیل**: support@peyda-tracker.mil
- **تلگرام**: @PeydaSupport
- **مسائل GitHub**: [Issues](https://github.com/military/peyda-uav-tracker/issues)

---

**سامانه پیدا - محافظت از آسمان ایران** 🇮🇷
**Peyda System - Protecting Iranian Skies** 
=======
# AEGIS C4ISR - Advanced UAV Command & Control System

**Mobile-Optimized Military C4ISR Platform for Supreme Commander/General Operations**

## 🎯 Core Features

### UAV SIDC Operations (Surveillance, Identification, Destruction, Capture)
- **Real-time UAV Asset Management** - Track and control multiple UAV platforms (MQ-9 Reaper, RQ-4 Global Hawk, MQ-1 Predator, etc.)
- **SIDC Protocol Implementation** - Full tactical operations suite:
  - 🔍 **Surveillance** - Continuous area monitoring and reconnaissance
  - 🎯 **Identification** - Target classification and threat assessment  
  - 💥 **Destruction** - Precision engagement capabilities
  - 🤚 **Capture** - Asset recovery and control protocols

### Advanced Command Interface
- **Military-Grade UI Design** - Dark tactical theme with green HUD elements
- **Multi-Panel Command Center** - Sliding panels for different operational areas
- **Real-Time Intelligence Feed** - Live threat detection and communication intercepts
- **Mission Planning System** - Pre-configured tactical mission templates

### C4ISR Integration
- **Command & Control** - Unified UAV fleet management
- **Communications** - Secure tactical communications protocols  
- **Computers** - Advanced computation and data processing
- **Intelligence** - Real-time threat analysis and battlefield intelligence
- **Surveillance** - Continuous area monitoring with multiple sensor feeds
- **Reconnaissance** - Deep reconnaissance missions and intelligence gathering

## 🚀 Key Capabilities

### Supreme Commander Interface
- **Tactical Map Display** - Military satellite imagery with tactical grid overlay
- **Asset Status Monitoring** - Real-time UAV operational status and health
- **Threat Level Assessment** - Dynamic threat evaluation with visual indicators
- **Emergency Protocols** - Rapid response and emergency evacuation procedures

### Mobile-First Design
- **Touch-Optimized Controls** - Large tactical buttons for field operations
- **Responsive Layout** - Adapts to various mobile screen sizes
- **Gesture Navigation** - Intuitive swipe and tap controls
- **Offline Capability** - Critical functions work without network connectivity

### Security Features
- **Military-Grade Security** - Encrypted communications and secure protocols
- **Access Control** - Role-based permissions for different command levels
- **Audit Trail** - Complete logging of all tactical operations
- **Demo Mode** - Safe training environment with no real-world actions

## 📱 User Interface

### Main Command Panels
1. **Control Sidebar** - UAV selection, SIDC operations, target analysis
2. **Intelligence Panel** - Real-time threat detection and communications intelligence
3. **Mission Panel** - Pre-configured tactical missions (Patrol, Recon, Strike, etc.)
4. **Command Footer** - Quick access to intel, missions, controls, emergency, and comms

### Tactical Features
- **Dynamic UAV Icons** - Color-coded status indicators (Operational, Engaged, Surveillance, Maintenance)
- **Target Selection** - Click-to-select enemy assets for engagement
- **Real-Time Updates** - Live position updates and status changes
- **Toast Notifications** - Immediate feedback for all tactical operations

## 🛠️ Technical Specifications

### Platform Requirements
- **Web-Based** - Runs in any modern mobile browser
- **ArcGIS Integration** - Professional mapping and geospatial analysis
- **Font Awesome Icons** - Military and tactical iconography
- **Responsive CSS Grid** - Advanced layout management

### Data Sources
- **Simulated UAV Fleet** - 6 different UAV platforms with realistic capabilities
- **Enemy Asset Simulation** - Dynamic threat generation and tracking
- **Real-Time Updates** - 10-second refresh cycles for all tactical data

## 🎮 Operation Instructions

### Basic Operations
1. **Launch System** - Open `index.html` in mobile browser
2. **Select UAV** - Tap UAV card in control sidebar to select asset
3. **Choose Operation** - Select SIDC operation (Surveillance, ID, Destruction, Capture)
4. **Target Selection** - Tap enemy assets on map for engagement
5. **Mission Assignment** - Choose from pre-configured mission templates

### Advanced Features
- **Emergency Protocol** - Red emergency button for immediate RTB (Return to Base)
- **Communications Check** - Verify all UAV communications status
- **Intelligence Monitoring** - Real-time threat and communication intercepts
- **Multi-Asset Coordination** - Manage multiple UAVs simultaneously

## 🔐 Security & Compliance

**⚠️ IMPORTANT DISCLAIMER:**
This is a demonstration/training system only. No real-world military assets are controlled or affected by this interface. All operations are simulated for training and development purposes.

## 📄 License

Military Training and Development Use Only

---

**Developed for Supreme Commanders and General-level tactical operations**  
*Mobile-optimized C4ISR platform with advanced UAV SIDC capabilities* 

# AEGIS C4ISR - سیستم فرماندهی و کنترل پیشرفته پهپاد

**پلتفرم C4ISR نظامی بهینه شده برای موبایل برای عملیات فرماندهی عالی/عمومی**

## 🎯 ویژگی‌های اصلی

### عملیات SIDC پهپاد (نظارت، شناسایی، انهدام، تصرف)
- **مدیریت دارایی‌های پهپاد در زمان واقعی** - ردیابی و کنترل چندین پلتفرم پهپاد (MQ-9 Reaper، RQ-4 Global Hawk، MQ-1 Predator و غیره)
- **پیاده‌سازی پروتکل SIDC** - مجموعه کامل عملیات تاکتیکی:
- 🔍 **نظارت** - نظارت و شناسایی مداوم منطقه
- 🎯 **شناسایی** - طبقه‌بندی هدف و ارزیابی تهدید
- 💥 **انهدام** - قابلیت‌های درگیری دقیق
- 🤚 **تصرف** - پروتکل‌های بازیابی و کنترل دارایی

### رابط فرماندهی پیشرفته
- **طراحی رابط کاربری در سطح نظامی** - تم تاکتیکی تیره با رنگ سبز  عناصر HUD
- **مرکز فرماندهی چند پنلی** - پنل‌های کشویی برای مناطق عملیاتی مختلف
- **تغذیه اطلاعاتی بلادرنگ** - تشخیص تهدید زنده و رهگیری ارتباطات
- **سیستم برنامه‌ریزی ماموریت** - قالب‌های ماموریت تاکتیکی از پیش پیکربندی شده

### یکپارچه‌سازی C4ISR
- **فرماندهی و کنترل** - مدیریت یکپارچه ناوگان پهپاد
- **ارتباطات** - پروتکل‌های ارتباطی تاکتیکی امن
- **کامپیوترها** - محاسبات و پردازش پیشرفته داده‌ها
- **اطلاعات** - تجزیه و تحلیل تهدید بلادرنگ و اطلاعات میدان نبرد
- **نظارت** - نظارت مداوم منطقه با چندین حسگر
- **شناسایی** - ماموریت‌های شناسایی عمیق و جمع‌آوری اطلاعات

## 🚀 قابلیت‌های کلیدی

### رابط فرماندهی عالی
- **نمایش نقشه تاکتیکی** - تصاویر ماهواره‌ای نظامی با پوشش شبکه تاکتیکی
- **نظارت بر وضعیت دارایی** - وضعیت عملیاتی و سلامت پهپاد در زمان واقعی
- **ارزیابی سطح تهدید** - ارزیابی پویای تهدید با تصویر  شاخص‌ها
- **پروتکل‌های اضطراری** - واکنش سریع و رویه‌های تخلیه اضطراری

### طراحی موبایل‌محور
- **کنترل‌های لمسی بهینه‌شده** - دکمه‌های تاکتیکی بزرگ برای عملیات میدانی
- **طرح‌بندی واکنش‌گرا** - سازگار با اندازه‌های مختلف صفحه نمایش موبایل
- **ناوبری با اشاره** - کنترل‌های لمسی و لمسی شهودی
- **قابلیت آفلاین** - عملکردهای حیاتی بدون اتصال به شبکه کار می‌کنند

### ویژگی‌های امنیتی
- **امنیت درجه نظامی** - ارتباطات رمزگذاری شده و پروتکل‌های امن
- **کنترل دسترسی** - مجوزهای مبتنی بر نقش برای سطوح مختلف فرماندهی
- **ردیابی حسابرسی** - ثبت کامل تمام عملیات تاکتیکی
- **حالت آزمایشی** - محیط آموزشی ایمن بدون اقدامات دنیای واقعی

## 📱 رابط کاربری

### پنل‌های فرماندهی اصلی
1. **نوار کناری کنترل** - انتخاب پهپاد، عملیات SIDC، تجزیه و تحلیل هدف
2. **پنل اطلاعات** - تشخیص تهدید در زمان واقعی و اطلاعات ارتباطات
3. **پنل ماموریت** -  ماموریت‌های تاکتیکی از پیش پیکربندی شده (گشت، شناسایی، حمله و غیره)
۴. **پایین فرمان** - دسترسی سریع به اطلاعات، ماموریت‌ها، کنترل‌ها، موارد اضطراری و ارتباطات

### ویژگی‌های تاکتیکی
- **آیکون‌های پویای پهپاد** - نشانگرهای وضعیت رنگی (عملیاتی، درگیر، نظارت، تعمیر و نگهداری)
- **انتخاب هدف** - انتخاب دارایی‌های دشمن برای درگیری با کلیک
- **به‌روزرسانی‌های بلادرنگ** - به‌روزرسانی‌های موقعیت زنده و تغییرات وضعیت
- **اعلان‌های Toast** - بازخورد فوری برای همه عملیات تاکتیکی

## 🛠️ مشخصات فنی

### الزامات پلتفرم
- **مبتنی بر وب** - قابل اجرا در هر مرورگر موبایل مدرن
- **ادغام با ArcGIS** - نقشه‌برداری حرفه‌ای و تحلیل جغرافیایی
- **آیکون‌های فونت عالی** - آیکون‌نگاری نظامی و تاکتیکی
- **شبکه CSS واکنش‌گرا** - مدیریت طرح‌بندی پیشرفته

### منابع داده
- **شبیه‌سازی شده  ناوگان پهپاد** - 6 پلتفرم پهپاد مختلف با قابلیت‌های واقع‌گرایانه
- **شبیه‌سازی تجهیزات دشمن** - تولید و ردیابی پویای تهدید
- **به‌روزرسانی‌های بلادرنگ** - چرخه‌های به‌روزرسانی 10 ثانیه‌ای برای تمام داده‌های تاکتیکی

## 🎮 دستورالعمل‌های عملیات

### عملیات پایه
1. **سیستم راه‌اندازی** - `index.html` را در مرورگر موبایل باز کنید
2. **پهپاد را انتخاب کنید** - برای انتخاب تجهیزات، روی کارت پهپاد در نوار کناری کنترل ضربه بزنید
3. **عملیات را انتخاب کنید** - عملیات SIDC (نظارت، شناسایی، تخریب، تصرف) را انتخاب کنید
4. **انتخاب هدف** - برای درگیری، روی تجهیزات دشمن روی نقشه ضربه بزنید
5. **انتساب ماموریت** - از بین قالب‌های ماموریت از پیش پیکربندی شده انتخاب کنید

### ویژگی‌های پیشرفته
- **پروتکل اضطراری** - دکمه قرمز اضطراری برای RTB فوری (بازگشت به پایگاه)
- **بررسی ارتباطات** - تأیید وضعیت تمام ارتباطات پهپاد
- **نظارت اطلاعاتی** - تهدید و ارتباطات بلادرنگ  رهگیری‌ها
- **هماهنگی چند دارایی** - مدیریت چندین پهپاد به طور همزمان

## 🔐 امنیت و انطباق

**⚠️ سلب مسئولیت مهم:**
این فقط یک سیستم نمایشی/آموزشی است. هیچ دارایی نظامی در دنیای واقعی توسط این رابط کنترل یا تحت تأثیر قرار نمی‌گیرد. همه عملیات برای اهداف آموزشی و توسعه‌ای شبیه‌سازی شده‌اند.

## 📄 مجوز

فقط برای استفاده آموزش و توسعه نظامی

---

**توسعه یافته برای فرماندهان عالی و عملیات تاکتیکی در سطح عمومی**
*پلتفرم C4ISR بهینه شده برای موبایل با قابلیت‌های پیشرفته SIDC پهپاد*

