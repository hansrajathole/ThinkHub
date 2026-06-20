import React from "react";

const MembersPanel = ({
  show,
  participants,
  currentUserId,
  joinRequests,
  isAdmin,
  requestLoading,
  onlineUsers,
  onReviewJoinRequest,
  onClose,
}) => {
  return (
    <div
      className={`sidePannel backdrop-blur-xl h-full absolute top-0 left-0 w-full bg-gray-100/95 dark:bg-gray-900/95 transition-all duration-300 ${
        show ? "translate-x-0" : "-translate-x-full"
      } z-10`}
    >
      <header className="text-lg font-semibold p-2 border-b border-gray-300 dark:border-gray-700 flex justify-end">
        <button
          className="rounded-full dark:text-gray-800 dark:bg-white bg-gray-800 text-white px-2 py-1 hover:opacity-90 transition"
          onClick={onClose}
        >
          <i className="ri-close-large-line"></i>
        </button>
      </header>
      <div className="flex flex-col">
        {isAdmin && (
          <>
            <h3 className="text-lg font-semibold px-2 py-2">Join Requests:</h3>
            <div className="p-2 flex flex-col gap-2">
              {joinRequests?.length ? (
                joinRequests.map((request) => (
                  <div
                    key={request._id}
                    className="flex flex-col gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={request.requestedBy?.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600"
                      />
                      <div>
                        <p className="text-sm font-semibold">{request.requestedBy?.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {request.requestedBy?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled={requestLoading}
                        onClick={() => onReviewJoinRequest(request._id, "reject")}
                        className="rounded-md border border-red-500 px-3 py-1 text-sm text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-500/10"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        disabled={requestLoading}
                        onClick={() => onReviewJoinRequest(request._id, "accept")}
                        className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded border border-dashed border-gray-300 bg-white/60 p-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-400">
                  No pending join requests.
                </div>
              )}
            </div>
          </>
        )}
        <h3 className="text-lg font-semibold px-2 py-2">Members:</h3>
        <div className="p-2 flex flex-col gap-2">
          {participants?.map((user, ind) => {
            const isOnline = onlineUsers?.has(user._id);
            const isCurrentUser = user._id === currentUserId;
            return (
              <div
                key={ind}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded shadow-sm"
              >
                {/* Avatar with online indicator */}
                <div className="relative flex-shrink-0">
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600"
                  />
                  {isOnline && (
                    <span
                      className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"
                      title="Online"
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold flex items-center gap-1">
                    {user.username}
                    {isCurrentUser && (
                      <span className="text-xs text-gray-400 font-normal">(You)</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isOnline ? (
                      <span className="text-green-500 font-medium">● Online</span>
                    ) : (
                      <span className="text-gray-400">○ Offline</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MembersPanel;
