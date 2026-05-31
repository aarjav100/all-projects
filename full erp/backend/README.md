# Hotel Booking Backend

A Node.js/Express backend for the Hotel Booking System with MongoDB integration.

## Features

- 🔐 JWT-based authentication
- 👥 Role-based access control (admin, customer)
- 📧 Email OTP for admin login
- 🏨 Hotel room management
- 📅 Booking and reservation system
- 💳 Payment processing
- 📊 Analytics and reporting
- 🔒 Security middleware (helmet, rate limiting, CORS)
- 📝 Input validation
- 🗄️ MongoDB database with Mongoose ODM

## Quick Start

### 1. Prerequisites

- Node.js (v16 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>
cd hotel-booking-backend

# Install dependencies
npm install

# Copy environment variables
cp env.example .env
```

### 3. Environment Configuration

Edit the `.env` file with your settings:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hotelbooking

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# Start MongoDB (if not already running)
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod
```

### 5. Seed the Database

```bash
# Create sample data
npm run seed
```

### 6. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Customer login
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/send-otp` - Send admin OTP
- `POST /api/auth/verify-otp` - Verify admin OTP
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/customers` - Get all customers (admin only)
- `GET /api/users/customers/:id` - Get customer by ID (admin only)

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room (admin only)
- `GET /api/rooms/:id` - Get room by ID
- `PUT /api/rooms/:id` - Update room (admin only)
- `DELETE /api/rooms/:id` - Delete room (admin only)

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Payments
- `GET /api/payments` - Get payment history
- `POST /api/payments` - Process payment
- `GET /api/payments/:id` - Get payment by ID

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/analytics` - Get analytics data

## Sample Credentials

After running the seed script:

- **Admin**: `admin@hotel.com` / `admin123`
- **Customer**: `customer@hotel.com` / `customer123`

## Email Configuration

For development, the email service uses a mock transporter that logs emails to the console. To use real email:

1. Set up your email credentials in `.env`
2. The mock service will automatically switch to real email sending

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation with express-validator
- SQL injection protection (MongoDB)

## Development

### Project Structure

```
backend/
├── config/
│   └── database.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── notFound.js
├── models/
│   ├── User.js
│   ├── Course.js (used for Rooms)
│   ├── Enrollment.js (used for Bookings)
│   └── ...
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── courses.js (used for rooms)
│   └── ...
├── scripts/
│   └── seed.js
├── utils/
│   └── email.js
├── server.js
└── package.json
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

## Troubleshooting

### Database Connection Issues
- Verify your MongoDB connection string
- Check if MongoDB is running
- Ensure the database name is correct

### CORS Issues
- Check FRONTEND_URL in .env
- Ensure frontend is running on the correct port

### Email Issues
- Check email credentials in .env
- For development, emails are logged to console

### Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration settings
- Ensure proper role assignments

## License

MIT License 