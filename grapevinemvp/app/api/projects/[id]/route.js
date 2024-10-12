import { NextResponse } from 'next/server';
import { connectDB } from '@/mongodb';
import Project from '@/models/Project';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const project = await Project.findById(params.id).populate('createdBy', 'name');

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}