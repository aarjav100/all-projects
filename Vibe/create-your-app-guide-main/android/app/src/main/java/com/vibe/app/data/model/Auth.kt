package com.vibe.app.data.model

import com.google.gson.annotations.SerializedName

/**
 * Authentication request/response models
 */

// Sign up request
data class SignUpRequest(
    @SerializedName("email")
    val email: String,
    
    @SerializedName("password")
    val password: String,
    
    @SerializedName("data")
    val data: SignUpMetadata
)

data class SignUpMetadata(
    @SerializedName("username")
    val username: String,
    
    @SerializedName("display_name")
    val displayName: String
)

// Sign in request
data class SignInRequest(
    @SerializedName("email")
    val email: String,
    
    @SerializedName("password")
    val password: String
)

// Auth response
data class AuthResponse(
    @SerializedName("access_token")
    val accessToken: String,
    
    @SerializedName("token_type")
    val tokenType: String,
    
    @SerializedName("expires_in")
    val expiresIn: Int,
    
    @SerializedName("refresh_token")
    val refreshToken: String,
    
    @SerializedName("user")
    val user: AuthUser
)

data class AuthUser(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("email")
    val email: String,
    
    @SerializedName("email_confirmed_at")
    val emailConfirmedAt: String? = null,
    
    @SerializedName("user_metadata")
    val userMetadata: Map<String, Any>? = null,
    
    @SerializedName("created_at")
    val createdAt: String
)

// Refresh token request
data class RefreshTokenRequest(
    @SerializedName("refresh_token")
    val refreshToken: String
)

// Password reset request
data class PasswordResetRequest(
    @SerializedName("email")
    val email: String
)

// Update password request
data class UpdatePasswordRequest(
    @SerializedName("password")
    val password: String
)

// Phone OTP request
data class PhoneOtpRequest(
    @SerializedName("phone")
    val phone: String
)

// Verify OTP request
data class VerifyOtpRequest(
    @SerializedName("phone")
    val phone: String,
    
    @SerializedName("token")
    val token: String,
    
    @SerializedName("type")
    val type: String = "sms"
)

// Session data
data class Session(
    val accessToken: String,
    val refreshToken: String,
    val expiresAt: Long,
    val user: AuthUser
)
