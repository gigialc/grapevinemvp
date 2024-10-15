import { NextResponse } from 'next/server';
import { connectDB } from '@/mongodb';
import User from '@/models/User';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

// GET request handler to retrieve users or a specific user
export async function GET(request) {
  try {
    await connectDB();

    // Extract search parameters from the request URL
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const currentUserEmail = searchParams.get('currentUserEmail');

    // Fetch the whole user information if 'email' param is provided
    if (email) {
      const user = await User.findOne({
        email
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

// PUT request handler to update a user or add a project to the user's project list
export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { email, project, ...updateData } = data;

    let updateOperation;

    // If a project is provided, prepare to add the project to the user's project list
    if (project) {
      const newProject = await Project.create({
        ...project,
        _id: new ObjectId(),
        createdBy: await User.findOne({ email }).select('_id')
      });
      updateOperation = {
        $push: { projects: newProject._id }
      };
    } else if (Object.keys(updateData).length > 0) { // general user update
      updateOperation = { $set: updateData };
    } else {
      return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      updateOperation,
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

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { email, password, name } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      profileImage: '',
      bio: '',
      website: '',
      skills: [],
      education: [],
      socialLinks: {
        linkedin: '',
        github: '',
      },
      interests: [],
    });

    // Remove password from the response
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}