const WebSocket = require('ws');
const sessionParser = require('./session.controller');
const
    UserModel = require('../models/user.model'),
    MessageModel = require('../models/message.model');

const DbController = require('../controllers/user.db.controller');

// * -> Collection's controllers
const Users = new DbController(UserModel);
const Messages = new DbController(MessageModel);

// * -> Create WebSocket Server
const wss = new WebSocket.Server({
    clientTracking: false,
    noServer: true
});

const upgradeSocket = (req, socket, head) => {
    sessionParser(req, {}, () => {
        if (!req.session || (req.session && !req.session.user)) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }

        wss.handleUpgrade(req, socket, head, function (ws) {
            wss.emit('connection', ws, req);
        });
    });
}

wss.on('connection', (ws, req) => {
    console.log('wss is opened!');
    try {
        Users.getOne({
                _id: req.session.user.id
            }).then(user => {
                Users.searchAll({
                        _id: {
                            $ne: user._id
                        },
                        chats: {
                            $in: user.chats
                        }
                    }, {
                        chats: 1,
                        name: 1,
                        image: 1,
                        email: 1,
                        _id: 0
                    })
                    .then(data => {
                        data.map(el => {
                            el.chats = el.chats.filter(uid => {
                                for (e of user.chats) {
                                    if (e != uid) continue;
                                    return uid;
                                }
                            })
                            return el;
                        })

                        ws.send(JSON.stringify({
                            event: 'uploadChats',
                            data
                        }), err => {
                            if (err) console.error(err)
                        });
                    })
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    } catch (error) {
        console.error(error)
    }
    ws.on('message', (userData) => {
        let {
            event,
            data
        } = JSON.parse(Buffer.from(userData).toString());
        switch (event) {
            case 'openchat':
                Messages.searchAll({
                    _uid: data
                }).then(data => {
                    console.log(data)
                })
                break;

            default:
                break;
        }
        console.log(event, data);
    })
})

module.exports = {
    upgradeSocket
};