import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as roomService from "../services/roomService";
import icons from "../utils/icons.json";
import codeSnippets from "../utils/codeSnippets.json";

export const useRooms = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllRooms = async () => {
    try {
      const rooms = await roomService.fetchRooms();
      setProjects(rooms);
    } catch (err) {
      // console.error(err.message);
      toast.error("Failed to load rooms");
    }
  };

  useEffect(() => {
    fetchAllRooms();
  }, []);

  const handleCreateProject = async (language, title) => {
    if (!language || !title) {
      toast.error("Please fill in both title and language.");
      return false;
    }
    
    const icon = icons[language.toLowerCase()];
    if (!icon) {
      toast.error("Invalid language selected.");
      return false;
    }
    
    const snippet = codeSnippets[language.toLowerCase()];
    if (!snippet) {
      toast.error("Invalid language selected.");
      return false;
    }
    
    setLoading(true);
    try {
      await roomService.createRoom({ 
        language, 
        title, 
        languageIcon: icon, 
        codeContent: snippet 
      });
      await fetchAllRooms();
      toast.success("Project created successfully!");
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProject = async (roomId) => {
    if (!roomId) {
      toast.error("Please enter a valid Project ID.");
      return false;
    }
    
    setLoading(true);
    try {
      const response = await roomService.joinRoom(roomId);
      toast.success(response.message || "Join request sent successfully!");
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleReviewJoinRequest = async (roomId, requestId, action) => {
    setLoading(true);
    try {
      const response = await roomService.reviewJoinRequest(roomId, requestId, action);
      await fetchAllRooms();
      toast.success(response.message || "Join request updated successfully!");
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update join request!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this room?"
      );
      if (!confirmDelete) return false;

      const response = await roomService.deleteRoom(roomId);
      await fetchAllRooms();
      toast.success(response.message || "Room deleted successfully!");
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete the room!");
      return false;
    }
  };

  return {
    projects,
    loading,
    handleCreateProject,
    handleJoinProject,
    handleReviewJoinRequest,
    handleDeleteRoom
  };
};
