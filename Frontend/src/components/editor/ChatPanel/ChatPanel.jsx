import React from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import MembersPanel from "./MembersPanel";

const ChatPanel = ({
  messages,
  input,
  setInput,
  handleInputChange,
  showPeople,
  setShowPeople,
  roomData,
  isAdmin,
  showRequestIndicator,
  requestLoading,
  messageBoxRef,
  currentUserId,
  onlineUsers,
  typingUsers,
  onSendMessage,
  onReviewJoinRequest,
}) => {
  return (
    <div className="w-80 max-sm:w-screen h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-800 flex flex-col relative">
      <ChatHeader 
        onTogglePeople={() => setShowPeople(!showPeople)} 
        showPeople={showPeople} 
        showRequestIndicator={showRequestIndicator}
      />
      
      <MessageList 
        messages={messages} 
        currentUserId={currentUserId} 
        messageBoxRef={messageBoxRef} 
      />

      {/* Typing Indicator */}
      {Object.keys(typingUsers || {}).length > 0 && (
        <div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 border-t border-gray-100 dark:border-gray-800">
          <span className="flex gap-0.5 items-end">
            <span className="typing-dot" />
            <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
            <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
          </span>
          <span>
            {Object.values(typingUsers).join(", ")}
            {Object.keys(typingUsers).length === 1 ? " is typing..." : " are typing..."}
          </span>
        </div>
      )}
      
      <MessageInput 
        input={input} 
        setInput={setInput}
        handleInputChange={handleInputChange}
        onSend={onSendMessage} 
      />
      
      <MembersPanel
        show={showPeople}
        participants={roomData?.participants}
        joinRequests={roomData?.joinRequests}
        isAdmin={isAdmin}
        requestLoading={requestLoading}
        currentUserId={currentUserId}
        onlineUsers={onlineUsers}
        onReviewJoinRequest={onReviewJoinRequest}
        onClose={() => setShowPeople(false)}
      />
    </div>
  );
};

export default ChatPanel;
