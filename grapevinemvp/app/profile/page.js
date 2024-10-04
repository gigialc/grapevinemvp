'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from "../components/Navbar";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faTools, faBriefcase, faGraduationCap, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
  
    useEffect(() => {
        console.log("Session:", session);
        if (session?.user?.email) {
          fetchUserData(session.user.email);
        }
      }, [session]);
  
      const fetchUserData = async (email) => {
        console.log("Fetching user data for email:", email);
        try {
          const response = await fetch(`/api/user?email=${email}`);
          console.log("API response status:", response.status);
          if (response.ok) {
            const userData = await response.json();
            console.log("Fetched user data:", userData);
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
        <main className="container mx-auto px-4 bg-gray-100 min-h-screen">
            <Navbar />
            <div className="bg-gray-100 rounded-lg overflow-hidden my-8">
                <div className=" p-4 sticky top-0 z-10">
                    <div className="flex items-center">
                        <img 
                            src={user.profileImage || '/images/default-avatar.png'}
                            alt={user.name} 
                            className="w-20 h-20 rounded-full border-4 border-white mr-4"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-black">{user.name}</h1>
                            <p className="text-black opacity-75">{user.bio}</p>
                        </div>
                    </div>
                    {isOwnProfile ? (
                        <Link href="/profile/edit" className="absolute top-4 right-4 bg-white text-purple-600 px-4 py-2 rounded-full hover:bg-purple-100 transition duration-300">
                            Edit Profile
                        </Link>
                    ) : (
                        <button className="absolute top-4 right-4 bg-white text-purple-600 px-4 py-2 rounded-full hover:bg-purple-100 transition duration-300">
                            Connect
                        </button>
                    )}
                </div>
                <div className="p-4 md:flex">
                    <div className="md:w-1/3 pr-4">
                        {/* <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-2 flex items-center">
                                
                                About
                            </h2>
                            <p className="text-gray-700">{user.bio || 'No bio available'}</p>
                        </section> */}
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-2 flex items-center">
                                Interests
                            </h2>
                            <p className="text-gray-700">{user.interests.join(', ')}</p>
                        </section>
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-2 flex items-center">
                                {/* <FontAwesomeIcon icon={faTools} className="mr-2" /> Skills */}
                                Skills
                            </h2>

                            <div className="flex flex-wrap">
                                {user.skills && user.skills.map((skill, index) => (
                                    <span key={index} className="bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            
                        </section>
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">School</h2>
                        <p className="text-black opacity-75">{user.education}</p>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Contact</h2>
                            <p className="text-gray-600 mb-2">{user.email}</p>
                            {user.location && <p className="text-gray-600 mb-2">{user.location}</p>}
                            {user.website && <p className="text-gray-600 mb-2"><a href={user.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">{user.website}</a></p>}
                        </section>
                        {user.socialLinks && (
                            <section className="mb-6">
                                <h2 className="text-xl font-semibold mb-2">Social Links</h2>
                                <div className="flex space-x-4">
                                    {user.socialLinks.linkedin && <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">LinkedIn</a>}
                                    {user.socialLinks.github && <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black">GitHub</a>}
                                    {/* {user.socialLinks.twitter && <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">Twitter</a>} */}
                                </div>
                            </section>
                        )}
                    </div>
                    <div className="md:w-2/3">
                        <Tabs>
                            <TabList>
                                <Tab><FontAwesomeIcon icon={faBriefcase} className="mr-2" /> Past Projects</Tab>
                                {/* <Tab><FontAwesomeIcon icon={faGraduationCap} className="mr-2" /> Education</Tab> */}
                                <Tab><FontAwesomeIcon icon={faProjectDiagram} className="mr-2" /> Current Projects</Tab>
                            </TabList>

                            <TabPanel>
                                {user.experience && user.experience.map((exp, index) => (
                                    <div key={index} className="mb-4 border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-semibold">{exp.title}</h3>
                                        <p className="text-gray-600">{exp.company}</p>
                                        <p className="text-gray-600">{exp.location}</p>
                                        <p className="text-gray-600">{new Date(exp.from).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.to).toLocaleDateString()}</p>
                                        <p className="text-gray-700 mt-2">{exp.description}</p>
                                    </div>
                                ))}
                            </TabPanel> 

                            {/* education string */}
                  

                            <TabPanel>
                                {user.projects && user.projects.map((project, index) => (
                                    <div key={index} className="mb-4 border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-semibold">{project.title}</h3>
                                        <p className="text-gray-700 mt-2">{project.description}</p>
                                        {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 mt-2 inline-block">View Project</a>}
                                    </div>
                                ))}
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </div>
        </main>
    );
}