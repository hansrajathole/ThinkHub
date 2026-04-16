let ioInstance = null;

export const setSocketServer = (io) => {
  ioInstance = io;
};

export const emitToRoom = (roomId, eventName, payload) => {
  ioInstance?.to(roomId).emit(eventName, payload);
};
