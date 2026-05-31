package com.chatapp

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.chatapp.adapters.MessageAdapter
import com.chatapp.databinding.ActivityChatBinding
import com.chatapp.models.Message
import com.chatapp.models.User
import com.chatapp.services.AuthService
import com.chatapp.services.MessagingService
import com.github.dhaval2404.imagepicker.ImagePicker
import kotlinx.coroutines.launch
import org.ocpsoft.prettytime.PrettyTime
import java.util.*

class ChatActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityChatBinding
    private val authService = AuthService()
    private val messagingService = MessagingService()
    
    private lateinit var messageAdapter: MessageAdapter
    private lateinit var otherUser: User
    private val messages = mutableListOf<Message>()
    private val prettyTime = PrettyTime()
    
    private val imagePickerLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val imageUri = result.data?.data
            imageUri?.let { uri ->
                uploadAndSendImage(uri)
            }
        }
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityChatBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // Get user from intent
        otherUser = intent.getParcelableExtra("user") ?: run {
            finish()
            return
        }
        
        setupUI()
        setupRecyclerView()
        setupClickListeners()
        loadMessages()
        markMessagesAsRead()
    }
    
    private fun setupUI() {
        binding.tvUserName.text = otherUser.name
        updateUserStatus()
        
        // Load profile image
        if (otherUser.profileImageUrl.isNotEmpty()) {
            Glide.with(this)
                .load(otherUser.profileImageUrl)
                .placeholder(R.drawable.ic_person_placeholder)
                .into(binding.ivUserProfile)
        }
    }
    
    private fun setupRecyclerView() {
        val currentUserId = authService.getCurrentUser()?.uid ?: ""
        messageAdapter = MessageAdapter(messages, currentUserId)
        
        binding.rvMessages.apply {
            layoutManager = LinearLayoutManager(this@ChatActivity).apply {
                stackFromEnd = true
            }
            adapter = messageAdapter
        }
    }
    
    private fun setupClickListeners() {
        binding.ivBack.setOnClickListener {
            finish()
        }
        
        binding.btnSend.setOnClickListener {
            sendMessage()
        }
        
        binding.ivAttach.setOnClickListener {
            selectImage()
        }
        
        binding.layoutUserInfo.setOnClickListener {
            // TODO: Open user profile
        }
    }
    
    private fun loadMessages() {
        lifecycleScope.launch {
            messagingService.getMessagesFlow(otherUser.uid).collect { messageList ->
                val oldSize = messages.size
                messages.clear()
                messages.addAll(messageList)
                
                if (oldSize == 0) {
                    messageAdapter.notifyDataSetChanged()
                } else {
                    messageAdapter.notifyItemRangeInserted(oldSize, messageList.size - oldSize)
                }
                
                // Scroll to bottom for new messages
                if (messageList.isNotEmpty()) {
                    binding.rvMessages.scrollToPosition(messageList.size - 1)
                }
            }
        }
    }
    
    private fun sendMessage() {
        val messageText = binding.etMessage.text.toString().trim()
        if (messageText.isEmpty()) return
        
        binding.etMessage.setText("")
        
        lifecycleScope.launch {
            messagingService.sendMessage(otherUser.uid, messageText)
                .onSuccess {
                    // Message sent successfully
                }
                .onFailure { exception ->
                    Toast.makeText(this@ChatActivity, "Failed to send message: ${exception.message}", Toast.LENGTH_SHORT).show()
                }
        }
    }
    
    private fun selectImage() {
        ImagePicker.with(this)
            .crop()
            .compress(1024)
            .maxResultSize(1080, 1080)
            .createIntent { intent ->
                imagePickerLauncher.launch(intent)
            }
    }
    
    private fun uploadAndSendImage(imageUri: Uri) {
        showLoading(true)
        
        lifecycleScope.launch {
            messagingService.uploadImage(imageUri)
                .onSuccess { imageUrl ->
                    messagingService.sendMessage(otherUser.uid, "", imageUrl)
                        .onSuccess {
                            showLoading(false)
                        }
                        .onFailure { exception ->
                            showLoading(false)
                            Toast.makeText(this@ChatActivity, "Failed to send image: ${exception.message}", Toast.LENGTH_SHORT).show()
                        }
                }
                .onFailure { exception ->
                    showLoading(false)
                    Toast.makeText(this@ChatActivity, "Failed to upload image: ${exception.message}", Toast.LENGTH_SHORT).show()
                }
        }
    }
    
    private fun markMessagesAsRead() {
        lifecycleScope.launch {
            messagingService.markMessagesAsRead(otherUser.uid)
        }
    }
    
    private fun updateUserStatus() {
        val statusText = if (otherUser.isOnline) {
            getString(R.string.online)
        } else {
            val lastSeenTime = Date(otherUser.lastSeen)
            "${getString(R.string.last_seen)} ${prettyTime.format(lastSeenTime)}"
        }
        binding.tvUserStatus.text = statusText
    }
    
    private fun showLoading(show: Boolean) {
        binding.progressBar.visibility = if (show) View.VISIBLE else View.GONE
    }
    
    override fun onResume() {
        super.onResume()
        markMessagesAsRead()
    }
}

