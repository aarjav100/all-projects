# ChatApp Setup Guide

This guide provides step-by-step instructions for setting up the ChatApp Android application with Firebase backend.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Android Studio**: Version Arctic Fox (2020.3.1) or later
- **Java Development Kit (JDK)**: Version 8 or later
- **Android SDK**: API level 24 (Android 7.0) or higher
- **Google Account**: For Firebase Console access
- **Physical Android Device or Emulator**: For testing

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `ChatApp` (or your preferred name)
4. Choose whether to enable Google Analytics (recommended)
5. Select or create a Google Analytics account
6. Click "Create project"

### 1.2 Add Android App to Firebase

1. In Firebase Console, click "Add app" and select Android
2. Enter the following details:
   - **Android package name**: `com.chatapp`
   - **App nickname**: `ChatApp` (optional)
   - **Debug signing certificate SHA-1**: (optional, for development)
3. Click "Register app"
4. Download `google-services.json`
5. Click "Next" through the remaining steps

### 1.3 Enable Firebase Authentication

1. In Firebase Console, navigate to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Optionally enable "Email link (passwordless sign-in)"
6. Click "Save"

### 1.4 Setup Firestore Database

1. Navigate to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" (we'll configure rules later)
4. Select a location for your database (choose closest to your users)
5. Click "Done"

### 1.5 Configure Firestore Security Rules

1. In Firestore Database, go to "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Allow reading other users for search
    }
    
    // Allow participants to read and write messages
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.senderId || 
         request.auth.uid == resource.data.receiverId);
    }
    
    // Allow participants to read and write chat documents
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
  }
}
```

3. Click "Publish"

### 1.6 Setup Firebase Storage

1. Navigate to "Storage"
2. Click "Get started"
3. Choose "Start in production mode"
4. Select the same location as your Firestore database
5. Click "Done"

### 1.7 Configure Storage Security Rules

1. In Storage, go to "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to upload images to their own folder
    match /chat_images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow reading profile images
    match /profile_images/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

### 1.8 Enable Cloud Messaging

1. Navigate to "Cloud Messaging"
2. The service should be automatically enabled
3. Note down the Server Key (you'll need this for sending notifications)

## Step 2: Android Project Setup

### 2.1 Clone or Download Project

If you have the project files:
```bash
# If using Git
git clone <repository-url>
cd ChatApp

# Or extract the ZIP file to a folder named ChatApp
```

### 2.2 Open Project in Android Studio

1. Launch Android Studio
2. Click "Open an existing Android Studio project"
3. Navigate to the ChatApp folder
4. Click "OK"
5. Wait for Gradle sync to complete

### 2.3 Add Firebase Configuration

1. Copy the downloaded `google-services.json` file
2. Paste it in the `app/` directory (replace the existing template file)
3. The file structure should be: `ChatApp/app/google-services.json`

### 2.4 Verify Dependencies

Ensure your `app/build.gradle` file contains all required dependencies:

```gradle
dependencies {
    // Core Android dependencies
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.10.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    
    // Firebase BOM
    implementation platform('com.google.firebase:firebase-bom:32.5.0')
    implementation 'com.google.firebase:firebase-analytics-ktx'
    implementation 'com.google.firebase:firebase-auth-ktx'
    implementation 'com.google.firebase:firebase-firestore-ktx'
    implementation 'com.google.firebase:firebase-storage-ktx'
    implementation 'com.google.firebase:firebase-messaging-ktx'
    
    // Additional libraries
    implementation 'com.github.bumptech.glide:glide:4.16.0'
    implementation 'org.ocpsoft.prettytime:prettytime:5.0.6.Final'
    implementation 'com.github.dhaval2404:imagepicker:2.1'
}
```

### 2.5 Sync Project

1. Click "Sync Now" when prompted
2. Wait for Gradle sync to complete
3. Resolve any dependency conflicts if they occur

## Step 3: Build and Run

### 3.1 Build the Project

1. In Android Studio, go to "Build" → "Clean Project"
2. Then go to "Build" → "Rebuild Project"
3. Wait for the build to complete successfully

### 3.2 Setup Device/Emulator

**For Physical Device:**
1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device to computer via USB
4. Allow USB debugging when prompted

**For Emulator:**
1. Open AVD Manager in Android Studio
2. Create a new virtual device (API level 24 or higher)
3. Start the emulator

### 3.3 Run the Application

1. Select your device/emulator from the device dropdown
2. Click the "Run" button (green play icon)
3. Wait for the app to install and launch

## Step 4: Testing the Application

### 4.1 Create Test Accounts

1. Launch the app
2. Click "Register" to create a new account
3. Fill in the registration form:
   - Full Name: Test User 1
   - Email: test1@example.com
   - Password: test123456
4. Complete registration
5. Sign out and create another test account for testing messaging

### 4.2 Test Core Features

1. **Authentication**: Test login/logout functionality
2. **User Search**: Search for the second test user
3. **Messaging**: Send text messages between accounts
4. **Image Sharing**: Test image upload and sharing
5. **Real-time Updates**: Verify messages appear instantly
6. **Notifications**: Test push notifications (requires two devices)

## Step 5: Troubleshooting

### Common Issues and Solutions

**Issue: "google-services.json not found"**
- Solution: Ensure the file is in the correct location (`app/google-services.json`)
- Verify the package name matches in the JSON file

**Issue: "Firebase Auth sign-in failed"**
- Solution: Check Firebase Authentication is enabled
- Verify email/password provider is enabled
- Check network connectivity

**Issue: "Firestore permission denied"**
- Solution: Review and update Firestore security rules
- Ensure user is properly authenticated
- Check document paths in rules

**Issue: "Images not uploading"**
- Solution: Verify Firebase Storage is enabled
- Check Storage security rules
- Ensure proper permissions in AndroidManifest.xml

**Issue: "Push notifications not working"**
- Solution: Verify FCM service is enabled
- Check notification permissions on device
- Test with Firebase Console test message

### Debug Tips

1. **Check Logcat**: Monitor Android Studio's Logcat for error messages
2. **Firebase Console**: Use Firebase Console to monitor authentication and database activity
3. **Network Inspector**: Use Android Studio's Network Inspector to debug API calls
4. **Breakpoints**: Set breakpoints in code to debug step-by-step

## Step 6: Production Deployment

### 6.1 Generate Signed APK

1. In Android Studio, go to "Build" → "Generate Signed Bundle/APK"
2. Select "APK" and click "Next"
3. Create a new keystore or use existing one
4. Fill in keystore details and click "Next"
5. Select "release" build variant
6. Click "Finish"

### 6.2 Prepare for Play Store

1. Update version code and version name in `build.gradle`
2. Add app icons for all required densities
3. Create store listing assets (screenshots, descriptions)
4. Test thoroughly on multiple devices
5. Upload to Google Play Console

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [Material Design Guidelines](https://material.io/design)
- [Kotlin Documentation](https://kotlinlang.org/docs)

## Support

If you encounter issues not covered in this guide:

1. Check the main README.md file
2. Review Firebase Console for configuration issues
3. Check Android Studio's Event Log for detailed error messages
4. Consult Firebase and Android documentation
5. Create an issue in the project repository

---

This setup guide should help you get the ChatApp up and running successfully. Follow each step carefully and refer to the troubleshooting section if you encounter any issues.

