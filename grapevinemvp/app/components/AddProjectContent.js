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
      
        // Validate tags
        if (!Array.isArray(project.tags) || project.tags.length === 0 || project.tags.length > 5) {
            console.error("Invalid tags provided");
            // You might want to set an error state here to display to the user
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
            // Redirect to the project page
            router.push(`/projects/${createdProject._id}`);
      
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
        setProject(prev => {
          const updatedTags = prev.tags.includes(tag)
            ? prev.tags.filter(t => t !== tag)
            : [...prev.tags, tag];
          
          // Limit to 5 tags
          if (updatedTags.length > 5) {
            return prev; // Don't update if we're exceeding 5 tags
          }
      
          return {
            ...prev,
            tags: updatedTags
          };
        });
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
    <div className=" min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-8 bg-white rounded-lg shadow-xl p-8 mb-20">
        <h1 className="text-3xl font-bold mb-8 text-left text-purple-800">
         What are you working on?
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="group">
            <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={project.title}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ease-in-out hover:border-purple-300"
              placeholder="Enter your awesome project title"
            />
          </div>
  
          <div className="group">
            <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={project.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ease-in-out hover:border-purple-300"
              placeholder="Describe"
            />
          </div>
  
          <div className="group">
            <label htmlFor="link" className="block text-lg font-medium text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
              Project Link (optional)
            </label>
            <input
              type="url"
              id="link"
              name="link"
              value={project.link}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ease-in-out hover:border-purple-300"
              placeholder="https://your-awesome-project.com"
            />
          </div>
  
          <div>
        <label className="block text-lg font-medium text-gray-700 mb-4">Project Images</label>
        <div className="flex items-center justify-center w-full">
            <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 transition duration-300 ease-in-out">  
            <div className="flex flex-col items-center justify-center pt-3 pb-4">
                <svg className="w-8 h-8 mb-3 text-purple-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2 text-sm text-purple-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-purple-500">PNG, JPG, GIF up to 10MB</p>
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
        <div className="mt-4 grid grid-cols-2 gap-4">
            {project.images.map((image, index) => (
            <div key={index} className="relative group">
                <Image 
                src={image}
                alt={`Project image ${index + 1}`} 
                width={100}
                height={100}
                className="rounded-md object-cover w-full h-full transition duration-300 ease-in-out group-hover:opacity-75"
                />
                <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                </button>
            </div>
            ))}
        </div>
        )}
  
          <div className="mb-6 bg-purple-50 p-4 rounded-lg shadow-inner">
            <label className="flex items-center space-x-3 text-lg font-medium text-purple-700 cursor-pointer">
              <input
                type="checkbox"
                checked={project.seekingCollaborators}
                onChange={(e) => setProject({...project, seekingCollaborators: e.target.checked})}
                className="form-checkbox h-5 w-5 text-purple-600 transition duration-150 ease-in-out"
              />
              <span>👥 Looking for collaborators?</span>
            </label>
          </div>
  
          {project.seekingCollaborators && (
            <div className="mb-6  p-4 rounded-lg">
              <label htmlFor="collaborationDetails" className="block text-lg font-medium text-purple-700 mb-2">
                What are you looking for in a collaborator?
              </label>
              <textarea
                id="collaborationDetails"
                name="collaborationDetails"
                value={project.collaborationDetails}
                onChange={(e) => setProject({...project, collaborationDetails: e.target.value})}
                className="w-full p-3 border-2 rounded-md transition-all duration-300 ease-in-out"
                placeholder="Describe the skills or roles you're looking for in a team member"
                rows={3}
              />
            </div>
          )}
  
                <div className="mb-8">
                <label className="block text-lg font-medium text-gray-700 mb-3">
                    Tag your project for people to find you! (Max 4 tags)
                </label>
                <div className="flex flex-wrap gap-2">
                    {['Tech', 'Finance', 'Art', 'Music', 'Health & Wellness', 'Education', 'Environmental', 'Nonprofit', 'Entrepreneurship', 'Writing & Literature', 'Entertainment', 'Social Impact', 'Science', 'Fashion', 'Social Media'].map((tag) => (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => project.tags.length < 5 || project.tags.includes(tag) ? handleTagToggle(tag) : null}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition duration-300 ease-in-out transform hover:-translate-y-1 ${
                        project.tags.includes(tag)
                            ? 'bg-purple-600 text-white shadow-lg'
                            : project.tags.length >= 5
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        disabled={project.tags.length >= 5 && !project.tags.includes(tag)}
                    >
                        {tag}
                    </button>
                    ))}
                </div>
                {project.tags.length >= 5 && (
                    <p className="text-sm text-red-500 mt-2">Maximum number of tags reached (5)</p>
                )}
                </div>
  
          <button
            type="submit"
            className="w-full bg-purple-800 text-white text-lg font-bold py-4 rounded-md hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
             Submit
          </button>
        </form>
      </div>
    </div>
  );
}