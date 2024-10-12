import React from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';

export default function ProjectDetails({ project }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-64 sm:h-80 md:h-96">
            <Image
              src={project.images[0] || '/placeholder-image.jpg'}
              alt={project.title}
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white text-center">{project.title}</h1>
            </div>
          </div>

          {/* Project Details */}
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap justify-between items-center mb-6">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-500">Created by: {project.createdBy}</p>
                <p className="text-sm text-gray-500">Date: {new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p>{project.description}</p>
            </div>

            {project.link && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Project Link</h2>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {project.link}
                </a>
              </div>
            )}

            {project.images.length > 1 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Project Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.images.slice(1).map((image, index) => (
                    <div key={index} className="relative h-48">
                      <Image src={image} alt={`Project image ${index + 2}`} layout="fill" objectFit="cover" className="rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.seekingCollaborators && (
              <div className="bg-purple-50 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4">Looking for Collaborators</h2>
                <p>{project.collaborationDetails}</p>
              </div>
            )}

            {/* Add more sections as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}