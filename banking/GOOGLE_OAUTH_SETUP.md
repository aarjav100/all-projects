# 🔐 Google OAuth Setup Guide

## Overview

This guide will help you set up Google OAuth for your SmartBank application, allowing users to sign in with their Google accounts.

## 📋 Prerequisites

- Google Account
- Access to [Google Cloud Console](https://console.cloud.google.com/)
- SmartBank application running locally

## 🚀 Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter project name: `SmartBank` or your preferred name
5. Click **"Create"**

### 2. Enable Google+ API

1. In your project, go to **"APIs & Services"** > **"Library"**
2. Search for **"Google+ API"**
3. Click on it and press **"Enable"**

### 3. Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Select **"External"** (for testing) or **"Internal"** (for organization only)
3. Click **"Create"**
4. Fill in the required information:
   - **App name:** SmartBank
   - **User support email:** Your email
   - **Developer contact:** Your email
5. Click **"Save and Continue"**
6. Skip "Scopes" for now (click **"Save and Continue"**)
7. Add test users if using External (your email)
8. Click **"Save and Continue"**

### 4. Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** > **"OAuth client ID"**
3. Choose **"Web application"**
4. Configure:
   - **Name:** SmartBank Web Client
   - **Authorized JavaScript origins:**
     - `http://localhost:5173` (frontend dev server)
     - `http://localhost:5000` (backend dev server)
   - **Authorized redirect URIs:**
     - `http://localhost:5173`
     - `http://localhost:5000`
5. Click **"Create"**
6. **IMPORTANT:** Copy your **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)

### 5. Update Environment Variables

#### Frontend (.env file in `/frontend` folder)

```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
```

#### Backend (.env file in `/backend` folder)

```env
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
```

**Replace `YOUR_CLIENT_ID_HERE` with your actual Client ID from step 4!**

### 6. Restart Your Servers

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## ✅ Testing

1. Open your browser to `http://localhost:5173`
2. You should see the login page
3. Click **"Sign in with Google"** button
4. Select your Google account
5. You should be logged in automatically!

## 🔧 Troubleshooting

### "Error: Invalid Client ID"
- Make sure you copied the Client ID correctly
- Check that it ends with `.apps.googleusercontent.com`
- Verify both frontend and backend `.env` files have the same Client ID

### "Error: redirect_uri_mismatch"
- Go back to Google Cloud Console
- Check **"Authorized JavaScript origins"** includes `http://localhost:5173`
- Make sure there are no trailing slashes

### "Error: Access blocked"
- Your app is not verified yet (normal for development)
- Add yourself as a test user in OAuth consent screen
- Click "Advanced" > "Go to SmartBank (unsafe)" during sign-in

### Button doesn't appear
- Check browser console for errors
- Verify frontend server is running
- Clear browser cache and reload

## 📁 Files Modified

✅ `frontend/src/main.tsx` - Added GoogleOAuthProvider
✅ `frontend/src/AuthContext.tsx` - Added signInWithGoogle method
✅ `frontend/src/App.tsx` - Added GoogleLogin button
✅ `backend/controllers/authController.js` - Added googleSignIn handler
✅ `backend/routes/auth.js` - Added /google route
✅ `backend/models/User.js` - Added googleId field
✅ `frontend/.env` - Added VITE_GOOGLE_CLIENT_ID
✅ `backend/.env` - Added GOOGLE_CLIENT_ID

## 🎯 How It Works

1. **User clicks Google Sign-In**
   - Frontend shows Google login popup
   
2. **User selects Google account**
   - Google verifies user
   - Returns JWT credential to frontend
   
3. **Frontend sends credential to backend**
   - POST request to `/api/auth/google`
   
4. **Backend verifies credential**
   - Uses Google Auth Library
   - Extracts user info (email, name, Google ID)
   
5. **Backend creates/updates user**
   - Creates new user if doesn't exist
   - Updates existing user with Google ID
   
6. **Backend returns JWT token**
   - Frontend stores token
   - User is logged in!

## 🔐 Security Notes

1. **Client ID is public** - It's safe to expose in frontend code
2. **Client Secret** - We don't use it for web apps (only for backend)
3. **Token verification** - Backend always verifies Google tokens
4. **HTTPS in production** - Always use HTTPS for production apps

## 🌐 Production Deployment

When deploying to production:

1. **Update OAuth Consent Screen**
   - Change to "In Production" status
   - Complete verification process

2. **Add Production URLs**
   - Add your production domain to Authorized JavaScript origins
   - Example: `https://yourdomain.com`

3. **Update Environment Variables**
   - Set production Client ID in your hosting platform
   - Never commit `.env` files to Git

4. **Use HTTPS**
   - Google OAuth requires HTTPS in production
   - Get SSL certificate (Let's Encrypt, Cloudflare, etc.)

## 📚 Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Sign-In for Web](https://developers.google.com/identity/gsi/web)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)
- [google-auth-library](https://www.npmjs.com/package/google-auth-library)

## 🎉 Success!

If you've completed all steps, users can now sign in with Google! The button appears between the regular login form and the Gemini AI button.

**Features:**
- ✅ One-click Google Sign-In
- ✅ Auto-create account for new users
- ✅ Link existing accounts by email
- ✅ Secure token verification
- ✅ Seamless user experience

