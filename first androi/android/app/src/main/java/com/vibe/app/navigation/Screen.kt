package com.vibe.app.navigation

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Auth : Screen("auth")
    object Home : Screen("home")
    object Search : Screen("search")
    object CreatePost : Screen("create")
    object Notifications : Screen("notifications")
    object Profile : Screen("profile")
    object Settings : Screen("settings")
    object Messages : Screen("messages")
    object Communities : Screen("communities")
    
    // Screens with arguments
    object UserProfile : Screen("user/{username}") {
        fun createRoute(username: String) = "user/$username"
    }
    
    object PostDetail : Screen("post/{postId}") {
        fun createRoute(postId: String) = "post/$postId"
    }
    
    object Chat : Screen("chat/{partnerId}") {
        fun createRoute(partnerId: String) = "chat/$partnerId"
    }
    
    object CommunityDetail : Screen("community/{id}") {
        fun createRoute(id: String) = "community/$id"
    }
    
    object TopicDetail : Screen("topic/{id}") {
        fun createRoute(id: String) = "topic/$id"
    }
}
