import { useState, useEffect, useRef, useCallback } from "react";
import socket from "../socket/socket";
import axios from "axios";
import toast from "react-hot-toast";

export const useChat = (roomId, userId, username, onRoomAccessDenied) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showPeople, setShowPeople] = useState(false);
  const [roomData, setRoomData] = useState({});
  const [code, setCode] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set([userId]));
  const [typingUsers, setTypingUsers] = useState({});
  const messageBoxRef = useRef(null);
  const onRoomAccessDeniedRef = useRef(onRoomAccessDenied);
  const typingTimeoutRef = useRef({});

  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    onRoomAccessDeniedRef.current = onRoomAccessDenied;
  }, [onRoomAccessDenied]);

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
        onRoomAccessDeniedRef.current?.();
      }
    };

    loadRoom();

    return () => {
      if (joinedRoom) {
        socket.emit("leaveRoom", { roomId });
      }
    };
  }, [baseUrl, roomId]);

  // Setup message listener
  useEffect(() => {
    if (!roomId) return;

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleAccessDenied = (message) => {
      toast.error(message || "Your room access is still pending approval");
      onRoomAccessDeniedRef.current?.();
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

    // Online presence handlers
    const handleUserOnline = ({ userId: onlineUserId }) => {
      setOnlineUsers((prev) => new Set([...prev, onlineUserId]));
    };

    const handleUserOffline = ({ userId: offlineUserId }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(offlineUserId);
        return next;
      });
    };

    // Typing indicator handlers
    const handleUserTyping = ({ userId: typingUserId, isTyping, username }) => {
      if (isTyping) {
        setTypingUsers((prev) => ({ ...prev, [typingUserId]: username }));
        // Auto-clear typing indicator after 3 seconds of no update
        if (typingTimeoutRef.current[typingUserId]) {
          clearTimeout(typingTimeoutRef.current[typingUserId]);
        }
        typingTimeoutRef.current[typingUserId] = setTimeout(() => {
          setTypingUsers((prev) => {
            const next = { ...prev };
            delete next[typingUserId];
            return next;
          });
        }, 3000);
      } else {
        setTypingUsers((prev) => {
          const next = { ...prev };
          delete next[typingUserId];
          return next;
        });
        if (typingTimeoutRef.current[typingUserId]) {
          clearTimeout(typingTimeoutRef.current[typingUserId]);
          delete typingTimeoutRef.current[typingUserId];
        }
      }
    };

    socket.on("receiveMessage", handleMessage);
    socket.on("roomAccessDenied", handleAccessDenied);
    socket.on("joinRequestCreated", handleJoinRequestCreated);
    socket.on("joinRequestReviewed", handleJoinRequestReviewed);
    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);
    socket.on("userTyping", handleUserTyping);

    return () => {
      socket.off("receiveMessage", handleMessage);
      socket.off("roomAccessDenied", handleAccessDenied);
      socket.off("joinRequestCreated", handleJoinRequestCreated);
      socket.off("joinRequestReviewed", handleJoinRequestReviewed);
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
      socket.off("userTyping", handleUserTyping);
      // Clear all typing timeouts on cleanup
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
    };
  }, [roomId]);

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const stopTypingTimerRef = useRef(null);

  const handleInputChange = useCallback((value) => {
    setInput(value);
    const name = username || "Someone";

    // Always emit typing:true on every keystroke so the indicator stays alive
    socket.emit("typing", { roomId, isTyping: true, username: name });

    // Reset the stop-typing timer on every keystroke
    if (stopTypingTimerRef.current) clearTimeout(stopTypingTimerRef.current);
    stopTypingTimerRef.current = setTimeout(() => {
      socket.emit("typing", { roomId, isTyping: false, username: name });
    }, 1500);
  }, [roomId, username]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const message = {
      roomId,
      userId,
      text: input,
      sender: roomData.participants?.find(p => p._id === userId) || { _id: userId },
    };

    // Stop typing indicator when message is sent
    if (stopTypingTimerRef.current) clearTimeout(stopTypingTimerRef.current);
    socket.emit("typing", { roomId, isTyping: false });
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
    handleInputChange,
    showPeople,
    setShowPeople,
    roomData,
    isAdmin,
    requestLoading,
    showRequestIndicator,
    messageBoxRef,
    onlineUsers,
    typingUsers,
    handleSendMessage,
    handleReviewJoinRequest,
  };
};
