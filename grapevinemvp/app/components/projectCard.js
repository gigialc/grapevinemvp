import Image from 'next/image';
import Link from 'next/link';


const ProjectCard = ({ project, onCollaborationRequest, isCurrentUser }) => {
  return (
    <Link href={`/profile/${project.userId}`} className="block">
      <div className="project-card bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center mb-3">
          <div className="relative w-16 h-16 mr-3 flex-shrink-0">
            {project.images && project.images.length > 0 ? (
              <Image
                src={project.images[0]}
                alt={project.title}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl text-purple-500">{project.title.charAt(0)}</span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{project.title}</h2>
            <p className="text-sm text-gray-600 italic">by @{project.userName}</p>
          </div>
        </div>
        
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
          <p className="text-sm text-gray-600 italic line-clamp-2">{project.description || 'No description provided'}</p>
        </div>
        
        {project.images && project.images.length > 1 && (
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Project Images</h3>
            <div className="grid grid-cols-3 gap-1">
              {project.images.slice(1, 4).map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <Image 
                    src={image}
                    alt={`Project image ${index + 2}`} 
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              ))}
              {project.images.length > 4 && (
                <div className="relative aspect-square bg-purple-100 rounded-md flex items-center justify-center">
                  <span className="text-sm text-purple-600">+{project.images.length - 4} more</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-purple-600 hover:text-purple-800"
                onClick={(e) => e.stopPropagation()}
              >
                View Project
              </a>
            )}
          </div>
          <div className="flex items-center">
            {project.seekingCollaborators && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                Hiring
              </span>
            )}
            {project.seekingCollaborators && !isCurrentUser && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onCollaborationRequest(project);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-1 px-2 rounded transition duration-300"
              >
                Collaborate
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard