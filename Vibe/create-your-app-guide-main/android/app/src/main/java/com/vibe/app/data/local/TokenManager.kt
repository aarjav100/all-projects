package com.vibe.app.data.local

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

/**
 * Token Manager using DataStore
 * Replaces React's localStorage for secure token storage
 * 
 * React equivalent:
 * - localStorage.setItem('access_token', token)
 * - localStorage.getItem('access_token')
 */
private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "auth_prefs")

class TokenManager(private val context: Context) {
    
    companion object {
        private val ACCESS_TOKEN_KEY = stringPreferencesKey("access_token")
        private val REFRESH_TOKEN_KEY = stringPreferencesKey("refresh_token")
        private val EXPIRES_AT_KEY = longPreferencesKey("expires_at")
        private val USER_ID_KEY = stringPreferencesKey("user_id")
        private val USER_EMAIL_KEY = stringPreferencesKey("user_email")
    }
    
    /**
     * Save authentication tokens
     * React: localStorage.setItem('sb-access-token', token)
     */
    suspend fun saveTokens(
        accessToken: String,
        refreshToken: String,
        expiresAt: Long,
        userId: String,
        userEmail: String
    ) {
        context.dataStore.edit { preferences ->
            preferences[ACCESS_TOKEN_KEY] = accessToken
            preferences[REFRESH_TOKEN_KEY] = refreshToken
            preferences[EXPIRES_AT_KEY] = expiresAt
            preferences[USER_ID_KEY] = userId
            preferences[USER_EMAIL_KEY] = userEmail
        }
    }
    
    /**
     * Get access token
     * React: localStorage.getItem('sb-access-token')
     */
    suspend fun getAccessToken(): String? {
        return context.dataStore.data.map { preferences ->
            preferences[ACCESS_TOKEN_KEY]
        }.first()
    }
    
    /**
     * Get access token as Flow (reactive)
     */
    fun getAccessTokenFlow(): Flow<String?> {
        return context.dataStore.data.map { preferences ->
            preferences[ACCESS_TOKEN_KEY]
        }
    }
    
    /**
     * Get refresh token
     */
    suspend fun getRefreshToken(): String? {
        return context.dataStore.data.map { preferences ->
            preferences[REFRESH_TOKEN_KEY]
        }.first()
    }
    
    /**
     * Get token expiration time
     */
    suspend fun getExpiresAt(): Long? {
        return context.dataStore.data.map { preferences ->
            preferences[EXPIRES_AT_KEY]
        }.first()
    }
    
    /**
     * Get user ID
     */
    suspend fun getUserId(): String? {
        return context.dataStore.data.map { preferences ->
            preferences[USER_ID_KEY]
        }.first()
    }
    
    /**
     * Get user email
     */
    suspend fun getUserEmail(): String? {
        return context.dataStore.data.map { preferences ->
            preferences[USER_EMAIL_KEY]
        }.first()
    }
    
    /**
     * Check if token is expired
     */
    suspend fun isTokenExpired(): Boolean {
        val expiresAt = getExpiresAt() ?: return true
        return System.currentTimeMillis() >= expiresAt
    }
    
    /**
     * Clear all tokens (logout)
     * React: localStorage.clear()
     */
    suspend fun clearTokens() {
        context.dataStore.edit { preferences ->
            preferences.clear()
        }
    }
    
    /**
     * Check if user is logged in
     */
    suspend fun isLoggedIn(): Boolean {
        return getAccessToken() != null && !isTokenExpired()
    }
}

// Extension function to get first value from Flow
private suspend fun <T> Flow<T>.first(): T {
    var result: T? = null
    collect { value ->
        result = value
        return@collect
    }
    return result!!
}
