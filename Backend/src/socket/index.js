
import roomModel from "../models/room.model.js";
import userModel from '../models/user.model.js'
import { setSocketServer } from "./socketServer.js";

const getAuthorizedRoom = async (roomId, userId) =>
  roomModel.findOne({
    roomId,
    $or: [{ roomCreatedby: userId }, { participants: userId }],
  });

const socketHandler = (io) => {
  setSocketServer(io);

  io.on("connection", (socket) => {
    console.log(" New user connected:", socket.id);

    socket.on("joinRoom", async ({ roomId }) => {
      const userId = socket.user.id;
      const room = await getAuthorizedRoom(roomId, userId);

      if (!room) {
        socket.emit("roomAccessDenied", "Your join request is still pending approval.");
        return;
      }

      socket.join(roomId);
      console.log(`${userId} joined room ${roomId}`);
    });

   
    socket.on("codeChange", async ({ roomId, code }) => {
      const room = await getAuthorizedRoom(roomId, socket.user.id);

      if (!room) {
        socket.emit("roomAccessDenied", "You do not have access to edit this room.");
        return;
      }

      await roomModel.findOneAndUpdate({ roomId }, { codeContent: code });
      socket.broadcast.to(roomId).emit("codeUpdate", code);
    });

  
    socket.on("sendMessage", async ({ roomId, text }) => {
      const room = await getAuthorizedRoom(roomId, socket.user.id);

      if (!room) {
        socket.emit("roomAccessDenied", "You do not have access to message in this room.");
        return;
      }

      const userId = socket.user.id;
      const user = await userModel.findById(userId)
      const message = {
        sender: userId,
        text,
        timestamp: new Date(),
        readBy: [userId]
      };

     
    await roomModel.findOneAndUpdate(
        { roomId },
        { $push: { messages: message } }
      );
     
      const newMessage = {
        sender:{
          _id: userId , username: user.username, avatar: user.avatar
        },
        text,
        timestamp: new Date(),
        readBy: [userId]
      };
     
      socket.broadcast.to(roomId).emit("receiveMessage", newMessage );
    });

   
    socket.on("leaveRoom", ({ roomId }) => {
      socket.leave(roomId);
      console.log(` User left room ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log(" User disconnected:", socket.id);
    });
  });
};

export default socketHandler;
