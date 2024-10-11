import { NextResponse } from 'next/server';
import { connectDB } from '@/mongodb';
import User from '@/models/User'; 
import Project from '@/models/Project';
import { ObjectId } from 'mongodb';


// Tag validation
const validTags = [
  'Tech', 'Finance', 'Art', 'Music', 'Health & Wellness', 'Education',
  'Environmental', 'Nonprofit', 'Entrepreneurship', 'Writing & Literature',
  'Entertainment', 'Gaming', 'Social Impact', 'Science', 'Fashion'
];

function validateTags(tags) {
  return tags.every(tag => validTags.includes(tag));
}

export async function POST(request) {
    try {
      await connectDB();
  
      const project = await request.json();
  
      if (!project.tags || !validateTags(project.tags)) {
        return NextResponse.json({ error: 'Invalid tags provided' }, { status: 400 });
      }
  
      if (!project.createdBy) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
      }
  
      // Find the user by ID to associate them as the creator of the project
      const user = await User.findById(project.createdBy);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      // Create a new project document, associating it with the user (creator)
      const newProject = await Project.create({
        ...project,
        createdBy: user._id, // Associate the user by their ObjectId
      });
  
      // Update the user's document to include the new Project
      await User.findByIdAndUpdate(
        user._id,
        { $push: { projects: newProject._id } },
        { new: true, runValidators: true }
      );
  
      return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
      console.error('Error adding project:', error);
      return NextResponse.json({ error: 'Failed to add project', details: error.message }, { status: 500 });
    }
  }

// Edit an existing Project (PUT request handler)
export async function PUT(request) {
  try {
    await connectDB();

    const { projectId, projectUpdates } = await request.json();

    if (projectUpdates.tags && !validateTags(projectUpdates.tags)) {
      return NextResponse.json({ error: 'Invalid tags provided' }, { status: 400 });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { ...projectUpdates },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// Delete an existing Project (DELETE request handler)
export async function DELETE(request) {
  try {
    await connectDB();

    const { projectId, email } = await request.json();

    // Find the project by its ID and delete it from the database
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Remove the project reference from the user's projects array
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $pull: { projects: new ObjectId(projectId) } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        let projects;

        if (userId) {
            // Fetch projects for the specific user
            projects = await Project.find({ createdBy: userId }).populate('createdBy', 'name email');
        } else {
            // Fetch all projects if no userId is provided
            projects = await Project.find().populate('createdBy', 'name email');
        }

        // Map the projects to include the userName
        const projectsWithUserName = projects.map(project => ({
            ...project.toObject(),
            userName: project.createdBy ? project.createdBy.name : 'Unknown User'
        }));

        return NextResponse.json(projectsWithUserName);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}