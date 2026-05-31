package com.vibe.app.data.repository

import com.vibe.app.data.api.SupabaseClient
import com.vibe.app.data.model.Message
import com.vibe.app.data.model.Profile
import com.vibe.app.data.model.Conversation
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Order
import io.github.jan.supabase.realtime.channel
import io.github.jan.supabase.realtime.postgresChangeFlow
import io.github.jan.supabase.realtime.PostgresAction
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MessageRepository @Inject constructor() {
    private val postgrest = SupabaseClient.postgrest
    private val auth = SupabaseClient.auth
    private val realtime = SupabaseClient.realtime

    suspend fun getConversations(): Result<List<Conversation>> {
        return try {
            val userId = auth.currentUserOrNull()?.id ?: throw Exception("Not authenticated")
            
            // Get all messages involving current user
            val messages = postgrest.from("messages")
                .select(Columns.raw("*, sender_profile:profiles!sender_id(*), receiver_profile:profiles!receiver_id(*)")) {
                    filter {
                        or {
                            eq("sender_id", userId)
                            eq("receiver_id", userId)
                        }
                    }
                    order("created_at", Order.DESCENDING)
                }
                .decodeList<Message>()

            // Group by conversation partner
            val conversationMap = mutableMapOf<String, Conversation>()
            for (message in messages) {
                val partnerId = if (message.senderId == userId) message.receiverId else message.senderId
                val partnerProfile = if (message.senderId == userId) message.receiverProfile else message.senderProfile
                
                if (partnerProfile != null && !conversationMap.containsKey(partnerId)) {
                    val unreadCount = messages.count { 
                        it.senderId == partnerId && it.readAt == null 
                    }
                    conversationMap[partnerId] = Conversation(
                        partnerId = partnerId,
                        partnerProfile = partnerProfile,
                        lastMessage = message,
                        unreadCount = unreadCount
                    )
                }
            }
            
            Result.success(conversationMap.values.toList())
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getMessages(partnerId: String): Result<List<Message>> {
        return try {
            val userId = auth.currentUserOrNull()?.id ?: throw Exception("Not authenticated")
            
            val messages = postgrest.from("messages")
                .select(Columns.raw("*, sender_profile:profiles!sender_id(*), receiver_profile:profiles!receiver_id(*)")) {
                    filter {
                        or {
                            and {
                                eq("sender_id", userId)
                                eq("receiver_id", partnerId)
                            }
                            and {
                                eq("sender_id", partnerId)
                                eq("receiver_id", userId)
                            }
                        }
                    }
                    order("created_at", Order.ASCENDING)
                }
                .decodeList<Message>()
            Result.success(messages)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun sendMessage(receiverId: String, content: String): Result<Message> {
        return try {
            val userId = auth.currentUserOrNull()?.id ?: throw Exception("Not authenticated")
            
            val message = postgrest.from("messages")
                .insert(mapOf(
                    "sender_id" to userId,
                    "receiver_id" to receiverId,
                    "content" to content
                )) {
                    select(Columns.raw("*, sender_profile:profiles!sender_id(*), receiver_profile:profiles!receiver_id(*)"))
                }
                .decodeSingle<Message>()
            Result.success(message)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun markAsRead(messageId: String): Result<Unit> {
        return try {
            postgrest.from("messages")
                .update(mapOf("read_at" to "now()")) {
                    filter { eq("id", messageId) }
                }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Real-time messaging can be implemented with polling or WebSocket in production
    // For now, use polling by calling getMessages periodically
    suspend fun subscribeToMessages(partnerId: String): Flow<Message> {
        return kotlinx.coroutines.flow.emptyFlow()
    }
}
