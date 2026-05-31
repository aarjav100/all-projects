package com.vibe.app.ui.notifications

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.vibe.app.data.model.Notification
import com.vibe.app.data.model.NotificationType
import com.vibe.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationsScreen(
    onBack: () -> Unit,
    onNavigateToPost: (String) -> Unit,
    onNavigateToUser: (String) -> Unit,
    viewModel: NotificationsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Notifications", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = DarkBackground,
                    titleContentColor = TextPrimary,
                    navigationIconContentColor = TextPrimary
                )
            )
        },
        containerColor = DarkBackground
    ) { paddingValues ->
        if (uiState.isLoading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(color = AccentPurple)
            }
        } else if (uiState.notifications.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Default.NotificationsNone,
                        contentDescription = null,
                        modifier = Modifier.size(64.dp),
                        tint = TextMuted
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "No notifications yet",
                        style = MaterialTheme.typography.bodyLarge,
                        color = TextMuted
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                items(uiState.notifications) { notification ->
                    NotificationItem(
                        notification = notification,
                        onUserClick = { notification.actorProfile?.username?.let { onNavigateToUser(it) } },
                        onPostClick = { notification.postId?.let { onNavigateToPost(it) } }
                    )
                }
            }
        }
    }
}

@Composable
private fun NotificationItem(
    notification: Notification,
    onUserClick: () -> Unit,
    onPostClick: () -> Unit
) {
    val (icon, color) = when (notification.type) {
        NotificationType.LIKE -> Icons.Default.Favorite to AccentRed
        NotificationType.COMMENT -> Icons.Default.ChatBubble to AccentBlue
        NotificationType.FOLLOW -> Icons.Default.PersonAdd to AccentPurple
        NotificationType.MESSAGE -> Icons.Default.Email to AccentGreen
        NotificationType.MENTION -> Icons.Default.AlternateEmail to AccentOrange
        NotificationType.REPOST -> Icons.Default.Repeat to AccentGreen
    }

    val actionText = when (notification.type) {
        NotificationType.LIKE -> "liked your post"
        NotificationType.COMMENT -> "commented on your post"
        NotificationType.FOLLOW -> "started following you"
        NotificationType.MESSAGE -> "sent you a message"
        NotificationType.MENTION -> "mentioned you"
        NotificationType.REPOST -> "reposted your post"
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(if (!notification.read) AccentPurple.copy(alpha = 0.05f) else Color.Transparent)
            .clickable { if (notification.postId != null) onPostClick() else onUserClick() }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Actor avatar
        Box(modifier = Modifier.size(48.dp)) {
            if (notification.actorProfile?.avatarUrl != null) {
                AsyncImage(
                    model = notification.actorProfile.avatarUrl,
                    contentDescription = "Avatar",
                    modifier = Modifier
                        .fillMaxSize()
                        .clip(CircleShape)
                        .clickable(onClick = onUserClick),
                    contentScale = ContentScale.Crop
                )
            } else {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.linearGradient(listOf(AccentPurple, AccentPink)),
                            CircleShape
                        )
                        .clickable(onClick = onUserClick),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = (notification.actorProfile?.displayName 
                            ?: notification.actorProfile?.username ?: "U").take(1).uppercase(),
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
            
            // Icon badge
            Box(
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .size(20.dp)
                    .background(color, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    icon,
                    contentDescription = null,
                    modifier = Modifier.size(12.dp),
                    tint = Color.White
                )
            }
        }

        Spacer(modifier = Modifier.width(16.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                buildAnnotatedString {
                    withStyle(SpanStyle(fontWeight = FontWeight.Bold, color = TextPrimary)) {
                        append(notification.actorProfile?.displayName 
                            ?: notification.actorProfile?.username ?: "Someone")
                    }
                    withStyle(SpanStyle(color = TextSecondary)) {
                        append(" $actionText")
                    }
                },
                style = MaterialTheme.typography.bodyMedium
            )
            
            Spacer(modifier = Modifier.height(4.dp))
            
            Text(
                text = formatTimeAgo(notification.createdAt),
                style = MaterialTheme.typography.labelSmall,
                color = TextMuted
            )
        }
    }
    
    Divider(color = DarkSurfaceVariant)
}

private fun formatTimeAgo(createdAt: String?): String {
    if (createdAt == null) return ""
    return try {
        val instant = java.time.Instant.parse(createdAt)
        val now = java.time.Instant.now()
        val minutes = java.time.temporal.ChronoUnit.MINUTES.between(instant, now)
        
        when {
            minutes < 1 -> "Just now"
            minutes < 60 -> "${minutes}m ago"
            minutes < 1440 -> "${minutes / 60}h ago"
            else -> "${minutes / 1440}d ago"
        }
    } catch (e: Exception) {
        ""
    }
}
