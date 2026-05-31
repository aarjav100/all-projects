package com.vibe.app.data.repository

import com.vibe.app.data.api.SupabaseClient
import com.vibe.app.data.model.Post
import com.vibe.app.data.model.Like
import com.vibe.app.data.model.SavedPost
import com.vibe.app.data.model.Repost
import com.vibe.app.data.model.Comment
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Order
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PostRepository @Inject constructor() {
    private val postgrest = SupabaseClient.postgrest
    private val auth = SupabaseClient.auth

    suspend fun getFeed(page: Int = 0, limit: Int = 15): Result<List<Post>> {
        return try {
            val offset = page * limit
            val posts = postgrest.from("posts")
                .select(Columns.raw("*, profile:profiles(*)")) {
                    order("created_at", Order.DESCENDING)
                    range(offset.toLong(), (offset + limit - 1).toLong())
                }
                .decodeList<Post>()

            // Enrich with like/save status if user is authenticated
            val userId = auth.currentUserOrNull()?.id
            if (userId != null) {
                val enrichedPosts = posts.map { post ->
                    val isLiked = checkIfLiked(userId, post.id)
                    val isSaved = checkIfSaved(userId, post.id)
                    post.copy(isLiked = isLiked, isSaved = isSaved)
                }
                Result.success(enrichedPosts)
            } else {
                Result.success(posts)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getPost(postId: String): Result<Post> {
        return try {
            val post = postgrest.from("posts")
                .select(Columns.raw("*, profile:profiles(*)")) {
                    filter { eq("id", postId) }
                }
                .decodeSingle<Post>()
            Result.success(post)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getUserPosts(userId: String): Result<List<Post>> {
        return try {
            val posts = postgrest.from("posts")
                .select(Columns.raw("*, profile:profiles(*)")) {
                    filter { eq("user_id", userId) }
                    order("created_at", Order.DESCENDING)
                }
                .decodeList<Post>()
            Result.success(posts)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createPost(content: String, mediaUrl: String? = null, mediaType: String? = null, intent: String? = null): Result<Post> {
        return try {
            val userId = auth.currentUserOrNull()?.id ?: throw Exception("Not authenticated")
            val post = postgrest.from("posts")
                .insert(mapOf(
                    "user_id" to userId,
                    "content" to content,
                    "media_url" to mediaUrl,
                    "media_type" to mediaType,
                    "intent" to intent
                )) {
                    select(Columns.raw("*, profile:profiles(*)"))
                }
                .decodeSingle<Post>()
            Result.success(post)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun toggleLike(postId: String): Result<Boolean> {
        return try {
            val userId = auth.currentUserOrNull()?.id ?: throw Exception("Not authenticated")
            val existingLike = postgrest.from("likes")
                .select {
                    filter {
                        eq("user_id", userId)
                        eq("post_id", postId)
                    }
                }
                .decodeList<Like>()

            if (existingLike.isEmpty()) {
                // Add like
                postgrest.from("likes")
                    .insert(mapOf(
                        "user_id" to userId,
                        "post_id" to postId
                    ))
                Result.success(true)
            } else {
                // Remove like
                postgrest.from("likes")
                    .delete {
                        filter {
                            eq("user_id", userId)
                            eq("post_id", postId)
                        }
                    }
                Result.success(false)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun toggleSave(postId: String): Result<Boolean> {
        return try {
            val userId = auth.currentUserOrNull()?.id ?: throw Exception("Not authenticated")
            val existingSave = postgrest.from("saved_posts")
                .select {
                    filter {
                        eq("user_id", userId)
                        eq("post_id", postId)
                    }
                }
                .decodeList<SavedPost>()

            if (existingSave.isEmpty()) {
                postgrest.from("saved_posts")
                    .insert(mapOf(
                        "user_id" to userId,
                        "post_id" to postId
                    ))
                Result.success(true)
            } else {
                postgrest.from("saved_posts")
                    .delete {
                        filter {
                            eq("user_id", userId)
                            eq("post_id", postId)
                        }
                    }
                Result.success(false)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun repost(postId: String, comment: String? = null): Result<Repost> {
        return try {
            val userId = auth.currentUserOrNull()?.id ?: throw Exception("Not authenticated")
            val repost = postgrest.from("reposts")
                .insert(mapOf(
                    "user_id" to userId,
                    "post_id" to postId,
                    "comment" to comment
                )) {
                    select()
                }
                .decodeSingle<Repost>()
            Result.success(repost)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getComments(postId: String): Result<List<Comment>> {
        return try {
            val comments = postgrest.from("comments")
                .select(Columns.raw("*, profile:profiles(*)")) {
                    filter { eq("post_id", postId) }
                    order("created_at", Order.ASCENDING)
                }
                .decodeList<Comment>()
            Result.success(comments)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun addComment(postId: String, content: String): Result<Comment> {
        return try {
            val userId = auth.currentUserOrNull()?.id ?: throw Exception("Not authenticated")
            val comment = postgrest.from("comments")
                .insert(mapOf(
                    "user_id" to userId,
                    "post_id" to postId,
                    "content" to content
                )) {
                    select(Columns.raw("*, profile:profiles(*)"))
                }
                .decodeSingle<Comment>()
            Result.success(comment)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private suspend fun checkIfLiked(userId: String, postId: String): Boolean {
        return try {
            val likes = postgrest.from("likes")
                .select {
                    filter {
                        eq("user_id", userId)
                        eq("post_id", postId)
                    }
                }
                .decodeList<Like>()
            likes.isNotEmpty()
        } catch (e: Exception) {
            false
        }
    }

    private suspend fun checkIfSaved(userId: String, postId: String): Boolean {
        return try {
            val saved = postgrest.from("saved_posts")
                .select {
                    filter {
                        eq("user_id", userId)
                        eq("post_id", postId)
                    }
                }
                .decodeList<SavedPost>()
            saved.isNotEmpty()
        } catch (e: Exception) {
            false
        }
    }
}
