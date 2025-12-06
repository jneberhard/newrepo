const pool = require("../database/")

/* ***************************
 *  insert new message
 * ************************** */
async function sendMessage(username, subject, message, recipient) {
    try {
        const sql = "INSERT INTO messages (username, subject, message, recipient) VALUES ($1, $2, $3, $4) RETURNING *"
        const data = await pool.query(sql, [username, subject, message, recipient])
        return data.rows[0]
    } catch (error) {
        console.error("Unable to insert new message", error)
        throw error
    }
}

/* ***************************
* check for existing username
* ************************** */
async function checkExistingUsername(username) {
    try {
        const sql = "SELECT * FROM messages WHERE username = $1"
        const data = await pool.query(sql, [username])
        return data.rowCount
    } catch (error) {
        console.error("Unable to get Username", error)
        throw error
    }
}

/* *****************************
* Get all messages for a recipient
* ***************************** */
async function getMessagesByRecipient(recipientEmail) {
  try {
    const sql = `
      SELECT message_id, username, subject, message, sent_at
      FROM messages
      WHERE recipient = $1
      ORDER BY sent_at DESC
    `
    const data = await pool.query(sql, [recipientEmail])
    return data.rows
  } catch (error) {
    console.error("Error fetching messages:", error)
    throw error
  }
}

/* *****************************
* Get all messages sent by a user
* ***************************** */
async function getMessagesBySender(senderEmail) {
  try {
    const sql = `
      SELECT message_id, recipient, subject, message, sent_at
      FROM messages
      WHERE username = $1
      ORDER BY sent_at DESC
    `
    const data = await pool.query(sql, [senderEmail])
    return data.rows
  } catch (error) {
    console.error("Error fetching sent messages:", error)
    throw error
  }
}

/* *****************************
* Get all messages sent id
* ***************************** */
async function getMessageById(messageId) {
    try {
        const result = await pool.query(
            'SELECT message_id, username, subject, message, recipient, sent_at FROM messages WHERE message_id = $1',
            [messageId])
        return result.rows[0]
    } catch (error) {
        console.error("Error getting that message", error)
        throw error
    }
}

/* *****************************
* add message to message 
* ***************************** */
async function addMessage(username, subject, message, recipient, reply_to = null) {
    try {
        const sql = `
            INSERT INTO messages (username, subject, message, recipient, sent_at, reply_to)
            VALUES ($1, $2, $3, $4, NOW(), $5)
            RETURNING *
        `
        const result = await pool.query(sql, [username, subject, message, recipient, reply_to])
        return result.rows[0]
    } catch (error) {
        console.error("Error inserting message", error)
        throw error
    }
}

async function deleteMessageById(messageId) {
  try {
    const sql = `DELETE FROM messages WHERE message_id = $1 RETURNING message_id`
    const result = await pool.query(sql, [messageId])
    return result.rowCount > 0
  } catch (error) {
    console.error("Error deleting message:", error)
    throw error
  }
}

module.exports = {
    sendMessage,
    getMessagesByRecipient,
    checkExistingUsername,
    addMessage,
    getMessagesBySender,
    getMessageById,
    deleteMessageById
}