package com.vibe.app.data.model

import com.google.gson.annotations.SerializedName

/**
 * Message and conversation models
 */
data class Message(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("conversation_id")
    val conversationId: String,
    
    @SerializedName("sender_id")
    val senderId: String,
    
    @SerializedName("content")
    val content: String,
    
    @SerializedName("image_url")
    val imageUrl: String? = null,
    
    @SerializedName("is_read")
    val isRead: Boolean = false,
    
    @SerializedName("created_at")
    val createdAt: String,
    
    @SerializedName("sender_profile")
    val senderProfile: User? = null
)

data class Conversation(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("participant_ids")
    val participantIds: List<String>,
    
    @SerializedName("last_message")
    val lastMessage: String? = null,
    
    @SerializedName("last_message_at")
    val lastMessageAt: String? = null,
    
    @SerializedName("unread_count")
    val unreadCount: Int = 0,
    
    @SerializedName("created_at")
    val createdAt: String,
    
    @SerializedName("other_participant")
    val otherParticipant: User? = null
)

data class SendMessageRequest(
    @SerializedName("conversation_id")
    val conversationId: String,
    
    @SerializedName("content")
    val content: String,
    
    @SerializedName("image_url")
    val imageUrl: String? = null
)
