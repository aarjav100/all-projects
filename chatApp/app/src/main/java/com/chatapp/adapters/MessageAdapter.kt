package com.chatapp.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.chatapp.R
import com.chatapp.databinding.ItemMessageReceivedBinding
import com.chatapp.databinding.ItemMessageSentBinding
import com.chatapp.models.Message
import com.chatapp.models.MessageType
import org.ocpsoft.prettytime.PrettyTime
import java.util.*

class MessageAdapter(
    private val messages: List<Message>,
    private val currentUserId: String
) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {
    
    companion object {
        private const val VIEW_TYPE_SENT = 1
        private const val VIEW_TYPE_RECEIVED = 2
    }
    
    private val prettyTime = PrettyTime()
    
    override fun getItemViewType(position: Int): Int {
        return if (messages[position].senderId == currentUserId) {
            VIEW_TYPE_SENT
        } else {
            VIEW_TYPE_RECEIVED
        }
    }
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return when (viewType) {
            VIEW_TYPE_SENT -> {
                val binding = ItemMessageSentBinding.inflate(LayoutInflater.from(parent.context), parent, false)
                SentMessageViewHolder(binding)
            }
            VIEW_TYPE_RECEIVED -> {
                val binding = ItemMessageReceivedBinding.inflate(LayoutInflater.from(parent.context), parent, false)
                ReceivedMessageViewHolder(binding)
            }
            else -> throw IllegalArgumentException("Invalid view type")
        }
    }
    
    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        when (holder) {
            is SentMessageViewHolder -> holder.bind(messages[position])
            is ReceivedMessageViewHolder -> holder.bind(messages[position])
        }
    }
    
    override fun getItemCount(): Int = messages.size
    
    inner class SentMessageViewHolder(private val binding: ItemMessageSentBinding) : RecyclerView.ViewHolder(binding.root) {
        
        fun bind(message: Message) {
            // Set message text
            if (message.message.isNotEmpty()) {
                binding.tvMessage.text = message.message
                binding.tvMessage.visibility = View.VISIBLE
            } else {
                binding.tvMessage.visibility = View.GONE
            }
            
            // Set image if available
            if (message.messageType == MessageType.IMAGE && message.imageUrl.isNotEmpty()) {
                binding.ivMessageImage.visibility = View.VISIBLE
                Glide.with(binding.root.context)
                    .load(message.imageUrl)
                    .into(binding.ivMessageImage)
            } else {
                binding.ivMessageImage.visibility = View.GONE
            }
            
            // Set timestamp
            val messageTime = Date(message.timestamp)
            binding.tvTime.text = prettyTime.format(messageTime)
        }
    }
    
    inner class ReceivedMessageViewHolder(private val binding: ItemMessageReceivedBinding) : RecyclerView.ViewHolder(binding.root) {
        
        fun bind(message: Message) {
            // Set message text
            if (message.message.isNotEmpty()) {
                binding.tvMessage.text = message.message
                binding.tvMessage.visibility = View.VISIBLE
            } else {
                binding.tvMessage.visibility = View.GONE
            }
            
            // Set image if available
            if (message.messageType == MessageType.IMAGE && message.imageUrl.isNotEmpty()) {
                binding.ivMessageImage.visibility = View.VISIBLE
                Glide.with(binding.root.context)
                    .load(message.imageUrl)
                    .into(binding.ivMessageImage)
            } else {
                binding.ivMessageImage.visibility = View.GONE
            }
            
            // Set timestamp
            val messageTime = Date(message.timestamp)
            binding.tvTime.text = prettyTime.format(messageTime)
            
            // Set sender profile image (placeholder for now)
            binding.ivSenderProfile.setImageResource(R.drawable.ic_person_placeholder)
        }
    }
}

