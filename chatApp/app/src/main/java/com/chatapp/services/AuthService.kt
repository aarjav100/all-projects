package com.chatapp.services

import com.chatapp.models.User
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.UserProfileChangeRequest
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.messaging.FirebaseMessaging
import kotlinx.coroutines.tasks.await

class AuthService {
    
    private val auth = FirebaseAuth.getInstance()
    private val firestore = FirebaseFirestore.getInstance()
    
    fun getCurrentUser(): FirebaseUser? = auth.currentUser
    
    fun isUserLoggedIn(): Boolean = auth.currentUser != null
    
    suspend fun loginUser(email: String, password: String): Result<FirebaseUser> {
        return try {
            val result = auth.signInWithEmailAndPassword(email, password).await()
            result.user?.let { user ->
                updateUserOnlineStatus(user.uid, true)
                Result.success(user)
            } ?: Result.failure(Exception("Login failed"))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun registerUser(email: String, password: String, fullName: String): Result<FirebaseUser> {
        return try {
            val result = auth.createUserWithEmailAndPassword(email, password).await()
            result.user?.let { user ->
                // Update user profile with display name
                val profileUpdates = UserProfileChangeRequest.Builder()
                    .setDisplayName(fullName)
                    .build()
                user.updateProfile(profileUpdates).await()
                
                // Create user document in Firestore
                createUserDocument(user, fullName)
                
                Result.success(user)
            } ?: Result.failure(Exception("Registration failed"))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun createUserDocument(firebaseUser: FirebaseUser, fullName: String) {
        try {
            val fcmToken = FirebaseMessaging.getInstance().token.await()
            
            val user = User(
                uid = firebaseUser.uid,
                name = fullName,
                email = firebaseUser.email ?: "",
                profileImageUrl = firebaseUser.photoUrl?.toString() ?: "",
                isOnline = true,
                lastSeen = System.currentTimeMillis(),
                fcmToken = fcmToken
            )
            
            firestore.collection("users")
                .document(firebaseUser.uid)
                .set(user.toMap())
                .await()
                
        } catch (e: Exception) {
            throw e
        }
    }
    
    suspend fun updateUserOnlineStatus(userId: String, isOnline: Boolean) {
        try {
            val updates = hashMapOf<String, Any>(
                "isOnline" to isOnline,
                "lastSeen" to System.currentTimeMillis()
            )
            
            firestore.collection("users")
                .document(userId)
                .update(updates)
                .await()
        } catch (e: Exception) {
            // Handle error silently
        }
    }
    
    suspend fun updateUserProfile(userId: String, name: String, profileImageUrl: String): Result<Unit> {
        return try {
            val updates = hashMapOf<String, Any>(
                "name" to name,
                "profileImageUrl" to profileImageUrl
            )
            
            firestore.collection("users")
                .document(userId)
                .update(updates)
                .await()
                
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getUserById(userId: String): Result<User> {
        return try {
            val document = firestore.collection("users")
                .document(userId)
                .get()
                .await()
                
            if (document.exists()) {
                val user = document.toObject(User::class.java)
                user?.let { Result.success(it) } ?: Result.failure(Exception("User not found"))
            } else {
                Result.failure(Exception("User not found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun searchUsers(query: String): Result<List<User>> {
        return try {
            val currentUserId = getCurrentUser()?.uid ?: ""
            
            val documents = firestore.collection("users")
                .orderBy("name")
                .startAt(query)
                .endAt(query + "\uf8ff")
                .get()
                .await()
                
            val users = documents.mapNotNull { doc ->
                doc.toObject(User::class.java)
            }.filter { it.uid != currentUserId }
            
            Result.success(users)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun signOut() {
        getCurrentUser()?.uid?.let { userId ->
            updateUserOnlineStatus(userId, false)
        }
        auth.signOut()
    }
    
    suspend fun sendPasswordResetEmail(email: String): Result<Unit> {
        return try {
            auth.sendPasswordResetEmail(email).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

