const 
    { v1 : createId } = require('uuid'),
    mongoose = require('mongoose');

// установка модель
const userScheme = new mongoose.Schema(
    {
        name: String,
        email: String,
        role: {
            type: String,
            default: "user"
        },
        image: {
            type: String,
            default: "/media/images/avatars/a1.png" 
        },
        password: String,
        _id: {
            type: String,
            default: createId
        }
    }, 
    {versionKey: false} 
);

const User = mongoose.model("User", userScheme);

module.exports = User;