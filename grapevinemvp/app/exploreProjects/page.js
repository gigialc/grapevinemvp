"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const ExploreProjects = () => {
  const [users, setUsers] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/user?currentUserEmail=${encodeURIComponent(session.user.email)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const hasContent = (project) => {
    return project.title || project.description || (project.images && project.images.length > 0);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user, userIndex) => (
            <div key={userIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-purple-700">@{user.name}</h2>
                {user.projects && user.projects.filter(hasContent).map((project, projectIndex) => (
                  <div key={projectIndex} className="mb-6 last:mb-0">
                    <h3 className="text-lg font-medium mb-2 text-gray-800">{project.title}</h3>
                    {project.description && (
                      <p className="text-gray-600 mb-2">{project.description}</p>
                    )}
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-purple-600 hover:text-purple-800 inline-block mb-2"
                      >
                        View Project
                      </a>
                    )}
                    {project.images && project.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {project.images.slice(0, 4).map((image, imageIndex) => (
                          <div key={imageIndex} className="relative aspect-square">
                            <Image 
                              src={image}
                              alt={`Project image ${imageIndex + 1}`} 
                              layout="fill"
                              objectFit="cover"
                              className="rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExploreProjects;