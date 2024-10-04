import React from 'react';
import ProjectCard from './projectCard'; // You'll need to create this component

const ProjectGrid = ({ projects, searchQuery, filters }) => {
  // Apply filters and search logic here
//   const filteredProjects = projects.filter(project => {
//     // Implement your filtering logic based on searchQuery and filters
    return true; // Replace with actual filtering
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectGrid;