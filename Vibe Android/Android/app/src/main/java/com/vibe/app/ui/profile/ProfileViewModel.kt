package com.vibe.app.ui.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.vibe.app.data.model.Post
import com.vibe.app.data.model.Profile
import com.vibe.app.data.repository.AuthRepository
import com.vibe.app.data.repository.PostRepository
import com.vibe.app.data.repository.ProfileRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ProfileUiState(
    val profile: Profile? = null,
    val posts: List<Post> = emptyList(),
    val followersCount: Int = 0,
    val followingCount: Int = 0,
    val postsCount: Int = 0,
    val isLoading: Boolean = false,
    val isOwnProfile: Boolean = false,
    val isFollowing: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val profileRepository: ProfileRepository,
    private val postRepository: PostRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ProfileUiState())
    val uiState: StateFlow<ProfileUiState> = _uiState.asStateFlow()

    fun loadOwnProfile() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)

            val result = authRepository.getCurrentProfile()
            val profile = result.getOrNull()
            if (profile != null) {
                loadProfileData(profile.userId, isOwnProfile = true)
            } else {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = result.exceptionOrNull()?.message ?: "Failed to load profile"
                )
            }
        }
    }

    fun loadUserProfile(username: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)

            val result = profileRepository.getProfileByUsername(username)
            result.fold(
                onSuccess = { profile ->
                    loadProfileData(profile.userId, isOwnProfile = false)
                },
                onFailure = { e ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = e.message
                    )
                }
            )
        }
    }

    private suspend fun loadProfileData(userId: String, isOwnProfile: Boolean) {
        val profileResult = profileRepository.getProfile(userId)
        val postsResult = postRepository.getUserPosts(userId)
        val followersCount = profileRepository.getFollowersCount(userId)
        val followingCount = profileRepository.getFollowingCount(userId)
        val isFollowing = if (!isOwnProfile) {
            profileRepository.isFollowing(userId).getOrDefault(false)
        } else false

        profileResult.fold(
            onSuccess = { profile ->
                _uiState.value = _uiState.value.copy(
                    profile = profile,
                    posts = postsResult.getOrDefault(emptyList()),
                    followersCount = followersCount,
                    followingCount = followingCount,
                    postsCount = postsResult.getOrDefault(emptyList()).size,
                    isLoading = false,
                    isOwnProfile = isOwnProfile,
                    isFollowing = isFollowing
                )
            },
            onFailure = { e ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        )
    }

    fun toggleFollow() {
        val userId = _uiState.value.profile?.userId ?: return
        
        viewModelScope.launch {
            val result = profileRepository.toggleFollow(userId)
            result.fold(
                onSuccess = { isFollowing ->
                    _uiState.value = _uiState.value.copy(
                        isFollowing = isFollowing,
                        followersCount = if (isFollowing) {
                            _uiState.value.followersCount + 1
                        } else {
                            _uiState.value.followersCount - 1
                        }
                    )
                },
                onFailure = { /* Handle error */ }
            )
        }
    }

    fun uploadAvatar(imageBytes: ByteArray) {
        viewModelScope.launch {
            val result = profileRepository.uploadAvatar(imageBytes)
            result.fold(
                onSuccess = { avatarUrl ->
                    _uiState.value = _uiState.value.copy(
                        profile = _uiState.value.profile?.copy(avatarUrl = avatarUrl)
                    )
                },
                onFailure = { /* Handle error */ }
            )
        }
    }

    fun signOut() {
        viewModelScope.launch {
            authRepository.signOut()
        }
    }
}
