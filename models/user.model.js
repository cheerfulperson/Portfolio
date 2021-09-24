const 
    { v1 : createId } = require('uuid'),
    mongoose = require('mongoose');

// установка модель
const userScheme = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        chats: Array,
        role: {
            type: Number,
            default: 0
        },
        image: {
            type: String,
            default: "/media/images/avatars/a1.png" 
        },
        _id: {
            type: String,
            default: createId
        }
    }, 
    {
        versionKey: false,
        collection: 'users'
    } 
);

const User = mongoose.model("User", userScheme);

module.exports = User;