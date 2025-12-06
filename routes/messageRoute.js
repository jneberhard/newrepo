// Needed Resources 
const express = require("express")
const router = new express.Router() 
const messageController = require("../controllers/messageController") 
const utilities = require("../utilities")
const messageValidate = require("../utilities/message-validation")
const mesCont = require("../controllers/messageController")

router.get("/inbox",
  utilities.checkLogin,
  utilities.handleErrors(messageController.buildInbox)
)

router.get("/new", 
    utilities.checkLogin,
    utilities.handleErrors(messageController.buildMessageForm)
)

router.get("/sent",
  utilities.checkLogin,
  utilities.handleErrors(messageController.buildSent)
)

router.post("/send", 
    utilities.checkLogin,
    messageValidate.newMessageRules(), 
    messageValidate.checkMessageData, 
    utilities.handleErrors(messageController.sendMessage)
);

router.get("/reply/:id",
  utilities.checkLogin,
  utilities.handleErrors(messageController.buildReplyForm)
)

router.post("/delete", mesCont.deleteMessage)

module.exports = router