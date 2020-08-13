const WSPORT = process.env.WSPORT || 5000;
const webSocketServer = new (require('ws')).Server({ port: WSPORT });
const webSockets = {}

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

exports.sendNotification = function  (destination, message) {
    const toUserWebSocket = webSockets[destination]
    if (toUserWebSocket) {
        toUserWebSocket.send(JSON.stringify(message))
        delete webSockets[destination]
    }
}
