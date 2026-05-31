package com.vibe.app.navigation

/**
 * Navigation routes
 * Replaces React Router routes from App.tsx
 */
sealed class Screen(val route: String) {
    object Auth : Screen("auth")
    object Feed : Screen("feed")
    object CreatePost : Screen("create_post")
    object PostDetail : Screen("post/{postId}") {
        fun createRoute(postId: String) = "post/$postId"
    }
    object Profile : Screen("profile")
    object UserProfile : Screen("user/{username}") {
        fun createRoute(username: String) = "user/$username"
    }
    object Search : Screen("search")
    object Notifications : Screen("notifications")
    object Messages : Screen("messages")
    object Chat : Screen("messages/{partnerId}") {
        fun createRoute(partnerId: String) = "messages/$partnerId"
    }
    object Settings : Screen("settings")
    object Communities : Screen("communities")
    object CommunityDetail : Screen("community/{id}") {
        fun createRoute(id: String) = "community/$id"
    }
    object TopicDetail : Screen("topic/{id}") {
        fun createRoute(id: String) = "topic/$id"
    }
}
