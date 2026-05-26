const Chat = require("../models/Chat");

const getChats = async(req,res)=> {
    const userId = req.user._id;
    const  {targetId } = req.params
    const chat = await Chat.find({
        participants : {$all : [userId,targetId]}
    }).populate({
        path : "messages.senderId",
        select : "firstName, lastName, profileImage"
    })

}