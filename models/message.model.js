const {
    v4: uid
} = require('uuid'), {
    Schema,
    model
} = require('mongoose');

const messageModel = new Schema({
    _uid: {
        type: String,
        default: uid
    },
    to: String,
    from: String,
    datetime: Object,
    data: String
}, {
    versionKey: false,
    collection: 'chats'
})

const Message = model('Message', messageModel);

module.exports = Message;