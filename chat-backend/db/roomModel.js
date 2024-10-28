const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    room: {
        type: String,
        unique: true,
    },
    users: {
        type: Array,
    },
})

module.exports = mongoose.model.Rooms || mongoose.model("Rooms", roomSchema)