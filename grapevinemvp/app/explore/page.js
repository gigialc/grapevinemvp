"use client";
import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ProjectGrid from '../components/ProjectGrid';
import Filters from '../components/Filters';
import Navbar from '../components/Navbar';

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Implement filtering logic here
  };

  return (
    <div className="explore-page mx-2">
           <Navbar />
    <div className="explore-page mx-4">
      <h1>Explore Projects</h1>
      <SearchBar onSearch={handleSearch} />
      <Filters onChange={handleFilterChange} />
      <ProjectGrid searchQuery={searchQuery} filters={filters} />
    </div>
    </div>
  );
};

export default ExplorePage;