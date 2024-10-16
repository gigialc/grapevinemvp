import { NextResponse } from 'next/server';
import { connectDB } from '@/mongodb';
import CollaborationRequest from '@/models/CollaborationRequest';
import User from '@/models/User';
import Project from '@/models/Project';

// POST request to create a new collaboration request
export async function POST(request) {
  try {
    await connectDB();

    const { requesterId, requestedUserId, projectId } = await request.json();

    // Validate that the requester, requested user, and project exist
    const requester = await User.findById(requesterId);
    const requestedUser = await User.findById(requestedUserId);
    const project = await Project.findById(projectId);

    if (!requester || !requestedUser || !project) {
      return NextResponse.json({ error: 'User or project not found' }, { status: 404 });
    }

    // Create a new collaboration request
    const newRequest = await CollaborationRequest.create({
      requester: requesterId,
      requestedUser: requestedUserId,
      project: projectId,
      status: 'pending',
    });

    return NextResponse.json({ message: 'Collaboration request sent', request: newRequest }, { status: 201 });
  } catch (error) {
    console.error('Error creating collaboration request:', error);
    return NextResponse.json({ error: 'Failed to create collaboration request', details: error.message }, { status: 500 });
  }
}

// PUT request to accept/reject a collaboration request
export async function PUT(request) {
  try {
    await connectDB();

    const { requestId, action } = await request.json();

    const requestToUpdate = await CollaborationRequest.findById(requestId);

    if (!requestToUpdate) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Update the status of the request based on the action
    if (action === 'accept') {
      requestToUpdate.status = 'accepted';
    } else if (action === 'reject') {
      requestToUpdate.status = 'rejected';
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await requestToUpdate.save();

    return NextResponse.json({ message: `Collaboration request ${action}ed`, request: requestToUpdate });
  } catch (error) {
    console.error('Error updating collaboration request:', error);
    return NextResponse.json({ error: `Failed to ${action} collaboration request`, details: error.message }, { status: 500 });
  }
}

// GET request to retrieve collaboration requests (optional)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId'); // Optional, if you want to fetch requests for a specific user

    let requests;
    if (userId) {
      // Fetch collaboration requests for a specific user
      requests = await CollaborationRequest.find({ requestedUser: userId }).populate('requester project');
    } else {
      // Fetch all collaboration requests
      requests = await CollaborationRequest.find().populate('requester project');
    }

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching collaboration requests:', error);
    return NextResponse.json({ error: 'Failed to fetch collaboration requests', details: error.message }, { status: 500 });
  }
}
