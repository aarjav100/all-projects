package com.vibe.app.data.repository

import com.vibe.app.data.api.SupabaseClient
import com.vibe.app.data.model.Profile
import com.vibe.app.data.model.Follow
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.storage.storage
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ProfileRepository @Inject constructor() {
    private val postgrest = SupabaseClient.postgrest
    private val auth = SupabaseClient.auth
    private val storage = SupabaseClient.storage

    suspend fun getProfile(userId: String): Result<Profile> {
        return try {
            val profile = postgrest.from("profiles")
                .select {
                    filter { eq("user_id", userId) }
                }
                .decodeSingle<Profile>()
            Result.success(profile)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getProfileByUsername(username: String): Result<Profile> {
        return try {
            val profile = postgrest.from("profiles")
                .select {
                    filter { eq("username", username) }
                }
                .decodeSingle<Profile>()
            Result.success(profile)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateProfile(displayName: String?, bio: String?): Result<Profile> {
        return try {
            val userId = auth.currentUserOrNull()?.id ?: throw Exception("Not authenticated")
            val updates = mutableMapOf<String, Any?>()
            displayName?.let { updates["display_name"] = it }
            bio?.let { updates["bio"] = it }

            val profile = postgrest.from("profiles")
                .update(updates) {
                    filter { eq("user_id", userId) }
                    select()
                }
                .decodeSingle<Profile>()
            Result.success(profile)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun uploadAvatar(imageBytes: ByteArray): Result<String> {
        return try {
            val userId = auth.currentUserOrNull()?.id ?: throw Exception("Not authenticated")
            val fileName = "avatars/$userId.jpg"
            
            val bucket = storage.from("avatars")
            bucket.upload(fileName, imageBytes, upsert = true)
            
            val publicUrl = bucket.publicUrl(fileName)
            
            // Update profile with new avatar URL
            postgrest.from("profiles")
                .update(mapOf("avatar_url" to publicUrl)) {
                    filter { eq("user_id", userId) }
                }
            
            Result.success(publicUrl)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getFollowers(userId: String): Result<List<Profile>> {
        return try {
            val follows = postgrest.from("follows")
                .select {
                    filter { eq("following_id", userId) }
                }
                .decodeList<Follow>()
            
            val followerIds = follows.map { it.followerId }
            if (followerIds.isEmpty()) {
                return Result.success(emptyList())
            }

            val profiles = postgrest.from("profiles")
                .select {
                    filter { isIn("user_id", followerIds) }
                }
                .decodeList<Profile>()
            Result.success(profiles)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getFollowing(userId: String): Result<List<Profile>> {
        return try {
            val follows = postgrest.from("follows")
                .select {
                    filter { eq("follower_id", userId) }
                }
                .decodeList<Follow>()
            
            val followingIds = follows.map { it.followingId }
            if (followingIds.isEmpty()) {
                return Result.success(emptyList())
            }

            val profiles = postgrest.from("profiles")
                .select {
                    filter { isIn("user_id", followingIds) }
                }
                .decodeList<Profile>()
            Result.success(profiles)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun toggleFollow(targetUserId: String): Result<Boolean> {
        return try {
            val userId = auth.currentUserOrNull()?.id ?: throw Exception("Not authenticated")
            
            val existingFollow = postgrest.from("follows")
                .select {
                    filter {
                        eq("follower_id", userId)
                        eq("following_id", targetUserId)
                    }
                }
                .decodeList<Follow>()

            if (existingFollow.isEmpty()) {
                // Follow
                postgrest.from("follows")
                    .insert(mapOf(
                        "follower_id" to userId,
                        "following_id" to targetUserId
                    ))
                Result.success(true)
            } else {
                // Unfollow
                postgrest.from("follows")
                    .delete {
                        filter {
                            eq("follower_id", userId)
                            eq("following_id", targetUserId)
                        }
                    }
                Result.success(false)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun isFollowing(targetUserId: String): Result<Boolean> {
        return try {
            val userId = auth.currentUserOrNull()?.id ?: return Result.success(false)
            
            val follows = postgrest.from("follows")
                .select {
                    filter {
                        eq("follower_id", userId)
                        eq("following_id", targetUserId)
                    }
                }
                .decodeList<Follow>()
            Result.success(follows.isNotEmpty())
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getFollowersCount(userId: String): Int {
        return try {
            val follows = postgrest.from("follows")
                .select {
                    filter { eq("following_id", userId) }
                }
                .decodeList<Follow>()
            follows.size
        } catch (e: Exception) {
            0
        }
    }

    suspend fun getFollowingCount(userId: String): Int {
        return try {
            val follows = postgrest.from("follows")
                .select {
                    filter { eq("follower_id", userId) }
                }
                .decodeList<Follow>()
            follows.size
        } catch (e: Exception) {
            0
        }
    }

    suspend fun searchProfiles(query: String): Result<List<Profile>> {
        return try {
            val profiles = postgrest.from("profiles")
                .select {
                    filter { 
                        or {
                            ilike("username", "%$query%")
                            ilike("display_name", "%$query%")
                        }
                    }
                    limit(20)
                }
                .decodeList<Profile>()
            Result.success(profiles)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
