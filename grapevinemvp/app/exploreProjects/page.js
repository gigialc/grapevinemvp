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
      const response = await fetch(`/api/user?currentUserEmail=${encodeURIComponent(session.user.email)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const users = await response.json();
      const allProjects = users.flatMap(user => 
        user.projects.map(project => ({ ...project, userName: user.name, userId: user._id }))
      );
      const populatedProjects = allProjects.filter(hasContent);
      setProjects(populatedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const hasContent = (project) => {
    return project.title && (project.description || (project.images && project.images.length > 0));
  };

  const handleCollaborationRequest = async (projectId) => {
    try {
      const response = await fetch(`/api/project/${projectId}/collaborate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: session.user.id })
      });
      if (!response.ok) {
        throw new Error('Failed to send collaboration request');
      }
      router.push('/projects');
    } catch (error) {
      console.error('Error sending collaboration request:', error);
    }
  }

  
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <p className="text-3xl font-bold mb-8 text-left text-purple-800">Explore Projects</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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