package com.chatapp

import android.content.Intent
import android.os.Bundle
import android.util.Patterns
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.chatapp.databinding.ActivityRegisterBinding
import com.chatapp.services.AuthService
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityRegisterBinding
    private val authService = AuthService()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupClickListeners()
    }
    
    private fun setupClickListeners() {
        binding.btnRegister.setOnClickListener {
            validateAndRegister()
        }
        
        binding.tvLogin.setOnClickListener {
            finish() // Go back to login activity
        }
    }
    
    private fun validateAndRegister() {
        val fullName = binding.etFullName.text.toString().trim()
        val email = binding.etEmail.text.toString().trim()
        val password = binding.etPassword.text.toString().trim()
        val confirmPassword = binding.etConfirmPassword.text.toString().trim()
        
        // Clear previous errors
        binding.tilFullName.error = null
        binding.tilEmail.error = null
        binding.tilPassword.error = null
        binding.tilConfirmPassword.error = null
        
        // Validate input
        if (fullName.isEmpty()) {
            binding.tilFullName.error = "Full name is required"
            return
        }
        
        if (fullName.length < 2) {
            binding.tilFullName.error = "Name must be at least 2 characters"
            return
        }
        
        if (email.isEmpty()) {
            binding.tilEmail.error = "Email is required"
            return
        }
        
        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.tilEmail.error = getString(R.string.invalid_email)
            return
        }
        
        if (password.isEmpty()) {
            binding.tilPassword.error = "Password is required"
            return
        }
        
        if (password.length < 6) {
            binding.tilPassword.error = getString(R.string.weak_password)
            return
        }
        
        if (confirmPassword.isEmpty()) {
            binding.tilConfirmPassword.error = "Please confirm your password"
            return
        }
        
        if (password != confirmPassword) {
            binding.tilConfirmPassword.error = getString(R.string.passwords_dont_match)
            return
        }
        
        registerUser(email, password, fullName)
    }
    
    private fun registerUser(email: String, password: String, fullName: String) {
        showLoading(true)
        
        lifecycleScope.launch {
            authService.registerUser(email, password, fullName)
                .onSuccess {
                    showLoading(false)
                    Toast.makeText(this@RegisterActivity, getString(R.string.registration_successful), Toast.LENGTH_SHORT).show()
                    navigateToMain()
                }
                .onFailure { exception ->
                    showLoading(false)
                    val errorMessage = when {
                        exception.message?.contains("email") == true -> "Email already in use"
                        exception.message?.contains("weak") == true -> getString(R.string.weak_password)
                        exception.message?.contains("network") == true -> getString(R.string.network_error)
                        else -> "Registration failed: ${exception.message}"
                    }
                    Toast.makeText(this@RegisterActivity, errorMessage, Toast.LENGTH_LONG).show()
                }
        }
    }
    
    private fun showLoading(show: Boolean) {
        binding.progressBar.visibility = if (show) View.VISIBLE else View.GONE
        binding.btnRegister.isEnabled = !show
        binding.btnRegister.text = if (show) "" else getString(R.string.register)
    }
    
    private fun navigateToMain() {
        startActivity(Intent(this, MainActivity::class.java))
        finish()
    }
}

