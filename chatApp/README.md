# ChatApp - Modern Android Messaging Application

A modern, real-time messaging application built with Kotlin and Firebase, featuring Material Design UI, user authentication, and push notifications.

## Features

### Core Features
- **User Authentication**: Secure login and registration using Firebase Auth
- **Real-time Messaging**: Instant message delivery using Firestore real-time listeners
- **User Profiles**: Customizable user profiles with profile pictures
- **Chat List**: Overview of all conversations with last message preview
- **Message Timestamps**: Formatted timestamps using PrettyTime library
- **Online Status**: Real-time online/offline status indicators
- **User Search**: Search and discover other users to start conversations

### Advanced Features
- **Image Sharing**: Send and receive images with Firebase Storage integration
- **Push Notifications**: FCM-powered notifications for new messages
- **Material Design**: Modern UI following Material Design 3 principles
- **Dark Mode Support**: Automatic dark/light theme switching
- **Message Status**: Read/unread message indicators
- **Responsive Design**: Optimized for various screen sizes

## Technology Stack

- **Language**: Kotlin
- **UI Framework**: Android Views with Material Design Components
- **Backend**: Firebase (Auth, Firestore, Storage, Cloud Messaging)
- **Architecture**: MVVM pattern with Repository pattern
- **Image Loading**: Glide
- **Image Picker**: ImagePicker library
- **Date Formatting**: PrettyTime

## Project Structure

```
ChatApp/
├── app/
│   ├── src/main/
│   │   ├── java/com/chatapp/
│   │   │   ├── adapters/           # RecyclerView adapters
│   │   │   ├── models/             # Data models
│   │   │   ├── services/           # Firebase services
│   │   │   ├── LoginActivity.kt    # User login
│   │   │   ├── RegisterActivity.kt # User registration
│   │   │   ├── MainActivity.kt     # Chat list
│   │   │   └── ChatActivity.kt     # Messaging interface
│   │   ├── res/
│   │   │   ├── layout/             # XML layouts
│   │   │   ├── drawable/           # Icons and drawables
│   │   │   ├── values/             # Colors, strings, themes
│   │   │   └── menu/               # Menu resources
│   │   └── AndroidManifest.xml
│   ├── build.gradle                # App-level dependencies
│   └── google-services.json        # Firebase configuration
├── build.gradle                    # Project-level configuration
└── settings.gradle                 # Project settings
```

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Add an Android app with package name: `com.chatapp`

### 2. Enable Firebase Services
- **Authentication**: Enable Email/Password provider
- **Firestore Database**: Create database in production mode
- **Storage**: Enable Firebase Storage
- **Cloud Messaging**: Enable FCM for push notifications

### 3. Download Configuration
- Download `google-services.json` from Firebase Console
- Replace the template file in `app/google-services.json`

### 4. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Allow reading other users for search
    }
    
    // Messages can be read/written by participants
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.senderId || 
         request.auth.uid == resource.data.receiverId);
    }
    
    // Chats can be read/written by participants
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
  }
}
```

### 5. Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /chat_images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Installation & Setup

### Prerequisites
- Android Studio Arctic Fox or later
- Android SDK 24 (API level 24) or higher
- Google Play Services
- Firebase project with required services enabled

### Steps
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ChatApp
   ```

2. **Open in Android Studio**
   - Open Android Studio
   - Select "Open an existing Android Studio project"
   - Navigate to the ChatApp folder

3. **Configure Firebase**
   - Replace `app/google-services.json` with your Firebase configuration
   - Update Firebase project settings if needed

4. **Build the project**
   ```bash
   ./gradlew build
   ```

5. **Run the application**
   - Connect an Android device or start an emulator
   - Click "Run" in Android Studio or use:
   ```bash
   ./gradlew installDebug
   ```

## Usage Guide

