package com.vibe.app.ui.messages

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.vibe.app.data.model.Conversation
import com.vibe.app.data.model.Message
import com.vibe.app.data.repository.MessageRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class MessagesUiState(
    val conversations: List<Conversation> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

data class ChatUiState(
    val messages: List<Message> = emptyList(),
    val partnerName: String = "",
    val partnerAvatar: String? = null,
    val isLoading: Boolean = false,
    val isSending: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class MessagesViewModel @Inject constructor(
    private val messageRepository: MessageRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(MessagesUiState())
    val uiState: StateFlow<MessagesUiState> = _uiState.asStateFlow()

    private val _chatState = MutableStateFlow(ChatUiState())
    val chatState: StateFlow<ChatUiState> = _chatState.asStateFlow()

    private val _messageText = MutableStateFlow("")
    val messageText: StateFlow<String> = _messageText.asStateFlow()

    init {
        loadConversations()
    }

    fun loadConversations() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)

            val result = messageRepository.getConversations()

            result.fold(
                onSuccess = { conversations ->
                    _uiState.value = _uiState.value.copy(
                        conversations = conversations,
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

    fun loadChat(partnerId: String) {
        viewModelScope.launch {
            _chatState.value = _chatState.value.copy(isLoading = true)

            val result = messageRepository.getMessages(partnerId)

            result.fold(
                onSuccess = { messages ->
                    val partner = messages.firstOrNull()?.let {
                        if (it.senderId == partnerId) it.senderProfile else it.receiverProfile
                    }
                    _chatState.value = _chatState.value.copy(
                        messages = messages,
                        partnerName = partner?.displayName ?: partner?.username ?: "User",
                        partnerAvatar = partner?.avatarUrl,
                        isLoading = false
                    )
                },
                onFailure = { e ->
                    _chatState.value = _chatState.value.copy(
                        isLoading = false,
                        error = e.message
                    )
                }
            )
        }
    }

    fun updateMessageText(text: String) {
        _messageText.value = text
    }

    fun sendMessage(partnerId: String) {
        val content = _messageText.value.trim()
        if (content.isEmpty()) return

        viewModelScope.launch {
            _chatState.value = _chatState.value.copy(isSending = true)

            val result = messageRepository.sendMessage(partnerId, content)

            result.fold(
                onSuccess = { message ->
                    _messageText.value = ""
                    _chatState.value = _chatState.value.copy(
                        messages = _chatState.value.messages + message,
                        isSending = false
                    )
                },
                onFailure = { e ->
                    _chatState.value = _chatState.value.copy(
                        isSending = false,
                        error = e.message
                    )
                }
            )
        }
    }
}
