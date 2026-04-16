import React from "react";

const ChatHeader = ({ onTogglePeople, showPeople, showRequestIndicator }) => {
  return (
    <header className="text-lg font-semibold p-2 border-b border-gray-300 dark:border-gray-700 flex justify-end">
      <button
        className="relative rounded-full dark:text-gray-800 dark:bg-white bg-gray-800 text-white px-2 py-1 hover:opacity-90 transition"
        onClick={onTogglePeople}
      >
        {!showPeople && showRequestIndicator && (
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900" />
        )}
        {showPeople ? (
          <i className="ri-close-large-line"></i>
        ) : (
          <i className="ri-group-fill"></i>
        )}
      </button>
    </header>
  );
};

export default ChatHeader;
