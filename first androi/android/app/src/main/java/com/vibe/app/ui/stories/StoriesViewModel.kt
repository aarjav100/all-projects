package com.vibe.app.ui.stories

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.vibe.app.data.model.Story
import com.vibe.app.data.repository.StoryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class StoriesUiState(
    val stories: List<Story> = emptyList(),
    val groupedStories: List<List<Story>> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class StoriesViewModel @Inject constructor(
    private val storyRepository: StoryRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(StoriesUiState())
    val uiState: StateFlow<StoriesUiState> = _uiState.asStateFlow()

    init {
        loadStories()
    }

    fun loadStories() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)

            val result = storyRepository.getStories()

            result.fold(
                onSuccess = { stories ->
                    // Group stories by user
                    val grouped = stories.groupBy { it.userId }
                        .values
                        .toList()
                        .sortedByDescending { group ->
                            group.any { !it.isViewed }
                        }

                    _uiState.value = _uiState.value.copy(
                        stories = stories,
                        groupedStories = grouped,
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

    fun markAsViewed(storyId: String) {
        viewModelScope.launch {
            storyRepository.markAsViewed(storyId)
            // Update local state
            val updatedStories = _uiState.value.stories.map { story ->
                if (story.id == storyId) story.copy(isViewed = true) else story
            }
            val grouped = updatedStories.groupBy { it.userId }
                .values
                .toList()
            
            _uiState.value = _uiState.value.copy(
                stories = updatedStories,
                groupedStories = grouped
            )
        }
    }
}
