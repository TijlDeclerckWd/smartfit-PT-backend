const socketIO = require('socket.io');

const { Conversation } = require('../api/models');

// const notifications = require('../api/controllers/notifications.controller');
// const { Post, Comment } = require('../api/models');

const init = (server) => {
    const io = socketIO(server);

    /* =================
     * - NOTIFICATIONS -
     * =================
     */

    io.on('connection', (socket) => {

        // Right after connecting to the socket we make the user join a private group based on his userId
        socket.on('joinUser', (userId) => {
            // join room
            socket.join(userId.userId);
        });

        // this is the event we receive to notify the other user that he received a new message
        socket.on('newMessage', (data) => {
            // I received the data
            // I define the other user to make sure we send it to the right one
            // I did the console.logs to make sure that I targeted the right client
            const otherUser = data.userId === data.message.trainer._id ? data.message.client : data.message.trainer;

            // this function is supposed to notify the client side, but the client received nothing
            socket.to(otherUser._id).emit('newMsg', data.message);
            socket.emit('newMsg', data.message);
        });

        socket.on('updateSeenMessages', async (conversationId) => {
            console.log('WE FIRED NUMBER 1');
            const conversation = await Conversation.findOne({ _id: conversationId });

            conversation.seenMessages = conversation.messages.length;

            const updatedConversation = await conversation.save();
            socket.emit('updatedSeenMessages', updatedConversation);
        });
})};

/* ===========
 * - HELPERS -
 * ===========
 */



module.exports = { init };
