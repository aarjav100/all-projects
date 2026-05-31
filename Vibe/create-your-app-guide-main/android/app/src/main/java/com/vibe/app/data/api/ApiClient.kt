package com.vibe.app.data.api

import com.vibe.app.BuildConfig
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

/**
 * Retrofit API Client configuration
 * Replaces React's Supabase client initialization
 */
object ApiClient {
    
    private const val BASE_URL = BuildConfig.SUPABASE_URL
    private const val ANON_KEY = BuildConfig.SUPABASE_ANON_KEY
    
    // Token storage (will be injected via Hilt in production)
    private var accessToken: String? = null
    
    fun setAccessToken(token: String?) {
        accessToken = token
    }
    
    /**
     * Auth interceptor - adds Supabase headers to every request
     * Equivalent to React's supabase client auto-header injection
     */
    private val authInterceptor = Interceptor { chain ->
        val originalRequest = chain.request()
        val requestBuilder = originalRequest.newBuilder()
            .header("apikey", ANON_KEY)
            .header("Content-Type", "application/json")
        
        // Add Authorization header if user is logged in
        accessToken?.let {
            requestBuilder.header("Authorization", "Bearer $it")
        }
        
        chain.proceed(requestBuilder.build())
    }
    
    /**
     * Logging interceptor for debugging
     */
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = if (BuildConfig.DEBUG) {
            HttpLoggingInterceptor.Level.BODY
        } else {
            HttpLoggingInterceptor.Level.NONE
        }
    }
    
    /**
     * OkHttp client with interceptors
     */
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    
    /**
     * Retrofit instance for Supabase REST API
     */
    private val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    /**
     * Retrofit instance for Supabase Auth API
     */
    private val authRetrofit: Retrofit = Retrofit.Builder()
        .baseUrl("${BASE_URL}/auth/v1/")
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    /**
     * API service instances
     */
    val supabaseApi: SupabaseApiService by lazy {
        retrofit.create(SupabaseApiService::class.java)
    }
    
    val authApi: AuthApiService by lazy {
        authRetrofit.create(AuthApiService::class.java)
    }
}
