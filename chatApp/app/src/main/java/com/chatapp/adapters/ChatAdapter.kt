package com.chatapp.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.chatapp.R
import com.chatapp.databinding.ItemChatBinding
import com.chatapp.models.Chat
import com.chatapp.services.AuthService
import kotlinx.coroutines.launch
import org.ocpsoft.prettytime.PrettyTime
import java.util.*

class ChatAdapter(
    private val chats: List<Chat>,
    private val onChatClick: (Chat) -> Unit
) : RecyclerView.Adapter<ChatAdapter.ChatViewHolder>() {
    
    private val authService = AuthService()
    private val prettyTime = PrettyTime()
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ChatViewHolder {
        val binding = ItemChatBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ChatViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: ChatViewHolder, position: Int) {
        holder.bind(chats[position])
    }
    
    override fun getItemCount(): Int = chats.size
    
    inner class ChatViewHolder(private val binding: ItemChatBinding) : RecyclerView.ViewHolder(binding.root) {
        
        fun bind(chat: Chat) {
            val currentUserId = authService.getCurrentUser()?.uid ?: return
            val otherUserId = chat.getOtherParticipant(currentUserId)
            
            // Load other user's information
            if (binding.root.context is androidx.lifecycle.LifecycleOwner) {
                val lifecycleOwner = binding.root.context as androidx.lifecycle.LifecycleOwner
                lifecycleOwner.lifecycleScope.launch {
                    authService.getUserById(otherUserId)
                        .onSuccess { user ->
                            binding.tvUserName.text = user.name
                            
                            // Load profile image
                            if (user.profileImageUrl.isNotEmpty()) {
                                Glide.with(binding.root.context)
                                    .load(user.profileImageUrl)
                                    .placeholder(R.drawable.ic_person_placeholder)
                                    .into(binding.ivProfileImage)
                            } else {
                                binding.ivProfileImage.setImageResource(R.drawable.ic_person_placeholder)
                            }
                            
                            // Show online indicator
                            binding.onlineIndicator.visibility = if (user.isOnline) View.VISIBLE else View.GONE
                        }
                        .onFailure {
                            binding.tvUserName.text = "Unknown User"
                            binding.ivProfileImage.setImageResource(R.drawable.ic_person_placeholder)
                            binding.onlineIndicator.visibility = View.GONE
                        }
                }
            }
            
            // Set last message
            binding.tvLastMessage.text = if (chat.lastMessage.isNotEmpty()) {
                chat.lastMessage
            } else {
                "No messages yet"
            }
            
            // Set time
            if (chat.lastMessageTime > 0) {
                val messageTime = Date(chat.lastMessageTime)
                binding.tvTime.text = prettyTime.format(messageTime)
            } else {
                binding.tvTime.text = ""
            }
            
            // Set unread count
            if (chat.unreadCount > 0) {
                binding.tvUnreadCount.visibility = View.VISIBLE
                binding.tvUnreadCount.text = chat.unreadCount.toString()
            } else {
                binding.tvUnreadCount.visibility = View.GONE
            }
            
            // Set click listener
            binding.root.setOnClickListener {
                onChatClick(chat)
            }
        }
    }
}

