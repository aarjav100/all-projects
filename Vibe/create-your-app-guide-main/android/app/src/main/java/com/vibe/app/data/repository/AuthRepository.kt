package com.vibe.app.data.repository

import com.vibe.app.data.api.AuthApiService
import com.vibe.app.data.api.ApiClient
import com.vibe.app.data.local.TokenManager
import com.vibe.app.data.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

/**
 * Authentication Repository
 * Converts React's useAuth hook to Repository pattern
 * Handles all authentication logic and token management
 */
class AuthRepository(
    private val authApi: AuthApiService,
    private val tokenManager: TokenManager
) {
    
    /**
     * Sign up with email and password
     * React equivalent: const { error } = await signUp(email, password, username, displayName)
     */
    suspend fun signUp(
        email: String,
        password: String,
        username: String,
        displayName: String
    ): Result<AuthResponse> {
        return try {
            val request = SignUpRequest(
                email = email,
                password = password,
                data = SignUpMetadata(
                    username = username,
                    displayName = displayName
                )
            )
            
            val response = authApi.signUp(request)
            
            if (response.isSuccessful && response.body() != null) {
                val authResponse = response.body()!!
                
                // Save tokens
                saveAuthTokens(authResponse)
                
                Result.success(authResponse)
            } else {
                Result.failure(Exception(response.message() ?: "Sign up failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Sign in with email and password
     * React equivalent: const { error } = await signIn(email, password)
     */
    suspend fun signIn(
        email: String,
        password: String
    ): Result<AuthResponse> {
        return try {
            val request = SignInRequest(email, password)
            val response = authApi.signIn(request)
            
            if (response.isSuccessful && response.body() != null) {
                val authResponse = response.body()!!
                
                // Save tokens and update API client
                saveAuthTokens(authResponse)
                
                Result.success(authResponse)
            } else {
                Result.failure(Exception(response.message() ?: "Sign in failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Sign out
     * React equivalent: await signOut()
     */
    suspend fun signOut(): Result<Unit> {
        return try {
            authApi.signOut()
            tokenManager.clearTokens()
            ApiClient.setAccessToken(null)
            Result.success(Unit)
        } catch (e: Exception) {
            // Even if API call fails, clear local tokens
            tokenManager.clearTokens()
            ApiClient.setAccessToken(null)
            Result.success(Unit)
        }
    }
    
    /**
     * Refresh access token
     * React equivalent: supabase.auth.refreshSession()
     */
    suspend fun refreshToken(): Result<AuthResponse> {
        return try {
            val refreshToken = tokenManager.getRefreshToken()
                ?: return Result.failure(Exception("No refresh token available"))
            
            val request = RefreshTokenRequest(refreshToken)
            val response = authApi.refreshToken(request)
            
            if (response.isSuccessful && response.body() != null) {
                val authResponse = response.body()!!
                saveAuthTokens(authResponse)
                Result.success(authResponse)
            } else {
                Result.failure(Exception("Token refresh failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Reset password
     * React equivalent: await resetPassword(email)
     */
    suspend fun resetPassword(email: String): Result<Unit> {
        return try {
            val request = PasswordResetRequest(email)
            val response = authApi.resetPassword(request)
            
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception(response.message() ?: "Password reset failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Update password
     * React equivalent: await updatePassword(password)
     */
    suspend fun updatePassword(newPassword: String): Result<AuthUser> {
        return try {
            val request = UpdatePasswordRequest(newPassword)
            val response = authApi.updatePassword(request)
            
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(response.message() ?: "Password update failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Send phone OTP
     * React equivalent: await signInWithPhone(phone)
     */
    suspend fun sendPhoneOtp(phone: String): Result<Unit> {
        return try {
            val request = PhoneOtpRequest(phone)
            val response = authApi.sendPhoneOtp(request)
            
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception(response.message() ?: "Failed to send OTP"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Verify phone OTP
     * React equivalent: await verifyOtp(phone, token)
     */
    suspend fun verifyOtp(phone: String, token: String): Result<AuthResponse> {
        return try {
            val request = VerifyOtpRequest(phone, token)
            val response = authApi.verifyOtp(request)
            
            if (response.isSuccessful && response.body() != null) {
                val authResponse = response.body()!!
                saveAuthTokens(authResponse)
                Result.success(authResponse)
            } else {
                Result.failure(Exception(response.message() ?: "OTP verification failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Get current user
     */
    suspend fun getCurrentUser(): Result<AuthUser> {
        return try {
            val response = authApi.getCurrentUser()
            
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to get current user"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Check if user is logged in
     */
    suspend fun isLoggedIn(): Boolean {
        return tokenManager.isLoggedIn()
    }
    
    /**
     * Get access token as Flow
     * Useful for observing auth state changes
     */
    fun getAccessTokenFlow(): Flow<String?> {
        return tokenManager.getAccessTokenFlow()
    }
    
    /**
     * Save authentication tokens to DataStore
     */
    private suspend fun saveAuthTokens(authResponse: AuthResponse) {
        val expiresAt = System.currentTimeMillis() + (authResponse.expiresIn * 1000L)
        
        tokenManager.saveTokens(
            accessToken = authResponse.accessToken,
            refreshToken = authResponse.refreshToken,
            expiresAt = expiresAt,
            userId = authResponse.user.id,
            userEmail = authResponse.user.email
        )
        
        // Update API client with new token
        ApiClient.setAccessToken(authResponse.accessToken)
    }
}
