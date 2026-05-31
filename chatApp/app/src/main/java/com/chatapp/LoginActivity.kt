package com.chatapp

import android.content.Intent
import android.os.Bundle
import android.util.Patterns
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.chatapp.databinding.ActivityLoginBinding
import com.chatapp.services.AuthService
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityLoginBinding
    private val authService = AuthService()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupClickListeners()
        
        // Check if user is already logged in
        if (authService.isUserLoggedIn()) {
            navigateToMain()
        }
    }
    
    private fun setupClickListeners() {
        binding.btnLogin.setOnClickListener {
            validateAndLogin()
        }
        
        binding.tvRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
        
        binding.tvForgotPassword.setOnClickListener {
            handleForgotPassword()
        }
    }
    
    private fun validateAndLogin() {
        val email = binding.etEmail.text.toString().trim()
        val password = binding.etPassword.text.toString().trim()
        
        // Clear previous errors
        binding.tilEmail.error = null
        binding.tilPassword.error = null
        
        // Validate input
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
        
        loginUser(email, password)
    }
    
    private fun loginUser(email: String, password: String) {
        showLoading(true)
        
        lifecycleScope.launch {
            authService.loginUser(email, password)
                .onSuccess {
                    showLoading(false)
                    Toast.makeText(this@LoginActivity, getString(R.string.login_successful), Toast.LENGTH_SHORT).show()
                    navigateToMain()
                }
                .onFailure { exception ->
                    showLoading(false)
                    val errorMessage = when {
                        exception.message?.contains("password") == true -> "Invalid password"
                        exception.message?.contains("user") == true -> "User not found"
                        exception.message?.contains("network") == true -> getString(R.string.network_error)
                        else -> getString(R.string.authentication_failed)
                    }
                    Toast.makeText(this@LoginActivity, errorMessage, Toast.LENGTH_LONG).show()
                }
        }
    }
    
    private fun handleForgotPassword() {
        val email = binding.etEmail.text.toString().trim()
        
        if (email.isEmpty()) {
            binding.tilEmail.error = "Enter email to reset password"
            return
        }
        
        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.tilEmail.error = getString(R.string.invalid_email)
            return
        }
        
        lifecycleScope.launch {
            authService.sendPasswordResetEmail(email)
                .onSuccess {
                    Toast.makeText(this@LoginActivity, "Password reset email sent", Toast.LENGTH_LONG).show()
                }
                .onFailure { exception ->
                    Toast.makeText(this@LoginActivity, "Failed to send reset email: ${exception.message}", Toast.LENGTH_LONG).show()
                }
        }
    }
    
    private fun showLoading(show: Boolean) {
        binding.progressBar.visibility = if (show) View.VISIBLE else View.GONE
        binding.btnLogin.isEnabled = !show
        binding.btnLogin.text = if (show) "" else getString(R.string.login)
    }
    
    private fun navigateToMain() {
        startActivity(Intent(this, MainActivity::class.java))
        finish()
    }
}

