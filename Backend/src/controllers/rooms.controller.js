import roomModel from "../models/room.model.js"
import userModel from "../models/user.model.js";
import crypto from "crypto" 
import { emitToRoom } from "../socket/socketServer.js";

const getEntityId = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (value._id) {
    return value._id.toString();
  }

  return value.toString();
};

const isRoomAdmin = (room, userId) => getEntityId(room.roomCreatedby) === getEntityId(userId);
const isRoomParticipant = (room, userId) =>
  room.participants.some((participant) => getEntityId(participant) === getEntityId(userId));

export const createRoom = async (req,res) => {
    const {language , title , languageIcon ,codeContent} = req.body

    const userId = req.user._id
    try {
        if(!language){
            throw new Error("language is required please select language")
        }
        if(!title){
            throw new Error("title is required")
        }   

        let roomId = crypto.randomBytes(15).toString("hex");
       
        const room = await roomModel.create({
            roomId : roomId,
            title : title,
            roomCreatedby : userId,
            language : language,
            participants : [userId],
            languageIcon : languageIcon,
            codeContent

        })
       
        res.status(200).json({ message: "Room created successfully", room });

    } catch (error) {
        console.log( "error in create room controller" , error.message);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
}

export const getRoomById = async (req, res) => {
    try {
      const { roomId } = req.params;
  
      const room = await roomModel.findOne({ roomId })
        .populate("roomCreatedby", "username avatar")
        .populate("participants", "username avatar")
        .populate("joinRequests.requestedBy", "username avatar email")
        .populate("messages.sender", "username avatar");
 
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      if (!isRoomAdmin(room, req.user._id) && !isRoomParticipant(room, req.user._id)) {
        return res.status(403).json({ message: "You do not have access to this room" });
      }
  
      res.status(200).json(room);
  
    } catch (error) {
      console.log(error.message)  
      res.status(500).json({ message: "Error fetching room", error });
    }
};
  

export const getAllRoom = async (req, res) => {
  try {
    const userId = req.user._id;

    const populatedRoom = await roomModel
      .find({
        $or: [
          { roomCreatedby: userId }, 
          { participants: userId },
        ],
      })
      .populate("roomCreatedby", "_id avatar username") 
      .populate("participants", "avatar username") 
      .populate("joinRequests.requestedBy", "_id avatar username email")
      .sort({ createdAt: -1 }); 
      
    return res.status(200).json({
      message: "Fetched all rooms successfully",
      rooms: populatedRoom,
    });
  } catch (error) {
    console.log("Error in getAllRoom controller:", error.message);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};


export const joinRoomById = async (req,res) => {
    const roomId = req.params.roomId
    const userId = req.user._id
    
    try {
      if(!roomId){
        throw new Error("RoomId is required")
      }
  
      const room = await roomModel.findOne({roomId})
  
      if(!room){
        return res.status(400).json({message :"roomId invalid please try again to different RoomId"})
      }

      if (isRoomAdmin(room, userId) || isRoomParticipant(room, userId)) {
        return res.status(400).json({ message: "You are already a member of this room" });
      }

      const alreadyRequested = room.joinRequests.some(
        (request) => getEntityId(request.requestedBy) === getEntityId(userId)
      );

      if (alreadyRequested) {
        return res.status(400).json({ message: "Join request already sent to the room admin" });
      }
  
      const updatedRoom = await roomModel.findOneAndUpdate(
        { roomId },
        {
          $push: {
            joinRequests: {
              requestedBy: userId
            }
          }
        },
        { new: true }
      );

      const newRequest = updatedRoom.joinRequests[updatedRoom.joinRequests.length - 1];

      emitToRoom(roomId, "joinRequestCreated", {
        _id: newRequest._id,
        requestedAt: newRequest.requestedAt,
        requestedBy: {
          _id: req.user._id,
          username: req.user.username,
          avatar: req.user.avatar,
          email: req.user.email,
        },
      });

      return res.status(200).json({message : "Join request sent to the room admin"})

    } catch (error) {
      console.log("Error in joinRoomById controller :" , error.message)
      return res.status(500).json({message : "Internal Server Error" })
    }





} 

export const reviewJoinRequest = async (req, res) => {
    const { roomId, requestId } = req.params;
    const { action } = req.body;
    const userId = req.user._id;

    try {
      if (!["accept", "reject"].includes(action)) {
        return res.status(400).json({ message: "Invalid action" });
      }

      const room = await roomModel.findOne({ roomId });

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      if (!isRoomAdmin(room, userId)) {
        return res.status(403).json({ message: "Only the room admin can review join requests" });
      }

      const request = room.joinRequests.id(requestId);

      if (!request) {
        return res.status(404).json({ message: "Join request not found" });
      }

      if (action === "accept") {
        const acceptedUser = await userModel.findById(request.requestedBy).select("_id username avatar email");

        await roomModel.findOneAndUpdate(
          { roomId },
          {
            $addToSet: { participants: request.requestedBy },
            $pull: { joinRequests: { _id: requestId } }
          }
        );

        emitToRoom(roomId, "joinRequestReviewed", {
          action,
          requestId,
          participant: acceptedUser,
        });

        return res.status(200).json({ message: "Join request accepted successfully" });
      }

      await roomModel.findOneAndUpdate(
        { roomId },
        {
          $pull: { joinRequests: { _id: requestId } }
        }
      );

      emitToRoom(roomId, "joinRequestReviewed", {
        action,
        requestId,
      });

      return res.status(200).json({ message: "Join request rejected successfully" });
    } catch (error) {
      console.log("Error in reviewJoinRequest controller :", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteRoom = async (req,res) => {
    const roomId = req.params.roomId
    const userId = req.user._id
    
    try {
      
      const room = await roomModel.findOne({roomId, roomCreatedby : userId})
      if(!room){
        return res.status(400).json({message : "You have no access to delete the room"})
      }

      await roomModel.findOneAndDelete({roomId})

      res.status(200).json({ message : "room deleted successfully"})
     
      
    } catch (error) {
      console.log("Error in deleteRoom controller :" , error.message)
      return res.status(500).json({message : "Internal Server Error" })
    }
}
