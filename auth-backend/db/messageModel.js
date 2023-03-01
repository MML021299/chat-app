const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    room: {
        type: String,
        unique: true,
    },
    author: {
        type: String,
        unique: true,
    },
    message: {
        type: String,
        unique: true,
    },
})

module.exports = mongoose.model.Messages || mongoose.model("Messages", messageSchema)