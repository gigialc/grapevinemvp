'use client'
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from "../../components/Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faMapMarkerAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { faUserFriends, faUserPlus } from '@fortawesome/free-solid-svg-icons';

export default function UserProfile() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const router = useRouter();
    const { id } = useParams();
    const [projects, setProjects] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);
    const [followersNames, setFollowersNames] = useState([]);
    const [followingNames, setFollowingNames] = useState([]);

    const fetchUserData = useCallback(async (userId) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/user/${userId}`);
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load user data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchProjects = useCallback(async (userId) => {
        try {
            const response = await fetch(`/api/projects?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError('Failed to load projects');
        }
    }, []);

    const fetchFollowStatus = useCallback(async (userId) => {
        if (!session || !session.user) {
            return;
        }
    
        try {
            const response = await fetch(`/api/user/${userId}/follow-status?currentUserId=${session.user.id}`);
            if (response.ok) {
                const data = await response.json();
                setIsFollowing(data.isFollowing);
            } else {
                const errorData = await response.json();
                console.error('Failed to fetch follow status:', errorData);
            }
        } catch (error) {
            console.error('Error fetching follow status:', error);
        }
    }, [session]);

    const fetchFollowers = useCallback(async (userId) => {
        try {
            const response = await fetch(`/api/user/${userId}?action=followers`);
            if (response.ok) {
                const followersData = await response.json();
                setFollowersNames(followersData);
            } else {
                console.error('Failed to fetch followers data');
            }
        } catch (error) {
            console.error('Error fetching followers data:', error);
        }
    }, []);

    const fetchFollowing = useCallback(async (userId) => {
        try {
            const response = await fetch(`/api/user/${userId}?action=following`);
            if (response.ok) {
                const followingData = await response.json();
                setFollowingNames(followingData);
            } else {
                console.error('Failed to fetch following data');
            }
        } catch (error) {
            console.error('Error fetching following data:', error);
        }
    }, []);


    useEffect(() => {
        if (id && session) {
            fetchUserData(id);
            fetchProjects(id);
            fetchFollowStatus(id);
            fetchFollowers(id);
            fetchFollowing(id);
        }
    }, [id, session, fetchUserData, fetchProjects, fetchFollowStatus]);


    const handleAddProject = useCallback(() => {
        router.push('/add-project');
    }, [router]);


    const handleFollowToggle = async () => {
        if (!session || !session.user) {
            console.error('No session or user found');
            return;
        }
    
        try {
            const response = await fetch(`/api/user/${user._id}/follow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ currentUserId: session.user.id })
            });
            if (response.ok) {
                const data = await response.json();
                setIsFollowing(data.isFollowing);
            } else {
                const errorData = await response.json();
                console.error('Failed to toggle follow status:', errorData);
            }
        } catch (error) {
            console.error('Error toggling follow status:', error);
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    const isOwnProfile = session?.user?.email === user.email;

    return (
        <main className="mx-auto px-4 min-h-screen">
            <Navbar />
            <div className="bg-white rounded-lg overflow-hidden my-4 md:my-8 shadow-md">
                <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div className="flex flex-col md:flex-row md:items-center">
                            <Image 
                                src={user.profileImage || '/images/default-avatar.png'}
                                alt={user.name} 
                                width={96}
                                height={96}
                                className="rounded-full border-4 border-white mb-4 md:mb-0 md:mr-4"
                            />
                             <div>
                                <h1 className="text-2xl font-bold text-black">{user.name}</h1>
                                <p className="text-black opacity-75 mt-1">{user.bio}</p>
                                <p className="text-gray-600 flex items-center mt-1">
                                    <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-purple-600" />
                                    {user.education}
                                </p>
                                <div className="flex mt-2 space-x-4">
                                    <button 
                                        onClick={() => setShowFollowers(true)}
                                        className="text-gray-600 flex items-center hover:text-purple-600 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faUserFriends} className="mr-2 text-purple-600" />
                                        <strong>{user.followers.length}</strong> followers
                                    </button>
                                    <button 
                                        onClick={() => setShowFollowing(true)}
                                        className="text-gray-600 flex items-center hover:text-purple-600 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faUserFriends} className="mr-2 text-purple-600" />
                                        <strong>{user.following.length}</strong> following
                                    </button>
                                </div>
                            </div>

                        </div>
                           {/* Followers Modal */}
            {showFollowers && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Followers</h2>
                        <ul className="max-h-60 overflow-y-auto">
                        {followersNames.map((follower) => (
                            <li key={follower._id} className="py-2 border-b last:border-b-0">
                                {follower.name}
                            </li>
                        ))}
                        </ul>
                        <button 
                            onClick={() => setShowFollowers(false)}
                            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Following Modal */}
            {showFollowing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Following</h2>
                        <ul className="max-h-60 overflow-y-auto">
                        {followingNames.map((followedUser) => (
                            <li key={followedUser._id} className="py-2 border-b last:border-b-0">
                                {followedUser.name}
                            </li>
                        ))}
                        </ul>
                        <button 
                            onClick={() => setShowFollowing(false)}
                            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
                        
                        <div className="mt-4 md:mt-0">
                            {isOwnProfile ? (
                                <Link href="/profile/edit" className="text-purple-600 px-4 py-2 rounded-full hover:bg-purple-100 transition duration-300">
                                    Edit Profile
                                </Link>
                            ) : (
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => window.location.href = `mailto:${user.email}?subject=Collaboration Request&body=Hello ${user.name},%0D%0A%0D%0AI'd like to request a collaboration with you.`}
                                        className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300"
                                    >
                                        Request Collaboration
                                    </button>
                                    <button 
                                        onClick={handleFollowToggle}
                                        className={`px-4 py-2 rounded-full transition duration-300 ${
                                            isFollowing 
                                                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </button>
                                </div>
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
                                className="bg-purple-800 hover:bg-purple-700 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center"
                                title="Add Project"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        )}
                    </div>
                    {projects && projects.length > 0 ? (
                        projects.map((project, index) => (
                            <div key={index} className="mb-6 pb-6 border-b last:border-b-0">
                                {project.seekingCollaborators && (
                                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded mb-5">
                                        Looking for Collaborators
                                    </span>
                                )}
                                {project.collaborationDetails && (
                                    <div className="bg-purple-50 border-l-4 border-purple-500 text-purple-700 p-4 mb-4 rounded-r-md">
                                        <p className="text-sm">{project.collaborationDetails}</p>
                                    </div>
                                )}
                                <h3 className="text-xl font-semibold">{project.title}</h3>
                                <p className="text-gray-700 mt-2">{project.description}</p>
                                {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 mt-2 inline-block">View Project</a>}
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
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-center py-4">No projects posted yet.</p>
                    )}
                </div>
            </div>
        </main>
    );
}