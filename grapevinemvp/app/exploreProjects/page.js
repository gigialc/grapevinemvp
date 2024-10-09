"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar'
import ProjectCard from '../components/ProjectCard'

const ExploreProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectTypeFilter, setProjectTypeFilter] = useState('all');
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      fetchProjects();
    }
  }, [session]);

  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery, projectTypeFilter]);

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

  const filterProjects = () => {
    let filtered = projects;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.userName.toLowerCase().includes(query)
      );
    }

    if (projectTypeFilter !== 'all') {
      filtered = filtered.filter(project => project.type === projectTypeFilter);
    }

    setFilteredProjects(filtered);
  };

  const handleAddProject = () => {
    router.push('/add-project');
  };

  return (
    <div className="explore-page mx-2 mb-20">
      <Navbar />
      <div className="px-5 relative mb-20">
        <div className="flex justify-between items-start mb-10">
          <h1 className="text-2xl font-bold">Explore Projects</h1>
          <button
            onClick={handleAddProject}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded-full transition duration-300 absolute top-0 right-5"
          >
            Add Project
          </button>
        </div>
        
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 pl-12"
            />
            <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
  
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={index} 
              project={project}
            />
          ))}
        </div>
      </div>
    </div>
  );

};
export default ExploreProjects;


const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-300 break-inside-avoid mb-4">
      <Link href={`/profile/${project.userId}`}>
        <div className="p-4">
          {project.images && project.images.length > 0 && (
            <div className="mb-4">
              <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                <Image 
                  src={project.images[0]}
                  alt={`Project image`} 
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
          )}
          <h2 className="text-lg font-bold text-purple-700 line-clamp-2 mb-2">{project.title}</h2>
          <p className="text-sm text-gray-500 mb-2">by @{project.userName}</p>
          {project.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{project.description}</p>
          )}
          {project.seekingCollaborators && (
            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mb-2">
              Hiring
            </span>
          )}
        </div>
      </Link>
      <div className="px-4 pb-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {project.link && (
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
            >
              View <FaExternalLinkAlt className="ml-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};


