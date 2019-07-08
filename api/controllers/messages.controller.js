const { Conversation, Message, Trainer, Client } = require('../models');


const getConversations = async (req, res) => {
    try {
        const { userId } = req;

        const conversations = await Conversation.find({ $or: [ { trainer: userId }, { client: userId }]})
            .populate([
                { path: 'client', select: 'type firstName lastName fullName profile_pic' },
                { path: 'trainer', select: 'type firstName lastName fullName profile_pic' },
                { path: 'messages' }]);

        console.log('retrieved conversations');

        res.status(200).json({
            conversations
        });
    } catch(err) {
        console.log('err', err);
    }
};

const getUserList = async (req, res) => {
    try {
        const { userId } = req;
        const value = req.params.value;

        const currentUser = await Trainer.findOne({ _id: userId });
        // if we didn't find a trainer, we know this user is a 'client'
        const type = currentUser ? 'trainer' : 'client';


        console.log('TYPE', type);

        if (type === 'trainer') {
            let myClients = await Client.find({ trainers: { $in: userId }});
            const filteredClients = myClients.filter((client) => client.fullName.includes(value));
            res.status(200).json({
                myResults: filteredClients
            });
        } else {
            let myTrainers = await Trainer.find({ clients: { $in: userId }});

            console.log('myTrainers check', myTrainers);
            // return only the trainers whose full name contains the search string
            const filteredTrainers = myTrainers.filter((trainer) => trainer.fullName.includes(value));
            res.status(200).json({
                myResults: filteredTrainers
            });
        }
    } catch (err) {
        console.log('error', err);
    }
};

const sendMsg = async (req, res) => {
    try {
        const {userId} = req;
        const {to, message} = req.body;


        //check to see if this user is a trainer
        const user = await Trainer.findOne({_id: userId});
        // if we found a document in the trainer model, that means that the trainer equals our userId, if not userid equals client
        const trainer = user ? userId : to;
        const client = user ? to : userId;
        const sentBy = user ? 'trainer' : 'client';

        // we look for a conversation of this user and the person he intends to write to
        let existingConversation = await Conversation.findOne({
            $and: [{trainer}, {client}]
        });

        //    if this conversation does not exist we create a new one
        if (!existingConversation) {
            existingConversation = await Conversation.create({trainer, client});
        }

        //we create a new message document
        let newMessage = await Message.create({trainer, client, sentBy, message, conversation: existingConversation});


        // update the conversation document
        existingConversation.messages.push(newMessage);
        await existingConversation.save();

        // populate the newMessage before returning it
        newMessage = await Message.populate(newMessage, [
            { path: 'trainer', select: 'firstName lastName type profile_pic fullName' },
            { path: 'client', select: 'firstName lastName type profile_pic fullName' },
            { path: 'conversation', populate: [{ path: 'messages' }, { path: 'client' }, { path: 'trainer'}]}
        ]);

        res.status(200).json({
            message: newMessage
        });
    } catch (err) {
        console.log('err', err);
    }
};

const updateSeenMessages = async (req, res) => {
    try {
        console.log('WE FIRED NUMBER 2');
        const { conversation } = req.body;

        const convToUpdate = await Conversation.findOne({ _id: conversation});

        convToUpdate.seenMessages = convToUpdate.messages.length;

        const updatedConversation = await convToUpdate.save();

        res.status(200).json({
            updatedConversation
        })
    } catch(err) {
        console.log('err', err);
    }
}

module.exports = {
    getConversations,
    getUserList,
    sendMsg,
    updateSeenMessages
};
