import { NextResponse } from 'next/server';
import { connectDB } from '@/mongodb';
import User from '@/models/User';
import Project from '@/models/Project'; // Import new Project model
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    await connectDB();
    const { email, project } = await request.json();

    // Create new project
    const newProject = await Project.create({
      ...project,
      createdBy: email,
    });

    // Update user by adding the project reference
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $push: { projects: newProject._id } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error adding project:', error);
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
  }
}
