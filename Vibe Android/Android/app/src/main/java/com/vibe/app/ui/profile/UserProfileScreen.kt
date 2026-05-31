package com.vibe.app.ui.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Chat
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.vibe.app.data.model.Post
import com.vibe.app.data.model.TrustBadgeLevel
import com.vibe.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserProfileScreen(
    username: String,
    onBack: () -> Unit,
    onNavigateToPost: (String) -> Unit,
    onNavigateToChat: (String) -> Unit,
    viewModel: ProfileViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(username) {
        viewModel.loadUserProfile(username)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = username,
                        fontWeight = FontWeight.Bold
                    )
                },
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
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                // Profile header
                UserProfileHeader(uiState = uiState)

                Spacer(modifier = Modifier.height(16.dp))

                // Action buttons
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Button(
                        onClick = { viewModel.toggleFollow() },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (uiState.isFollowing) DarkSurfaceVariant else AccentPurple
                        ),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            if (uiState.isFollowing) "Following" else "Follow",
                            color = if (uiState.isFollowing) TextPrimary else Color.White
                        )
                    }
                    
                    OutlinedButton(
                        onClick = {
                            uiState.profile?.userId?.let { onNavigateToChat(it) }
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(
                            Icons.AutoMirrored.Filled.Chat,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Message")
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Posts grid
                UserPostsGrid(
                    posts = uiState.posts,
                    onPostClick = onNavigateToPost
                )
            }
        }
    }
}

@Composable
private fun UserProfileHeader(uiState: ProfileUiState) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Avatar
        if (uiState.profile?.avatarUrl != null) {
            AsyncImage(
                model = uiState.profile.avatarUrl,
                contentDescription = "Profile picture",
                modifier = Modifier
                    .size(100.dp)
                    .clip(CircleShape),
                contentScale = ContentScale.Crop
            )
        } else {
            Box(
                modifier = Modifier
                    .size(100.dp)
                    .background(
                        Brush.linearGradient(listOf(AccentPurple, AccentPink)),
                        CircleShape
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = (uiState.profile?.displayName ?: uiState.profile?.username ?: "U")
                        .take(1).uppercase(),
                    style = MaterialTheme.typography.displaySmall,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Name and badge
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = uiState.profile?.displayName ?: uiState.profile?.username ?: "Unknown",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )

            uiState.profile?.trustBadge?.let { badge ->
                if (badge != TrustBadgeLevel.NONE) {
                    Spacer(modifier = Modifier.width(8.dp))
                    val color = when (badge) {
                        TrustBadgeLevel.NEWCOMER -> TrustNewcomer
                        TrustBadgeLevel.CONTRIBUTOR -> TrustContributor
                        TrustBadgeLevel.TRUSTED -> TrustTrusted
                        TrustBadgeLevel.VERIFIED -> TrustVerified
                        TrustBadgeLevel.CHAMPION -> TrustChampion
                        else -> TextMuted
                    }
                    Icon(
                        Icons.Default.Verified,
                        contentDescription = badge.name,
                        modifier = Modifier.size(20.dp),
                        tint = color
                    )
                }
            }
        }

        Text(
            text = "@${uiState.profile?.username ?: "user"}",
            style = MaterialTheme.typography.bodyMedium,
            color = TextMuted
        )

        // Bio
        uiState.profile?.bio?.let { bio ->
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = bio,
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = 32.dp)
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Stats
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            StatItem(count = uiState.postsCount, label = "Posts")
            StatItem(count = uiState.followersCount, label = "Followers")
            StatItem(count = uiState.followingCount, label = "Following")
        }
    }
}

@Composable
private fun StatItem(count: Int, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = formatCount(count),
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = TextPrimary
        )
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = TextMuted
        )
    }
}

@Composable
private fun UserPostsGrid(
    posts: List<Post>,
    onPostClick: (String) -> Unit
) {
    if (posts.isEmpty()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(48.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(
                    Icons.Default.GridOn,
                    contentDescription = null,
                    modifier = Modifier.size(48.dp),
                    tint = TextMuted
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "No posts yet",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextMuted
                )
            }
        }
    } else {
        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(2.dp),
            horizontalArrangement = Arrangement.spacedBy(2.dp),
            verticalArrangement = Arrangement.spacedBy(2.dp)
        ) {
            items(posts) { post ->
                Box(
                    modifier = Modifier
                        .aspectRatio(1f)
                        .clip(RoundedCornerShape(4.dp))
                        .background(DarkSurfaceVariant)
                ) {
                    if (post.mediaUrl != null) {
                        AsyncImage(
                            model = post.mediaUrl,
                            contentDescription = "Post",
                            modifier = Modifier.fillMaxSize(),
                            contentScale = ContentScale.Crop
                        )
                    } else {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = post.content?.take(30) ?: "",
                                style = MaterialTheme.typography.labelSmall,
                                color = TextSecondary,
                                textAlign = TextAlign.Center,
                                modifier = Modifier.padding(4.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

private fun formatCount(count: Int): String {
    return when {
        count >= 1_000_000 -> String.format("%.1fM", count / 1_000_000.0)
        count >= 1_000 -> String.format("%.1fK", count / 1_000.0)
        else -> count.toString()
    }
}
