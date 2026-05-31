# MongoDB Compass Connection Guide

This guide provides connection strings and instructions for connecting to the ERP system database using MongoDB Compass.

## Connection Strings

### Local Development
```
mongodb://localhost:27017/erp_system
```

### MongoDB Atlas (Cloud)
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/erp_system?retryWrites=true&w=majority
```

## How to Connect with MongoDB Compass

1. **Download and Install MongoDB Compass**
   - Download from: https://www.mongodb.com/try/download/compass
   - Install and launch MongoDB Compass

2. **Connect to Local Database**
   - Open MongoDB Compass
   - In the connection string field, enter: `mongodb://localhost:27017/erp_system`
   - Click "Connect"

3. **Connect to MongoDB Atlas**
   - Open MongoDB Compass
   - In the connection string field, enter your Atlas connection string
   - Replace `<username>`, `<password>`, `<cluster>`, and `<database>` with your actual values
   - Click "Connect"

## Environment Variables

Make sure your `.env` file contains the correct `MONGODB_URI`:

```env
# For local development
MONGODB_URI=mongodb://localhost:27017/erp_system

# For MongoDB Atlas
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/erp_system?retryWrites=true&w=majority
```

## Database Collections

The ERP system uses the following collections:
- `users` - User accounts and profiles
- `courses` - Course information
- `enrollments` - Student course enrollments
- `attendance` - Attendance records
- `grades` - Student grades
- `fees` - Fee records and payments
- `messages` - Communication messages
- `rooms` - Room assignments
- `bookings` - Room bookings
- `assignments` - Course assignments
- `adminotps` - Admin OTP verification

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running locally: `mongod`
- Check if the port 27017 is not blocked by firewall
- Verify your Atlas credentials and network access

### Authentication Issues
- For Atlas, ensure your IP address is whitelisted
- Check username and password are correct
- Verify the database name matches your configuration

## Security Notes

- Never commit your `.env` file to version control
- Use strong passwords for database access
- Regularly rotate database credentials
- Enable MongoDB authentication for production environments 