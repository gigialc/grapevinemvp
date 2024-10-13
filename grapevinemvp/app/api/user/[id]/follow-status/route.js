import { NextResponse } from 'next/server';
import { connectDB } from '@/mongodb';
import User from '@/models/User';

export async function GET(request, { params }) {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('currentUserId');

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

        const isFollowing = currentUser.following.includes(targetUser._id);

        return NextResponse.json({ isFollowing });
    } catch (error) {
        console.error('Error fetching follow status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}