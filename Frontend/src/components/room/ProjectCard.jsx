import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Tippy from "@tippyjs/react";
import DeleteButton from "../shared/DeleteButton";
import JoinRequestsDialog from "./JoinRequestsDialog";

const ProjectCard = ({ project, loading, onReviewJoinRequest, onDelete }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isAdmin = project.roomCreatedby?._id === user?._id;
  const pendingRequests = project.joinRequests || [];

  const handleReview = async (requestId, action) => {
    await onReviewJoinRequest(project.roomId, requestId, action);
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg">
      {/* Delete Icon */}
      {isAdmin && <DeleteButton onClick={() => onDelete(project.roomId)} />}

      {/* Language Badge */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          {project?.title}
        </h3>
        <img
          src={project?.languageIcon}
          alt="Language Icon"
          className="w-8 h-8"
        />
      </div>

      {/* Members */}
      <p className="text-sm font-medium mb-2">Members:</p>
      <div className="flex -space-x-2 mb-4">
        {project.participants?.map((user) => (
          <Tippy
            animation="slide-up"
            placement="top"
            key={user._id}
            content={user.username}
            className="dark:bg-gray-100 dark:text-gray-700 text-gray-50 font-semibold bg-gray-400 px-2 py-1 rounded-md"
          >
            <img
              src={user.avatar}
              alt={user.username}
              className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 cursor-pointer"
              onClick={() => navigate(`/profile/${user._id}`)}
            />
          </Tippy>
        ))}
      </div>

      {/* Creation Date & Creator */}
      <p className="text-xs text-gray-500">
        <span className="text-gray-900 dark:text-gray-400">Created at</span>{" "}
        {new Date(project.createdAt).toDateString()}
      </p>
      <div className="flex justify-between items-center gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-lg">By</span>
          {project.roomCreatedby?.avatar && (
            <Tippy
              animation="slide-up"
              placement="top"
              content={project.roomCreatedby.username}
              className="dark:bg-gray-100 dark:text-gray-700 text-gray-50 font-semibold bg-gray-400 px-2 py-1 rounded-md"
            >
              <img
                src={project.roomCreatedby.avatar}
                alt="creator-avatar"
                className="w-5 h-5 rounded-full cursor-pointer"
                onClick={() => navigate(`/profile/${project.roomCreatedby._id}`)}
              />
            </Tippy>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          {isAdmin && pendingRequests.length > 0 && (
            <JoinRequestsDialog
              requests={pendingRequests}
              loading={loading}
              onReview={handleReview}
            />
          )}
          <button
            className="px-4 py-2 border border-blue-500 dark:text-white text-sm rounded hover:bg-blue-500 hover:shadow-md hover:shadow-blue-700 transition"
            onClick={() => navigate(`/rooms/room/${project.roomId}`)}
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
