package com.vibe.app.ui.auth

import androidx.compose.animation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle

/**
 * Auth Screen - Jetpack Compose
 * Converted from React Auth.tsx
 * 
 * This screen handles:
 * - Login with email/password
 * - Sign up with email/password
 * - Google OAuth (placeholder)
 * - Phone OTP
 * - Password reset
 * - Email verification
 */
@Composable
fun AuthScreen(
    viewModel: AuthViewModel,
    onAuthSuccess: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val email by viewModel.email.collectAsStateWithLifecycle()
    val password by viewModel.password.collectAsStateWithLifecycle()
    val username by viewModel.username.collectAsStateWithLifecycle()
    val displayName by viewModel.displayName.collectAsStateWithLifecycle()
    val phone by viewModel.phone.collectAsStateWithLifecycle()
    val otp by viewModel.otp.collectAsStateWithLifecycle()
    
    // Navigate on successful authentication
    LaunchedEffect(uiState.isAuthenticated) {
        if (uiState.isAuthenticated) {
            onAuthSuccess()
        }
    }
    
    // Show snackbar for errors and success messages
    val snackbarHostState = remember { SnackbarHostState() }
    
    LaunchedEffect(uiState.error) {
        uiState.error?.let {
            snackbarHostState.showSnackbar(it)
        }
    }
    
    LaunchedEffect(uiState.successMessage) {
        uiState.successMessage?.let {
            snackbarHostState.showSnackbar(it)
        }
    }
    
    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentAlignment = Alignment.Center
        ) {
            when (uiState.currentView) {
                AuthView.VERIFY_EMAIL -> VerifyEmailView(
                    email = email,
                    onBackToLogin = { viewModel.setAuthView(AuthView.LOGIN) }
                )
                AuthView.FORGOT_PASSWORD -> ForgotPasswordView(
                    email = email,
                    onEmailChange = viewModel::updateEmail,
                    onSubmit = viewModel::resetPassword,
                    onBack = { viewModel.setAuthView(AuthView.LOGIN) },
                    isLoading = uiState.isLoading,
                    error = uiState.errors["email"]
                )
                AuthView.PHONE_LOGIN -> PhoneLoginView(
                    phone = phone,
                    otp = otp,
                    otpSent = uiState.otpSent,
                    onPhoneChange = viewModel::updatePhone,
                    onOtpChange = viewModel::updateOtp,
                    onSendOtp = viewModel::sendPhoneOtp,
                    onVerifyOtp = viewModel::verifyOtp,
                    onBack = { viewModel.setAuthView(AuthView.LOGIN) },
                    isLoading = uiState.isLoading,
                    error = uiState.errors["phone"]
                )
                else -> LoginSignupView(
                    currentView = uiState.currentView,
                    email = email,
                    password = password,
                    username = username,
                    displayName = displayName,
                    showPassword = uiState.showPassword,
                    errors = uiState.errors,
                    isLoading = uiState.isLoading,
                    onEmailChange = viewModel::updateEmail,
                    onPasswordChange = viewModel::updatePassword,
                    onUsernameChange = viewModel::updateUsername,
                    onDisplayNameChange = viewModel::updateDisplayName,
                    onTogglePassword = viewModel::togglePasswordVisibility,
                    onLogin = viewModel::signIn,
                    onSignup = viewModel::signUp,
                    onForgotPassword = { viewModel.setAuthView(AuthView.FORGOT_PASSWORD) },
                    onPhoneLogin = { viewModel.setAuthView(AuthView.PHONE_LOGIN) },
                    onSwitchView = { view -> viewModel.setAuthView(view) }
                )
            }
        }
    }
}

/**
 * Login/Signup Tab View
 * React equivalent: TabsContent in Auth.tsx
 */
