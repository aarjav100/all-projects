package com.vibe.app.ui.feed

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.vibe.app.data.model.Comment
import com.vibe.app.data.model.Post
import com.vibe.app.data.repository.PostRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class PostDetailUiState(
    val post: Post? = null,
    val comments: List<Comment> = emptyList(),
    val isLoading: Boolean = false,
    val isSendingComment: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class PostDetailViewModel @Inject constructor(
    private val postRepository: PostRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(PostDetailUiState())
    val uiState: StateFlow<PostDetailUiState> = _uiState.asStateFlow()

    private val _commentText = MutableStateFlow("")
    val commentText: StateFlow<String> = _commentText.asStateFlow()

    fun loadPost(postId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)

            val postResult = postRepository.getPost(postId)
            val commentsResult = postRepository.getComments(postId)

            postResult.fold(
                onSuccess = { post ->
                    _uiState.value = _uiState.value.copy(
                        post = post,
                        comments = commentsResult.getOrDefault(emptyList()),
                        isLoading = false
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
    }

    fun updateCommentText(text: String) {
        _commentText.value = text
    }

    fun addComment(postId: String) {
        val content = _commentText.value.trim()
        if (content.isEmpty()) return

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSendingComment = true)

            val result = postRepository.addComment(postId, content)

            result.fold(
                onSuccess = { comment ->
                    _commentText.value = ""
                    _uiState.value = _uiState.value.copy(
                        comments = _uiState.value.comments + comment,
                        post = _uiState.value.post?.copy(
                            commentsCount = (_uiState.value.post?.commentsCount ?: 0) + 1
                        ),
                        isSendingComment = false
                    )
                },
                onFailure = { e ->
                    _uiState.value = _uiState.value.copy(
                        isSendingComment = false,
                        error = e.message
                    )
                }
            )
        }
    }

    fun toggleLike(postId: String) {
        viewModelScope.launch {
            val result = postRepository.toggleLike(postId)
            result.fold(
                onSuccess = { isLiked ->
                    _uiState.value = _uiState.value.copy(
                        post = _uiState.value.post?.copy(
                            isLiked = isLiked,
                            likesCount = if (isLiked) {
                                (_uiState.value.post?.likesCount ?: 0) + 1
                            } else {
                                (_uiState.value.post?.likesCount ?: 1) - 1
                            }
                        )
                    )
                },
                onFailure = { }
            )
        }
    }

    fun toggleSave(postId: String) {
        viewModelScope.launch {
            val result = postRepository.toggleSave(postId)
            result.fold(
                onSuccess = { isSaved ->
                    _uiState.value = _uiState.value.copy(
                        post = _uiState.value.post?.copy(isSaved = isSaved)
                    )
                },
                onFailure = { }
            )
        }
    }

    fun repost(postId: String) {
        viewModelScope.launch {
            val result = postRepository.repost(postId)
            result.fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        post = _uiState.value.post?.copy(
                            isReposted = true,
                            repostsCount = (_uiState.value.post?.repostsCount ?: 0) + 1
                        )
                    )
                },
                onFailure = { }
            )
        }
    }
}
