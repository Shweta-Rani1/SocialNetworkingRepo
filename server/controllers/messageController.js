const HttpError = require("../models/errorModel")
const ConversationModel = require("../models/ConversationModel")


// CREATE MESSAGE 
// POST : api/messages/:receiverId
// PROTECTED
const createMessage = async (req, res, next) => {
    try {const{receiverId} = req.params;
        const {messageBody} = req.body;
        // check if there's already a conversation with the receiver
        let conversation = await ConversationModel.findOne({participants: {$all: [req.user._id, receiverId]}})
        // create a new cobversation if it doesn't exist
        if (!conversation) {
            conversation = await ConversationModel.create({
                participants: [req.user._id, receiverId],
                lastMessage: {text: messageBody, sender: req.user._id}
            });
        }
        //create a new message in the conversation
        const newMessage = await MessageModel.create({
            conversationId: conversation._id,
            text: messageBody,
            senderId: req.user._id
        });
        await conversation.updateOne({
            lastMessage: {text: messageBody, senderId: req.user._id}
        });
        res.json(newMessage);
    } catch (error) {
        return next(new HttpError(error))
        
    }
}

// GET MESSAGE 
// GET : api/messages/:receiverId
// PROTECTED
const getMessages = async (req, res, next) => {
    try {
        const {receiverId} = req.params;
        const conversation = await ConversationModel.findOne({participants: {$all: [req.user._id, receiverId]}})
        if (!conversation) {
            return next(new HttpError("You have no conversation with this person", 404))
        }
        const messages = await MessageModel.find({conversationId: conversation._id}).sort
        ({createdAt: 1});
        res.json(messages);
    } catch (error) {
        return next(new HttpError(error))
        
    }
}

// GET CONVERSATIONS 
// GET : api/conversations
// PROTECTED
const getConversations = async (req, res, next) => {
    try {
        let conversations = await ConversationModel.find({
            participants: req.user._id
        }).populate({path: "participants", select: "fullName profilePhoto"}).sort({createdAt: -1});
        //remove logged in user from participants array
        conversations.forEach((conversation) => {
            conversation.participants = conversation.participants.filter((participant) => participant._id.toString() !== req.user._id.toString());
        });
        res.json(conversations);
    } catch (error) {
        return next(new HttpError(error))
    }
}    

module.exports = {createMessage, getMessages, getConversations}