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
