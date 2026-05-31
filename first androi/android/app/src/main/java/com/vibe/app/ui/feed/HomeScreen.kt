package com.vibe.app.ui.feed

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.vibe.app.ui.components.BottomNavBar
import com.vibe.app.ui.stories.StoriesBar
import com.vibe.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onNavigateToPost: (String) -> Unit,
    onNavigateToUser: (String) -> Unit,
    onNavigateToCreate: () -> Unit,
    onNavigateToSearch: () -> Unit,
    onNavigateToNotifications: () -> Unit,
    onNavigateToProfile: () -> Unit,
    onNavigateToMessages: () -> Unit,
    viewModel: FeedViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val listState = rememberLazyListState()
    var selectedNavItem by remember { mutableIntStateOf(0) }

    // Load more when reaching end
    LaunchedEffect(listState) {
        snapshotFlow { listState.layoutInfo.visibleItemsInfo.lastOrNull()?.index }
            .collect { lastVisibleIndex ->
                if (lastVisibleIndex != null && lastVisibleIndex >= uiState.posts.size - 3) {
                    viewModel.loadMore()
                }
            }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Vibe",
                        fontWeight = FontWeight.Bold,
                        color = AccentPurple
                    )
                },
                actions = {
                    IconButton(onClick = onNavigateToMessages) {
                        Badge(containerColor = AccentPink) {
                            Icon(
                                Icons.Outlined.ChatBubbleOutline,
                                contentDescription = "Messages",
                                tint = TextPrimary
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = DarkBackground
                )
            )
        },
        bottomBar = {
            BottomNavBar(
                selectedIndex = selectedNavItem,
                onItemSelected = { index ->
                    selectedNavItem = index
                    when (index) {
                        0 -> { /* Home - already here */ }
                        1 -> onNavigateToSearch()
                        2 -> onNavigateToCreate()
                        3 -> onNavigateToNotifications()
                        4 -> onNavigateToProfile()
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onNavigateToCreate,
                containerColor = AccentPurple
            ) {
                Icon(Icons.Default.Add, contentDescription = "Create Post")
            }
        },
        containerColor = DarkBackground
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            LazyColumn(
                state = listState,
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Stories bar
                item {
                    StoriesBar(
                        onStoryClick = { /* View story */ },
                        onAddStory = { /* Add story */ }
                    )
                }

                // Feed tabs
                item {
                    FeedTabs(
                        selectedTab = uiState.selectedTab,
                        onTabSelected = viewModel::setTab
                    )
                }

                // Posts
                items(uiState.posts, key = { it.id }) { post ->
                    PostCard(
                        post = post,
                        onLike = { viewModel.toggleLike(post.id) },
                        onSave = { viewModel.toggleSave(post.id) },
                        onRepost = { viewModel.repost(post.id) },
                        onClick = { onNavigateToPost(post.id) },
                        onUserClick = onNavigateToUser,
                        modifier = Modifier.padding(horizontal = 16.dp)
                    )
                }

                // Loading more indicator
                if (uiState.isLoading && uiState.posts.isNotEmpty()) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(32.dp),
                                color = AccentPurple
                            )
                        }
                    }
                }

                // Empty state
                if (uiState.posts.isEmpty() && !uiState.isLoading) {
                    item {
                        EmptyFeedState()
                    }
                }
            }

            // Initial loading
            if (uiState.isLoading && uiState.posts.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = AccentPurple)
                }
            }
        }
    }
}

@Composable
private fun FeedTabs(
    selectedTab: FeedTab,
    onTabSelected: (FeedTab) -> Unit
) {
    TabRow(
        selectedTabIndex = if (selectedTab == FeedTab.FOR_YOU) 0 else 1,
        containerColor = DarkBackground,
        contentColor = AccentPurple,
        modifier = Modifier.padding(horizontal = 16.dp)
    ) {
        Tab(
            selected = selectedTab == FeedTab.FOR_YOU,
            onClick = { onTabSelected(FeedTab.FOR_YOU) },
            text = {
                Text(
                    "For You",
                    fontWeight = if (selectedTab == FeedTab.FOR_YOU) FontWeight.Bold else FontWeight.Normal
                )
            }
        )
        Tab(
            selected = selectedTab == FeedTab.FOLLOWING,
            onClick = { onTabSelected(FeedTab.FOLLOWING) },
            text = {
                Text(
                    "Following",
                    fontWeight = if (selectedTab == FeedTab.FOLLOWING) FontWeight.Bold else FontWeight.Normal
                )
            }
        )
    }
}

@Composable
private fun EmptyFeedState() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(48.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            Icons.Default.Camera,
            contentDescription = null,
            modifier = Modifier.size(64.dp),
            tint = TextMuted
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "No posts yet",
            style = MaterialTheme.typography.titleMedium,
            color = TextPrimary
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Follow some people or create your first post!",
            style = MaterialTheme.typography.bodyMedium,
            color = TextSecondary
        )
    }
}
