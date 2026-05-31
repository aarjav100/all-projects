# 🔄 How to Properly Restart Servers

## ⚠️ IMPORTANT: You MUST restart the backend!

The changes to validation and the User model will NOT take effect until you restart the backend server.

---

## 🛑 Step 1: Stop Backend Server

In your backend terminal:
- Press **Ctrl+C** to stop the server

---

## ✅ Step 2: Restart Backend Server

```bash
cd F:\projects\banking\backend
npm run dev
```

**Expected output:**
```
[nodemon] starting `node server.js`
🚀 Server running on port 5000
✅ Connected to MongoDB
🌐 API available at http://localhost:5000/api
```

---

## ✅ Step 3: Verify Backend is Running

Open a new terminal and run:
```bash
curl http://localhost:5000/api/health
```

Or open in browser:
http://localhost:5000/api/health

**Expected response:**
```json
{
  "status": "ok",
  "message": "Banking API is running.",
  "timestamp": "2025-10-27T...",
  "version": "1.0.0"
}
```

---

## ✅ Step 4: Check Frontend (if not running)

```bash
cd F:\projects\banking\frontend
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## ✅ Step 5: Test Login

1. Go to: http://localhost:5173
2. Enter credentials:
   - **Email:** `test@smartbank.com`
   - **Password:** `Test123!`
3. Click **Sign In**
4. ✅ **Should work!**

---

## 🔍 Troubleshooting

### Backend won't start?

**Error: "Port 5000 already in use"**
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Then restart
npm run dev
```

**Error: "Cannot find module"**
```bash
# Reinstall dependencies
npm install
npm run dev
```

**Error: "MongooseServerSelectionError"**
```bash
# Check if MongoDB is running
mongo --version

# Start MongoDB (if installed locally)
net start MongoDB

# Or use MongoDB Atlas connection string in .env
```

### Still getting 401?

1. **Clear browser cache:**
   - Press F12 → Application → Storage → Clear site data
   - Or use Incognito/Private mode

2. **Verify user exists:**
   ```bash
   cd backend
   npm run check-users
   ```

3. **Test password:**
   ```bash
   cd backend
   npm run test-login
   ```

4. **Check backend logs:**
   - Look for errors in backend terminal
   - Should show each API request

5. **Verify frontend proxy:**
   - Check `frontend/vite.config.ts` has proxy configured
   - Restart frontend if you changed it

---

## 📊 Quick Diagnostic Commands

Run these from the backend directory:

```bash
# Check which users exist
npm run check-users

# Test if login credentials work
npm run test-login

# Create a fresh test user
npm run create-user

# Seed full database with sample data
npm run seed
```

---

## 🎯 Complete Fresh Start

If nothing works, do a complete restart:

### 1. Stop Everything
- Backend terminal: Ctrl+C
- Frontend terminal: Ctrl+C

### 2. Clear Database (Optional)
```bash
cd backend
# This will delete all users and recreate test user
npm run create-user
```

### 3. Start Backend
```bash
cd backend
npm run dev
```

### 4. Start Frontend
```bash
cd frontend
npm run dev
```

### 5. Test
- Go to http://localhost:5173
- Login with: `test@smartbank.com` / `Test123!`

---

## ✅ Success Indicators

### Backend is working when you see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

### Frontend is working when you see:
```
➜  Local:   http://localhost:5173/
```

### Login works when:
- No 401 error in browser console
- You see the dashboard
- Welcome message appears with your name

---

## 🚨 Common Mistakes

1. ❌ **Not restarting backend after changes**
   - Always restart after modifying backend code

2. ❌ **Backend not connected to MongoDB**
   - Check .env has correct MONGODB_URI
   - Verify MongoDB is running

3. ❌ **Wrong credentials**
   - Email: test@smartbank.com
   - Password: Test123! (case sensitive!)

4. ❌ **Old token in browser**
   - Clear browser cache/localStorage
   - Use incognito mode

---

## 📞 Need More Help?

If you're still stuck:

1. Show me the **backend terminal output**
2. Show me the **browser console errors** (F12)
3. Run `npm run check-users` and show output
4. Run `npm run test-login` and show output

---

## ✅ Summary

To fix the 401 error:

1. **Stop backend** (Ctrl+C)
2. **Restart backend** (`npm run dev`)
3. **Clear browser cache** (F12 → Clear storage)
4. **Try login again** (test@smartbank.com / Test123!)

The backend MUST be restarted for changes to take effect!

