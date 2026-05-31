package com.vibe.app.data.api

import com.vibe.app.data.model.*
import retrofit2.Response
import retrofit2.http.*

/**
 * Supabase Database API Service
 * Converts React's supabase.from() queries to Retrofit endpoints
 */
interface SupabaseApiService {
    
    // ==================== POSTS ====================
    
    /**
     * Get feed posts
     * React: supabase.from('posts').select('*, profile:profiles(*)')
     */
    @GET("rest/v1/posts")
    suspend fun getPosts(
        @Query("select") select: String = "*,profile:profiles(*)",
        @Query("order") order: String = "created_at.desc",
        @Query("limit") limit: Int = 20,
        @Query("offset") offset: Int = 0
    ): Response<List<Post>>
    
    /**
     * Get single post by ID
     * React: supabase.from('posts').select('*').eq('id', postId).single()
     */
    @GET("rest/v1/posts")
    suspend fun getPostById(
        @Query("id") id: String,
        @Query("select") select: String = "*,profile:profiles(*)"
    ): Response<List<Post>>
    
    /**
     * Create new post
     * React: supabase.from('posts').insert({ content, image_url })
     */
    @POST("rest/v1/posts")
    suspend fun createPost(
        @Body request: CreatePostRequest
    ): Response<Post>
    
    /**
     * Update post
     * React: supabase.from('posts').update({ content }).eq('id', postId)
     */
    @PATCH("rest/v1/posts")
    suspend fun updatePost(
        @Query("id") id: String,
        @Body request: CreatePostRequest
    ): Response<Post>
    
    /**
     * Delete post
     * React: supabase.from('posts').delete().eq('id', postId)
     */
    @DELETE("rest/v1/posts")
    suspend fun deletePost(
        @Query("id") id: String
    ): Response<Unit>
    
    /**
     * Like/Unlike post
     */
    @POST("rest/v1/post_likes")
    suspend fun likePost(
        @Body request: Map<String, String>
    ): Response<Unit>
    
    @DELETE("rest/v1/post_likes")
    suspend fun unlikePost(
        @Query("post_id") postId: String,
        @Query("user_id") userId: String
    ): Response<Unit>
    
    // ==================== COMMENTS ====================
    
    /**
     * Get comments for a post
     */
    @GET("rest/v1/comments")
    suspend fun getComments(
        @Query("post_id") postId: String,
        @Query("select") select: String = "*,profile:profiles(*)",
        @Query("order") order: String = "created_at.desc"
    ): Response<List<Comment>>
    
    /**
     * Create comment
     */
    @POST("rest/v1/comments")
    suspend fun createComment(
        @Body request: CreateCommentRequest
    ): Response<Comment>
    
    // ==================== USERS / PROFILES ====================
    
    /**
     * Get user profile by ID
     * React: supabase.from('profiles').select('*').eq('id', userId).single()
     */
    @GET("rest/v1/profiles")
    suspend fun getUserProfile(
        @Query("id") id: String
    ): Response<List<User>>
    
    /**
     * Get user profile by username
     * React: supabase.from('profiles').select('*').eq('username', username).single()
     */
    @GET("rest/v1/profiles")
    suspend fun getUserByUsername(
        @Query("username") username: String
    ): Response<List<User>>
    
    /**
     * Update user profile
     * React: supabase.from('profiles').update({ display_name, bio }).eq('id', userId)
     */
    @PATCH("rest/v1/profiles")
    suspend fun updateProfile(
        @Query("id") id: String,
        @Body request: UpdateProfileRequest
    ): Response<User>
    
    /**
     * Search users
     */
    @GET("rest/v1/profiles")
    suspend fun searchUsers(
        @Query("or") searchQuery: String,
        @Query("limit") limit: Int = 20
    ): Response<List<User>>
    
    // ==================== MESSAGES ====================
    
    /**
     * Get conversations
     */
    @GET("rest/v1/conversations")
    suspend fun getConversations(
        @Query("select") select: String = "*,other_participant:profiles(*)",
        @Query("order") order: String = "last_message_at.desc"
    ): Response<List<Conversation>>
    
    /**
     * Get messages for a conversation
     */
    @GET("rest/v1/messages")
    suspend fun getMessages(
        @Query("conversation_id") conversationId: String,
        @Query("select") select: String = "*,sender_profile:profiles(*)",
        @Query("order") order: String = "created_at.asc"
    ): Response<List<Message>>
    
    /**
     * Send message
     */
    @POST("rest/v1/messages")
    suspend fun sendMessage(
        @Body request: SendMessageRequest
    ): Response<Message>
    
    /**
     * Mark messages as read
     */
    @PATCH("rest/v1/messages")
    suspend fun markAsRead(
        @Query("id") messageId: String,
        @Body request: Map<String, Boolean>
    ): Response<Unit>
    
    // ==================== COMMUNITIES ====================
    
    /**
     * Get all communities
     */
    @GET("rest/v1/communities")
    suspend fun getCommunities(
        @Query("select") select: String = "*,creator_profile:profiles(*)",
        @Query("order") order: String = "members_count.desc",
        @Query("limit") limit: Int = 20
    ): Response<List<Community>>
    
    /**
     * Get community by ID
     */
    @GET("rest/v1/communities")
    suspend fun getCommunityById(
        @Query("id") id: String,
        @Query("select") select: String = "*,creator_profile:profiles(*)"
    ): Response<List<Community>>
    
    /**
     * Create community
     */
    @POST("rest/v1/communities")
    suspend fun createCommunity(
        @Body request: CreateCommunityRequest
    ): Response<Community>
    
    /**
     * Join community
     */
    @POST("rest/v1/community_members")
    suspend fun joinCommunity(
        @Body request: Map<String, String>
    ): Response<Unit>
    
    /**
     * Leave community
     */
    @DELETE("rest/v1/community_members")
    suspend fun leaveCommunity(
        @Query("community_id") communityId: String,
        @Query("user_id") userId: String
    ): Response<Unit>
    
    /**
     * Get community posts
     */
    @GET("rest/v1/posts")
    suspend fun getCommunityPosts(
        @Query("community_id") communityId: String,
        @Query("select") select: String = "*,profile:profiles(*)",
        @Query("order") order: String = "created_at.desc"
    ): Response<List<Post>>
    
    // ==================== NOTIFICATIONS ====================
    
    /**
     * Get notifications
     */
    @GET("rest/v1/notifications")
    suspend fun getNotifications(
        @Query("user_id") userId: String,
        @Query("order") order: String = "created_at.desc",
        @Query("limit") limit: Int = 50
    ): Response<List<Map<String, Any>>>
    
    /**
     * Mark notification as read
     */
    @PATCH("rest/v1/notifications")
    suspend fun markNotificationAsRead(
        @Query("id") notificationId: String,
        @Body request: Map<String, Boolean>
    ): Response<Unit>
}
