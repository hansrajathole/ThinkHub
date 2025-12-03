import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white w-64 h-screen fixed top-9 left-0 pt-16 p-4 shadow-md">
      {/* Navigation Items */}
      <nav className="space-y-2">
        <Link
          to="/"
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600"
        >
          <span>🏠</span>
          <span>Home</span>
        </Link>
        <Link
          to="/questions"
          className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 rounded-md"
        >
          <span>🔍</span>
          <span>Questions</span>
        </Link>
        
      
       
        <Link
          to="/users"
          className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 rounded-md"
        >
          <span>👥</span>
          <span>Users</span>
        </Link>
        <Link
          to="/rooms"
          className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 rounded-md"
        >
          <span>🏢</span>
          <span>Room</span>
        </Link>
        <Link
          to="/Interview-Prep"
          className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 rounded-md"
        >
          <span>🎯</span>
          <span>Interview Prep</span>
        </Link>
        <Link
          to="/Project-Hub"
          className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 rounded-md"
        >
          <span>📁</span>
          <span>Project Hub</span>
        </Link>
        <Link
          to="/Road-Map-to-Tech"
          className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 rounded-md"
        >
          <span>🗺️</span>
          <span>Road Map to Tech</span>
        </Link>

        <Link
          to="/leaderboard"
          className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 rounded-md"
        >
          <span>🏆</span>
          <span>LeaderBoard</span>


        </Link>
      </nav>

      {/* Collectives Section */}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-black dark:text-white">COLLECTIVES</h3>
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          Communities for your favorite technologies.
        </p>
        <Link
          to="#"
          className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
        >
          Explore all Collectives
        </Link>
      </div>
      <br /><br />
      {/* Teams Section */}
      <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
        <h3 className="text-sm font-bold text-black dark:text-white">TEAMS</h3>
        <p className="text-gray-600 dark:text-gray-400 text-xs">
          Ask questions, find answers, and collaborate at work with Stack Overflow for Teams.
        </p>
        <button className="mt-2 bg-orange-500 text-white text-sm px-3 py-1 rounded-md hover:bg-orange-600">
          Try Teams for free
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
