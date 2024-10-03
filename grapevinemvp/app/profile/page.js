'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from "../components/Navbar";

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

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Loading user data...</div>;
    }

    const isOwnProfile = session?.user?.email === user.email;

    return (
        <main className="container mx-auto px-4">
            <Navbar />
            <div className="bg-white shadow-lg rounded-lg overflow-hidden my-8">
                <div className="bg-purple-600 p-4 relative">
                    <img 
                        src={user.profileImage || 'https://via.placeholder.com/150'} 
                        alt={user.name} 
                        className="w-32 h-32 rounded-full border-4 border-white mx-auto"
                    />
                    {isOwnProfile && (
                        <Link href="/profile/edit" className="absolute top-4 right-4 bg-white text-purple-600 px-4 py-2 rounded-full hover:bg-purple-100 transition duration-300">
                            Edit Profile
                        </Link>
                    )}
                </div>
                <div className="p-4">
                    <h1 className="text-3xl font-bold text-center mb-2">{user.name}</h1>
                    <p className="text-gray-600 text-center mb-4">{user.email}</p>
                    <div className="border-t border-gray-200 pt-4">
                        <h2 className="text-xl font-semibold mb-2">About</h2>
                        <p className="text-gray-700">{user.bio || 'No bio available'}</p>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold mb-2">Skills</h2>
                        <div className="flex flex-wrap">
                            {user.skills && user.skills.map((skill, index) => (
                                <span key={index} className="bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    {/* Add more sections as needed */}
                </div>
            </div>
        </main>
    );
}