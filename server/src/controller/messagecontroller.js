const Message = require("../models/messageModel")
const  User = require("../models/userModel")
const Chat = require("../models/chatModel")

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    console.log(content, chatId, "chat iddddd");

    if (!content || !chatId) {
        console.log("Invalid data");
        return res.status(400).send({ message: "Invalid data" });
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };

    console.log(newMessage, "Newmessage");

    try {
        let message = await Message.create(newMessage);

        message = await Message.populate(message, {
            path: "sender",
            select: "name pic"
        });

        message = await Message.populate(message, {
            path: "chat",
            populate: {
                path: "users",
                select: "name pic email"
            }
        });

        // Update latest message in the chat
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        res.json(message);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const allMessages = async(req,res) =>{
    const id = req.params.chatId
    try{
        const messages = await Message.find({chat:id})
        .populate("sender","name pic email")
        .populate("chat")
        res.json(messages)
    }
    catch(error){
        console.error(error);
        res.status(400).json({ message: error.message });
    }

}

module.exports = {sendMessage,allMessages}