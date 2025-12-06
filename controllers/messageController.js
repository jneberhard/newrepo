const messageModel = require("../models/message-model")
const accountModel = require("../models/account-model") //imports the models
const utilities = require("../utilities/")

const mesCont = {}    //mesCont = short for messageController

// send message
mesCont.sendMessage = async function (req, res, next) {
    if (!res.locals.loggedin) {
    req.flash("error", "You must be logged in to send a message.")
    return res.redirect("/account/login")
    }

    const { subject, message, recipient, reply_to } = req.body
    const username = res.locals.accountData.account_email

    let finalMessage = message

    const sendResult = await messageModel.addMessage(username, subject, finalMessage, recipient, reply_to)
    if (sendResult) {
        req.flash("success", `Message sent to ${recipient} successfully.`)
        res.redirect("/message/inbox")
    } else {
        req.flash("error", "Failed to send message. Please try again.")
        res.redirect("/message/inbox")
    }
}

// build message form view with only Employee/Manager recipients
mesCont.buildMessageForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  const accounts = await accountModel.getEmployeesAndManagers()

  // Build recipient options HTML
  let recipientList = accounts.map(acc => {
    return `<option value="${acc.account_email}">${acc.account_firstname} ${acc.account_lastname} (${acc.account_type})</option>`
  }).join("")

  res.render("message/message", {
    title: "Send Message",
    nav,
    errors: null,
    username: res.locals.accountData?.account_email || "",
    subject: "",
    message: "",
    recipientList,
    success: req.flash("success"),
    error: req.flash("error"),
  })
}

//build message management view
mesCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("message/message-management", {
        title: "Message Management",
        nav,
        errors: null,
    });
}

// build message inbox view
mesCont.buildInbox = async function (req, res, next) {
  if (!res.locals.loggedin) {
    req.flash("error", "You must be logged in to view your inbox.")
    return res.redirect("/account/login")
  }

  let nav = await utilities.getNav()
  const recipientEmail = res.locals.accountData.account_email
  const messages = await messageModel.getMessagesByRecipient(recipientEmail)

    messages.forEach(message => {
      message.sent_at = new Date(message.sent_at)
  })
  res.render("message/inbox", {
    title: "My Inbox",
    nav,
    errors: null,
      messages,
    success: req.flash("success"),
    error: req.flash("error")
  })
}

//build sent messages view
mesCont.buildSent = async function (req, res, next) {
  if (!res.locals.loggedin) {
    req.flash("error", "You must be logged in to view your sent messages.")
    return res.redirect("/account/login")
  }

  let nav = await utilities.getNav()
  const senderEmail = res.locals.accountData.account_email
  let messages = await messageModel.getMessagesBySender(senderEmail)
    
  messages.forEach(message => {
    message.sent_at = new Date(message.sent_at)
  })

  res.render("message/sent", {
    title: "Sent Messages",
    nav,
    errors: null,
    messages, 
    success: req.flash("success"),
    error: req.flash("error")
  })
}

mesCont.buildReplyForm = async function (req, res, next) {
    let nav = await utilities.getNav()
    const messageId = req.params.id
    const recipientMessage = await messageModel.getMessageById(messageId)

    if (!recipientMessage) {
        req.flash("error", "Message not found.")
        return res.redirect("/message/inbox")
    }

    const accounts = await accountModel.getAllAccounts()
    let recipientList = accounts.map(acc => {
    return `<option value="${acc.account_email}" 
      ${acc.account_email === recipientMessage.username ? "selected" : ""}>
      ${acc.account_firstname} ${acc.account_lastname} (${acc.account_type})
    </option>`
    }).join("")
    
    res.render("message/message", {
    title: "Reply to Message",
    nav,
    errors: null,
    username: res.locals.accountData?.account_email || "",
    subject: "Re: " + recipientMessage.subject,
    message: `\n\n--- Original Message ---\nFrom: ${recipientMessage.username}\nSent: ${recipientMessage.sent_at}\n\n${recipientMessage.message}`,
    recipientList,
    reply_to: recipientMessage.message_id,  
    success: req.flash("success"),
    error: req.flash("error")
  })
}

// delete message
mesCont.deleteMessage = async function (req, res, next) {
  if (!res.locals.loggedin) {
    req.flash("error", "You must be logged in to delete a message.")
    return res.redirect("/account/login")
  }

  const { message_id } = req.body  
  const deleteResult = await messageModel.deleteMessageById(message_id)

  if (deleteResult) {
    req.flash("success", "Message deleted successfully.")
  } else {
    req.flash("error", "Message could not be deleted.")
  }

  res.redirect("/message/inbox")
}

module.exports = mesCont  