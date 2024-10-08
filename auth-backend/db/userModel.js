const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: true,
    },
    username: {
        type: String,
        required: [true, "Please provide a Username!"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        unique: false,
    },
    uniqueId: {
        type: String,
        unique: true,
    }
})

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);