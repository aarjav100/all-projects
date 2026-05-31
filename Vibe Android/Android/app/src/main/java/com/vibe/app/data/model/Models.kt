package com.vibe.app.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

// Enums
@Serializable
enum class TrustBadgeLevel {
    @SerialName("none") NONE,
    @SerialName("newcomer") NEWCOMER,
    @SerialName("contributor") CONTRIBUTOR,
    @SerialName("trusted") TRUSTED,
    @SerialName("verified") VERIFIED,
    @SerialName("champion") CHAMPION
}

@Serializable
enum class PostIntent {
    @SerialName("ask") ASK,
    @SerialName("teach") TEACH,
    @SerialName("vent") VENT,
    @SerialName("celebrate") CELEBRATE
}

@Serializable
enum class MediaType {
    @SerialName("image") IMAGE,
    @SerialName("video") VIDEO
}

@Serializable
enum class NotificationType {
    @SerialName("like") LIKE,
    @SerialName("comment") COMMENT,
    @SerialName("follow") FOLLOW,
    @SerialName("message") MESSAGE,
    @SerialName("mention") MENTION,
    @SerialName("repost") REPOST
}

// Data Classes
@Serializable
data class Profile(
    val id: String,
    @SerialName("user_id") val userId: String,
    val username: String,
    @SerialName("display_name") val displayName: String? = null,
    @SerialName("avatar_url") val avatarUrl: String? = null,
    val bio: String? = null,
    @SerialName("created_at") val createdAt: String? = null,
    @SerialName("updated_at") val updatedAt: String? = null,
    @SerialName("is_verified") val isVerified: Boolean = false,
    @SerialName("trust_score") val trustScore: Int = 0,
    @SerialName("trust_badge") val trustBadge: TrustBadgeLevel = TrustBadgeLevel.NONE,
    @SerialName("helpful_count") val helpfulCount: Int = 0,
    @SerialName("report_count") val reportCount: Int = 0
)

@Serializable
data class Post(
    val id: String,
    @SerialName("user_id") val userId: String,
    val content: String? = null,
    @SerialName("media_url") val mediaUrl: String? = null,
    @SerialName("media_type") val mediaType: MediaType? = null,
    val intent: PostIntent? = null,
    @SerialName("created_at") val createdAt: String? = null,
    @SerialName("updated_at") val updatedAt: String? = null,
    @SerialName("expires_at") val expiresAt: String? = null,
    @SerialName("ai_mood_score") val aiMoodScore: Float? = null,
    @SerialName("ai_mood_warning") val aiMoodWarning: String? = null,
    val profile: Profile? = null,
    @SerialName("likes_count") val likesCount: Int = 0,
    @SerialName("comments_count") val commentsCount: Int = 0,
    @SerialName("reposts_count") val repostsCount: Int = 0,
    @SerialName("is_liked") val isLiked: Boolean = false,
    @SerialName("is_saved") val isSaved: Boolean = false,
    @SerialName("is_reposted") val isReposted: Boolean = false,
    @SerialName("is_repost") val isRepost: Boolean = false,
    @SerialName("reposted_by") val repostedBy: Profile? = null,
    @SerialName("repost_comment") val repostComment: String? = null,
    @SerialName("repost_created_at") val repostCreatedAt: String? = null
)

@Serializable
data class Comment(
    val id: String,
    @SerialName("user_id") val userId: String,
    @SerialName("post_id") val postId: String,
    val content: String,
    @SerialName("created_at") val createdAt: String? = null,
    @SerialName("updated_at") val updatedAt: String? = null,
    val profile: Profile? = null
)

@Serializable
data class Story(
    val id: String,
    @SerialName("user_id") val userId: String,
    @SerialName("media_url") val mediaUrl: String,
    @SerialName("media_type") val mediaType: MediaType,
    @SerialName("created_at") val createdAt: String? = null,
    @SerialName("expires_at") val expiresAt: String,
    val profile: Profile? = null,
    @SerialName("views_count") val viewsCount: Int = 0,
    @SerialName("is_viewed") val isViewed: Boolean = false
)

@Serializable
data class Message(
    val id: String,
    @SerialName("sender_id") val senderId: String,
    @SerialName("receiver_id") val receiverId: String,
    val content: String,
    @SerialName("read_at") val readAt: String? = null,
    @SerialName("created_at") val createdAt: String? = null,
    @SerialName("sender_profile") val senderProfile: Profile? = null,
    @SerialName("receiver_profile") val receiverProfile: Profile? = null
)

@Serializable
data class Notification(
    val id: String,
    @SerialName("user_id") val userId: String,
    val type: NotificationType,
    @SerialName("actor_id") val actorId: String,
    @SerialName("post_id") val postId: String? = null,
    val read: Boolean = false,
    @SerialName("created_at") val createdAt: String? = null,
    @SerialName("actor_profile") val actorProfile: Profile? = null
)

@Serializable
data class Follow(
    val id: String,
    @SerialName("follower_id") val followerId: String,
    @SerialName("following_id") val followingId: String,
    @SerialName("created_at") val createdAt: String? = null
)

@Serializable
data class Like(
    val id: String,
    @SerialName("user_id") val userId: String,
    @SerialName("post_id") val postId: String,
    @SerialName("created_at") val createdAt: String? = null
)

@Serializable
data class SavedPost(
    val id: String,
    @SerialName("user_id") val userId: String,
    @SerialName("post_id") val postId: String,
    @SerialName("collection_id") val collectionId: String? = null,
    @SerialName("created_at") val createdAt: String? = null
)

@Serializable
data class Collection(
    val id: String,
    @SerialName("user_id") val userId: String,
    val name: String,
    val description: String? = null,
    @SerialName("cover_url") val coverUrl: String? = null,
    @SerialName("created_at") val createdAt: String? = null,
    @SerialName("updated_at") val updatedAt: String? = null,
    @SerialName("posts_count") val postsCount: Int = 0
)

@Serializable
data class Repost(
    val id: String,
    @SerialName("user_id") val userId: String,
    @SerialName("post_id") val postId: String,
    val comment: String? = null,
    @SerialName("created_at") val createdAt: String? = null,
    val profile: Profile? = null,
    @SerialName("original_post") val originalPost: Post? = null
)

@Serializable
data class Conversation(
    val partnerId: String,
    val partnerProfile: Profile,
    val lastMessage: Message? = null,
    val unreadCount: Int = 0
)
