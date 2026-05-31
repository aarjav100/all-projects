package com.chatapp.services

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.chatapp.ChatActivity
import com.chatapp.MainActivity
import com.chatapp.R
import com.chatapp.models.User
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await

class MyFirebaseMessagingService : FirebaseMessagingService() {
    
    companion object {
        private const val CHANNEL_ID = "chat_notifications"
        private const val NOTIFICATION_ID = 1001
    }
    
    private val firestore = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()
    
    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }
    
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        
        // Update FCM token in Firestore
        val currentUser = auth.currentUser
        if (currentUser != null) {
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    firestore.collection("users")
                        .document(currentUser.uid)
                        .update("fcmToken", token)
                        .await()
                } catch (e: Exception) {
                    // Handle error silently
                }
            }
        }
    }
    
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        
        // Handle FCM messages here
        val data = remoteMessage.data
        val senderId = data["senderId"] ?: return
        val senderName = data["senderName"] ?: "Unknown"
        val messageText = data["message"] ?: ""
        val messageType = data["messageType"] ?: "TEXT"
        
        // Don't show notification if the chat is currently open
        if (isAppInForeground() && isChatOpen(senderId)) {
            return
        }
        
        showNotification(senderId, senderName, messageText, messageType)
    }
    
    private fun showNotification(senderId: String, senderName: String, messageText: String, messageType: String) {
        val intent = if (senderId.isNotEmpty()) {
            // Create intent to open specific chat
            Intent(this, ChatActivity::class.java).apply {
                putExtra("user", User(uid = senderId, name = senderName))
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
        } else {
            // Create intent to open main activity
            Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
        }
        
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        val notificationText = when (messageType) {
            "IMAGE" -> "📷 Image"
            else -> messageText
        }
        
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_chat_logo)
            .setContentTitle(senderName)
            .setContentText(notificationText)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .build()
        
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(NOTIFICATION_ID, notification)
    }
    
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Chat Notifications",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifications for new chat messages"
                enableLights(true)
                enableVibration(true)
            }
            
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }
    
    private fun isAppInForeground(): Boolean {
        // Simple check - in a real app, you might want to use ActivityLifecycleCallbacks
        return true // Simplified for this example
    }
    
    private fun isChatOpen(senderId: String): Boolean {
        // Check if the specific chat is currently open
        // This would require maintaining app state
        return false // Simplified for this example
    }
}

