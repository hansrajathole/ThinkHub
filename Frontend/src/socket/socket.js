import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL,  {
  auth: {
      token: localStorage.getItem('token')
  },
  withCredentials: true,
});

export const setSocketAuthToken = (token) => {
  socket.auth = {
    ...socket.auth,
    token,
  };
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
