package com.vibe.app.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import androidx.navigation.NavType
import com.vibe.app.data.api.ApiClient
import com.vibe.app.data.api.AuthApiService
import com.vibe.app.data.api.SupabaseApiService
import com.vibe.app.data.local.TokenManager
import com.vibe.app.data.repository.AuthRepository
import com.vibe.app.data.repository.PostRepository
import com.vibe.app.ui.auth.AuthScreen
import com.vibe.app.ui.auth.AuthViewModel
import com.vibe.app.ui.feed.FeedScreen
import com.vibe.app.ui.feed.FeedViewModel

/**
 * Navigation Graph
 * Replaces React Router's BrowserRouter and Routes
 * 
 * React equivalent:
 * <BrowserRouter>
 *   <Routes>
 *     <Route path="/" element={<Index />} />
 *     <Route path="/auth" element={<Auth />} />
 *     ...
 *   </Routes>
 * </BrowserRouter>
 */
@Composable
fun NavGraph(
    navController: NavHostController,
    tokenManager: TokenManager,
    startDestination: String
) {
    // Create repositories (in production, use Hilt for DI)
    val authRepository = remember {
        AuthRepository(ApiClient.authApi, tokenManager)
    }
    
    val postRepository = remember {
        PostRepository(ApiClient.supabaseApi)
    }
    
    // Create ViewModels (in production, use Hilt ViewModel)
    val authViewModel = remember {
        AuthViewModel(authRepository)
    }
    
    val feedViewModel = remember {
        FeedViewModel(postRepository)
    }
    
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        // Auth Screen
        composable(Screen.Auth.route) {
            AuthScreen(
                viewModel = authViewModel,
                onAuthSuccess = {
                    navController.navigate(Screen.Feed.route) {
                        popUpTo(Screen.Auth.route) { inclusive = true }
                    }
                }
            )
        }
        
        // Feed Screen (Home)
        composable(Screen.Feed.route) {
            FeedScreen(
                viewModel = feedViewModel,
                onPostClick = { postId ->
                    navController.navigate(Screen.PostDetail.createRoute(postId))
                },
                onProfileClick = { username ->
                    navController.navigate(Screen.UserProfile.createRoute(username))
                },
                onCreatePost = {
                    navController.navigate(Screen.CreatePost.route)
                }
            )
        }
        
        // Post Detail Screen
        composable(
            route = Screen.PostDetail.route,
            arguments = listOf(navArgument("postId") { type = NavType.StringType })
        ) { backStackEntry ->
            val postId = backStackEntry.arguments?.getString("postId") ?: ""
            // TODO: Create PostDetailScreen
            // PostDetailScreen(postId = postId, navController = navController)
        }
        
        // User Profile Screen
        composable(
            route = Screen.UserProfile.route,
            arguments = listOf(navArgument("username") { type = NavType.StringType })
        ) { backStackEntry ->
            val username = backStackEntry.arguments?.getString("username") ?: ""
            // TODO: Create UserProfileScreen
            // UserProfileScreen(username = username, navController = navController)
        }
        
        // Create Post Screen
        composable(Screen.CreatePost.route) {
            // TODO: Create CreatePostScreen
            // CreatePostScreen(navController = navController)
        }
        
        // Search Screen
        composable(Screen.Search.route) {
            // TODO: Create SearchScreen
            // SearchScreen(navController = navController)
        }
        
        // Notifications Screen
        composable(Screen.Notifications.route) {
            // TODO: Create NotificationsScreen
            // NotificationsScreen(navController = navController)
        }
        
        // Messages Screen
        composable(Screen.Messages.route) {
            // TODO: Create MessagesScreen
            // MessagesScreen(navController = navController)
        }
        
        // Chat Screen
        composable(
            route = Screen.Chat.route,
            arguments = listOf(navArgument("partnerId") { type = NavType.StringType })
        ) { backStackEntry ->
            val partnerId = backStackEntry.arguments?.getString("partnerId") ?: ""
            // TODO: Create ChatScreen
            // ChatScreen(partnerId = partnerId, navController = navController)
        }
        
        // Settings Screen
        composable(Screen.Settings.route) {
            // TODO: Create SettingsScreen
            // SettingsScreen(navController = navController)
        }
        
        // Communities Screen
        composable(Screen.Communities.route) {
            // TODO: Create CommunitiesScreen
            // CommunitiesScreen(navController = navController)
        }
        
        // Community Detail Screen
        composable(
            route = Screen.CommunityDetail.route,
            arguments = listOf(navArgument("id") { type = NavType.StringType })
        ) { backStackEntry ->
            val communityId = backStackEntry.arguments?.getString("id") ?: ""
            // TODO: Create CommunityDetailScreen
            // CommunityDetailScreen(communityId = communityId, navController = navController)
        }
        
        // Profile Screen (current user)
        composable(Screen.Profile.route) {
            // TODO: Create ProfileScreen
            // ProfileScreen(navController = navController)
        }
    }
}
