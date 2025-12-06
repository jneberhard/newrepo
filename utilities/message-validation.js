const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* ******************************
 * Validate new message rules
 * ***************************** */
validate.newMessageRules = () => {
    return [
        // username required
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required."),

        // subject required
        body("subject")
            .trim()
            .notEmpty()
            .withMessage("Subject is required."),

        // message
        body("message")
            .trim()
            .notEmpty()
            .withMessage("Message is required."),


        //  recipient required - dropdown
        body("recipient")
            .trim()
            .notEmpty()
            .withMessage("Recipient is required."),
    ]
}
/* ******************************
 * Check message data
 * ***************************** */
validate.checkMessageData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("message/message", {
      title: "Send Message",
      nav,
      errors,
      username: req.body.username,
      subject: req.body.subject,
      message: req.body.message,
      recipientList: "<option value='" + req.body.recipient + "' selected>" + req.body.recipient + "</option>"
    })
  }
  next()
}

module.exports = validate;