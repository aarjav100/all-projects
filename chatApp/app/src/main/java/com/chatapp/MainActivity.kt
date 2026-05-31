package com.chatapp

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.chatapp.adapters.ChatAdapter
import com.chatapp.adapters.UserAdapter
import com.chatapp.databinding.ActivityMainBinding
import com.chatapp.models.Chat
import com.chatapp.models.User
import com.chatapp.services.AuthService
import com.chatapp.services.MessagingService
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private val authService = AuthService()
    private val messagingService = MessagingService()
    
    private lateinit var chatAdapter: ChatAdapter
    private lateinit var userAdapter: UserAdapter
    
    private val chats = mutableListOf<Chat>()
    private val searchResults = mutableListOf<User>()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupToolbar()
        setupRecyclerViews()
        setupSearchFunctionality()
        
        // Check authentication
        if (!authService.isUserLoggedIn()) {
            navigateToLogin()
            return
        }
        
        loadChats()
    }
    
    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.title = getString(R.string.chats)
    }
    
    private fun setupRecyclerViews() {
        // Setup chat adapter
        chatAdapter = ChatAdapter(chats) { chat ->
            openChat(chat)
        }
        binding.rvChats.apply {
            layoutManager = LinearLayoutManager(this@MainActivity)
            adapter = chatAdapter
        }
        
        // Setup user search adapter
        userAdapter = UserAdapter(searchResults) { user ->
            startChatWithUser(user)
        }
        binding.rvSearchResults.apply {
            layoutManager = LinearLayoutManager(this@MainActivity)
            adapter = userAdapter
        }
    }
    
    private fun setupSearchFunctionality() {
        binding.etSearch.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val query = s.toString().trim()
                if (query.isNotEmpty()) {
                    searchUsers(query)
                    showSearchResults(true)
                } else {
                    showSearchResults(false)
                }
            }
            
            override fun afterTextChanged(s: Editable?) {}
        })
    }
    
    private fun loadChats() {
        showLoading(true)
        
        lifecycleScope.launch {
            messagingService.getChatsFlow().collect { chatList ->
                chats.clear()
                chats.addAll(chatList)
                chatAdapter.notifyDataSetChanged()
                
                showLoading(false)
                showEmptyState(chats.isEmpty())
            }
        }
    }
    
    private fun searchUsers(query: String) {
        lifecycleScope.launch {
            authService.searchUsers(query)
                .onSuccess { users ->
                    searchResults.clear()
                    searchResults.addAll(users)
                    userAdapter.notifyDataSetChanged()
                }
                .onFailure { exception ->
                    Toast.makeText(this@MainActivity, "Search failed: ${exception.message}", Toast.LENGTH_SHORT).show()
                }
        }
    }
    
    private fun openChat(chat: Chat) {
        val currentUserId = authService.getCurrentUser()?.uid ?: return
        val otherUserId = chat.getOtherParticipant(currentUserId)
        
        if (otherUserId.isNotEmpty()) {
            // Get other user's info and start chat activity
            lifecycleScope.launch {
                authService.getUserById(otherUserId)
                    .onSuccess { user ->
                        val intent = Intent(this@MainActivity, ChatActivity::class.java).apply {
                            putExtra("user", user)
                        }
                        startActivity(intent)
                    }
                    .onFailure { exception ->
                        Toast.makeText(this@MainActivity, "Failed to load user: ${exception.message}", Toast.LENGTH_SHORT).show()
                    }
            }
        }
    }
    
    private fun startChatWithUser(user: User) {
        val intent = Intent(this, ChatActivity::class.java).apply {
            putExtra("user", user)
        }
        startActivity(intent)
        
        // Clear search
        binding.etSearch.setText("")
        showSearchResults(false)
    }
    
    private fun showSearchResults(show: Boolean) {
        binding.rvSearchResults.visibility = if (show) View.VISIBLE else View.GONE
        binding.rvChats.visibility = if (show) View.GONE else View.VISIBLE
    }
    
    private fun showLoading(show: Boolean) {
        binding.progressBar.visibility = if (show) View.VISIBLE else View.GONE
    }
    
    private fun showEmptyState(show: Boolean) {
        binding.layoutEmpty.visibility = if (show) View.VISIBLE else View.GONE
    }
    
    private fun navigateToLogin() {
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }
    
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.main_menu, menu)
        return true
    }
    
    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_profile -> {
                // TODO: Open profile activity
                true
            }
            R.id.action_logout -> {
                logout()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
    
    private fun logout() {
        lifecycleScope.launch {
            authService.signOut()
            navigateToLogin()
        }
    }
    
    override fun onResume() {
        super.onResume()
        // Update user online status
        authService.getCurrentUser()?.uid?.let { userId ->
            lifecycleScope.launch {
                authService.updateUserOnlineStatus(userId, true)
            }
        }
    }
    
    override fun onPause() {
        super.onPause()
        // Update user offline status
        authService.getCurrentUser()?.uid?.let { userId ->
            lifecycleScope.launch {
                authService.updateUserOnlineStatus(userId, false)
            }
        }
    }
}

