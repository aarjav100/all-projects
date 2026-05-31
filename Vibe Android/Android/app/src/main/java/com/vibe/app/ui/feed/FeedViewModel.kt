package com.vibe.app.ui.feed

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.vibe.app.data.model.Post
import com.vibe.app.data.repository.PostRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class FeedUiState(
    val posts: List<Post> = emptyList(),
    val isLoading: Boolean = false,
    val isRefreshing: Boolean = false,
    val error: String? = null,
    val currentPage: Int = 0,
    val hasMorePosts: Boolean = true,
    val selectedTab: FeedTab = FeedTab.FOR_YOU
)

enum class FeedTab {
    FOR_YOU,
    FOLLOWING
}

@HiltViewModel
class FeedViewModel @Inject constructor(
    private val postRepository: PostRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(FeedUiState())
    val uiState: StateFlow<FeedUiState> = _uiState.asStateFlow()

    init {
        loadFeed()
    }

    fun loadFeed(refresh: Boolean = false) {
        if (_uiState.value.isLoading) return

        viewModelScope.launch {
            val page = if (refresh) 0 else _uiState.value.currentPage
            _uiState.value = _uiState.value.copy(
                isLoading = !refresh,
                isRefreshing = refresh,
                error = null
            )

            val result = postRepository.getFeed(page)
            
            result.fold(
                onSuccess = { posts ->
                    val currentPosts = if (refresh) emptyList() else _uiState.value.posts
                    _uiState.value = _uiState.value.copy(
                        posts = currentPosts + posts,
                        isLoading = false,
                        isRefreshing = false,
                        currentPage = if (refresh) 1 else page + 1,
                        hasMorePosts = posts.isNotEmpty()
                    )
                },
                onFailure = { e ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        isRefreshing = false,
                        error = e.message
                    )
                }
            )
        }
    }

    fun refresh() = loadFeed(refresh = true)

    fun loadMore() {
        if (_uiState.value.hasMorePosts && !_uiState.value.isLoading) {
            loadFeed()
        }
    }

    fun setTab(tab: FeedTab) {
        if (_uiState.value.selectedTab != tab) {
            _uiState.value = _uiState.value.copy(
                selectedTab = tab,
                posts = emptyList(),
                currentPage = 0
            )
            loadFeed()
        }
    }

    fun toggleLike(postId: String) {
        viewModelScope.launch {
            val result = postRepository.toggleLike(postId)
            result.fold(
                onSuccess = { isLiked ->
                    val updatedPosts = _uiState.value.posts.map { post ->
                        if (post.id == postId) {
                            post.copy(
                                isLiked = isLiked,
                                likesCount = if (isLiked) post.likesCount + 1 else post.likesCount - 1
                            )
                        } else post
                    }
                    _uiState.value = _uiState.value.copy(posts = updatedPosts)
                },
                onFailure = { /* Handle error */ }
            )
        }
    }

    fun toggleSave(postId: String) {
        viewModelScope.launch {
            val result = postRepository.toggleSave(postId)
            result.fold(
                onSuccess = { isSaved ->
                    val updatedPosts = _uiState.value.posts.map { post ->
                        if (post.id == postId) {
                            post.copy(isSaved = isSaved)
                        } else post
                    }
                    _uiState.value = _uiState.value.copy(posts = updatedPosts)
                },
                onFailure = { /* Handle error */ }
            )
        }
    }

    fun repost(postId: String, comment: String? = null) {
        viewModelScope.launch {
            val result = postRepository.repost(postId, comment)
            result.fold(
                onSuccess = {
                    val updatedPosts = _uiState.value.posts.map { post ->
                        if (post.id == postId) {
                            post.copy(
                                isReposted = true,
                                repostsCount = post.repostsCount + 1
                            )
                        } else post
                    }
                    _uiState.value = _uiState.value.copy(posts = updatedPosts)
                },
                onFailure = { /* Handle error */ }
            )
        }
    }
}