### Getting Started
1. **Registration**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Search Users**: Use the search bar to find other users
4. **Start Chat**: Tap on a user to start a conversation
5. **Send Messages**: Type and send text messages or images
6. **Receive Notifications**: Get notified of new messages when app is in background

### Key Screens
- **Login/Register**: Authentication screens with form validation
- **Main Screen**: Chat list with search functionality and user status
- **Chat Screen**: Real-time messaging interface with image sharing
- **Profile**: User profile management (accessible via menu)

## Features in Detail

### Authentication System
- Email/password authentication via Firebase Auth
- Form validation with error handling
- Automatic login state persistence
- Password reset functionality
- User profile creation in Firestore

### Real-time Messaging
- Instant message delivery using Firestore listeners
- Message ordering by timestamp
- Support for text and image messages
- Read/unread status tracking
- Chat list with last message preview

### User Interface
- Material Design 3 components
- Responsive layouts for different screen sizes
- Dark/light theme support
- Smooth animations and transitions
- Intuitive navigation patterns

### Push Notifications
- FCM integration for background notifications
- Custom notification handling
- Deep linking to specific chats
- Notification channels for Android O+

## Development Notes

### Architecture Patterns
- **Repository Pattern**: Centralized data access through service classes
- **Observer Pattern**: Real-time updates using Firestore listeners
- **Adapter Pattern**: RecyclerView adapters for list displays

### Key Dependencies
```gradle
// Firebase
implementation platform('com.google.firebase:firebase-bom:32.5.0')
implementation 'com.google.firebase:firebase-auth-ktx'
implementation 'com.google.firebase:firebase-firestore-ktx'
implementation 'com.google.firebase:firebase-storage-ktx'
implementation 'com.google.firebase:firebase-messaging-ktx'

// UI
implementation 'com.google.android.material:material:1.10.0'
implementation 'com.github.bumptech.glide:glide:4.16.0'
implementation 'com.github.dhaval2404:imagepicker:2.1'
implementation 'org.ocpsoft.prettytime:prettytime:5.0.6.Final'
```

### Performance Optimizations
- Efficient RecyclerView usage with ViewHolder pattern
- Image loading optimization with Glide
- Firestore query optimization with proper indexing
- Memory leak prevention with proper lifecycle management

## Testing

### Manual Testing Checklist
- [ ] User registration with valid/invalid data
- [ ] User login with correct/incorrect credentials
- [ ] Password reset functionality
- [ ] User search and discovery
- [ ] Real-time message sending and receiving
- [ ] Image sharing functionality
- [ ] Push notification delivery
- [ ] Online/offline status updates
- [ ] App navigation and UI responsiveness

### Automated Testing
The project includes unit tests for:
- Authentication service methods
- Message validation logic
- Data model serialization
- Utility functions

Run tests with:
```bash
./gradlew test
```

## Deployment

### Debug Build
```bash
./gradlew assembleDebug
```

### Release Build
1. Configure signing in `app/build.gradle`
2. Generate signed APK:
```bash
./gradlew assembleRelease
```

### Play Store Deployment
1. Create signed AAB (Android App Bundle):
```bash
./gradlew bundleRelease
```
2. Upload to Google Play Console
3. Configure store listing and publish

## Troubleshooting

### Common Issues

**Firebase Connection Issues**
- Verify `google-services.json` is correctly placed
- Check Firebase project configuration
- Ensure all required Firebase services are enabled

**Build Errors**
- Clean and rebuild project: `./gradlew clean build`
- Check Gradle and Android Studio versions
- Verify all dependencies are properly resolved

**Runtime Crashes**
- Check Firebase security rules
- Verify network permissions in manifest
- Review Logcat for detailed error messages

**Push Notifications Not Working**
- Verify FCM service is properly configured
- Check notification permissions on device
- Test with Firebase Console test messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review Firebase documentation for backend-related issues

---

**Note**: This is a demonstration project. For production use, consider additional security measures, comprehensive testing, and performance optimizations.

