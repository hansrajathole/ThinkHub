import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL


const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const fetchRooms = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/rooms`, getAuthHeader());
    return response.data?.rooms || [];
  } catch (error) {
    throw error;
  }
};

export const createRoom = async (roomData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/rooms`,
      roomData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const joinRoom = async (roomId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/api/rooms/${roomId}`,
      { roomId },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const reviewJoinRequest = async (roomId, requestId, action) => {
  try {
    const response = await axios.patch(
      `${API_URL}/api/rooms/${roomId}/requests/${requestId}`,
      { action },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRoom = async (roomId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/rooms/${roomId}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
