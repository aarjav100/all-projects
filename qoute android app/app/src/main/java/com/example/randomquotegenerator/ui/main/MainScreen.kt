package com.example.randomquotegenerator.ui.main

import android.app.Application
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.widget.Toast
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.path
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation3.runtime.NavKey
import com.example.randomquotegenerator.data.LocalQuoteRepository
import com.example.randomquotegenerator.data.Quote
import com.example.randomquotegenerator.theme.CardBorderDark
import com.example.randomquotegenerator.theme.CardBorderLight
import com.example.randomquotegenerator.theme.FavoriteColor
import com.example.randomquotegenerator.theme.RandomQuoteGeneratorTheme

// Custom Copy icon path drawn using standard ImageVector to keep dependencies minimal.
val ContentCopyIcon: ImageVector by lazy {
    ImageVector.Builder(
        name = "ContentCopy",
        defaultWidth = 24.dp,
        defaultHeight = 24.dp,
        viewportWidth = 24f,
        viewportHeight = 24f
    ).path(
        fill = SolidColor(Color.Black),
        pathBuilder = {
            // Draw background copy sheet
            moveTo(16f, 1f)
            lineTo(4f, 1f)
            curveTo(2.9f, 1f, 2f, 1.9f, 2f, 3f)
            lineTo(2f, 17f)
            lineTo(4f, 17f)
            lineTo(4f, 3f)
            lineTo(16f, 3f)
            lineTo(16f, 1f)
            close()
            // Draw foreground copy sheet
            moveTo(19f, 5f)
            lineTo(8f, 5f)
            curveTo(6.9f, 5f, 6f, 5.9f, 6f, 7f)
            lineTo(6f, 21f)
            curveTo(6f, 22.1f, 6.9f, 23f, 8f, 23f)
            lineTo(19f, 23f)
            curveTo(20.1f, 23f, 21f, 22.1f, 21f, 21f)
            lineTo(21f, 7f)
            curveTo(21f, 5.9f, 20.1f, 5f, 19f, 5f)
            close()
            moveTo(19f, 21f)
            lineTo(8f, 21f)
            lineTo(8f, 7f)
            lineTo(19f, 7f)
            lineTo(19f, 21f)
            close()
        }
    ).build()
}

@Composable
fun MainScreen(
    onItemClick: (NavKey) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: QuoteViewModel = viewModel {
        val context = LocalContext.current
        QuoteViewModel(
            application = context.applicationContext as Application,
            quoteRepository = LocalQuoteRepository()
        )
    }
) {
    val state by viewModel.uiState.collectAsState()
    val context = LocalContext.current

    MainScreenContent(
        quote = state.currentQuote,
        isFavorite = state.isFavorite,
        totalViewed = state.totalQuotesViewed,
        onNextClick = { viewModel.showNextQuote() },
        onFavoriteClick = { viewModel.toggleFavorite() },
        onCopyClick = { quote ->
            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val clip = ClipData.newPlainText("Quote", "\"${quote.text}\" — ${quote.author}")
            clipboard.setPrimaryClip(clip)
            Toast.makeText(context, "Quote copied to clipboard!", Toast.LENGTH_SHORT).show()
        },
        onShareClick = { quote ->
            val shareIntent = Intent().apply {
                action = Intent.ACTION_SEND
                putExtra(Intent.EXTRA_TEXT, "\"${quote.text}\" — ${quote.author}")
                type = "text/plain"
            }
            context.startActivity(Intent.createChooser(shareIntent, "Share Quote"))
        },
        modifier = modifier
    )
}

