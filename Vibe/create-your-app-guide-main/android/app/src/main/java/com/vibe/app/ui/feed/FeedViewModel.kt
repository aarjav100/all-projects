package com.vibe.app.ui.feed

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.vibe.app.data.model.Post
import com.vibe.app.data.repository.PostRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * FeedViewModel
 * Converts React's useState and useEffect to ViewModel with StateFlow
 * 
 * React equivalent:
 * const [posts, setPosts] = useState([])
 * const [loading, setLoading] = useState(false)
 * useEffect(() => { fetchPosts() }, [])
 */
class FeedViewModel(
    private val postRepository: PostRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(FeedUiState())
    val uiState: StateFlow<FeedUiState> = _uiState.asStateFlow()
    
    init {
        loadPosts()
    }
    
    /**
     * Load posts from repository
     * React: useEffect(() => { fetchPosts() }, [])
     */
    fun loadPosts(refresh: Boolean = false) {
        if (refresh) {
            _uiState.value = _uiState.value.copy(isRefreshing = true)
        } else {
            _uiState.value = _uiState.value.copy(isLoading = true)
        }
        
        viewModelScope.launch {
            postRepository.getPosts().collect { result ->
                result.onSuccess { posts ->
                    _uiState.value = _uiState.value.copy(
                        posts = posts,
                        isLoading = false,
                        isRefreshing = false,
                        error = null
                    )
                }.onFailure { error ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        isRefreshing = false,
                        error = error.message
                    )
                }
            }
        }
    }
    
    /**
     * Like/Unlike post
     */
    fun toggleLike(postId: String, userId: String, isLiked: Boolean) {
        viewModelScope.launch {
            val result = if (isLiked) {
                postRepository.unlikePost(postId, userId)
            } else {
                postRepository.likePost(postId, userId)
            }
            
            result.onSuccess {
                // Update local post state
                val updatedPosts = _uiState.value.posts.map { post ->
                    if (post.id == postId) {
                        post.copy(
                            isLiked = !isLiked,
                            likesCount = if (isLiked) post.likesCount - 1 else post.likesCount + 1
                        )
                    } else {
                        post
                    }
                }
                _uiState.value = _uiState.value.copy(posts = updatedPosts)
            }
        }
    }
    
    /**
     * Refresh posts (pull-to-refresh)
     */
    fun refresh() {
        loadPosts(refresh = true)
    }
}

/**
 * Feed UI State
 */
data class FeedUiState(
    val posts: List<Post> = emptyList(),
    val isLoading: Boolean = false,
    val isRefreshing: Boolean = false,
    val error: String? = null
)
