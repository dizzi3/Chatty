const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    founder: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    joinedUsers: {
        type: Array,
        required: true
    }

})

const Room = mongoose.model('Room', RoomSchema)

module.exports = Room