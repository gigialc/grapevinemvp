import { NextResponse } from 'next/server';
import { connectDB } from '@/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const currentUserEmail = searchParams.get('currentUserEmail');

    // Case 1: Fetch a specific user by email
    if (email) {
      const user = await User.findOne({ email }).select('-password');
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    // Case 2: Fetch all users except the current user
    if (currentUserEmail) {
      const users = await User.find({ email: { $ne: currentUserEmail } }).select('-password');
      return NextResponse.json(users);
    }

    // Case 3: Fetch all users if no email or currentUserEmail is provided
    const allUsers = await User.find().select('-password');
    return NextResponse.json(allUsers);

  } catch (error) {
    console.error('Error fetching user(s):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { email, ...updateData } = data;

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}