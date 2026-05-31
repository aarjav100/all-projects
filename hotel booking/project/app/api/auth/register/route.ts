import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { addMockUser } from '../login/route';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('Registration request received');
    
    const body = await request.json();
    const { firstName, lastName, email, password, phone } = body;
    
    console.log('Registration data:', { firstName, lastName, email, phone: phone ? 'provided' : 'not provided' });
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      console.log('Missing required fields:', { firstName: !!firstName, lastName: !!lastName, email: !!email, password: !!password });
      return NextResponse.json(
        { success: false, message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Try to connect to MongoDB
    try {
      console.log('Attempting to connect to MongoDB...');
      await dbConnect();
      console.log('MongoDB connected successfully');
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('User already exists with email:', email);
        return NextResponse.json(
          { success: false, message: 'User with this email already exists' },
          { status: 409 }
        );
      }
      
      // Hash password
      console.log('Hashing password...');
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create new user
      console.log('Creating new user...');
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone
      });
      
      await user.save();
      console.log('User saved successfully:', user._id);
      
      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;
      
      return NextResponse.json({
        success: true,
        data: userResponse,
        message: 'User registered successfully'
      }, { status: 201 });
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Fallback: Mock registration for testing
      console.log('⚠️ Using fallback registration (no database)');
      
      // Add the new user to mock users list so they can log in
      addMockUser({ firstName, lastName, email, password });
      
      // Simulate successful registration
      return NextResponse.json({
        success: true,
        data: {
          _id: 'mock-user-id',
          firstName,
          lastName,
          email,
          phone,
          isVerified: true,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        message: 'User registered successfully (mock mode)'
      }, { status: 201 });
    }
    
  } catch (error) {
    console.error('Error registering user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      { success: false, message: errorMessage, error: errorStack },
      { status: 500 }
    );
  }
} 