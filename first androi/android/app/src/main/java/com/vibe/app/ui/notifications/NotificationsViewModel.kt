package com.vibe.app.ui.notifications

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.vibe.app.data.api.SupabaseClient
import com.vibe.app.data.model.Notification
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Order
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class NotificationsUiState(
    val notifications: List<Notification> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class NotificationsViewModel @Inject constructor() : ViewModel() {

    private val _uiState = MutableStateFlow(NotificationsUiState())
    val uiState: StateFlow<NotificationsUiState> = _uiState.asStateFlow()

    private val postgrest = SupabaseClient.postgrest
    private val auth = SupabaseClient.auth

    init {
        loadNotifications()
    }

    fun loadNotifications() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)

            try {
                val userId = auth.currentUserOrNull()?.id
                if (userId == null) {
                    _uiState.value = _uiState.value.copy(isLoading = false)
                    return@launch
                }

                val notifications = postgrest.from("notifications")
                    .select(Columns.raw("*, actor_profile:profiles!actor_id(*)")) {
                        filter { eq("user_id", userId) }
                        order("created_at", Order.DESCENDING)
                        limit(50)
                    }
                    .decodeList<Notification>()

                _uiState.value = _uiState.value.copy(
                    notifications = notifications,
                    isLoading = false
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }

    fun markAsRead(notificationId: String) {
        viewModelScope.launch {
            try {
                postgrest.from("notifications")
                    .update(mapOf("read" to true)) {
                        filter { eq("id", notificationId) }
                    }
                
                val updated = _uiState.value.notifications.map {
                    if (it.id == notificationId) it.copy(read = true) else it
                }
                _uiState.value = _uiState.value.copy(notifications = updated)
            } catch (e: Exception) {
                // Handle error silently
            }
        }
    }
}
