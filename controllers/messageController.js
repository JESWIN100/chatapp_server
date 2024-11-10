import Conversation from "../model/conversationSchema.js";
import Message from "../model/messageSchema.js";
import { getReciverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { receiverId } = req.params;
        const senderId = req.user._conditions._id

        // console.log(req.user._conditions._id);

        let chats = await Conversation.findOne({
            participants:{$all:[senderId, receiverId] }
        })
        if (!chats) {
            chats = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessages = new Message({
            senderId,
            receiverId,
            message,
            ConversationId: chats._id
        })
        console.log(newMessages);
        
        if (newMessages) {
            chats.messages.push(newMessages._id)
        }
        await Promise.all([chats.save(), newMessages.save()])

//socket.io
const receverSocketId=getReciverSocketId(receiverId)
if(receverSocketId){
    io.to(receverSocketId).emit('newMessage',newMessages)
}


        res.status(201).send(newMessages)



    } catch (error) {
        console.log(error);

        res.status(500).send({ scuess: false, message: error.message })

    }

}


export const getMessages=async(req,res)=>{
    try {
        const { receiverId } = req.params;
        const senderId = req.user._conditions._id

        let chats = await Conversation.findOne({
            participants:{$all:[senderId, receiverId] }
            }).populate('messages')
            if (!chats) {
                return res.status(200).send([])
            }
            const messages=chats.messages;
            res.status(200).send(messages)


        
    } catch (error) {
        console.log(error);

        res.status(500).send({ scuess: false, message: error.message })

    }
}