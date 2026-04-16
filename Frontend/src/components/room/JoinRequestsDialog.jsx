import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const JoinRequestsDialog = ({ requests, loading, onReview }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded-md border border-amber-500 px-3 py-2 text-sm font-medium text-amber-600 transition hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-500/10">
          Requests ({requests.length})
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle>Join Requests</DialogTitle>
          <DialogDescription>
            Review people who want to join this room.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
          {requests.map((request) => (
            <div
              key={request._id}
              className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={request.requestedBy?.avatar}
                  alt={request.requestedBy?.username}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{request.requestedBy?.username}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {request.requestedBy?.email || "No email available"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onReview(request._id, "reject")}
                  className="rounded-md border border-red-500 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-500/10"
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onReview(request._id, "accept")}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRequestsDialog;
