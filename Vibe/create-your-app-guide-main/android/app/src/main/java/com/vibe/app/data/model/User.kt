package com.vibe.app.data.model

import com.google.gson.annotations.SerializedName

/**
 * User model matching Supabase profiles table
 * Converted from React TypeScript interface
 */
data class User(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("username")
    val username: String,
    
    @SerializedName("display_name")
    val displayName: String,
    
    @SerializedName("email")
    val email: String? = null,
    
    @SerializedName("avatar_url")
    val avatarUrl: String? = null,
    
    @SerializedName("bio")
    val bio: String? = null,
    
    @SerializedName("website")
    val website: String? = null,
    
    @SerializedName("location")
    val location: String? = null,
    
    @SerializedName("followers_count")
    val followersCount: Int = 0,
    
    @SerializedName("following_count")
    val followingCount: Int = 0,
    
    @SerializedName("posts_count")
    val postsCount: Int = 0,
    
    @SerializedName("is_verified")
    val isVerified: Boolean = false,
    
    @SerializedName("is_private")
    val isPrivate: Boolean = false,
    
    @SerializedName("created_at")
    val createdAt: String,
    
    @SerializedName("updated_at")
    val updatedAt: String? = null
)

/**
 * Profile update request
 */
data class UpdateProfileRequest(
    @SerializedName("display_name")
    val displayName: String? = null,
    
    @SerializedName("bio")
    val bio: String? = null,
    
    @SerializedName("website")
    val website: String? = null,
    
    @SerializedName("location")
    val location: String? = null,
    
    @SerializedName("avatar_url")
    val avatarUrl: String? = null,
    
    @SerializedName("is_private")
    val isPrivate: Boolean? = null
)
