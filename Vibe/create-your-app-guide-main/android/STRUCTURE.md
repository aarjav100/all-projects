# Android Project Structure

This directory contains the native Android Kotlin application.

## Folder Structure

```
android/
├── .gradle/                    # Gradle cache (auto-generated)
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── app/                        # Main application module
│   ├── build.gradle.kts       # App-level Gradle config
│   ├── proguard-rules.pro
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml
│           ├── java/com/vibe/app/
│           │   ├── data/
│           │   ├── ui/
│           │   ├── navigation/
│           │   ├── MainActivity.kt
│           │   └── VibeApplication.kt
│           └── res/
│               ├── layout/
│               ├── values/
│               ├── drawable/
│               └── mipmap/
├── build.gradle.kts           # Project-level Gradle
├── settings.gradle.kts
├── gradle.properties
├── local.properties           # Local config (not in git)
└── README.md
```

## Setup

See [README.md](README.md) for complete setup instructions.

## Quick Start

1. Open this folder in Android Studio
2. Configure `local.properties` with Supabase credentials
3. Sync Gradle
4. Run the app
