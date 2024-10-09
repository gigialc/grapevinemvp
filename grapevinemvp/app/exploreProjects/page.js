"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ExploreProjects = () => {
  const [projects, setProjects] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetchProjects();
    }
  }, [session]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/user');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const users = await response.json();
      const allProjects = users.flatMap(user => 
        user.projects
          .filter(project => hasContent(project))
          .map(project => ({ 
            ...project, 
            userName: user.name, 
            userId: user._id,
            isCurrentUser: user.email === session.user.email
          }))
      );
      setProjects(allProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const hasContent = (project) => {
    return (
      project.title && 
      (project.description || project.link || (project.images && project.images.length > 0))
    );
  };

  const handleAddProject = () => {
    router.push('/add-project');
  };

  const handleCollaborationRequest = async (project) => {
    if (!session?.user) {
      alert("Please sign in to request collaboration.");
      return;
    }

    try {
      const response = await fetch('/api/collaboration-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project._id,
          userId: session.user.id,
          projectOwnerId: project.userId,
        }),
      });

      if (response.ok) {
        alert("Collaboration request sent successfully!");
      } else {
        throw new Error('Failed to send collaboration request');
      }
    } catch (error) {
      console.error('Error sending collaboration request:', error);
      alert("Failed to send collaboration request. Please try again.");
    }
  };


  return (
    <div className="bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-purple-800">Explore Startups and Projects</h1>
          <button
            onClick={handleAddProject}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300"
          >
            Add Project
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, index) => (
            <ProjectCard 
              key={index} 
              project={project} 
              onCollaborationRequest={handleCollaborationRequest}
              isCurrentUser={project.isCurrentUser}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onCollaborationRequest, isCurrentUser }) => (
  <div className="relative">
    <Link href={`/profile/${project.userId}`} className="block">
  <div className="bg-white rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
    <div className="p-3">
      <div className="justify-between mb-2">
        <h2 className="text-lg font-semibold text-purple-700 line-clamp-1">{project.title}</h2>
        {project.seekingCollaborators && (
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">
            Hiring
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-2">by @{project.userName}</p>
      {project.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
      )}
      {project.link && (
        <a 
          href={project.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs text-purple-600 hover:text-purple-800 inline-block mb-2"
        >
          View Project
        </a>
      )}
      {project.images && project.images.length > 0 && (
        <div className="grid grid-cols-2 gap-1">
          {project.images.slice(0, 4).map((image, imageIndex) => (
            <div key={imageIndex} className="relative aspect-square">
              <Image 
                src={image}
                alt={`Project image ${imageIndex + 1}`} 
                layout="fill"
                objectFit="cover"
                className="rounded-sm"
              />
            </div>
            
          ))}
        
         
        </div>
        
      )}
    </div>
  </div>
  </Link>
  </div>
);

export default ExploreProjects;