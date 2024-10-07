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
    router.push('/add-project'); // Adjust this route to match your project structure
  };


  return (
    <div className="bg-gray-100 min-h-screen">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <p className="text-3xl font-bold text-purple-800">Explore Projects</p>
        <button
          onClick={handleAddProject}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Add Project
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Link href={`/profile/${project.userId}?tab=projects`} key={index}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-purple-700">{project.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">by @{project.userName}</p>
                  {project.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  )}
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-purple-600 hover:text-purple-800 inline-block mb-4"
                      onClick={(e) => e.stopPropagation()}
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExploreProjects;