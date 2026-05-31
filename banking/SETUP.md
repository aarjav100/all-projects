# SmartBank - Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js v16+ installed (`node --version`)
- [ ] MongoDB installed and running, OR MongoDB Atlas account
- [ ] npm or yarn installed (`npm --version`)

## Step-by-Step Setup

### 1. Install MongoDB (if not already installed)

**Option A: Local MongoDB**
- Download from https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Default connection: `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/smartbank`

### 2. Configure Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Windows PowerShell:
Copy-Item env.example .env
# Linux/Mac:
cp env.example .env

# Open .env and configure:
# - Set MONGODB_URI to your MongoDB connection string
# - Optionally change JWT_SECRET for production
```

**Required .env Configuration:**
```env
MONGODB_URI=mongodb://localhost:27017/smartbank
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 3. Configure Frontend

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

No additional configuration needed! The frontend is pre-configured to work with the backend.

### 4. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
🌐 API available at http://localhost:5000/api
🔗 Health check at http://localhost:5000/api/health
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 5. Verify Installation

1. **Check Backend Health:**
   - Open browser: http://localhost:5000/api/health
   - Should show: `{"status":"ok","message":"Banking API is running."}`

2. **Check Frontend:**
   - Open browser: http://localhost:5173
   - Should see SmartBank login page

### 6. Create Your First Account

1. Go to http://localhost:5173
2. Click "Don't have an account? Sign up"
3. Fill in the registration form:
   - Full Name: Your Name
   - Email: your.email@example.com
   - Password: Must be secure (e.g., Test123!)
4. Click "Create Account"
5. You'll be automatically logged in

### 7. Optional: Seed Database with Sample Data

```bash
cd backend
npm run seed
```

This will create sample users, branches, employees, and transactions for testing.

## Troubleshooting

### Backend Issues

**Error: "MongooseServerSelectionError"**
- MongoDB is not running
- Solution: Start MongoDB service or check MongoDB Atlas connection

**Error: "Port 5000 already in use"**
- Another application is using port 5000
- Solution: Change PORT in backend/.env to different port (e.g., 5001)

**Error: "JWT_SECRET is not defined"**
- .env file not loaded properly
- Solution: Ensure .env file exists in backend directory

### Frontend Issues

**Error: "Failed to fetch"**
- Backend is not running
- Solution: Start backend server first

**Blank page or errors in console**
- Dependencies not installed
- Solution: Run `npm install` in frontend directory

**CORS errors**
- Proxy not configured properly
- Solution: Check vite.config.ts has proxy configuration

### Database Connection Issues

**Can't connect to local MongoDB:**
```bash
# Check if MongoDB is running (Windows)
services.msc
# Look for "MongoDB" service

# Check if MongoDB is running (Linux/Mac)
sudo systemctl status mongod
```

**MongoDB Atlas connection timeout:**
- Check network access settings in Atlas dashboard
- Add your IP address to whitelist
- Verify connection string is correct

## Common Commands

### Backend
```bash
npm run dev        # Start development server
npm start          # Start production server
npm run seed       # Seed database
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run linter
```

## Default Ports

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017

## Next Steps

Once everything is running:

1. ✅ Explore the dashboard
2. ✅ Try transferring money
3. ✅ View transaction history
4. ✅ Browse branch locations
5. ✅ Check out banking services

## Need Help?

- Check `README.md` for detailed documentation
- Check `CHANGES.md` for list of recent fixes
- Review API endpoints in `README.md`
- Check browser console for error messages
- Check backend terminal for server errors

## Production Deployment

Before deploying to production:

1. **Security:**
   - Change JWT_SECRET to a strong random value
   - Enable HTTPS
   - Configure proper CORS origins
   - Enable rate limiting

2. **Database:**
   - Use MongoDB Atlas or managed MongoDB service
   - Set up proper indexes
   - Configure backups

3. **Environment:**
   - Set NODE_ENV=production
   - Use environment variables for all secrets
   - Never commit .env files

4. **Build:**
   ```bash
   # Frontend
   cd frontend
   npm run build
   # Deploy 'dist' folder to static hosting (Vercel, Netlify, etc.)
   
   # Backend
   cd backend
   # Deploy to Node.js hosting (Heroku, Railway, AWS, etc.)
   ```

## Support

For issues or questions:
- Open an issue in the repository
- Check existing documentation
- Review error logs in terminal

Happy banking! 🏦

