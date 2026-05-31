import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// In-memory storage for mock users (in a real app, this would be a database)
let mockUsers = [
  { email: 'demo@example.com', password: 'password', firstName: 'Demo', lastName: 'User' },
  { email: 'test@example.com', password: 'password', firstName: 'Test', lastName: 'User' },
  { email: 'aarjav200jain@gmail.com', password: 'password123', firstName: 'aarjav', lastName: 'jain' }
];

// Function to add a new mock user
export function addMockUser(userData: { firstName: string; lastName: string; email: string; password: string }) {
  mockUsers.push(userData);
  console.log('✅ Added new mock user:', userData.email);
  console.log('📋 Current mock users:', mockUsers.map(u => u.email).join(', '));
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Login request received');
    
    const body = await request.json();
    const { email, password } = body;
    
    console.log('📧 Login attempt for email:', email);

    // Validate required fields
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Try to connect to MongoDB
    try {
      console.log('🔌 Attempting to connect to MongoDB...');
      await dbConnect();
      console.log('✅ MongoDB connected successfully');

      // Find user by email
      const user = await User.findOne({ email, isActive: true });
      if (!user) {
        console.log('❌ User not found for email:', email);
        return NextResponse.json(
          { success: false, message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      console.log('✅ User found:', user.email, 'First name:', user.firstName);

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('🔐 Password validation result:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('❌ Password validation failed for user:', email);
        return NextResponse.json(
          { success: false, message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      console.log('🎉 Login successful for user:', email);
      return NextResponse.json({
        success: true,
        data: userResponse,
        message: 'Login successful'
      });

    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      
      // Fallback: Mock login for testing
      console.log('⚠️ Using fallback login (database connection failed)');
      
      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (mockUser) {
        console.log('✅ Mock login successful for:', email);
        return NextResponse.json({
          success: true,
          data: {
            _id: 'mock-user-id',
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            email: mockUser.email,
            isVerified: true,
            isActive: true,
            lastLogin: new Date()
          },
          message: 'Login successful (mock mode)'
        });
      } else {
        console.log('❌ Mock login failed - invalid credentials for:', email);
        console.log('💡 Available mock users:', mockUsers.map(u => u.email).join(', '));
        return NextResponse.json(
          { success: false, message: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

  } catch (error) {
    console.error('❌ Error logging in user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      { success: false, message: errorMessage, error: errorStack },
      { status: 500 }
    );
  }
} 