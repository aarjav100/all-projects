package com.vibe.app.ui.stories

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.vibe.app.data.model.Story
import com.vibe.app.ui.theme.*

@Composable
fun StoriesBar(
    onStoryClick: (Story) -> Unit,
    onAddStory: () -> Unit,
    viewModel: StoriesViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LazyRow(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Add story button
        item {
            AddStoryButton(onClick = onAddStory)
        }

        // Stories grouped by user
        items(uiState.groupedStories) { userStories ->
            StoryAvatar(
                stories = userStories,
                onClick = { onStoryClick(userStories.first()) }
            )
        }
    }
}

@Composable
private fun AddStoryButton(onClick: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.width(72.dp)
    ) {
        Box(
            modifier = Modifier
                .size(68.dp)
                .clip(CircleShape)
                .background(DarkSurfaceVariant)
                .clickable(onClick = onClick),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .size(60.dp)
                    .clip(CircleShape)
                    .background(DarkCardBackground),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.Add,
                    contentDescription = "Add Story",
                    tint = AccentPurple,
                    modifier = Modifier.size(28.dp)
                )
            }
        }
        
        Spacer(modifier = Modifier.height(4.dp))
        
        Text(
            text = "Your story",
            style = MaterialTheme.typography.labelSmall,
            color = TextSecondary,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
private fun StoryAvatar(
    stories: List<Story>,
    onClick: () -> Unit
) {
    val story = stories.first()
    val hasUnviewed = stories.any { !it.isViewed }

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.width(72.dp)
    ) {
        Box(
            modifier = Modifier
                .size(68.dp)
                .then(
                    if (hasUnviewed) {
                        Modifier.background(
                            Brush.linearGradient(
                                listOf(
                                    StoryGradientStart,
                                    StoryGradientMiddle,
                                    StoryGradientEnd
                                )
                            ),
                            CircleShape
                        )
                    } else {
                        Modifier.border(2.dp, TextMuted, CircleShape)
                    }
                )
                .padding(3.dp)
                .clip(CircleShape)
                .clickable(onClick = onClick),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .clip(CircleShape)
                    .background(DarkBackground)
                    .padding(2.dp)
            ) {
                if (story.profile?.avatarUrl != null) {
                    AsyncImage(
                        model = story.profile.avatarUrl,
                        contentDescription = "Story avatar",
                        modifier = Modifier
                            .fillMaxSize()
                            .clip(CircleShape),
                        contentScale = ContentScale.Crop
                    )
                } else {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.linearGradient(listOf(AccentPurple, AccentPink)),
                                CircleShape
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = (story.profile?.displayName ?: story.profile?.username ?: "U")
                                .take(1).uppercase(),
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            style = MaterialTheme.typography.titleMedium
                        )
                    }
                }
            }
        }
        
        Spacer(modifier = Modifier.height(4.dp))
        
        Text(
            text = story.profile?.displayName ?: story.profile?.username ?: "User",
            style = MaterialTheme.typography.labelSmall,
            color = if (hasUnviewed) TextPrimary else TextSecondary,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            textAlign = TextAlign.Center,
            fontWeight = if (hasUnviewed) FontWeight.Medium else FontWeight.Normal
        )
    }
}
