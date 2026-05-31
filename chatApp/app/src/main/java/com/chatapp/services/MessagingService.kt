package com.chatapp.services

import com.chatapp.models.Chat
import com.chatapp.models.Message
import com.chatapp.models.MessageType
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ListenerRegistration
import com.google.firebase.firestore.Query
import com.google.firebase.storage.FirebaseStorage
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await
import java.util.*

class MessagingService {
    
    private val firestore = FirebaseFirestore.getInstance()
    private val storage = FirebaseStorage.getInstance()
    private val auth = FirebaseAuth.getInstance()
    
    suspend fun sendMessage(receiverId: String, messageText: String, imageUrl: String = ""): Result<String> {
        return try {
            val currentUserId = auth.currentUser?.uid ?: return Result.failure(Exception("User not authenticated"))
            
            val messageId = UUID.randomUUID().toString()
            val timestamp = System.currentTimeMillis()
            
            val message = Message(
                id = messageId,
                senderId = currentUserId,
                receiverId = receiverId,
                message = messageText,
                imageUrl = imageUrl,
                timestamp = timestamp,
                isRead = false,
                messageType = if (imageUrl.isNotEmpty()) MessageType.IMAGE else MessageType.TEXT
            )
            
            // Create chat ID (consistent ordering)
            val chatId = if (currentUserId < receiverId) {
                "${currentUserId}_${receiverId}"
            } else {
                "${receiverId}_${currentUserId}"
            }
            
            // Add message to messages collection
            firestore.collection("messages")
                .document(messageId)
                .set(message.toMap())
                .await()
            
            // Update or create chat document
            updateChatDocument(chatId, currentUserId, receiverId, messageText, timestamp)
            
            Result.success(messageId)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    private suspend fun updateChatDocument(chatId: String, senderId: String, receiverId: String, lastMessage: String, timestamp: Long) {
        try {
            val chatRef = firestore.collection("chats").document(chatId)
            val chatDoc = chatRef.get().await()
            
            if (chatDoc.exists()) {
                // Update existing chat
                val updates = hashMapOf<String, Any>(
                    "lastMessage" to lastMessage,
                    "lastMessageTime" to timestamp,
                    "lastMessageSenderId" to senderId
                )
                chatRef.update(updates).await()
            } else {
                // Create new chat
                val chat = Chat(
                    chatId = chatId,
                    participants = listOf(senderId, receiverId),
                    lastMessage = lastMessage,
                    lastMessageTime = timestamp,
                    lastMessageSenderId = senderId,
                    unreadCount = 0
                )
                chatRef.set(chat.toMap()).await()
            }
        } catch (e: Exception) {
            // Handle error silently
        }
    }
    
    fun getMessagesFlow(otherUserId: String): Flow<List<Message>> = callbackFlow {
        val currentUserId = auth.currentUser?.uid ?: return@callbackFlow
        
        val listener = firestore.collection("messages")
            .whereIn("senderId", listOf(currentUserId, otherUserId))
            .whereIn("receiverId", listOf(currentUserId, otherUserId))
            .orderBy("timestamp", Query.Direction.ASCENDING)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                
                val messages = snapshot?.documents?.mapNotNull { doc ->
                    doc.toObject(Message::class.java)
                }?.filter { message ->
                    (message.senderId == currentUserId && message.receiverId == otherUserId) ||
                    (message.senderId == otherUserId && message.receiverId == currentUserId)
                } ?: emptyList()
                
                trySend(messages)
            }
        
        awaitClose { listener.remove() }
    }
    
    fun getChatsFlow(): Flow<List<Chat>> = callbackFlow {
        val currentUserId = auth.currentUser?.uid ?: return@callbackFlow
        
        val listener = firestore.collection("chats")
            .whereArrayContains("participants", currentUserId)
            .orderBy("lastMessageTime", Query.Direction.DESCENDING)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                
                val chats = snapshot?.documents?.mapNotNull { doc ->
                    doc.toObject(Chat::class.java)
                } ?: emptyList()
                
                trySend(chats)
            }
        
        awaitClose { listener.remove() }
    }
    
    suspend fun markMessagesAsRead(otherUserId: String): Result<Unit> {
        return try {
            val currentUserId = auth.currentUser?.uid ?: return Result.failure(Exception("User not authenticated"))
            
            val unreadMessages = firestore.collection("messages")
                .whereEqualTo("senderId", otherUserId)
                .whereEqualTo("receiverId", currentUserId)
                .whereEqualTo("isRead", false)
                .get()
                .await()
            
            val batch = firestore.batch()
            unreadMessages.documents.forEach { doc ->
                batch.update(doc.reference, "isRead", true)
            }
            batch.commit().await()
            
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun uploadImage(imageUri: android.net.Uri): Result<String> {
        return try {
            val currentUserId = auth.currentUser?.uid ?: return Result.failure(Exception("User not authenticated"))
            val imageId = UUID.randomUUID().toString()
            val imageRef = storage.reference.child("chat_images/${currentUserId}/${imageId}.jpg")
            
            val uploadTask = imageRef.putFile(imageUri).await()
            val downloadUrl = uploadTask.storage.downloadUrl.await()
            
            Result.success(downloadUrl.toString())
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun deleteMessage(messageId: String): Result<Unit> {
        return try {
            firestore.collection("messages")
                .document(messageId)
                .delete()
                .await()
            
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getUnreadMessagesCount(otherUserId: String): Result<Int> {
        return try {
            val currentUserId = auth.currentUser?.uid ?: return Result.failure(Exception("User not authenticated"))
            
            val unreadMessages = firestore.collection("messages")
                .whereEqualTo("senderId", otherUserId)
                .whereEqualTo("receiverId", currentUserId)
                .whereEqualTo("isRead", false)
                .get()
                .await()
            
            Result.success(unreadMessages.size())
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

