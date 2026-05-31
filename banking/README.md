# SmartBank - Digital Banking Platform

A modern full-stack banking application built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

- 🔐 Secure Authentication & Authorization
- 💰 Account Management & Balance Tracking
- 💸 Money Transfers & Transactions
- 👥 Beneficiary Management
- 🏢 Branch Locator with Employee Information
- 📊 Transaction History
- 🎯 Banking Services (Loans, Credit Cards, Fixed Deposits)
- 🛡️ Security Features & Account Protection
- 📱 Responsive Modern UI

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas account)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd banking
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp env.example .env

# Edit .env file and configure your settings
# Important: Set your MongoDB connection string
# For local MongoDB: mongodb://localhost:27017/smartbank
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/smartbank
```

**Required Environment Variables:**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smartbank
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

### 4. Database Setup (Optional)

To seed the database with sample data:

```bash
cd backend
npm run seed
```

## Running the Application

You'll need to run both the backend and frontend servers.

### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

### Terminal 2 - Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## Default Test Accounts

After seeding the database, you can use these test accounts:

- **Email:** test@smartbank.com
- **Password:** Test123!

Or create a new account through the registration page.

## Project Structure

```
banking/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & validation middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts (seed, etc.)
│   ├── server.js        # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components (currently in App.tsx)
│   │   ├── contexts/    # Empty (for future context providers)
│   │   ├── hooks/       # Empty (for future custom hooks)
│   │   ├── App.tsx      # Main application component
│   │   ├── AuthContext.tsx  # Authentication context
│   │   ├── main.tsx     # React entry point
│   │   └── index.css    # Global styles
│   ├── vite.config.ts   # Vite configuration
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Transactions
- `GET /api/transactions` - Get user transactions (protected)
- `POST /api/transactions` - Create transaction (protected)

### Beneficiaries
- `GET /api/beneficiaries` - Get user beneficiaries (protected)
- `POST /api/beneficiaries` - Add beneficiary (protected)
- `DELETE /api/beneficiaries/:id` - Remove beneficiary (protected)

### Health Check
- `GET /api/health` - Check API status

## Available Scripts

### Backend

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
```

### Frontend

```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Login attempt limiting
- Account lockout mechanism
- Input validation with Joi
- CORS protection
- Helmet security headers

## Development Notes

- The frontend uses Vite's proxy feature to forward `/api` requests to the backend
- All API calls from frontend go through the proxy to avoid CORS issues
- Authentication state is managed through React Context
- JWT tokens are stored in localStorage

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify MongoDB connection string in `.env`
- Ensure port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check Vite proxy configuration in `vite.config.ts`
- Ensure CORS is properly configured in backend

### Authentication issues
- Clear browser localStorage
- Verify JWT_SECRET is set in backend `.env`
- Check token expiration settings

## Future Enhancements

- Real-time notifications
- Mobile app
- Two-factor authentication
- Advanced transaction filtering
- Bill payment integration
- Investment portfolio management
- Credit score tracking

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

