package com.vibe.app.data.repository

import com.vibe.app.data.api.SupabaseApiService
import com.vibe.app.data.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

/**
 * Post Repository
 * Handles all post-related operations
 * Converts React Query hooks to repository pattern
 */
class PostRepository(
    private val api: SupabaseApiService
) {
    
    /**
     * Get feed posts
     * React: const { data: posts } = useQuery(['posts'], () => supabase.from('posts').select())
     */
    fun getPosts(limit: Int = 20, offset: Int = 0): Flow<Result<List<Post>>> = flow {
        try {
            val response = api.getPosts(limit = limit, offset = offset)
            if (response.isSuccessful && response.body() != null) {
                emit(Result.success(response.body()!!))
            } else {
                emit(Result.failure(Exception(response.message() ?: "Failed to fetch posts")))
            }
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
    
    /**
     * Get single post by ID
     */
    suspend fun getPostById(postId: String): Result<Post> {
        return try {
            val response = api.getPostById(postId)
            if (response.isSuccessful && response.body()?.isNotEmpty() == true) {
                Result.success(response.body()!!.first())
            } else {
                Result.failure(Exception("Post not found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Create new post
     * React: await supabase.from('posts').insert({ content, image_url })
     */
    suspend fun createPost(
        content: String,
        imageUrl: String? = null,
        videoUrl: String? = null,
        communityId: String? = null
    ): Result<Post> {
        return try {
            val request = CreatePostRequest(content, imageUrl, videoUrl, communityId)
            val response = api.createPost(request)
            
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(response.message() ?: "Failed to create post"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Delete post
     */
    suspend fun deletePost(postId: String): Result<Unit> {
        return try {
            val response = api.deletePost(postId)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to delete post"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Like post
     */
    suspend fun likePost(postId: String, userId: String): Result<Unit> {
        return try {
            val request = mapOf("post_id" to postId, "user_id" to userId)
            val response = api.likePost(request)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to like post"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Unlike post
     */
    suspend fun unlikePost(postId: String, userId: String): Result<Unit> {
        return try {
            val response = api.unlikePost(postId, userId)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to unlike post"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Get comments for a post
     */
    suspend fun getComments(postId: String): Result<List<Comment>> {
        return try {
            val response = api.getComments(postId)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch comments"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    /**
     * Create comment
     */
    suspend fun createComment(postId: String, content: String): Result<Comment> {
        return try {
            val request = CreateCommentRequest(postId, content)
            val response = api.createComment(request)
            
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to create comment"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
