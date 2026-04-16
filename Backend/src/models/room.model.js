import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      unique: true,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    roomCreatedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    language: {
      type: String
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    joinRequests: [
      {
        requestedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        requestedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    codeContent: {
      type: String,
      default: ""
    },
    languageIcon: {
      type: String,
      default: ""
    },
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        text: {
          type: String
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        readBy: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

const roomModel = mongoose.model("Room", RoomSchema);
export default roomModel;
