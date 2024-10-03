'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from "../../components/Navbar";

export default function EditProfile() {
    const { data: session } = useSession();
    const router = useRouter();
    const [user, setUser] = useState({
        name: '',
        email: '',
        bio: '',
        skills: [],
    });

    useEffect(() => {
        if (session?.user?.email) {
            fetchUserData(session.user.email);
        }
    }, [session]);

    const fetchUserData = async (email) => {
        // Fetch user data as in the Profile component
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Implement API call to update user data
    };

    return (
        <main className="container mx-auto px-4">
            <Navbar />
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto my-8">
                <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                {/* Add more form fields for other user properties */}
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-lg">
                    Save Changes
                </button>
            </form>
        </main>
    );
}