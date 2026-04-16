import { useState, useEffect, useRef } from "react";
import socket from "../socket/socket";
import axios from "axios";
import toast from "react-hot-toast";

export const useChat = (roomId, userId, onRoomAccessDenied) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showPeople, setShowPeople] = useState(false);
  const [roomData, setRoomData] = useState({});
  const [code, setCode] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const messageBoxRef = useRef(null);

  const baseUrl = import.meta.env.VITE_BACKEND_URL

  // Fetch room data and messages
  useEffect(() => {
    if (!roomId) return;

    let joinedRoom = false;

    const loadRoom = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/rooms/${roomId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRoomData(res.data);
        setMessages(res.data.messages || []);
        socket.emit("joinRoom", { roomId });
        joinedRoom = true;
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load room data");
        onRoomAccessDenied?.();
      }
    };

    loadRoom();

    return () => {
      if (joinedRoom) {
        socket.emit("leaveRoom", { roomId });
      }
    };
  }, [baseUrl, onRoomAccessDenied, roomId, userId]);

  // Setup message listener
  useEffect(() => {
    if (!roomId) return;

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleAccessDenied = (message) => {
      toast.error(message || "Your room access is still pending approval");
      onRoomAccessDenied?.();
    };

    const handleJoinRequestCreated = (request) => {
      setRoomData((prev) => ({
        ...prev,
        joinRequests: [...(prev.joinRequests || []), request],
      }));
    };

    const handleJoinRequestReviewed = ({ requestId, action, participant }) => {
      setRoomData((prev) => {
        const nextJoinRequests = (prev.joinRequests || []).filter(
          (request) => request._id !== requestId
        );

        const nextParticipants =
          action === "accept" && participant
            ? [...(prev.participants || []), participant].filter(
                (value, index, array) =>
                  array.findIndex((item) => item._id === value._id) === index
              )
            : prev.participants || [];

        return {
          ...prev,
          joinRequests: nextJoinRequests,
          participants: nextParticipants,
        };
      });
    };

    socket.on("receiveMessage", handleMessage);
    socket.on("roomAccessDenied", handleAccessDenied);
    socket.on("joinRequestCreated", handleJoinRequestCreated);
    socket.on("joinRequestReviewed", handleJoinRequestReviewed);

    return () => {
      socket.off("receiveMessage", handleMessage);
      socket.off("roomAccessDenied", handleAccessDenied);
      socket.off("joinRequestCreated", handleJoinRequestCreated);
      socket.off("joinRequestReviewed", handleJoinRequestReviewed);
    };
  }, [onRoomAccessDenied, roomId]);

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const message = {
      roomId,
      userId,
      text: input,
      sender: roomData.participants?.find(p => p._id === userId) || { _id: userId },
    };

    socket.emit("sendMessage", { roomId, text: input });
    setMessages((prev) => [...prev, message]);
    setInput("");
  };

  const handleReviewJoinRequest = async (requestId, action) => {
    setRequestLoading(true);

    try {
      const response = await axios.patch(
        `${baseUrl}/api/rooms/${roomId}/requests/${requestId}`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(response.data?.message || "Join request updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update join request");
    } finally {
      setRequestLoading(false);
    }
  };

  const isAdmin = roomData?.roomCreatedby?._id === userId;
  const showRequestIndicator = isAdmin && !showPeople && (roomData?.joinRequests?.length || 0) > 0;

  return {
    messages,
    input,
    code,
    setInput,
    showPeople,
    setShowPeople,
    roomData,
    isAdmin,
    requestLoading,
    showRequestIndicator,
    messageBoxRef,
    handleSendMessage,
    handleReviewJoinRequest,
  };
};
