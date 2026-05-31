package com.vibe.app.data.repository

import com.vibe.app.data.api.SupabaseClient
import com.vibe.app.data.model.Story
import com.vibe.app.data.model.Profile
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Order
import io.github.jan.supabase.storage.storage
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class StoryRepository @Inject constructor() {
    private val postgrest = SupabaseClient.postgrest
    private val auth = SupabaseClient.auth
    private val storage = SupabaseClient.storage

    suspend fun getStories(): Result<List<Story>> {
        return try {
            val stories = postgrest.from("stories")
                .select(Columns.raw("*, profile:profiles(*)")) {
                    filter { gt("expires_at", "now()") }
                    order("created_at", Order.DESCENDING)
                }
                .decodeList<Story>()
            Result.success(stories)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getUserStories(userId: String): Result<List<Story>> {
        return try {
            val stories = postgrest.from("stories")
                .select(Columns.raw("*, profile:profiles(*)")) {
                    filter { 
                        eq("user_id", userId)
                        gt("expires_at", "now()")
                    }
                    order("created_at", Order.ASCENDING)
                }
                .decodeList<Story>()
            Result.success(stories)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createStory(mediaBytes: ByteArray, mediaType: String): Result<Story> {
        return try {
            val userId = auth.currentUserOrNull()?.id ?: throw Exception("Not authenticated")
            val timestamp = System.currentTimeMillis()
            val extension = if (mediaType == "video") "mp4" else "jpg"
            val fileName = "stories/${userId}_$timestamp.$extension"

            // Upload media
            val bucket = storage.from("stories")
            bucket.upload(fileName, mediaBytes)
            val mediaUrl = bucket.publicUrl(fileName)

            // Create story (expires in 24 hours)
            val story = postgrest.from("stories")
                .insert(mapOf(
                    "user_id" to userId,
                    "media_url" to mediaUrl,
                    "media_type" to mediaType,
                    "expires_at" to "now() + interval '24 hours'"
                )) {
                    select(Columns.raw("*, profile:profiles(*)"))
                }
                .decodeSingle<Story>()
            Result.success(story)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun markAsViewed(storyId: String): Result<Unit> {
        return try {
            val userId = auth.currentUserOrNull()?.id ?: throw Exception("Not authenticated")
            postgrest.from("story_views")
                .insert(mapOf(
                    "story_id" to storyId,
                    "viewer_id" to userId
                ))
            Result.success(Unit)
        } catch (e: Exception) {
            // Ignore if already viewed
            Result.success(Unit)
        }
    }

    suspend fun deleteStory(storyId: String): Result<Unit> {
        return try {
            val userId = auth.currentUserOrNull()?.id ?: throw Exception("Not authenticated")
            postgrest.from("stories")
                .delete {
                    filter {
                        eq("id", storyId)
                        eq("user_id", userId)
                    }
                }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
