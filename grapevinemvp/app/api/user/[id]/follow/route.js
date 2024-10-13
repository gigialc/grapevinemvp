import { NextResponse } from 'next/server';
import { connectDB } from '@/mongodb';
import User from '@/models/User';

export async function POST(request, { params }) {
  const { id } = params;
  const { currentUserId } = await request.json();

  if (!currentUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(id);

    if (!currentUser || !targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (currentUser._id.toString() === targetUser._id.toString()) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    const isFollowing = currentUser.following.includes(targetUser._id);
    
    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(currentUser._id, { $pull: { following: targetUser._id } });
      await User.findByIdAndUpdate(targetUser._id, { $pull: { followers: currentUser._id } });
    } else {
      // Follow
      await User.findByIdAndUpdate(currentUser._id, { $addToSet: { following: targetUser._id } });
      await User.findByIdAndUpdate(targetUser._id, { $addToSet: { followers: currentUser._id } });
    }

    const updatedIsFollowing = !isFollowing;

    return NextResponse.json({ success: true, isFollowing: updatedIsFollowing });
  } catch (error) {
    console.error('Error updating follow status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}