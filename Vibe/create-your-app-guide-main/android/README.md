# Vibe Android - Native Kotlin Conversion

This is the **native Android Kotlin** version of the Vibe social media application, converted from the React.js + Supabase web app.

## 🏗️ Architecture

- **Language**: Kotlin
- **UI Framework**: Jetpack Compose (Modern declarative UI)
- **Architecture Pattern**: MVVM (Model-View-ViewModel)
- **Networking**: Retrofit + OkHttp
- **Backend**: Supabase REST API
- **State Management**: StateFlow + LiveData
- **Navigation**: Jetpack Navigation Component
- **Dependency Injection**: Manual (ready for Hilt)
- **Image Loading**: Coil
- **Async Operations**: Kotlin Coroutines

## 📁 Project Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/vibe/app/
│   │   │   ├── data/
│   │   │   │   ├── api/           # Retrofit API services
│   │   │   │   │   ├── ApiClient.kt
│   │   │   │   │   ├── AuthApiService.kt
│   │   │   │   │   └── SupabaseApiService.kt
│   │   │   │   ├── model/         # Data models
│   │   │   │   │   ├── User.kt
│   │   │   │   │   ├── Post.kt
│   │   │   │   │   ├── Auth.kt
│   │   │   │   │   ├── Message.kt
│   │   │   │   │   └── Community.kt
│   │   │   │   ├── repository/    # Repository pattern
│   │   │   │   │   ├── AuthRepository.kt
│   │   │   │   │   └── PostRepository.kt
│   │   │   │   └── local/         # Local storage
│   │   │   │       └── TokenManager.kt
│   │   │   ├── ui/
│   │   │   │   ├── auth/          # Authentication screens
│   │   │   │   │   ├── AuthScreen.kt
│   │   │   │   │   └── AuthViewModel.kt
│   │   │   │   ├── feed/          # Feed screens
│   │   │   │   │   ├── FeedScreen.kt
│   │   │   │   │   └── FeedViewModel.kt
│   │   │   │   └── theme/         # Material 3 theme
│   │   │   │       ├── Color.kt
│   │   │   │       ├── Type.kt
│   │   │   │       └── Theme.kt
│   │   │   ├── navigation/        # Navigation setup
│   │   │   │   ├── NavGraph.kt
│   │   │   │   └── Screen.kt
│   │   │   ├── MainActivity.kt
│   │   │   └── VibeApplication.kt
│   │   ├── res/                   # Resources
│   │   └── AndroidManifest.xml
│   └── build.gradle.kts
├── build.gradle.kts
└── settings.gradle.kts
```

## 🚀 Setup Instructions

### Prerequisites

1. **Android Studio** (Hedgehog 2023.1.1 or later)
2. **JDK 17** or higher
3. **Android SDK** with minimum API 24 (Android 7.0)
4. **Supabase Project** (your existing backend)

### Step 1: Clone and Open Project

```bash
cd android
```

Open the `android` folder in Android Studio.

### Step 2: Configure Supabase Credentials

1. Copy `local.properties.example` to `local.properties`:
   ```bash
   cp local.properties.example local.properties
   ```

2. Edit `local.properties` and add your Supabase credentials:
   ```properties
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

   **Where to find these:**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to Settings → API
   - Copy "Project URL" and "anon public" key

### Step 3: Sync Gradle

Android Studio will automatically detect the Gradle files and prompt you to sync. Click **"Sync Now"**.

If not, manually sync:
- Click **File → Sync Project with Gradle Files**

### Step 4: Build the Project

```bash
./gradlew build
```

Or in Android Studio:
- Click **Build → Make Project** (Ctrl+F9 / Cmd+F9)

### Step 5: Run on Device/Emulator

1. **Using Android Emulator:**
   - Open AVD Manager (Tools → Device Manager)
   - Create a new virtual device (Pixel 5 or later recommended)
   - Click Run (Shift+F10 / Ctrl+R)

2. **Using Physical Device:**
   - Enable Developer Options on your Android device
   - Enable USB Debugging
   - Connect via USB
   - Click Run and select your device

## 📱 Features Implemented

### ✅ Core Features

- **Authentication**
  - Email/Password sign up and sign in
  - Email verification flow
  - Password reset
  - Phone OTP (placeholder - requires Supabase phone auth setup)
  - Google OAuth (placeholder - requires Android OAuth setup)
  - Secure token storage with DataStore

- **Feed**
  - Scrollable post feed with LazyColumn
  - Pull-to-refresh
  - Like/Unlike posts
  - View comments count
  - Share functionality (placeholder)

- **Navigation**
  - Type-safe navigation with Navigation Component
  - Deep linking support
  - Back stack management

### 🚧 Features To Implement

The following screens are defined in the navigation but need implementation:

- Profile Screen
- User Profile Screen
- Create Post Screen
- Post Detail Screen
- Search Screen
- Notifications Screen
- Messages Screen
- Chat Screen
- Settings Screen
- Communities Screen
- Community Detail Screen

## 🔄 React to Kotlin Conversion Guide

### State Management

| React Pattern | Kotlin Equivalent |
|--------------|-------------------|
| `useState()` | `MutableStateFlow<T>` |
| `useEffect()` | `LaunchedEffect` or ViewModel `init` |
| `useContext()` | Dependency Injection (Hilt) |
| `useCallback()` | Regular Kotlin functions |
| `useMemo()` | `remember { }` or `derivedStateOf` |
| React Query | Repository + Flow |

