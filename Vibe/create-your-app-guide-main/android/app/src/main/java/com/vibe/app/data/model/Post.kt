package com.vibe.app.data.model

import com.google.gson.annotations.SerializedName

/**
 * Post model matching Supabase posts table
 */
data class Post(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("user_id")
    val userId: String,
    
    @SerializedName("content")
    val content: String,
    
    @SerializedName("image_url")
    val imageUrl: String? = null,
    
    @SerializedName("video_url")
    val videoUrl: String? = null,
    
    @SerializedName("likes_count")
    val likesCount: Int = 0,
    
    @SerializedName("comments_count")
    val commentsCount: Int = 0,
    
    @SerializedName("shares_count")
    val sharesCount: Int = 0,
    
    @SerializedName("is_liked")
    val isLiked: Boolean = false,
    
    @SerializedName("is_bookmarked")
    val isBookmarked: Boolean = false,
    
    @SerializedName("created_at")
    val createdAt: String,
    
    @SerializedName("updated_at")
    val updatedAt: String? = null,
    
    // Embedded user profile
    @SerializedName("profile")
    val profile: User? = null,
    
    @SerializedName("community_id")
    val communityId: String? = null
)

/**
 * Create post request
 */
data class CreatePostRequest(
    @SerializedName("content")
    val content: String,
    
    @SerializedName("image_url")
    val imageUrl: String? = null,
    
    @SerializedName("video_url")
    val videoUrl: String? = null,
    
    @SerializedName("community_id")
    val communityId: String? = null
)

/**
 * Comment model
 */
data class Comment(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("post_id")
    val postId: String,
    
    @SerializedName("user_id")
    val userId: String,
    
    @SerializedName("content")
    val content: String,
    
    @SerializedName("likes_count")
    val likesCount: Int = 0,
    
    @SerializedName("is_liked")
    val isLiked: Boolean = false,
    
    @SerializedName("created_at")
    val createdAt: String,
    
    @SerializedName("profile")
    val profile: User? = null
)

/**
 * Create comment request
 */
data class CreateCommentRequest(
    @SerializedName("post_id")
    val postId: String,
    
    @SerializedName("content")
    val content: String
)
