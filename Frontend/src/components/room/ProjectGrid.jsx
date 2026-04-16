import React from "react";
import ProjectCard from "./ProjectCard";

const ProjectGrid = ({ projects, loading, onReviewJoinRequest, onDeleteRoom }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No projects found. Create one to get started!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {projects.map((project) => (
        <ProjectCard 
          key={project._id} 
          project={project} 
          loading={loading}
          onReviewJoinRequest={onReviewJoinRequest}
          onDelete={onDeleteRoom} 
        />
      ))}
    </div>
  );
};

export default ProjectGrid;
