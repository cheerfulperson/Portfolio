const mongoose = require('mongoose');
const User = require('../models/user.model');

const connectToDb = cb => {
    mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('\x1b[36m%s\x1b[0m', 'Connected to mongoDB!');
        cb();
    });
};

module.exports = connectToDb;