package com.vibe.app.ui.feed

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.vibe.app.data.model.Post
import com.vibe.app.data.model.PostIntent
import com.vibe.app.data.model.TrustBadgeLevel
import com.vibe.app.ui.theme.*
import java.time.Instant
import java.time.temporal.ChronoUnit

@Composable
fun PostCard(
    post: Post,
    onLike: () -> Unit,
    onSave: () -> Unit,
    onRepost: () -> Unit,
    onClick: () -> Unit,
    onUserClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var showRepostDialog by remember { mutableStateOf(false) }
    
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = DarkCardBackground),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Repost header
            if (post.isRepost && post.repostedBy != null) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.Repeat,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = TextMuted
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "${post.repostedBy.displayName ?: post.repostedBy.username} reposted",
                        style = MaterialTheme.typography.labelSmall,
                        color = TextMuted
                    )
                }
            }

            // User info row
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Avatar
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .clickable { post.profile?.username?.let { onUserClick(it) } }
                ) {
                    if (post.profile?.avatarUrl != null) {
                        AsyncImage(
                            model = post.profile.avatarUrl,
                            contentDescription = "Avatar",
                            modifier = Modifier.fillMaxSize(),
                            contentScale = ContentScale.Crop
                        )
                    } else {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(
                                    Brush.linearGradient(
                                        listOf(AccentPurple, AccentPink)
                                    )
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = (post.profile?.displayName ?: post.profile?.username ?: "U")
                                    .take(1).uppercase(),
                                color = Color.White,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = post.profile?.displayName ?: post.profile?.username ?: "Unknown",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.SemiBold,
                            color = TextPrimary
                        )
                        
                        // Trust badge
                        post.profile?.trustBadge?.let { badge ->
                            if (badge != TrustBadgeLevel.NONE) {
                                Spacer(modifier = Modifier.width(4.dp))
                                TrustBadgeIcon(badge)
                            }
                        }
                    }
                    
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "@${post.profile?.username ?: "user"}",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextMuted
                        )
                        Text(
                            text = " · ${formatTimeAgo(post.createdAt)}",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextMuted
                        )
                    }
                }

                // Intent badge
                post.intent?.let { intent ->
                    IntentBadge(intent)
                }

                IconButton(onClick = { /* More options */ }) {
                    Icon(
                        Icons.Default.MoreHoriz,
                        contentDescription = "More",
                        tint = TextMuted
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Content
            post.content?.let { content ->
                Text(
                    text = content,
                    style = MaterialTheme.typography.bodyLarge,
                    color = TextPrimary,
                    maxLines = 10,
                    overflow = TextOverflow.Ellipsis
                )
            }

            // Media
            post.mediaUrl?.let { mediaUrl ->
                Spacer(modifier = Modifier.height(12.dp))
                AsyncImage(
                    model = mediaUrl,
                    contentDescription = "Post media",
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 400.dp)
                        .clip(RoundedCornerShape(12.dp)),
                    contentScale = ContentScale.Crop
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Action buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Like button
                ActionButton(
                    icon = if (post.isLiked) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                    count = post.likesCount,
                    isActive = post.isLiked,
                    activeColor = AccentRed,
                    onClick = onLike
                )

                // Comment button
                ActionButton(
                    icon = Icons.Outlined.ChatBubbleOutline,
                    count = post.commentsCount,
                    onClick = onClick
                )

                // Repost button
                ActionButton(
                    icon = Icons.Default.Repeat,
                    count = post.repostsCount,
                    isActive = post.isReposted,
                    activeColor = AccentGreen,
                    onClick = { showRepostDialog = true }
                )

                // Save button
                ActionButton(
                    icon = if (post.isSaved) Icons.Filled.Bookmark else Icons.Outlined.BookmarkBorder,
                    isActive = post.isSaved,
                    activeColor = AccentBlue,
                    onClick = onSave
                )

                // Share button
                ActionButton(
                    icon = Icons.Outlined.Share,
                    onClick = { /* Share */ }
                )
            }
        }
    }

    // Repost dialog
    if (showRepostDialog) {
        AlertDialog(
            onDismissRequest = { showRepostDialog = false },
            title = { Text("Repost") },
            text = { Text("Share this post with your followers?") },
            confirmButton = {
                TextButton(
                    onClick = {
                        onRepost()
                        showRepostDialog = false
                    }
                ) {
                    Text("Repost", color = AccentPurple)
                }
            },
            dismissButton = {
                TextButton(onClick = { showRepostDialog = false }) {
                    Text("Cancel", color = TextMuted)
                }
            },
            containerColor = DarkSurface
        )
    }
}

