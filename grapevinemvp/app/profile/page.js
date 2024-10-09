'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from "../components/Navbar";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle, 
  faTools, 
  faBriefcase, 
  faGraduationCap, 
  faProjectDiagram, 
  faPlus,
  faMapMarkerAlt 
} from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (session?.user?.email) {
            fetchUserData(session.user.email);
        }
    }, [session]);

    const fetchUserData = async (email) => {
        try {
            const response = await fetch(`/api/user?email=${email}`);
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    if (status === 'loading' || !user) {
        return <div>Loading...</div>;
    }

    const handleAddProject = () => {
        router.push('/add-project');
    };

    const isOwnProfile = session?.user?.email === user.email;

    return (
        <main className="container mx-auto px-4 bg-gray-100 min-h-screen">
            <Navbar />
            <div className="rounded-lg overflow-hidden my-4 md:my-8 shadow-md bg-white">
                <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div className="flex flex-col md:flex-row md:items-center">
                            <img 
                                src={user.profileImage || '/images/default-avatar.png'}
                                alt={user.name} 
                                className="w-24 h-24 rounded-full border-4 border-white mb-4 md:mb-0 md:mr-4"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-black">{user.name}</h1>
                                <p className="text-black opacity-75 mt-1">{user.bio}</p>
                                <p className="text-gray-600 flex items-center mt-1">
                                    <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-purple-600" />
                                    {user.education}
                                </p>
                                <p className="text-gray-600 flex items-center mt-1">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-purple-600" />
                                    {user.location}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                            {isOwnProfile ? (
                                <Link href="/profile/edit" className="text-purple-600 px-4 py-2 rounded-full hover:bg-purple-100 transition duration-300 inline-block">
                                    Edit Profile
                                </Link>
                            ) : (
                                <button className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300">
                                    Connect
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {user.skills && user.skills.map((skill, index) => (
                            <span key={index} className="bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm font-semibold">
                                {skill}
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {user.website && <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">Website</a>}
                        {user.socialLinks?.linkedin && <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">LinkedIn</a>}
                        {user.socialLinks?.github && <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black">GitHub</a>}
                    </div>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden my-4 md:my-8 ">
                <div className="p-4 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Projects</h2>
                        {isOwnProfile && (
                            <button 
                                onClick={handleAddProject}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300"
                            >
                                Add Project
                            </button>
                        )}
                    </div>
                    {user.projects && user.projects.map((project, index) => (
                        <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                            {project.seekingCollaborators && (
                            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 mb-5 rounded">
                                Hiring
                            </span>
                            )}
                            
                            <h3 className="text-xl font-semibold">{project.title}</h3>
                            <p className="text-gray-700 mt-2">{project.description}</p>
                            {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 mt-2 inline-block">View Project</a>}
                            {project.images && project.images.length > 0 && (
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {project.images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <Image 
                                                src={image}
                                                alt={`Project image ${index + 1}`} 
                                                width={200} 
                                                height={200} 
                                                className="rounded-md object-cover w-full h-auto"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}