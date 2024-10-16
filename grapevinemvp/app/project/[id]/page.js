'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ProjectPage() {
    const params = useParams();
    const { data: session } = useSession();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [collaborationRequests, setCollaborationRequests] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [creatorId, setCreatorId] = useState(null);
    const [hasRequested, setHasRequested] = useState(false); // Track if the user already requested collaboration
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

    useEffect(() => {
        const fetchCollaborationRequests = async () => {
            if (!params.id) return;

            try {
                const response = await fetch(`/api/collaboration-requests?projectId=${params.id}`);
                const data = await response.json();
                setCollaborationRequests(data);
            } catch (error) {
                console.error('Error fetching collaboration requests:', error);
            }
        };

        const checkIfOwner = () => {
            if (project && session?.user?.id === project.createdBy) {
                setIsOwner(true);
            }
        };

        fetchCollaborationRequests();
        checkIfOwner();
    }, [params.id, session, project]);

    const handleAction = async (requestId, action) => {
        try {
            const response = await fetch(`/api/collaboration-requests`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, status: action }),
            });
            const data = await response.json();
            if (response.ok) {
                setCollaborationRequests(prev =>
                    prev.map(req => (req._id === requestId ? { ...req, status: action } : req))
                );
            } else {
                console.error('Error updating collaboration request:', data.error);
            }
        } catch (error) {
            console.error('Error updating collaboration request:', error);
        }
    };

    const handleCollaborationRequest = async () => {
        try {
            const requestBody = {
                requester: session?.user?.id,
                project: project?._id, // Ensure project._id is defined
                requestedUser: project?.createdBy, // Ensure createdBy is defined
            };

            // Log the request body for debugging
            console.log('Sending collaboration request with payload:', requestBody);

            const response = await fetch('/api/collaboration-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            // Log the response status and body for debugging
            console.log('Collaboration request response status:', response.status);
            const responseData = await response.json();
            console.log('Collaboration request response data:', responseData);

            if (response.ok) {
                setHasRequested(true);
            } else {
                console.error('Failed to send collaboration request:', responseData);
            }
        } catch (error) {
            console.error('Error sending collaboration request:', error);
        }
    };

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
              <div className="rounded-lg overflow-hidden">
                  <div className="p-6">
                      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                      <p className="text-lg text-gray-600 mb-4">by {creatorId.name}</p>
                      
                      {project.images && project.images.length > 0 && (
                          <div className="mb-6">
                              <Image
                                  src={project.images[0]}
                                  alt="Project main image"
                                  width={800}
                                  height={400}
                                  className="rounded-lg object-cover w-full"
                              />
                          </div>
                      )}

                      <div className="prose max-w-none mb-6">
                          <h2 className="text-xl font-semibold mb-2">Project Description</h2>
                          <p>{project.description}</p>
                      </div>

                      {project.link && (
                          <div className="mb-6">
                              <h2 className="text-xl font-semibold mb-2">Project Link</h2>
                              <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-600 hover:text-purple-800"
                              >
                                  View Project
                              </a>
                          </div>
                      )}

                      {project.seekingCollaborators && (
                          <div className="mb-6 bg-purple-100 p-4 rounded-lg">
                              <h2 className="text-xl font-semibold mb-2">Collaboration Opportunity</h2>
                              <p>{project.collaborationDetails}</p>
                              {!isOwner && !hasRequested && (
                                  <button
                                      className="mt-4 bg-purple-500 text-white font-semibold py-2 px-4 rounded hover:bg-purple-600 transition duration-300"
                                      onClick={handleCollaborationRequest}
                                  >
                                      Contact
                                  </button>
                              )}
                              {hasRequested && (
                                  <p className="mt-4 text-green-600">Collaboration request sent!</p>
                              )}
                          </div>
                      )}

                      {isOwner && collaborationRequests.length > 0 && (
                          <div className="mb-6">
                              <h2 className="text-xl font-semibold mb-2">Collaboration Requests</h2>
                              {collaborationRequests.map((request) => (
                                  <div key={request._id} className="bg-gray-100 p-4 rounded-lg mb-2">
                                      <p className="mb-2">{request.requester.name} is requesting to collaborate.</p>
                                      <div className="flex space-x-2">
                                          <button
                                              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                              onClick={() => handleAction(request._id, 'accepted')}
                                          >
                                              Accept
                                          </button>
                                          <button
                                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                              onClick={() => handleAction(request._id, 'rejected')}
                                          >
                                              Reject
                                          </button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}

                      {project.images && project.images.length > 1 && (
                          <div className="mb-6">
                              <h2 className="text-xl font-semibold mb-2">Project Gallery</h2>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  {project.images.slice(1).map((image, index) => (
                                      <div key={index} className="relative">
                                          <Image
                                              src={image}
                                              alt={`Project image ${index + 2}`}
                                              width={200}
                                              height={200}
                                              className="rounded-md object-cover w-full h-48"
                                          />
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
  );
}