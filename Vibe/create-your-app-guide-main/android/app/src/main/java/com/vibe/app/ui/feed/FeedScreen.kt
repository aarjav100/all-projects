package com.vibe.app.ui.feed

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.google.accompanist.swiperefresh.SwipeRefresh
import com.google.accompanist.swiperefresh.rememberSwipeRefreshState
import com.vibe.app.data.model.Post

/**
 * Feed Screen - Jetpack Compose
 * Converted from React Index.tsx and Feed component
 * 
 * Displays scrollable list of posts with pull-to-refresh
 */
@Composable
fun FeedScreen(
    viewModel: FeedViewModel,
    onPostClick: (String) -> Unit,
    onProfileClick: (String) -> Unit,
    onCreatePost: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Vibe") },
                actions = {
                    IconButton(onClick = onCreatePost) {
                        Icon(Icons.Default.Add, contentDescription = "Create Post")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = onCreatePost) {
                Icon(Icons.Default.Edit, contentDescription = "Create Post")
            }
        }
    ) { paddingValues ->
        SwipeRefresh(
            state = rememberSwipeRefreshState(uiState.isRefreshing),
            onRefresh = viewModel::refresh,
            modifier = Modifier.padding(paddingValues)
        ) {
            when {
                uiState.isLoading && uiState.posts.isEmpty() -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator()
                    }
                }
                uiState.error != null && uiState.posts.isEmpty() -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = uiState.error ?: "An error occurred",
                                style = MaterialTheme.typography.bodyLarge
                            )
                            Button(onClick = viewModel::loadPosts) {
                                Text("Retry")
                            }
                        }
                    }
                }
                else -> {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(vertical = 8.dp)
                    ) {
                        items(
                            items = uiState.posts,
                            key = { it.id }
                        ) { post ->
                            PostCard(
                                post = post,
                                onPostClick = { onPostClick(post.id) },
                                onProfileClick = { onProfileClick(post.userId) },
                                onLikeClick = { /* TODO: Get current user ID */ 
                                    viewModel.toggleLike(post.id, "", post.isLiked)
                                },
                                onCommentClick = { onPostClick(post.id) },
                                onShareClick = { /* TODO */ }
                            )
                            Divider()
                        }
                    }
                }
            }
        }
    }
}

/**
 * Post Card Component
 * React equivalent: PostCard component
 */
@Composable
fun PostCard(
    post: Post,
    onPostClick: () -> Unit,
    onProfileClick: () -> Unit,
    onLikeClick: () -> Unit,
    onCommentClick: () -> Unit,
    onShareClick: () -> Unit
) {
    Card(
        onClick = onPostClick,
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(12.dp)
        ) {
            // User info
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Avatar
                    AsyncImage(
                        model = post.profile?.avatarUrl,
                        contentDescription = "Profile picture",
                        modifier = Modifier.size(40.dp),
                        contentScale = ContentScale.Crop
                    )
                    
                    Column {
                        Text(
                            text = post.profile?.displayName ?: "Unknown",
                            style = MaterialTheme.typography.titleSmall
                        )
                        Text(
                            text = "@${post.profile?.username ?: "unknown"}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
                
                IconButton(onClick = { /* More options */ }) {
                    Icon(Icons.Default.MoreVert, contentDescription = "More")
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Post content
            Text(
                text = post.content,
                style = MaterialTheme.typography.bodyMedium
            )
            
            // Post image
            post.imageUrl?.let { imageUrl ->
                Spacer(modifier = Modifier.height(8.dp))
                AsyncImage(
                    model = imageUrl,
                    contentDescription = "Post image",
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 300.dp),
                    contentScale = ContentScale.Crop
                )
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Action buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                // Like button
                IconButton(onClick = onLikeClick) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = if (post.isLiked) Icons.Filled.Favorite else Icons.Default.FavoriteBorder,
                            contentDescription = "Like",
                            tint = if (post.isLiked) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurface
                        )
                        Text(text = post.likesCount.toString())
                    }
                }
                
                // Comment button
                IconButton(onClick = onCommentClick) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.Comment, contentDescription = "Comment")
                        Text(text = post.commentsCount.toString())
                    }
                }
                
                // Share button
                IconButton(onClick = onShareClick) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.Share, contentDescription = "Share")
                        Text(text = post.sharesCount.toString())
                    }
                }
            }
        }
    }
}
