package com.chatapp.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.chatapp.R
import com.chatapp.databinding.ItemUserBinding
import com.chatapp.models.User

class UserAdapter(
    private val users: List<User>,
    private val onUserClick: (User) -> Unit
) : RecyclerView.Adapter<UserAdapter.UserViewHolder>() {
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserViewHolder {
        val binding = ItemUserBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return UserViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: UserViewHolder, position: Int) {
        holder.bind(users[position])
    }
    
    override fun getItemCount(): Int = users.size
    
    inner class UserViewHolder(private val binding: ItemUserBinding) : RecyclerView.ViewHolder(binding.root) {
        
        fun bind(user: User) {
            binding.tvUserName.text = user.name
            binding.tvUserEmail.text = user.email
            
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
            
            // Set click listener
            binding.root.setOnClickListener {
                onUserClick(user)
            }
        }
    }
}

