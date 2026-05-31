package com.vibe.app.ui.components

import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.vibe.app.ui.theme.*

@Composable
fun BottomNavBar(
    selectedIndex: Int,
    onItemSelected: (Int) -> Unit
) {
    NavigationBar(
        containerColor = DarkSurface,
        contentColor = TextPrimary
    ) {
        NavigationBarItem(
            selected = selectedIndex == 0,
            onClick = { onItemSelected(0) },
            icon = {
                Icon(
                    if (selectedIndex == 0) Icons.Filled.Home else Icons.Outlined.Home,
                    contentDescription = "Home",
                    modifier = Modifier.size(26.dp)
                )
            },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = AccentPurple,
                unselectedIconColor = TextMuted,
                indicatorColor = AccentPurple.copy(alpha = 0.1f)
            )
        )
        NavigationBarItem(
            selected = selectedIndex == 1,
            onClick = { onItemSelected(1) },
            icon = {
                Icon(
                    if (selectedIndex == 1) Icons.Filled.Search else Icons.Outlined.Search,
                    contentDescription = "Search",
                    modifier = Modifier.size(26.dp)
                )
            },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = AccentPurple,
                unselectedIconColor = TextMuted,
                indicatorColor = AccentPurple.copy(alpha = 0.1f)
            )
        )
        NavigationBarItem(
            selected = selectedIndex == 2,
            onClick = { onItemSelected(2) },
            icon = {
                Icon(
                    Icons.Outlined.AddBox,
                    contentDescription = "Create",
                    modifier = Modifier.size(26.dp)
                )
            },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = AccentPurple,
                unselectedIconColor = TextMuted,
                indicatorColor = AccentPurple.copy(alpha = 0.1f)
            )
        )
        NavigationBarItem(
            selected = selectedIndex == 3,
            onClick = { onItemSelected(3) },
            icon = {
                Icon(
                    if (selectedIndex == 3) Icons.Filled.Notifications else Icons.Outlined.Notifications,
                    contentDescription = "Notifications",
                    modifier = Modifier.size(26.dp)
                )
            },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = AccentPurple,
                unselectedIconColor = TextMuted,
                indicatorColor = AccentPurple.copy(alpha = 0.1f)
            )
        )
        NavigationBarItem(
            selected = selectedIndex == 4,
            onClick = { onItemSelected(4) },
            icon = {
                Icon(
                    if (selectedIndex == 4) Icons.Filled.Person else Icons.Outlined.Person,
                    contentDescription = "Profile",
                    modifier = Modifier.size(26.dp)
                )
            },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = AccentPurple,
                unselectedIconColor = TextMuted,
                indicatorColor = AccentPurple.copy(alpha = 0.1f)
            )
        )
    }
}
