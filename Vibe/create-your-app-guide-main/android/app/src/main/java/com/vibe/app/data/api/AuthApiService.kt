package com.vibe.app.data.api

import com.vibe.app.data.model.*
import retrofit2.Response
import retrofit2.http.*

/**
 * Authentication API Service
 * Converts React's useAuth hook methods to Retrofit endpoints
 */
interface AuthApiService {
    
    /**
     * Sign up with email and password
     * React equivalent: supabase.auth.signUp({ email, password, options })
     */
    @POST("signup")
    suspend fun signUp(
        @Body request: SignUpRequest
    ): Response<AuthResponse>
    
    /**
     * Sign in with email and password
     * React equivalent: supabase.auth.signInWithPassword({ email, password })
     */
    @POST("token?grant_type=password")
    suspend fun signIn(
        @Body request: SignInRequest
    ): Response<AuthResponse>
    
    /**
     * Refresh access token
     * React equivalent: supabase.auth.refreshSession()
     */
    @POST("token?grant_type=refresh_token")
    suspend fun refreshToken(
        @Body request: RefreshTokenRequest
    ): Response<AuthResponse>
    
    /**
     * Send password reset email
     * React equivalent: supabase.auth.resetPasswordForEmail(email)
     */
    @POST("recover")
    suspend fun resetPassword(
        @Body request: PasswordResetRequest
    ): Response<Unit>
    
    /**
     * Update user password
     * React equivalent: supabase.auth.updateUser({ password })
     */
    @PUT("user")
    suspend fun updatePassword(
        @Body request: UpdatePasswordRequest
    ): Response<AuthUser>
    
    /**
     * Send phone OTP
     * React equivalent: supabase.auth.signInWithOtp({ phone })
     */
    @POST("otp")
    suspend fun sendPhoneOtp(
        @Body request: PhoneOtpRequest
    ): Response<Unit>
    
    /**
     * Verify phone OTP
     * React equivalent: supabase.auth.verifyOtp({ phone, token, type: 'sms' })
     */
    @POST("verify")
    suspend fun verifyOtp(
        @Body request: VerifyOtpRequest
    ): Response<AuthResponse>
    
    /**
     * Sign out
     * React equivalent: supabase.auth.signOut()
     */
    @POST("logout")
    suspend fun signOut(): Response<Unit>
    
    /**
     * Get current session
     * React equivalent: supabase.auth.getSession()
     */
    @GET("user")
    suspend fun getCurrentUser(): Response<AuthUser>
}
