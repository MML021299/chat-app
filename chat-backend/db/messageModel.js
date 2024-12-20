const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    room: {
        type: String,
    },
    author: {
        type: String,
    },
    message: {
        type: String,
    },
    userId: {
        type: String
    },
    users: {
        type: Array
    },
    dateCreated: {
        type: String
    }
})

module.exports = mongoose.model.Messages || mongoose.model("Messages", messageSchema)