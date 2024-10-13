"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';

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
              Looking for Collaborators
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

export default ProjectCard;
