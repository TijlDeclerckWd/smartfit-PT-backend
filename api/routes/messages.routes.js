const express = require('express');
const path = require('path');

const {
    messagesController
} = require('../controllers');

const {
    auth
} = require('../../utils');

const router = express.Router();

// Verify token and add current userId to request data
router.use(auth.verifyToken);
// Check if user is logged in
// router.use(auth.isLoggedIn);


// -| Routes |-

// get all the conversations of this person
router.get('/getConversations', messagesController.getConversations);

// get user list
router.get('/getUserList/:value', messagesController.getUserList);

// send message to other user
router.post('/sendMsg', messagesController.sendMsg);

// update seen messages
router.put('/updateSeenMessages', messagesController.updateSeenMessages);

module.exports = router;
