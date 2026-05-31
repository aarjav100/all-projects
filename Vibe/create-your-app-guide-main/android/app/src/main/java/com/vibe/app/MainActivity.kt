package com.vibe.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.vibe.app.data.local.TokenManager
import com.vibe.app.navigation.NavGraph
import com.vibe.app.navigation.Screen
import com.vibe.app.ui.theme.VibeAndroidTheme
import kotlinx.coroutines.launch

/**
 * MainActivity
 * Entry point for the Android app
 * Replaces React's main.tsx and App.tsx
 */
class MainActivity : ComponentActivity() {
    
    private lateinit var tokenManager: TokenManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        tokenManager = TokenManager(applicationContext)
        
        setContent {
            VibeAndroidTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    VibeApp(tokenManager)
                }
            }
        }
    }
}

/**
 * Main App Composable
 * Replaces React's App component with BrowserRouter
 */
@Composable
fun VibeApp(tokenManager: TokenManager) {
    val navController = rememberNavController()
    val scope = rememberCoroutineScope()
    
    // Determine start destination based on auth state
    var startDestination by remember { mutableStateOf<String?>(null) }
    
    LaunchedEffect(Unit) {
        scope.launch {
            val isLoggedIn = tokenManager.isLoggedIn()
            startDestination = if (isLoggedIn) {
                Screen.Feed.route
            } else {
                Screen.Auth.route
            }
        }
    }
    
    // Wait for start destination to be determined
    startDestination?.let { destination ->
        NavGraph(
            navController = navController,
            tokenManager = tokenManager,
            startDestination = destination
        )
    }
}
