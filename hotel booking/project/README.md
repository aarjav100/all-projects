# Hotel Booking Application

A modern hotel booking application built with Next.js, React, TypeScript, Tailwind CSS, and MongoDB.

## Features

- 🏨 **Hotel Search & Filtering** - Search hotels by location, price, rating, and amenities
- 🔐 **User Authentication** - Secure sign-up and sign-in functionality
- 📅 **Booking System** - Complete booking flow with room selection and payment
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful interface built with Radix UI and Tailwind CSS
- 🗄️ **MongoDB Database** - Persistent data storage with Mongoose ODM

## Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: bcryptjs for password hashing
- **Icons**: Lucide React
- **Development**: ESLint, Prettier

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (version 16 or higher)
2. **MongoDB** (local installation or MongoDB Atlas account)
3. **npm** or **yarn** package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hotel-booking-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**

   **Option A: Local MongoDB**
   - Install MongoDB locally on your machine
   - Start MongoDB service
   - The app will connect to `mongodb://localhost:27017/hotelbooker`

   **Option B: MongoDB Atlas (Recommended)**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Create a `.env.local` file in the root directory with:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotelbooker?retryWrites=true&w=majority
     ```

4. **Seed the database**
   ```bash
   npm run seed
   ```
   This will populate the database with sample hotels and users.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Database Schema

### Hotels Collection
```javascript
{
  name: String (required),
  location: String (required),
  description: String (required),
  image: String (required),
  price: Number (required),
  rating: Number (0-5),
  reviews: Number,
  amenities: [String],
  roomTypes: [{
    id: String,
    name: String,
    price: Number,
    capacity: Number,
    description: String,
    available: Boolean
  }],
  isActive: Boolean
}
```

### Users Collection
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String,
  isVerified: Boolean,
  isActive: Boolean,
  lastLogin: Date
}
```

### Bookings Collection
```javascript
{
  bookingId: String (required, unique),
  userId: ObjectId (ref: User),
  hotelId: ObjectId (ref: Hotel),
  roomType: {
    id: String,
    name: String,
    price: Number,
    capacity: Number
  },
  checkIn: Date (required),
  checkOut: Date (required),
  guests: {
    adults: Number,
    children: Number,
    infants: Number
  },
  pricing: {
    roomPrice: Number,
    nights: Number,
    subtotal: Number,
    tax: Number,
    serviceFee: Number,
    total: Number
  },
  guestInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  },
  payment: {
    method: String,
    status: String,
    transactionId: String,
    lastFourDigits: String
  },
  status: String
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Hotels
- `GET /api/hotels` - Get hotels with filtering and pagination
- `POST /api/hotels` - Create new hotel (admin only)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking

## Sample Data

After running the seed script, you'll have:

### Sample Users
- **Email**: john.doe@example.com, **Password**: password123
- **Email**: jane.smith@example.com, **Password**: password123

### Sample Hotels
- Grand Plaza Hotel (New York, NY)
- Ocean View Resort (Miami, FL)
- Mountain Lodge (Aspen, CO)
- Urban Boutique Hotel (San Francisco, CA)
- Historic Inn (Charleston, SC)
- Desert Oasis Resort (Phoenix, AZ)

## Features in Detail

### 🔍 Search & Filtering
- Real-time search suggestions
- Filter by price range, rating, and amenities
- Sort by popularity, price, or rating
- Pagination support

### 🔐 Authentication
- Secure password hashing with bcryptjs
- Email validation
- User registration and login
- Session management

### 📅 Booking System
- Room type selection
- Date picker for check-in/check-out
- Guest count selection
- Real-time price calculation
- Payment information collection
- Booking confirmation with reference number

### 📱 Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Optimized for all screen sizes

## Development

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── bookings/          # Bookings page
│   ├── hotels/            # Hotels page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── booking/          # Booking components
│   └── ui/               # UI components
├── lib/                  # Utility libraries
│   ├── mongodb.ts        # MongoDB connection
│   └── utils.ts          # Utility functions
├── models/               # Mongoose models
├── scripts/              # Database scripts
└── types/                # TypeScript types
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- **Netlify**: Configure build settings for Next.js
- **Railway**: Add MongoDB add-on
- **Heroku**: Add MongoDB Atlas add-on

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/hotelbooker

# For production (MongoDB Atlas)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotelbooker?retryWrites=true&w=majority
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include your Node.js version, MongoDB version, and error logs

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM 