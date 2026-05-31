package com.vibe.app.data.model

import com.google.gson.annotations.SerializedName

/**
 * Community models
 */
data class Community(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("name")
    val name: String,
    
    @SerializedName("description")
    val description: String? = null,
    
    @SerializedName("image_url")
    val imageUrl: String? = null,
    
    @SerializedName("cover_url")
    val coverUrl: String? = null,
    
    @SerializedName("members_count")
    val membersCount: Int = 0,
    
    @SerializedName("posts_count")
    val postsCount: Int = 0,
    
    @SerializedName("is_member")
    val isMember: Boolean = false,
    
    @SerializedName("is_private")
    val isPrivate: Boolean = false,
    
    @SerializedName("created_by")
    val createdBy: String,
    
    @SerializedName("created_at")
    val createdAt: String,
    
    @SerializedName("creator_profile")
    val creatorProfile: User? = null
)

data class Topic(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("community_id")
    val communityId: String,
    
    @SerializedName("title")
    val title: String,
    
    @SerializedName("description")
    val description: String? = null,
    
    @SerializedName("posts_count")
    val postsCount: Int = 0,
    
    @SerializedName("created_at")
    val createdAt: String
)

data class CreateCommunityRequest(
    @SerializedName("name")
    val name: String,
    
    @SerializedName("description")
    val description: String? = null,
    
    @SerializedName("is_private")
    val isPrivate: Boolean = false
)
