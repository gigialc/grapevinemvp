'use client'

import { useState, useEffect, use } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export default function ProjectPage() {
    const params = useParams();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session } = useSession()
    const [users, setUsers] = useState([])
    const [creatorId, setCreatorId] = useState(null)
    const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      if (!params.id) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const data = await response.json();
        setProject(data);
        setCreatorId(data.createdBy); // Ensure this is set correctly
      } catch (error) {
        console.error('Error fetching project:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [params.id]);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  
  return (
    <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
            <a href={`/live`} className="ml-2 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-red-600 transition duration-300 ring-2 ring-black"></a>
            <p className="text-lg text-gray-600 mb-4 mt-4">by {creatorId.name}</p>

            {project.seekingCollaborators && (
                <div className="mt-6 bg-purple-100 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Looking for Collaborators</h2>
                    <p>{project.collaborationDetails}</p>
                    {/* <button 
                        className="mt-4 bg-purple-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                        onClick={handleContactClick}
                    >

                        Contact
                    </button> */}
                </div>
            )}

        {project.images && project.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {project.images.map((image, imageIndex) => (
                                <div key={imageIndex} className="relative">
                                    <Image 
                                        src={image}
                                        alt={`Project image ${imageIndex + 1}`} 
                                        width={200} 
                                        height={200} 
                                        className="rounded-md object-cover w-full h-auto"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
        <p className="text-lg mb-6 mt-10">{project.description}</p>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800"
          >
            Project Link
          </a>
        )}
      </div>
    </div>
  );
}