**Example:**

```typescript
// React
const [email, setEmail] = useState('')
const [loading, setLoading] = useState(false)

useEffect(() => {
  fetchData()
}, [])
```

```kotlin
// Kotlin
private val _email = MutableStateFlow("")
val email: StateFlow<String> = _email.asStateFlow()

private val _loading = MutableStateFlow(false)
val loading: StateFlow<Boolean> = _loading.asStateFlow()

init {
    fetchData()
}
```

### API Calls

| React (Supabase Client) | Kotlin (Retrofit) |
|------------------------|-------------------|
| `supabase.from('posts').select()` | `api.getPosts()` |
| `supabase.auth.signIn()` | `authApi.signIn(request)` |
| `supabase.from('posts').insert()` | `api.createPost(request)` |

**Example:**

```typescript
// React
const { data, error } = await supabase
  .from('posts')
  .select('*, profile:profiles(*)')
```

```kotlin
// Kotlin
val response = api.getPosts(
    select = "*,profile:profiles(*)"
)
if (response.isSuccessful) {
    val posts = response.body()
}
```

### UI Components

| React Component | Jetpack Compose |
|----------------|-----------------|
| `<div>` | `Box`, `Column`, `Row` |
| `<button>` | `Button` |
| `<input>` | `TextField`, `OutlinedTextField` |
| `<img>` | `AsyncImage` (Coil) |
| `map()` for lists | `LazyColumn` + `items()` |
| CSS classes | `Modifier` chains |

**Example:**

```jsx
// React
<div className="flex flex-col gap-4">
  <input 
    type="email" 
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <button onClick={handleSubmit}>
    Submit
  </button>
</div>
```

```kotlin
// Kotlin Compose
Column(
    verticalArrangement = Arrangement.spacedBy(16.dp)
) {
    OutlinedTextField(
        value = email,
        onValueChange = { email = it },
        label = { Text("Email") }
    )
    Button(onClick = { handleSubmit() }) {
        Text("Submit")
    }
}
```

## 🔐 Authentication Flow

1. **App Launch** → Check if user is logged in (TokenManager)
2. **If logged out** → Navigate to AuthScreen
3. **User signs in** → Tokens saved to DataStore
4. **API calls** → Automatically include Bearer token in headers
5. **Token expires** → Auto-refresh using refresh token
6. **User signs out** → Clear tokens, navigate to AuthScreen

## 🌐 Backend Integration

The Android app communicates with your existing Supabase backend via REST API:

### API Endpoints

- **Auth**: `https://your-project.supabase.co/auth/v1/`
  - POST `/signup` - Create account
  - POST `/token?grant_type=password` - Sign in
  - POST `/token?grant_type=refresh_token` - Refresh token

- **Database**: `https://your-project.supabase.co/rest/v1/`
  - GET `/posts` - Fetch posts
  - POST `/posts` - Create post
  - GET `/profiles` - Get user profiles

### Headers

Every API request includes:
```
apikey: your-supabase-anon-key
Authorization: Bearer user-access-token
Content-Type: application/json
```

## 🧪 Testing

### Run Unit Tests

```bash
./gradlew test
```

### Run Instrumentation Tests

```bash
./gradlew connectedAndroidTest
```

## 📦 Building APK

### Debug APK

```bash
./gradlew assembleDebug
```

Output: `app/build/outputs/apk/debug/app-debug.apk`

### Release APK

1. Create a keystore:
   ```bash
   keytool -genkey -v -keystore vibe-release.keystore -alias vibe -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Add to `local.properties`:
   ```properties
   KEYSTORE_FILE=../vibe-release.keystore
   KEYSTORE_PASSWORD=your-password
   KEY_ALIAS=vibe
   KEY_PASSWORD=your-password
   ```

3. Build release APK:
   ```bash
   ./gradlew assembleRelease
   ```

## 🐛 Troubleshooting

### Build Errors

**Error: "Unresolved reference: BuildConfig"**
- Solution: Sync Gradle files (File → Sync Project with Gradle Files)

**Error: "SUPABASE_URL not found"**
- Solution: Ensure `local.properties` exists with correct credentials

### Runtime Errors

**Error: "Unable to connect to Supabase"**
- Check internet permission in AndroidManifest.xml
- Verify Supabase URL and API key
- Check device/emulator internet connection

**Error: "Token expired"**
- The app should auto-refresh tokens
- If not working, sign out and sign in again

## 📚 Next Steps

1. **Implement remaining screens** (Profile, Messages, Communities, etc.)
2. **Add Hilt for dependency injection**
3. **Implement real-time features** (WebSocket for messages)
4. **Add image upload** (Camera + Gallery integration)
5. **Implement push notifications** (Firebase Cloud Messaging)
6. **Add offline support** (Room database for caching)
7. **Write comprehensive tests**

## 🤝 Contributing

This is a converted version of the React app. To add new features:

1. Create data models in `data/model/`
2. Add API endpoints in `data/api/`
3. Create repository in `data/repository/`
4. Build UI in `ui/` with ViewModel
5. Add navigation route in `navigation/`

## 📄 License

Same as the original React project.

## 🆘 Support

For issues related to:
- **Android app**: Check Android Studio logs
- **Supabase backend**: Check Supabase dashboard logs
- **API errors**: Enable logging interceptor in `ApiClient.kt`

---

**Built with ❤️ using Kotlin and Jetpack Compose**
