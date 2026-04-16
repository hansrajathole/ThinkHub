import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const JoinProjectDialog = ({ onJoin, loading }) => {
  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState("");

  const handleJoinClick = async () => {
    const success = await onJoin(roomId);
    if (success) {
      setOpen(false);
      setRoomId("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="border border-purple-500 px-3 py-1 rounded-md text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-600/20 transition">
        Join
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 rounded-lg w-[425px]">
        <DialogHeader>
          <DialogTitle>Request to Join</DialogTitle>
          <DialogDescription>
            Enter the project ID to send a join request to the room admin.
          </DialogDescription>
          <div className="flex items-center justify-between mt-4">
            <label htmlFor="project" className="text-sm font-medium">
              Project ID
            </label>
            <Input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Project ID"
              className="bg-gray-100 dark:bg-gray-800 w-[70%] px-3 py-1 rounded-md border-none ring-0 focus-visible:ring-0"
            />
          </div>
          <div className="flex justify-end mt-8">
            <Button
              onClick={handleJoinClick}
              variant="secondary"
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white transition"
            >
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default JoinProjectDialog;
