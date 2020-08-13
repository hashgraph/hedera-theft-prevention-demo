const dotEnv = require('dotenv')
const dbService = require('./database')
const WebSockets = require('./webSockets')

const {
    MirrorClient,
    MirrorConsensusTopicQuery
} = require('@hashgraph/sdk')

dotEnv.config()

const mirrorClient = new MirrorClient(process.env.MIRROR_ADDRESS)
let consensusTopicId;

let isListening = false
let listenAttempts = 0
let lastReceivedResponseTime = Date.now()

exports.startListening = function () {
    // Guard against being called multiple times
    console.log('Mirror startListening')
    if (isListening) return
    isListening = true

    consensusTopicId = process.env.TOPIC_ID;

    console.log('Mirror new MirrorConsensusTopicQuery() for topic Id '.concat(consensusTopicId))
    new MirrorConsensusTopicQuery()
        .setTopicId(consensusTopicId)
        .setStartTime(Date.now())
        .subscribe(mirrorClient, (response) => {
            console.log('got mirror notification')
            listenAttempts = 0
            lastReceivedResponseTime = response.consensusTimestamp.asDate()

            // const message = response.message
            // const timestamp = utils.secondsToDate(response.consensusTimestamp).toUTCString()
            // const sequence = response.sequenceNumber

            handleNotification(response);
        }, (error) => {
            console.warn('Mirror error')
            console.warn(error)
            listenAttempts += 1
            isListening = false
            setTimeout(() => {
                console.log('reconnecting...')
                this.startListening()
            }, listenAttempts * 250)
        })
}

const handleNotification = function(mirrorResponse) {
    try {
        console.log('handling mirror notification')
        const payload = new TextDecoder().decode(mirrorResponse.message);
        const itemData = JSON.parse(payload)
        const consensustime = mirrorResponse.consensusTimestamp.asDate()

        dbService.addItem(itemData.serial, itemData.price, itemData.action, itemData.posId, consensustime)
            .then(() => {
                WebSockets.sendNotification(itemData.serial, 'System of records updated for '.concat(itemData.action))
                console.log('item added')
            })
            .catch(err => {
                if (err.toString().includes('UNIQUE constraint')) {
                    console.warn("duplicate Operation consensus timestamp detected - skipping");
                } else {
                    console.error(err);
                }
            })
    } catch (e) {
        console.error(e)
    }
}

