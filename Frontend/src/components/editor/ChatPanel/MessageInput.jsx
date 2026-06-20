import React from "react";
import { Button } from "@/components/ui/button";

const MessageInput = ({ input, setInput, handleInputChange, onSend }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (handleInputChange) {
      handleInputChange(value);
    } else {
      setInput(value);
    }
  };

  return (
    <div className="p-2 border-t border-gray-300 dark:border-gray-700 flex gap-2">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
      />
      <Button
        onClick={onSend}
        className="bg-blue-600 hover:bg-blue-700 transition"
      >
        <i className="ri-send-plane-fill"></i>
      </Button>
    </div>
  );
};

export default MessageInput;