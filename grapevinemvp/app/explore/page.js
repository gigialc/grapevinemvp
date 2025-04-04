"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Navbar from '../components/Navbar'
import UserCard from '../components/UserCard'
import BubbleFilter from '../components/BubbleFilter'

const ExplorePage = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [selectedSkills, setSelectedSkills] = useState([])
  const [allSkills, setAllSkills] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const { data: session } = useSession()

  const MAX_SKILLS_DISPLAYED = 10;

  useEffect(() => {
    fetchUsers()
  }, [session])

  useEffect(() => {
    filterUsers()
  }, [users, selectedSkills, searchQuery])

  const fetchUsers = async () => {
    if (session?.user?.email) {
      try {
        const response = await fetch(`/api/user?currentUserEmail=${encodeURIComponent(session.user.email)}`)
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await response.json()
        setUsers(data)
        
        // Extract all unique skills from users
        const skills = Array.from(new Set(data.flatMap(user => user.skills)))
        setAllSkills(skills)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Filter by skills to include all people with any of the selected skills
    if (selectedSkills.length) {
      filtered = filtered.filter(user =>
        user.skills.some(skill => selectedSkills.includes(skill))
      )
    }

    // Filter by search query (name similarity)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(query)
      ).sort((a, b) => {
        const aStartsWith = a.name.toLowerCase().startsWith(query)
        const bStartsWith = b.name.toLowerCase().startsWith(query)
        if (aStartsWith && !bStartsWith) return -1
        if (!aStartsWith && bStartsWith) return 1
        return a.name.localeCompare(b.name)
      })
    }

    setFilteredUsers(filtered)
  }

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prevSkills =>
      prevSkills.includes(skill)
        ? prevSkills.filter(s => s !== skill)
        : [...prevSkills, skill]
    )
  }

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  return (
    <div className="explore-page mx-2">
      <Navbar />
      <div className="explore-page mx-4">
        <div className="my-3">
          <h1 className="text-2xl font-bold mb-4">Explore People</h1>
          <div className="mb-4">
            <input
                type="text"
                placeholder="Search users by name..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-6 py-1.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm text-lg"
            />
            </div>
          {/* <BubbleFilter
            skills={allSkills.slice(0, MAX_SKILLS_DISPLAYED)}
            selectedSkills={selectedSkills}
            onSkillToggle={handleSkillToggle}
          /> */}
        </div>
        <div className="user-grid columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {filteredUsers.map(user => (
            <div key={user._id} className="mb-4 break-inside-avoid">
              <UserCard user={user} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExplorePage