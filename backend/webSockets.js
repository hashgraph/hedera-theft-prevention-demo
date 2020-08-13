const WSPORT = process.env.WSPORT || 5000;
const webSockets = {}
const http = require('http');
const url = require('url');
const server = http.createServer();
const webSocketServer = new (require('ws')).Server({ noServer: true });

webSocketServer.on('connection', function connection(webSocket) {
    let userID = ''
    console.log('Socket connection')
    webSocket.on('message', function incoming(message) {
        serial = JSON.parse(message).serial
        webSockets[serial] = webSocket
        console.log('connected: ' + serial)
    })

    webSocket.on('close', function () {
        delete webSockets[userID]
    })
})

server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = url.parse(request.url).pathname;

    if (pathname === '/ws') {
        webSocketServer.handleUpgrade(request, socket, head, function done(ws) {
            webSocketServer.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
})

exports.sendNotification = function  (destination, message) {
    const toUserWebSocket = webSockets[destination]
    if (toUserWebSocket) {
        toUserWebSocket.send(JSON.stringify(message))
        delete webSockets[destination]
    }
}

server.listen(process.env.WSPORT)