@Composable
internal fun MainScreenContent(
    quote: Quote?,
    isFavorite: Boolean,
    totalViewed: Int,
    onNextClick: () -> Unit,
    onFavoriteClick: () -> Unit,
    onCopyClick: (Quote) -> Unit,
    onShareClick: (Quote) -> Unit,
    modifier: Modifier = Modifier
) {
    val isDark = isSystemInDarkTheme()

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentAlignment = Alignment.Center
    ) {
        // Total Quotes Viewed Counter Badge (Top Center)
        Surface(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .padding(top = 24.dp),
            shape = RoundedCornerShape(16.dp),
            color = MaterialTheme.colorScheme.secondary.copy(alpha = 0.1f)
        ) {
            Text(
                text = "Quotes viewed: $totalViewed",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.secondary,
                fontWeight = FontWeight.Medium,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
            )
        }

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .fillMaxWidth()
        ) {
            // Quote Display Card with Custom Animations
            AnimatedContent(
                targetState = quote,
                transitionSpec = {
                    (fadeIn() + slideInVertically { height -> height / 3 }).togetherWith(
                        fadeOut() + slideOutVertically { height -> -height / 3 }
                    )
                },
                label = "QuoteTransition"
            ) { activeQuote ->
                if (activeQuote != null) {
                    ElevatedCard(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 32.dp),
                        shape = RoundedCornerShape(24.dp),
                        colors = CardDefaults.elevatedCardColors(
                            containerColor = MaterialTheme.colorScheme.surface
                        ),
                        elevation = CardDefaults.elevatedCardElevation(
                            defaultElevation = 8.dp
                        ),
                        border = BorderStroke(
                            1.dp,
                            if (isDark) CardBorderDark else CardBorderLight
                        )
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(28.dp)
                        ) {
                            // Large Background Quotation Mark Watermark
                            Text(
                                text = "“",
                                fontSize = 120.sp,
                                fontFamily = FontFamily.Serif,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary.copy(alpha = 0.08f),
                                modifier = Modifier
                                    .align(Alignment.TopStart)
                                    .offset(x = (-8).dp, y = (-50).dp)
                            )

                            Column(
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                // Quote text
                                Text(
                                    text = activeQuote.text,
                                    style = MaterialTheme.typography.displayMedium,
                                    color = MaterialTheme.colorScheme.onSurface,
                                    textAlign = TextAlign.Start,
                                    modifier = Modifier.fillMaxWidth()
                                )

                                Spacer(modifier = Modifier.height(16.dp))

                                // Author attribution
                                Text(
                                    text = "— ${activeQuote.author}",
                                    style = MaterialTheme.typography.labelLarge,
                                    color = MaterialTheme.colorScheme.secondary,
                                    textAlign = TextAlign.End,
                                    modifier = Modifier.fillMaxWidth()
                                )

                                Spacer(modifier = Modifier.height(24.dp))

                                // Inline Action Buttons
                                Row(
                                    horizontalArrangement = Arrangement.End,
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    // Favorite Toggle Button
                                    IconButton(
                                        onClick = onFavoriteClick,
                                        colors = IconButtonDefaults.iconButtonColors(
                                            contentColor = if (isFavorite) FavoriteColor else MaterialTheme.colorScheme.secondary
                                        )
                                    ) {
                                        Icon(
                                            imageVector = if (isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                                            contentDescription = "Favorite Quote",
                                            modifier = Modifier.size(24.dp)
                                        )
                                    }

                                    Spacer(modifier = Modifier.width(8.dp))

                                    // Copy Quote Button
                                    IconButton(
                                        onClick = { onCopyClick(activeQuote) },
                                        colors = IconButtonDefaults.iconButtonColors(
                                            contentColor = MaterialTheme.colorScheme.secondary
                                        )
                                    ) {
                                        Icon(
                                            imageVector = ContentCopyIcon,
                                            contentDescription = "Copy Quote",
                                            modifier = Modifier.size(22.dp)
                                        )
                                    }

                                    Spacer(modifier = Modifier.width(8.dp))

                                    // Share Quote Button
                                    IconButton(
                                        onClick = { onShareClick(activeQuote) },
                                        colors = IconButtonDefaults.iconButtonColors(
                                            contentColor = MaterialTheme.colorScheme.secondary
                                        )
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Share,
                                            contentDescription = "Share Quote",
                                            modifier = Modifier.size(22.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // Fallback placeholder during loading (though state is instant)
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Loading inspiring thoughts...",
                            style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.secondary
                        )
                    }
                }
            }

            // Prominent "New Quote" button
            Button(
                onClick = onNextClick,
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = MaterialTheme.colorScheme.onPrimary
                ),
                elevation = ButtonDefaults.buttonElevation(
                    defaultElevation = 2.dp,
                    pressedElevation = 6.dp
                ),
                modifier = Modifier
                    .padding(top = 16.dp)
                    .height(56.dp)
                    .fillMaxWidth(0.6f)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = "Next Icon",
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "NEW QUOTE",
                        style = MaterialTheme.typography.labelMedium
                    )
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun MainScreenPreview() {
    RandomQuoteGeneratorTheme {
        MainScreenContent(
            quote = Quote("The only way to do great work is to love what you do.", "Steve Jobs"),
            isFavorite = true,
            totalViewed = 5,
            onNextClick = {},
            onFavoriteClick = {},
            onCopyClick = {},
            onShareClick = {}
        )
    }
}
