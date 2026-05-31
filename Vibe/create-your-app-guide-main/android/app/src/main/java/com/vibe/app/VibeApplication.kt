package com.vibe.app

import android.app.Application

/**
 * Application class
 * Used for app-wide initialization
 * In production, this would be annotated with @HiltAndroidApp for dependency injection
 */
class VibeApplication : Application() {
    
    override fun onCreate() {
        super.onCreate()
        // Initialize app-wide components here
        // e.g., Timber for logging, Crashlytics, etc.
    }
}
