package com.vibe.app.data.api

import android.util.Log
import com.vibe.app.BuildConfig
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.Auth
import io.github.jan.supabase.gotrue.FlowType
import io.github.jan.supabase.gotrue.auth
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.realtime.Realtime
import io.github.jan.supabase.realtime.realtime
import io.github.jan.supabase.storage.Storage
import io.github.jan.supabase.storage.storage

object SupabaseClient {
    private const val TAG = "SupabaseClient"
    
    // Check if credentials are configured (not placeholder values)
    val isConfigured: Boolean by lazy {
        val url = BuildConfig.SUPABASE_URL
        val key = BuildConfig.SUPABASE_ANON_KEY
        val isValid = url.isNotEmpty() && 
                      key.isNotEmpty() && 
                      !url.contains("your-project") && 
                      !key.contains("your-anon-key") &&
                      url.startsWith("https://")
        
        if (!isValid) {
            Log.w(TAG, "Supabase credentials not configured. App will run in demo mode.")
        }
        isValid
    }
    
    val client by lazy {
        if (!isConfigured) {
            // Create a dummy client with placeholder URL for demo mode
            Log.w(TAG, "Creating demo Supabase client - auth features disabled")
        }
        
        createSupabaseClient(
            supabaseUrl = if (isConfigured) BuildConfig.SUPABASE_URL else "https://demo.supabase.co",
            supabaseKey = if (isConfigured) BuildConfig.SUPABASE_ANON_KEY else "demo-key"
        ) {
            install(Auth) {
                flowType = FlowType.PKCE
                scheme = "vibe"
                host = "callback"
            }
            install(Postgrest)
            install(Realtime)
            install(Storage)
        }
    }

    val auth get() = client.auth
    val postgrest get() = client.postgrest
    val realtime get() = client.realtime
    val storage get() = client.storage
}
