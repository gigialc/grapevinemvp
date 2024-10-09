import React from "react"
import Link from 'next/link'
import { FaExternalLinkAlt } from 'react-icons/fa'

const jobListings = [
    {
      id: 1,
      title: "Full Stack Developer",
      company: "TechNova",
      location: "San Francisco, CA",
      teamSize: 12,
      keyPeople: [
        { name: "Sarah Chen", role: "CTO", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "Alex Rodriguez", role: "Lead Developer", avatar: "/placeholder.svg?height=40&width=40" },
      ],
    },
    {
      id: 2,
      title: "Product Manager",
      company: "GrowthLab",
      location: "New York, NY",
      teamSize: 8,
      keyPeople: [
        { name: "Emily Watson", role: "CEO", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "Michael Lee", role: "Head of Product", avatar: "/placeholder.svg?height=40&width=40" },
      ],
    },
    {
      id: 3,
      title: "UX/UI Designer",
      company: "DesignWave",
      location: "Remote",
      teamSize: 15,
      keyPeople: [
        { name: "Olivia Martinez", role: "Design Lead", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "David Kim", role: "Senior Designer", avatar: "/placeholder.svg?height=40&width=40" },
      ],
    },
    ]

export default function StartupCard() {
    return (
      <div className="p-4">
        <div className="flex overflow-x-auto space-x-6 pb-4">
          {jobListings.map((job) => (
            <div key={job.id} className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-300 flex-shrink-0 w-80">
              <Link href={`/job/${job.id}`}>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-purple-700">{job.title}</h2>
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                      Hiring
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">at {job.company}</p>
                  <div className="flex items-center mb-2">
                    <span className="mr-2">📍</span>
                    <span className="text-sm text-gray-600">{job.location}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <span className="mr-2">👥</span>
                    <span className="text-sm text-gray-600">Team of {job.teamSize}</span>
                  </div>
                  <hr className="my-4" />
                  <h4 className="font-semibold mb-2">Key People You will Work With:</h4>
                  <div className="space-y-3">
                    {job.keyPeople.map((person, index) => (
                      <div key={index} className="flex items-center space-x-3">
                    
                        <div>
                          <p className="font-medium">{person.name}</p>
                          <p className="text-sm text-gray-600">{person.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
              <div className="px-5 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                  >
                    View Job <FaExternalLinkAlt className="ml-1" />
                  </a>
                  <button className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full hover:bg-purple-700 transition duration-300 flex items-center">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }