'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import Navbar from '../components/Navbar';
import Image from 'next/image';

export default function AddProjectContent() {
  const searchParams = useSearchParams();
  const projectType = searchParams.get('type');
  const router = useRouter();
  const { data: session } = useSession();
  
  const [project, setProject] = useState({
    title: '',
    description: '',
    link: [],
    images: [],
    seekingCollaborators: false,
    collaborationDetails: '',
    tags: [],
  });

    const handleRemoveImage = (index) => {
        setProject(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!session || !session.user) {
          console.error("User not authenticated");
          return;
        }
      
        const newProject = {
          ...project,
          createdBy: session.user.id,
        };
      
        try {
          const response = await fetch('/api/projects', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProject),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add project');
          }
      
          const createdProject = await response.json();
          console.log('Project added successfully', createdProject);
      
          // Clear the form
          setProject({
            title: '',
            description: '',
            link: [],
            images: [],
            seekingCollaborators: false,
            collaborationDetails: '',
            tags: [],
          });
      
        } catch (error) {
          console.error('Error adding project:', error);
        }
      };

    const handleTagToggle = (tag) => {
        setProject(prev => ({
        ...prev,
        tags: prev.tags.includes(tag)
            ? prev.tags.filter(t => t !== tag)
            : [...prev.tags, tag]
        }));
    };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];
  
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        uploadedUrls.push(data.secure_url);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  
    setProject(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
  };


  return (
        <div className="bg-gray-100 min-h-screen">
          <Navbar />
          <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Add {projectType} Project</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={project.title}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter project title"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={project.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your project"
            />
          </div>
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Project Links</label>
            <input
              type="url"
              id="link"
              name="link"
              value={project.link}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://your-project-link.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Images</label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  id="images"
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
              </label>
            </div>
          </div>
  
          {project.images && project.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {project.images.map((image, index) => (
                <div key={index} className="relative">
                  <Image 
                    src={image}
                    alt={`Project image ${index + 1}`} 
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
  
          <div className="mb-4 mt-10">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={project.seekingCollaborators}
                onChange={(e) => setProject({...project, seekingCollaborators: e.target.checked})}
                className="mr-2"
              />
              Looking for team members?
            </label>
          </div>
          {project.seekingCollaborators && (
            <div className="mb-4">
              <label htmlFor="collaborationDetails" className="block text-sm font-medium text-gray-700 mb-1">
                What are you looking for in a team member?
              </label>
              <textarea
                id="collaborationDetails"
                name="collaborationDetails"
                value={project.collaborationDetails}
                onChange={(e) => setProject({...project, collaborationDetails: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Describe the skills or roles you're looking for in a team member"
              />
            </div>
          )}
  
         {/* tags that you can select in bubbles */}
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tag your project for people to find you!</label>
          <div className="flex flex-wrap gap-2">
            {['Tech', 'Finance', 'Art', 'Music', 'Health & Wellness', 'Education', 'Environmental', 'Nonprofit', 'Entrepreneurship', 'Writing & Literature', 'Entertainment', 'Social Impact', 'Science', 'Fashion', 'Social Media'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  project.tags.includes(tag)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>   

          <button
            type="submit"
            className="w-full bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Project
          </button>
        </form>
      </div>
    </div>
  );
}