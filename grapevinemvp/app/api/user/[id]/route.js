import { NextResponse } from 'next/server';
import { connectDB } from '@/mongodb';
import User from '@/models/User';
import { ObjectId } from 'mongodb'; // Make sure to import ObjectId

export async function GET(request) {
  try {
    await connectDB();

    // Extract search parameters from the request URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('_id'); // This is the id being passed
    const currentUserEmail = searchParams.get('currentUserEmail');

    // Fetch the whole user information if 'id' param is provided
    if (id) { // Changed from 'email' to 'id'
      const user = await User.findOne({
        _id: ObjectId(id) // Use ObjectId to find by id
      }).select('-password').populate('projects');
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    // Fetch all users except the current user if 'currentUserEmail' param is provided
    if (currentUserEmail) {
      const users = await User.find({ email: { $ne: currentUserEmail } })
        .select('-password')
        .populate('projects');
      return NextResponse.json(users);
    }

    // Fetch all users if no specific query params are provided
    const allUsers = await User.find().select('-password').populate('projects');
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error fetching user(s):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
