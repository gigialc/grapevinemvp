"use client";
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import Navbar from '../components/Navbar';
import UserCard from '../components/UserCard';
import { useSession } from 'next-auth/react';

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [users, setUsers] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetchUsers();
  }, [session]);

  const fetchUsers = async () => {
    if (session?.user?.email) {
      try {
        const response = await fetch(`/api/user?currentUserEmail=${encodeURIComponent(session.user.email)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  };

  const handleSearch = (results) => {
    setUsers(results);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Implement filtering logic here
  };

  return (
    <div className="explore-page mx-2 ">
      <Navbar />
      <div className="explore-page mx-4">
        <h1>Explore Projects</h1>
        <SearchBar onSearch={handleSearch} />
        <Filters onChange={handleFilterChange} />
        <div className="user-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;