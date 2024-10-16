import { NextResponse } from 'next/server';
import { connectDB } from '@/mongodb';
import User from '@/models/User';

export async function GET(request, { params }) {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    await connectDB();

    switch (action) {
      case 'profile':
        return await getProfile(id);
      case 'followers':
        return await getFollowers(id);
      case 'following':
        return await getFollowing(id);
      default:
        return await getProfile(id);
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function getProfile(id) {
  const user = await User.findById(id).select('-password');
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

async function getFollowers(id) {
  const user = await User.findById(id).populate('followers', 'name email profileImage');
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user.followers);
}

async function getFollowing(id) {
  const user = await User.findById(id).populate('following', 'name email profileImage');
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user.following);
}