import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import LeaveRoomDialog from "./dialogs/LeaveRoomDialog";
import PromptDialog from "./dialogs/PromptDialog";
import { FiCopy, FiCheck } from "react-icons/fi";

const EditorToolbar = ({
  roomData,
  isLeaveOpen,
  setIsLeaveOpen,
  isPromptOpen,
  setIsPromptOpen,
  prompt,
  setPrompt,
  onLeave,
  onFix,
  onRun,
  onGenerate,
  isFix,
  setisFix,
  codingUsers,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyRoomId = () => {
    if (roomData?.roomId) {
      navigator.clipboard.writeText(roomData.roomId)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error("Failed to copy room ID: ", err);
        });
    }
  };

  return (
    <div className="flex justify-between items-center p-3 shadow dark:shadow-lg border-b border-gray-200 dark:border-gray-800 max-sm:flex-col gap-2">
      
      {/* Left Section */}
      <div className="flex gap-3 items-center flex-wrap max-sm:w-full max-sm:justify-between">
        <LeaveRoomDialog
          isOpen={isLeaveOpen}
          setIsOpen={setIsLeaveOpen}
          onLeave={onLeave}
        />
        <span className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-md cursor-not-allowed max-sm:text-sm max-sm:px-2">
          {roomData?.title || "Loading..."}
        </span>
        <span className="px-3 py-1 rounded bg-gray-200 text-black dark:bg-gray-800 dark:text-white text-sm font-medium max-sm:text-xs max-sm:px-2 max-sm:hidden">
          {roomData?.language || "..."}
        </span>
        <Button
          className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition max-sm:text-xs"
          onClick={handleCopyRoomId}
          title="Copy Room ID"
          disabled={!roomData?.roomId}
        >
          {copied ? (
            <>
              <FiCheck className="text-green-500" />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <FiCopy />
              <span className="text-xs">Copy ID</span>
            </>
          )}
        </Button>
      </div>

      {/* Center Section - Coding Indicator */}
      <div className="flex items-center justify-center flex-1 text-sm max-sm:w-full my-1">
        {Object.keys(codingUsers || {}).length > 0 ? (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50/70 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900/40 rounded-full font-medium shadow-sm animate-pulse-subtle">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500"></span>
            </span>
            <span className="text-xs sm:text-sm">
              {Object.values(codingUsers).join(", ")} {Object.keys(codingUsers).length === 1 ? "is writing code" : "are writing code"}...
            </span>
          </div>
        ) : (
          <div className="text-gray-400 dark:text-gray-500 flex items-center gap-1.5 text-xs">
            <i className="ri-checkbox-circle-fill text-green-500/80"></i>
            <span>Workspace synced</span>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex gap-3 max-sm:flex-wrap max-sm:justify-between max-sm:w-full">
        <PromptDialog
          isOpen={isPromptOpen}
          setIsOpen={setIsPromptOpen}
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={onGenerate}
        />
        <Button
          className="bg-gray-700 hover:bg-gray-600 transition active:scale-95 max-sm:flex-1"
          onClick={() => {
            setisFix(!isFix);
            onFix();
          }}
        >
          {isFix ? "Fixing..." : "Fix Code"}
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 transition max-sm:flex-1"
          onClick={onRun}
        >
          Run Code
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;
