const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

let store = new MongoDBStore({
    uri: process.env.MONGO_CONNECTION_STRING,
    collection: 'sessions',

    // Lets you set options passed to `MongoClient.connect()`. Useful for
    // configuring connectivity or working around deprecation warnings.
    connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000
    }
});

// Catch errors
store.on('error', function(error) {
    console.error(error);
});

module.exports = store;