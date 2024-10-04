'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from "../../components/Navbar";

export default function EditProfile() {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleArrayChange = (e, index, field) => {
        const { value } = e.target;
        setUser(prevUser => {
            const newArray = [...prevUser[field]];
            newArray[index] = value;
            return { ...prevUser, [field]: newArray };
        });
    };

    const handleObjectChange = (e, field, subfield) => {
        const { value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [field]: {
                ...prevUser[field],
                [subfield]: value
            }
        }));
    };

    const handleEducationChange = (index, field, value) => {
        setUser(prevUser => {
            const newEducation = [...prevUser.education];
            newEducation[index] = { ...newEducation[index], [field]: value };
            return { ...prevUser, education: newEducation };
        });
    };

    const handleProjectChange = (index, field, value) => {
        setUser(prevUser => {
            const newProjects = [...prevUser.projects];
            newProjects[index] = { ...newProjects[index], [field]: value };
            return { ...prevUser, projects: newProjects };
        });
    };

    const addField = (field) => {
        setUser(prevUser => ({
            ...prevUser,
            [field]: [...prevUser[field], field === 'education' ? {
                school: '',
                degree: '',
                fieldOfStudy: '',
                from: '',
                to: '',
                current: false,
                description: ''
            } : field === 'projects' ? {
                title: '',
                description: '',
                link: '',
                image: ''
            } : '']
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            if (response.ok) {
                router.push('/profile');
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (status === 'loading' || !user) {
        return <div>Loading...</div>;
    }

    return (
        <main className="container mx-auto px-4">
            <Navbar />
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto my-8">
                <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>
                
                {/* Existing fields */}
                {/* ... */}

                {/* Education */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Education</label>
                    {user.education.map((edu, index) => (
                        <div key={index} className="mb-2">
                            <input
                                type="text"
                                placeholder="School"
                                value={edu.school}
                                onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                            />
                            <input
                                type="text"
                                placeholder="Degree"
                                value={edu.degree}
                                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                            />
                            {/* Add more fields for education */}
                        </div>
                    ))}
                    <button type="button" onClick={() => addField('education')} className="text-purple-600 hover:text-purple-800">
                        Add Education
                    </button>
                </div>

                {/* Social Links */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Social Links</label>
                    <input
                        type="text"
                        placeholder="LinkedIn"
                        value={user.socialLinks.linkedin}
                        onChange={(e) => handleObjectChange(e, 'socialLinks', 'linkedin')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                    />
                    <input
                        type="text"
                        placeholder="GitHub"
                        value={user.socialLinks.github}
                        onChange={(e) => handleObjectChange(e, 'socialLinks', 'github')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Twitter"
                        value={user.socialLinks.twitter}
                        onChange={(e) => handleObjectChange(e, 'socialLinks', 'twitter')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                    />
                </div>

                {/* Projects */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Projects</label>
                    {user.projects.map((project, index) => (
                        <div key={index} className="mb-2">
                            <input
                                type="text"
                                placeholder="Project Title"
                                value={project.title}
                                onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                            />
                            <textarea
                                placeholder="Project Description"
                                value={project.description}
                                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                            ></textarea>
                            {/* Add more fields for projects */}
                        </div>
                    ))}
                    <button type="button" onClick={() => addField('projects')} className="text-purple-600 hover:text-purple-800">
                        Add Project
                    </button>
                </div>

                {/* Interests */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Interests</label>
                    {user.interests.map((interest, index) => (
                        <input
                            key={index}
                            type="text"
                            value={interest}
                            onChange={(e) => handleArrayChange(e, index, 'interests')}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                        />
                    ))}
                    <button type="button" onClick={() => addField('interests')} className="text-purple-600 hover:text-purple-800">
                        Add Interest
                    </button>
                </div>

                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Save Changes
                </button>
            </form>
        </main>
    );
}