@Composable
private fun ActionButton(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    count: Int? = null,
    isActive: Boolean = false,
    activeColor: Color = AccentPurple,
    onClick: () -> Unit
) {
    val animatedScale by animateFloatAsState(
        targetValue = if (isActive) 1.1f else 1f,
        animationSpec = spring(),
        label = "scale"
    )
    val animatedColor by animateColorAsState(
        targetValue = if (isActive) activeColor else TextMuted,
        label = "color"
    )

    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .clickable(onClick = onClick)
            .padding(8.dp)
    ) {
        Icon(
            icon,
            contentDescription = null,
            modifier = Modifier
                .size(22.dp)
                .scale(animatedScale),
            tint = animatedColor
        )
        if (count != null && count > 0) {
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = formatCount(count),
                style = MaterialTheme.typography.labelMedium,
                color = animatedColor
            )
        }
    }
}

@Composable
private fun TrustBadgeIcon(level: TrustBadgeLevel) {
    val (icon, color) = when (level) {
        TrustBadgeLevel.NEWCOMER -> Icons.Default.StarOutline to TrustNewcomer
        TrustBadgeLevel.CONTRIBUTOR -> Icons.Default.StarHalf to TrustContributor
        TrustBadgeLevel.TRUSTED -> Icons.Default.Star to TrustTrusted
        TrustBadgeLevel.VERIFIED -> Icons.Default.Verified to TrustVerified
        TrustBadgeLevel.CHAMPION -> Icons.Default.EmojiEvents to TrustChampion
        else -> return
    }
    
    Icon(
        icon,
        contentDescription = level.name,
        modifier = Modifier.size(16.dp),
        tint = color
    )
}

@Composable
private fun IntentBadge(intent: PostIntent) {
    val (text, color) = when (intent) {
        PostIntent.ASK -> "Ask" to IntentAsk
        PostIntent.TEACH -> "Teach" to IntentTeach
        PostIntent.VENT -> "Vent" to IntentVent
        PostIntent.CELEBRATE -> "Celebrate" to IntentCelebrate
    }
    
    Surface(
        color = color.copy(alpha = 0.15f),
        shape = RoundedCornerShape(12.dp)
    ) {
        Text(
            text = text,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            style = MaterialTheme.typography.labelSmall,
            color = color,
            fontWeight = FontWeight.Medium
        )
    }
}

private fun formatTimeAgo(createdAt: String?): String {
    if (createdAt == null) return ""
    return try {
        val instant = Instant.parse(createdAt)
        val now = Instant.now()
        val minutes = ChronoUnit.MINUTES.between(instant, now)
        val hours = ChronoUnit.HOURS.between(instant, now)
        val days = ChronoUnit.DAYS.between(instant, now)
        
        when {
            minutes < 1 -> "now"
            minutes < 60 -> "${minutes}m"
            hours < 24 -> "${hours}h"
            days < 7 -> "${days}d"
            else -> "${days / 7}w"
        }
    } catch (e: Exception) {
        ""
    }
}

private fun formatCount(count: Int): String {
    return when {
        count >= 1_000_000 -> "${count / 1_000_000}M"
        count >= 1_000 -> "${count / 1_000}K"
        else -> count.toString()
    }
}
