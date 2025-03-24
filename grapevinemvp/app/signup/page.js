"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [skills, setSkills] = useState([""]);
  const [education, setEducation] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    github: "",
    // twitter: ''
  });
  const [projects, setProjects] = useState([
    {
      title: "",
      description: "",
      link: "",
      image: "",
    },
  ]);
  const [projectInterest, setProjectInterest] = useState("");
  const [interests, setInterests] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); // State to manage dropdown visibility
  const [tags, setTags] = useState([]); // State to manage selected tags
  const availableTags = ["MEC (MIT)", "DivHacks (Columbia)"]; // Example tags for the dropdown
  const router = useRouter();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProfileImage(data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    try {
      const userData = {
        name,
        email,
        password,
        profileImage,
        bio,
        website,
        skills: skills.filter((skill) => skill.trim() !== ""),
        education,
        socialLinks,
        interests: typeof interests === 'string' ? [interests] : interests.filter((interest) => interest.trim() !== ""),
        // events: tags, // Use the selected tags as events
      };

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        
      });
      

      const data = await response.json();
      console.log("Signup successful", data);
      router.push("/exploreProjects");
        
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const addField = (setter, array) => {
    setter([...array, ""]);
  };

  const updateField = (setter, array, index, value) => {
    const newArray = [...array];
    newArray[index] = value;
    setter(newArray);
  };

  // Function to add a tag
  const addTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="mb-8">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-purple-900">
            {step === 1 ? "Join the network" : "Complete Your Profile"}
          </h2>
          <p className="text-center text-sm text-purple-600">
            Connect, collaborate, and create impact together
          </p>
        </div>
        <div className="space-y-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-purple-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-purple-300 placeholder-purple-400 text-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-purple-700 mb-1">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-purple-300 placeholder-purple-400 text-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-purple-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-purple-300 placeholder-purple-400 text-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 hover:shadow-sm transition-all duration-200">
                <label
                  htmlFor="profileImage"
                  className="block text-sm font-medium text-purple-700"
                >
                  Profile Image
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    id="profileImage"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-purple-50 file:text-purple-700
                    hover:file:bg-purple-100 cursor-pointer transition-all duration-200"
                  />
                </div>
                {profileImage && (
                  <div className="mt-4 flex items-center">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-purple-200 hover:ring-purple-300 transition-all duration-200">
                      <Image
                        src={profileImage}
                        alt="Profile Preview"
                        width={80}
                        height={80}
                        className="object-cover rounded-full"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setProfileImage("")}
                      className="ml-4 px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full hover:bg-red-100 transition-colors duration-200 hover:shadow-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-purple-700 mb-1">
                  Bio <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    required
                    className="mt-1 block w-full rounded-md border border-purple-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 sm:text-sm transition-all duration-200 p-3 resize-none hover:border-purple-400"
                    placeholder="Tell us about yourself"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                  <div className="absolute bottom-3 right-3 text-xs text-purple-400">
                    {bio.length}/500
                  </div>
                </div>
                <p className="mt-1 text-xs text-purple-500">Share your background, interests, and what you hope to achieve.</p>
              </div>
              <div>
                <label htmlFor="interests" className="block text-sm font-medium text-purple-700 mb-1">
                  Project Interest <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    type="text"
                    id="interests"
                    name="interests"
                    rows="3"
                    required
                    className="mt-1 block w-full rounded-md border border-purple-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 sm:text-sm transition-all duration-200 p-3 resize-none hover:border-purple-400"
                    placeholder="What projects are you interested in?"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                  />
                </div>
                <p className="mt-1 text-xs text-purple-500">Describe the types of projects you&apos;d like to collaborate on.</p>
              </div>
              <div>
                <label
                  htmlFor="education"
                  className="block text-sm font-medium text-purple-700 mb-1"
                >
                  School
                </label>
                <input
                  type="text"
                  id="education"
                  name="education"
                  className="mt-1 block w-full rounded-md border border-purple-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 sm:text-sm transition-all duration-200 p-3 hover:border-purple-400"
                  placeholder="Your education"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">
                  Skills <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2 p-4 border border-purple-200 rounded-md bg-white">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center mt-1 group">
                      <input
                        type="text"
                        required
                        className="block w-full rounded-md border border-purple-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 sm:text-sm transition-all duration-200 p-3 hover:border-purple-400 group-hover:border-purple-400"
                        placeholder="Enter a skill"
                        value={skill}
                        onChange={(e) => updateField(setSkills, skills, index, e.target.value)}
                      />
                      {skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newSkills = skills.filter((_, i) => i !== index);
                            setSkills(newSkills);
                          }}
                          className="ml-2 p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 opacity-70 group-hover:opacity-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addField(setSkills, skills)}
                  className="mt-2 text-sm text-purple-600 hover:text-purple-800 flex items-center hover:underline transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Skill
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">
                  Social Links
                </label>
                <div className="space-y-3 mt-1 p-4 border border-purple-200 rounded-md bg-white">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </div>
                    <input
                      type="url"
                      placeholder="LinkedIn profile URL"
                      value={socialLinks.linkedin}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                      }
                      className="block w-full rounded-md border border-purple-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 sm:text-sm transition-all duration-200 p-3 pl-10 hover:border-purple-400"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <input
                      type="url"
                      placeholder="GitHub profile URL"
                      value={socialLinks.github}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, github: e.target.value })
                      }
                      className="block w-full rounded-md border border-purple-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 sm:text-sm transition-all duration-200 p-3 pl-10 hover:border-purple-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all duration-200 hover:shadow-md hover:-translate-y-1"
            >
              {step === 1 ? "Next" : "Create Account"}
            </button>
          </div>
        </form>
        </div>
        {step === 1 && (
          <div className="text-center mt-6">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-purple-500">Already a member?</span>
              </div>
            </div>
            <Link
              href="/login"
              className="font-medium text-purple-600 hover:text-purple-500 hover:underline transition-all duration-200"
            >
              Sign in to your account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
