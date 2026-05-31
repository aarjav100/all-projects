import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email parameter is required' 
      }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email }).select('-password');
    
    if (user) {
      return NextResponse.json({
        success: true,
        data: user,
        message: 'User found'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Database error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 