@Composable
private fun LoginSignupView(
    currentView: AuthView,
    email: String,
    password: String,
    username: String,
    displayName: String,
    showPassword: Boolean,
    errors: Map<String, String>,
    isLoading: Boolean,
    onEmailChange: (String) -> Unit,
    onPasswordChange: (String) -> Unit,
    onUsernameChange: (String) -> Unit,
    onDisplayNameChange: (String) -> Unit,
    onTogglePassword: () -> Unit,
    onLogin: () -> Unit,
    onSignup: () -> Unit,
    onForgotPassword: () -> Unit,
    onPhoneLogin: () -> Unit,
    onSwitchView: (AuthView) -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier
                .padding(24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header
            Icon(
                imageVector = Icons.Default.Star,
                contentDescription = null,
                modifier = Modifier.size(48.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            
            Text(
                text = if (currentView == AuthView.SIGNUP) "Join the community" else "Welcome back",
                style = MaterialTheme.typography.headlineMedium
            )
            
            Text(
                text = if (currentView == AuthView.SIGNUP) "Create an account to start sharing" else "Sign in to connect with your friends",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Tab selector
            TabRow(
                selectedTabIndex = if (currentView == AuthView.LOGIN) 0 else 1
            ) {
                Tab(
                    selected = currentView == AuthView.LOGIN,
                    onClick = { onSwitchView(AuthView.LOGIN) },
                    text = { Text("Sign In") }
                )
                Tab(
                    selected = currentView == AuthView.SIGNUP,
                    onClick = { onSwitchView(AuthView.SIGNUP) },
                    text = { Text("Sign Up") }
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Form content
            AnimatedContent(
                targetState = currentView,
                label = "auth_form"
            ) { view ->
                when (view) {
                    AuthView.LOGIN -> LoginForm(
                        email = email,
                        password = password,
                        showPassword = showPassword,
                        errors = errors,
                        isLoading = isLoading,
                        onEmailChange = onEmailChange,
                        onPasswordChange = onPasswordChange,
                        onTogglePassword = onTogglePassword,
                        onLogin = onLogin,
                        onForgotPassword = onForgotPassword
                    )
                    AuthView.SIGNUP -> SignupForm(
                        email = email,
                        password = password,
                        username = username,
                        displayName = displayName,
                        showPassword = showPassword,
                        errors = errors,
                        isLoading = isLoading,
                        onEmailChange = onEmailChange,
                        onPasswordChange = onPasswordChange,
                        onUsernameChange = onUsernameChange,
                        onDisplayNameChange = onDisplayNameChange,
                        onTogglePassword = onTogglePassword,
                        onSignup = onSignup
                    )
                    else -> {}
                }
            }
            
            // Social login buttons
            if (currentView == AuthView.LOGIN) {
                Divider(modifier = Modifier.padding(vertical = 8.dp))
                
                Text(
                    text = "Or continue with",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedButton(
                        onClick = { /* Google OAuth */ },
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(Icons.Default.AccountCircle, contentDescription = null)
                        Spacer(Modifier.width(8.dp))
                        Text("Google")
                    }
                    
                    OutlinedButton(
                        onClick = onPhoneLogin,
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(Icons.Default.Phone, contentDescription = null)
                        Spacer(Modifier.width(8.dp))
                        Text("Phone")
                    }
                }
            }
        }
    }
}

/**
 * Login Form
 */
@Composable
private fun LoginForm(
    email: String,
    password: String,
    showPassword: Boolean,
    errors: Map<String, String>,
    isLoading: Boolean,
    onEmailChange: (String) -> Unit,
    onPasswordChange: (String) -> Unit,
    onTogglePassword: () -> Unit,
    onLogin: () -> Unit,
    onForgotPassword: () -> Unit
) {
    Column(
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Email field
        OutlinedTextField(
            value = email,
            onValueChange = onEmailChange,
            label = { Text("Email") },
            placeholder = { Text("john@example.com") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            isError = errors.containsKey("email"),
            supportingText = errors["email"]?.let { { Text(it) } },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
        
        // Password field
        OutlinedTextField(
            value = password,
            onValueChange = onPasswordChange,
            label = { Text("Password") },
            placeholder = { Text("••••••••") },
            visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            isError = errors.containsKey("password"),
            supportingText = errors["password"]?.let { { Text(it) } },
            trailingIcon = {
                IconButton(onClick = onTogglePassword) {
                    Icon(
                        imageVector = if (showPassword) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                        contentDescription = "Toggle password visibility"
                    )
                }
            },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
        
        // Forgot password
        TextButton(
            onClick = onForgotPassword,
            modifier = Modifier.align(Alignment.End)
        ) {
            Text("Forgot password?")
        }
        
        // Login button
        Button(
            onClick = onLogin,
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    color = MaterialTheme.colorScheme.onPrimary
                )
            } else {
                Text("Sign In")
            }
        }
    }
}

/**
 * Signup Form
 */
@Composable
private fun SignupForm(
    email: String,
    password: String,
    username: String,
    displayName: String,
    showPassword: Boolean,
    errors: Map<String, String>,
    isLoading: Boolean,
    onEmailChange: (String) -> Unit,
    onPasswordChange: (String) -> Unit,
    onUsernameChange: (String) -> Unit,
    onDisplayNameChange: (String) -> Unit,
    onTogglePassword: () -> Unit,
    onSignup: () -> Unit
) {
    Column(
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Username and Display Name
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = username,
                onValueChange = onUsernameChange,
                label = { Text("Username") },
                placeholder = { Text("johndoe") },
                isError = errors.containsKey("username"),
                supportingText = errors["username"]?.let { { Text(it) } },
                modifier = Modifier.weight(1f),
                singleLine = true
            )
            
            OutlinedTextField(
                value = displayName,
                onValueChange = onDisplayNameChange,
                label = { Text("Display Name") },
                placeholder = { Text("John Doe") },
                isError = errors.containsKey("displayName"),
                supportingText = errors["displayName"]?.let { { Text(it) } },
                modifier = Modifier.weight(1f),
                singleLine = true
            )
        }
        
        // Email
        OutlinedTextField(
            value = email,
            onValueChange = onEmailChange,
            label = { Text("Email") },
            placeholder = { Text("john@example.com") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            isError = errors.containsKey("email"),
            supportingText = errors["email"]?.let { { Text(it) } },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
        
        // Password
        OutlinedTextField(
            value = password,
            onValueChange = onPasswordChange,
            label = { Text("Password") },
            placeholder = { Text("••••••••") },
            visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            isError = errors.containsKey("password"),
            supportingText = errors["password"]?.let { { Text(it) } },
            trailingIcon = {
                IconButton(onClick = onTogglePassword) {
                    Icon(
                        imageVector = if (showPassword) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                        contentDescription = "Toggle password visibility"
                    )
                }
            },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
        
        // Signup button
        Button(
            onClick = onSignup,
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    color = MaterialTheme.colorScheme.onPrimary
                )
            } else {
                Text("Sign Up")
            }
        }
    }
}

/**
 * Verify Email View
 */
@Composable
private fun VerifyEmailView(
    email: String,
    onBackToLogin: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Email,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            
            Text(
                text = "Check your email",
                style = MaterialTheme.typography.headlineMedium
            )
            
            Text(
                text = "We've sent a verification link to:",
                style = MaterialTheme.typography.bodyMedium
            )
            
            Text(
                text = email,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.primary
            )
            
            Text(
                text = "Click the link in your email to verify your account. Check your spam folder if you don't see it.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Button(
                onClick = onBackToLogin,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Back to Sign In")
            }
        }
    }
}

/**
 * Forgot Password View
 */
@Composable
private fun ForgotPasswordView(
    email: String,
    onEmailChange: (String) -> Unit,
    onSubmit: () -> Unit,
    onBack: () -> Unit,
    isLoading: Boolean,
    error: String?
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
            
            Text(
                text = "Forgot password?",
                style = MaterialTheme.typography.headlineMedium
            )
            
            Text(
                text = "We'll send you a reset link",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            OutlinedTextField(
                value = email,
                onValueChange = onEmailChange,
                label = { Text("Email") },
                placeholder = { Text("john@example.com") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                isError = error != null,
                supportingText = error?.let { { Text(it) } },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
            
            Button(
                onClick = onSubmit,
                modifier = Modifier.fillMaxWidth(),
                enabled = !isLoading
            ) {
                if (isLoading) {
                    CircularProgressIndicator(modifier = Modifier.size(20.dp))
                } else {
                    Text("Send reset link")
                }
            }
        }
    }
}

/**
 * Phone Login View
 */
@Composable
private fun PhoneLoginView(
    phone: String,
    otp: String,
    otpSent: Boolean,
    onPhoneChange: (String) -> Unit,
    onOtpChange: (String) -> Unit,
    onSendOtp: () -> Unit,
    onVerifyOtp: () -> Unit,
    onBack: () -> Unit,
    isLoading: Boolean,
    error: String?
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
            
            Text(
                text = "Phone login",
                style = MaterialTheme.typography.headlineMedium
            )
            
            if (!otpSent) {
                OutlinedTextField(
                    value = phone,
                    onValueChange = onPhoneChange,
                    label = { Text("Phone Number") },
                    placeholder = { Text("+1234567890") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                    isError = error != null,
                    supportingText = error?.let { { Text(it) } },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
                
                Button(
                    onClick = onSendOtp,
                    modifier = Modifier.fillMaxWidth(),
                    enabled = !isLoading
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(modifier = Modifier.size(20.dp))
                    } else {
                        Text("Send OTP")
                    }
                }
            } else {
                Text("Enter the 6-digit code sent to $phone")
                
                OutlinedTextField(
                    value = otp,
                    onValueChange = { if (it.length <= 6) onOtpChange(it) },
                    label = { Text("OTP Code") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
                
                Button(
                    onClick = onVerifyOtp,
                    modifier = Modifier.fillMaxWidth(),
                    enabled = !isLoading && otp.length == 6
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(modifier = Modifier.size(20.dp))
                    } else {
                        Text("Verify")
                    }
                }
            }
        }
    }
}
