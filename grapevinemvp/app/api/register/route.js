import { NextResponse } from 'next/server';
import { connectDB } from '../../../mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    await connectDB();

    // ... (rest of the function remains the same)
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 });
  }
}