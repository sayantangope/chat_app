const socket = require("socket.io");
const crypto = require("crypto");
const { Server } = require("socket.io");
const Chat = require("../models/Chat");
const intialiseSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  const getRoomSecretId = (userId, targetId)=> {
    return crypto
        .createHash("sha256")
        .update([userId,targetId].sort().join("_"))
        .digest("hex")
  }

    io.on("connection",(socket)=> {
        socket.on("joinchat",({userId,targetId})=> {
            const roomId = getRoomSecretId(userId,targetId);
            socket.join(roomId)
        });

        socket.on("sendMessage",async ({ firstName, userId, targetId, message, profileImage}) =>{
            try {
                const roomId = getRoomSecretId(userId, targetId);
                let chat = await Chat.find({
                    participants : {$all : [userId,targetId]}
                })
                if(!chat) {
                    chat = new Chat({
                        participants : [userId,targetId],
                        messages : []
                    })
                }
                chat.messages.push({senderId : userId, text : message})
                await chat.save()
                io.to(roomId).emit("messageReceived", {
                    firstName,
                    message,
                    profileImage
                })
            } catch (error) {
                
            }
        })
    })
};

module.exports = { intialiseSocket };
