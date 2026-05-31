package com.vibe.app.ui.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.vibe.app.data.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * AuthViewModel
 * Converts React's useAuth hook and useState to ViewModel with StateFlow
 * 
 * React equivalent:
 * const [email, setEmail] = useState('')
 * const [loading, setLoading] = useState(false)
 * 
 * Kotlin:
 * private val _email = MutableStateFlow("")
 * val email: StateFlow<String> = _email.asStateFlow()
 */
class AuthViewModel(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    // UI State - replaces React useState hooks
    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()
    
    // Form fields
    private val _email = MutableStateFlow("")
    val email: StateFlow<String> = _email.asStateFlow()
    
    private val _password = MutableStateFlow("")
    val password: StateFlow<String> = _password.asStateFlow()
    
    private val _confirmPassword = MutableStateFlow("")
    val confirmPassword: StateFlow<String> = _confirmPassword.asStateFlow()
    
    private val _username = MutableStateFlow("")
    val username: StateFlow<String> = _username.asStateFlow()
    
    private val _displayName = MutableStateFlow("")
    val displayName: StateFlow<String> = _displayName.asStateFlow()
    
    private val _phone = MutableStateFlow("")
    val phone: StateFlow<String> = _phone.asStateFlow()
    
    private val _otp = MutableStateFlow("")
    val otp: StateFlow<String> = _otp.asStateFlow()
    
    /**
     * Update form fields
     * React: setEmail(value)
     * Kotlin: updateEmail(value)
     */
    fun updateEmail(value: String) {
        _email.value = value
        clearError("email")
    }
    
    fun updatePassword(value: String) {
        _password.value = value
        clearError("password")
    }
    
    fun updateConfirmPassword(value: String) {
        _confirmPassword.value = value
        clearError("confirmPassword")
    }
    
    fun updateUsername(value: String) {
        _username.value = value.lowercase()
        clearError("username")
    }
    
    fun updateDisplayName(value: String) {
        _displayName.value = value
        clearError("displayName")
    }
    
    fun updatePhone(value: String) {
        _phone.value = value
        clearError("phone")
    }
    
    fun updateOtp(value: String) {
        _otp.value = value
    }
    
    /**
     * Sign in with email and password
     * React: const handleLogin = async (e) => { await signIn(email, password) }
     */
    fun signIn() {
        if (!validateLogin()) return
        
        _uiState.value = _uiState.value.copy(isLoading = true, error = null)
        
        viewModelScope.launch {
            val result = authRepository.signIn(_email.value, _password.value)
            
            result.onSuccess {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    isAuthenticated = true
                )
            }.onFailure { error ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = error.message ?: "Sign in failed"
                )
            }
        }
    }
    
    /**
     * Sign up with email and password
     * React: const handleSignup = async (e) => { await signUp(email, password, username, displayName) }
     */
    fun signUp() {
        if (!validateSignup()) return
        
        _uiState.value = _uiState.value.copy(isLoading = true, error = null)
        
        viewModelScope.launch {
            val result = authRepository.signUp(
                email = _email.value,
                password = _password.value,
                username = _username.value,
                displayName = _displayName.value
            )
            
            result.onSuccess {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    showVerifyEmail = true
                )
            }.onFailure { error ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = error.message ?: "Sign up failed"
                )
            }
        }
    }
    
    /**
     * Sign out
     */
    fun signOut() {
        viewModelScope.launch {
            authRepository.signOut()
            _uiState.value = AuthUiState()
            clearAllFields()
        }
    }
    
    /**
     * Reset password
     */
    fun resetPassword() {
        if (_email.value.isBlank()) {
            _uiState.value = _uiState.value.copy(
                errors = _uiState.value.errors + ("email" to "Email is required")
            )
            return
        }
        
        _uiState.value = _uiState.value.copy(isLoading = true)
        
        viewModelScope.launch {
            val result = authRepository.resetPassword(_email.value)
            
            result.onSuccess {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    successMessage = "Password reset link sent to your email"
                )
            }.onFailure { error ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = error.message
                )
            }
        }
    }
    
    /**
     * Send phone OTP
     */
    fun sendPhoneOtp() {
        if (_phone.value.length < 10) {
            _uiState.value = _uiState.value.copy(
                errors = _uiState.value.errors + ("phone" to "Please enter a valid phone number")
            )
            return
        }
        
        _uiState.value = _uiState.value.copy(isLoading = true)
        
        viewModelScope.launch {
            val result = authRepository.sendPhoneOtp(_phone.value)
            
            result.onSuccess {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    otpSent = true,
                    successMessage = "OTP sent to your phone"
                )
            }.onFailure { error ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = error.message
                )
            }
        }
    }
    
    /**
     * Verify OTP
     */
    fun verifyOtp() {
        if (_otp.value.length != 6) return
        
        _uiState.value = _uiState.value.copy(isLoading = true)
        
        viewModelScope.launch {
            val result = authRepository.verifyOtp(_phone.value, _otp.value)
            
            result.onSuccess {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    isAuthenticated = true
                )
            }.onFailure { error ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = error.message
                )
            }
        }
    }
    
    /**
     * Validation functions
     */
    private fun validateLogin(): Boolean {
        val errors = mutableMapOf<String, String>()
        
        if (!isValidEmail(_email.value)) {
            errors["email"] = "Please enter a valid email"
        }
        
        if (_password.value.length < 6) {
            errors["password"] = "Password must be at least 6 characters"
        }
        
        _uiState.value = _uiState.value.copy(errors = errors)
        return errors.isEmpty()
    }
    
    private fun validateSignup(): Boolean {
        val errors = mutableMapOf<String, String>()
        
        if (!isValidEmail(_email.value)) {
            errors["email"] = "Please enter a valid email"
        }
        
        if (_password.value.length < 6) {
            errors["password"] = "Password must be at least 6 characters"
        }
        
        if (_username.value.length < 3) {
            errors["username"] = "Username must be at least 3 characters"
        }
        
        if (_displayName.value.isBlank()) {
            errors["displayName"] = "Display name is required"
        }
        
        _uiState.value = _uiState.value.copy(errors = errors)
        return errors.isEmpty()
    }
    
    private fun isValidEmail(email: String): Boolean {
        return android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }
    
    private fun clearError(field: String) {
        _uiState.value = _uiState.value.copy(
            errors = _uiState.value.errors - field
        )
    }
    
    private fun clearAllFields() {
        _email.value = ""
        _password.value = ""
        _confirmPassword.value = ""
        _username.value = ""
        _displayName.value = ""
        _phone.value = ""
        _otp.value = ""
    }
    
    fun setAuthView(view: AuthView) {
        _uiState.value = _uiState.value.copy(currentView = view)
    }
    
    fun togglePasswordVisibility() {
        _uiState.value = _uiState.value.copy(
            showPassword = !_uiState.value.showPassword
        )
    }
}

/**
 * UI State data class
 * Replaces multiple React useState hooks with a single state object
 */
data class AuthUiState(
    val isLoading: Boolean = false,
    val isAuthenticated: Boolean = false,
    val error: String? = null,
    val successMessage: String? = null,
    val errors: Map<String, String> = emptyMap(),
    val currentView: AuthView = AuthView.LOGIN,
    val showPassword: Boolean = false,
    val otpSent: Boolean = false,
    val showVerifyEmail: Boolean = false
)

enum class AuthView {
    LOGIN,
    SIGNUP,
    FORGOT_PASSWORD,
    RESET_PASSWORD,
    PHONE_LOGIN,
    VERIFY_EMAIL
}
