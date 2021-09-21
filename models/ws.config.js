const WebSocket = require('ws');
const sessionParser = require('../controllers/session.controller');

let wss = new WebSocket.Server({
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
    console.log(req.session);
})

module.exports = { upgradeSocket };