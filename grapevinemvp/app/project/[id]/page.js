'use client'

import { useState, useEffect, use } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function ProjectPage() {
    const params = useParams();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session } = useSession()
    const [users, setUsers] = useState([])
    const [creatorId, setCreatorId] = useState(null)

    useEffect(() => {
        fetchUsers()
    }, [session])


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
        setCreatorId(data.createdBy)
      } catch (error) {
        console.error('Error fetching project:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

   // fetch user data from the creatorId from the project data 
    const fetchUsers = async () => {
     if (session?.user?.email) {
        try {
          const response = await fetch(`/api/user?userId=${creatorId}`)
          if (!response.ok) {
             throw new Error('Failed to fetch users')
          }
          const data = await response.json()
          setUsers(data)
        } catch (error) {
          console.error('Error fetching users:', error)
        }
     }
    }
   


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
        <p className="text-lg text-gray-600 mb-4">by {users.name}</p>
        {project.images && project.images.length > 0 && (
          <div className="mb-6">
            <Image
              src={project.images[0]}
              alt={project.title}
              width={800}
              height={400}
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        )}
        <p className="text-lg mb-6">{project.description}</p>
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
        {project.seekingCollaborators && (
          <div className="mt-6 bg-green-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Looking for Collaborators</h2>
            <p>{project.collaborationDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
}