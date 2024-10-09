import Image from 'next/image';

const ProjectCard = ({ project, onCollaborationRequest, isCurrentUser }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
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
          >
            View Project
          </a>
        )}
        {project.images && project.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
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
        {project.seekingCollaborators && (
          <p className="text-green-600 font-semibold mb-2">Looking for collaborators!</p>
        )}
        {project.seekingCollaborators && !isCurrentUser && (
          <button
            onClick={() => onCollaborationRequest(project)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Request Collaboration
          </button>
        )}
      </div>
    </div>
  );

export default ProjectCard;