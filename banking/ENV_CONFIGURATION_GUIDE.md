# Environment Variables Configuration Guide

Both `.env` files have been created for you! Here's what you need to know:

## 📁 Files Created

✅ `backend/.env` - Backend server configuration  
✅ `frontend/.env` - Frontend application configuration

---

## 🔧 Backend Configuration (`backend/.env`)

### Required Variables (Must Configure)

#### **MONGODB_URI** 
**Current:** `mongodb://localhost:27017/smartbank`

Choose one option:

**Option 1: Local MongoDB (Recommended for Development)**
```env
MONGODB_URI=mongodb://localhost:27017/smartbank
```
- Install MongoDB locally
- Start MongoDB service
- No additional setup needed

**Option 2: MongoDB Atlas (Cloud Database)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/smartbank?retryWrites=true&w=majority
```
- Sign up at https://www.mongodb.com/cloud/atlas
- Create free cluster
- Replace `username`, `password`, and `cluster0` with your details
- Whitelist your IP address in Atlas dashboard

#### **JWT_SECRET**
**Current:** `smartbank-jwt-secret-key-2024-change-this-in-production-abc123xyz789`

⚠️ **IMPORTANT FOR PRODUCTION:**
- Change this to a strong random string
- Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- Never share or commit this value

### Optional Variables (Already Configured)

#### **Email Configuration** (For notifications)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
```

To enable email:
1. Use Gmail App Password (not regular password)
2. Enable "Less secure app access" or create App Password
3. Set `ENABLE_EMAIL_VERIFICATION=true`

#### **Twilio SMS** (For SMS alerts)
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

To enable SMS:
1. Sign up at https://www.twilio.com
2. Get credentials from dashboard
3. Set `ENABLE_SMS_ALERTS=true`

#### **Stripe** (For payments)
```env
STRIPE_SECRET_KEY=sk_test_...
```

To enable payments:
1. Sign up at https://stripe.com
2. Get test API key from dashboard

---

## 🎨 Frontend Configuration (`frontend/.env`)

### Variables Available

All frontend environment variables are **optional** and prefixed with `VITE_`:

```env
VITE_APP_NAME=SmartBank
VITE_APP_VERSION=1.0.0
VITE_ENV=development
```

### How to Use in Code

Access in your React components:
```typescript
const appName = import.meta.env.VITE_APP_NAME;
const version = import.meta.env.VITE_APP_VERSION;
```

### Adding New Variables

1. Add to `.env` file with `VITE_` prefix
2. Restart Vite dev server
3. Access via `import.meta.env.VITE_YOUR_VAR`

---

## 🚀 Quick Start Checklist

### Minimal Setup (Development)

- [x] ✅ `backend/.env` created
- [x] ✅ `frontend/.env` created
- [ ] ⚙️ Install and start MongoDB locally
- [ ] ⚙️ Run `cd backend && npm run dev`
- [ ] ⚙️ Run `cd frontend && npm run dev`

### MongoDB Setup Options

**Option A: Local MongoDB**
```bash
# Windows (if MongoDB installed)
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

**Option B: MongoDB Atlas**
1. Go to https://cloud.mongodb.com
2. Sign up / Login
3. Create new project
4. Build a cluster (Free tier)
5. Create database user
6. Get connection string
7. Update `MONGODB_URI` in `backend/.env`

---

## 🔍 Verifying Configuration

### 1. Check Backend .env
```bash
cd backend
type .env  # Windows
cat .env   # Linux/Mac
```

### 2. Test MongoDB Connection
```bash
cd backend
npm run dev
```

Look for: `✅ Connected to MongoDB`

### 3. Test Frontend
```bash
cd frontend
npm run dev
```

Open: http://localhost:5173

---

## 🛠️ Common Issues

### "MongooseServerSelectionError"
❌ **Problem:** Can't connect to MongoDB

✅ **Solutions:**
- Ensure MongoDB is running locally
- Check `MONGODB_URI` format
- For Atlas: whitelist your IP address
- For local: verify MongoDB service is started

### "JWT malformed" or auth errors
❌ **Problem:** JWT token issues

✅ **Solutions:**
- Clear browser localStorage
- Ensure `JWT_SECRET` is set
- Restart backend server

### Frontend can't reach backend
❌ **Problem:** API calls failing

✅ **Solutions:**
- Verify backend is running on port 5000
- Check `FRONTEND_URL=http://localhost:5173` in backend `.env`
- Ensure Vite proxy is configured (already done)

---

## 🔒 Security Best Practices

### Development
✅ Use local MongoDB  
✅ Use sample JWT_SECRET  
✅ Disable email/SMS features  

### Production
⚠️ Use MongoDB Atlas or managed database  
⚠️ Generate strong random JWT_SECRET  
⚠️ Enable HTTPS  
⚠️ Set strong CORS origins  
⚠️ Enable rate limiting  
⚠️ Never commit `.env` files  
⚠️ Use environment variables on hosting platform  

---

## 📝 Environment Variables Reference

### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 5000 | Server port |
| `NODE_ENV` | No | development | Environment mode |
| `MONGODB_URI` | **Yes** | - | MongoDB connection string |
| `JWT_SECRET` | **Yes** | - | Secret for JWT signing |
| `JWT_EXPIRES_IN` | No | 7d | Token expiration |
| `BCRYPT_ROUNDS` | No | 12 | Password hashing rounds |
| `FRONTEND_URL` | **Yes** | - | Frontend URL for CORS |
| `EMAIL_HOST` | No | - | SMTP server |
| `EMAIL_PORT` | No | 587 | SMTP port |
| `EMAIL_USER` | No | - | Email username |
| `EMAIL_PASS` | No | - | Email password |
| `TWILIO_ACCOUNT_SID` | No | - | Twilio account ID |
| `TWILIO_AUTH_TOKEN` | No | - | Twilio auth token |
| `STRIPE_SECRET_KEY` | No | - | Stripe API key |
| `ENABLE_EMAIL_VERIFICATION` | No | false | Enable email verification |
| `ENABLE_SMS_ALERTS` | No | false | Enable SMS alerts |

### Frontend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_APP_NAME` | No | SmartBank | Application name |
| `VITE_APP_VERSION` | No | 1.0.0 | App version |
| `VITE_ENV` | No | development | Environment |

---

## 💡 Next Steps

1. **Start MongoDB**
   ```bash
   # Check if running
   mongo --version
   # or
   mongosh --version
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Expected: `🚀 Server running on port 5000`

3. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Expected: `➜  Local:   http://localhost:5173/`

4. **Test the App**
   - Open http://localhost:5173
   - Register a new account
   - Login and explore features

---

## 📞 Need Help?

If you encounter issues:
1. Check this guide first
2. Review `SETUP.md` for detailed setup
3. Check `README.md` for troubleshooting
4. Verify all services are running
5. Check terminal logs for errors

---

## ✅ Configuration Complete!

Both `.env` files are ready. Just:
1. Install/start MongoDB
2. Run backend: `npm run dev`
3. Run frontend: `npm run dev`
4. Visit http://localhost:5173

Happy coding! 🎉

