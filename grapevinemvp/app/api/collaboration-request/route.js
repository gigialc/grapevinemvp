import { NextResponse } from 'next/server';
import { connectDB } from '@/mongodb';
import CollaborationRequest from '@/models/CollaborationRequest';
import User from '@/models/User';
import Project from '@/models/Project';
import jwt from 'jsonwebtoken';

// POST request to create a new collaboration request
export async function POST(request) {
  try {
    await connectDB();

    const requestBody = await request.json();
    console.log('Incoming collaboration request body:', requestBody); // Log the request body

    const { requesterId, requestedUserId, projectId } = requestBody;

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

// GET request to retrieve collaboration requests by project ID
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId'); // Fetch requests by project ID

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const collaborationRequests = await CollaborationRequest.find({ project: projectId }).populate('requester', 'name');
    
    return NextResponse.json(collaborationRequests);
  } catch (error) {
    console.error('Error fetching collaboration requests:', error);
    return NextResponse.json({ error: 'Failed to fetch collaboration requests', details: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connectDB();
    
    const { requestId, status } = await request.json();

    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Extract the token from the request headers
    const token = request.headers.get('Authorization')?.split(' ')[1]; // Assuming Bearer token

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify and decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
    const currentUserId = decoded.id; // Assuming the user ID is stored in the 'id' field

    // Find the collaboration request
    const collaborationRequest = await CollaborationRequest.findById(requestId).populate('project');
    if (!collaborationRequest) {
      return NextResponse.json({ error: 'Collaboration request not found' }, { status: 404 });
    }

    // Check if the user is the owner of the project
    const project = await Project.findById(collaborationRequest.project);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (String(project.createdBy) !== currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update the collaboration request status
    collaborationRequest.status = status;
    await collaborationRequest.save();

    return NextResponse.json({ message: `Collaboration request ${status} successfully` });
  } catch (error) {
    console.error('Error updating collaboration request:', error);
    return NextResponse.json({ error: 'Failed to update collaboration request', details: error.message }, { status: 500 });
  }
}
