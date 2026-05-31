# 🏠 Airbnb Clone — Full-Stack Mobile App

A production-ready Airbnb clone built with **React Native (Expo)** and **Node.js/Express/MongoDB**.

## ✨ Features

### Guest Features
- **Browse & Search** — Explore listings by category, location, price, and type
- **Listing Details** — Image carousel, reviews, amenities, host info, house rules
- **Booking Flow** — 3-step wizard: dates → guests → price breakdown → confirmation
- **Wishlists** — Save favorites into custom collections
- **Trips** — View upcoming, past, and cancelled bookings
- **Real-time Chat** — Message hosts with Socket.IO
- **Reviews** — 6-category rating system with host replies

### Host Features
- **Create Listings** — 4-step wizard for property, location, amenities, pricing
- **Manage Bookings** — Confirm/cancel guest requests
- **Dashboard** — View earnings and stats

### Auth & Security
- JWT access/refresh token rotation
- Email OTP verification & password reset
- Google OAuth support
- Role-based access (guest, host, admin)
- Rate limiting & input sanitization

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native, Expo Router, Zustand, Axios |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB, Mongoose |
| Real-time | Socket.IO |
| Payments | Stripe (mock fallback for dev) |
| Storage | Cloudinary (placeholder fallback for dev) |

## 📁 Project Structure

```
airbnb-clone/
├── client/                    # React Native (Expo)
│   ├── app/                   # Expo Router screens
│   │   ├── (auth)/            # Login, Register, Forgot Password, OTP
│   │   ├── (tabs)/            # Explore, Wishlists, Trips, Inbox, Profile
│   │   ├── listing/[id].tsx   # Listing detail
│   │   ├── booking/[id].tsx   # Booking flow
│   │   ├── chat/[id].tsx      # Real-time chat
│   │   └── host/create.tsx    # Create listing wizard
│   ├── stores/                # Zustand state management
│   ├── services/              # API layer (Axios)
│   └── constants/             # Theme & design tokens
├── server/                    # Node.js + Express
│   └── src/
│       ├── models/            # 7 Mongoose models
│       ├── controllers/       # 9 controller groups
│       ├── routes/            # 9 route files
│       ├── middleware/        # Auth, validation, upload, rate limiting
│       ├── socket/            # Socket.IO real-time
│       └── utils/             # Seed, email
└── .env                       # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Expo Go app on your phone

### 1. Clone & Install

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 2. Configure Environment

Edit `.env` in the root folder:
```env
MONGODB_URI=mongodb://localhost:27017/airbnb-clone
JWT_SECRET=your-secret-key
```

### 3. Seed Database

```bash
cd server && npx ts-node src/utils/seed.ts
```

### 4. Start Server

```bash
cd server && npm run dev
```

### 5. Start Client

```bash
cd client && npx expo start
```

### 📋 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Host | sarah@example.com | password123 |
| Host | michael@example.com | password123 |
| Guest | emma@example.com | password123 |
| Guest | james@example.com | password123 |
| Admin | admin@example.com | admin123 |

## 📡 API Endpoints

| Group | Endpoints |
|-------|-----------|
| Auth | POST register, login, google, forgot-password, verify-otp, reset-password, refresh-token |
| Users | GET/PATCH me, POST avatar, GET/POST/PATCH/DELETE wishlists |
| Listings | GET (search/filter), POST, PATCH, DELETE, availability |
| Bookings | POST create, GET guest/host, PATCH cancel/confirm |
| Reviews | POST create, GET by listing, PATCH reply, DELETE |
| Messages | GET conversations, POST conversation, GET/POST messages |
| Payments | POST create-intent, POST confirm, GET history |
| Notifications | GET list, PATCH read, PATCH read-all |
| Admin | GET users/listings/stats, PATCH user status/listing moderation |
