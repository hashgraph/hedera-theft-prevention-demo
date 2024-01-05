const dotEnv = require('dotenv')
const dbService = require('./database')
const WebSockets = require('./webSockets')

const {
    Client,
    TopicMessageQuery, AccountId, PrivateKey, Timestamp
} = require('@hashgraph/sdk')

dotEnv.config()

const client = Client.forTestnet();
const dummyKey = PrivateKey.generateED25519();
client.setOperator(AccountId.fromString("0.0.2"), dummyKey)
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
    try {
        new TopicMessageQuery()
            .setTopicId(consensusTopicId)

            .subscribe(client,
                (error) => {
                    console.log('Mirror error')
                    console.warn(error)
                    listenAttempts += 1
                    isListening = false
                    setTimeout(() => {
                        console.log('reconnecting...')
                        this.startListening()
                    }, listenAttempts * 250)
                },
                (message) => {
                    console.log('got mirror notification')
                    listenAttempts = 0
                    lastReceivedResponseTime = message.consensusTimestamp

                    // const message = response.message
                    // const timestamp = utils.secondsToDate(response.consensusTimestamp).toUTCString()
                    // const sequence = response.sequenceNumber

                    handleNotification(message);
                }
            );
    }
    catch (e) {
        console.log(e)
    }
}

const handleNotification = function(mirrorResponse) {
    try {
        console.log('handling mirror notification')
        const payload = new TextDecoder().decode(mirrorResponse.contents);
        const itemData = JSON.parse(payload)
        const consensustime = mirrorResponse.consensusTimestamp.seconds.toString();

        dbService.addItem(itemData.serial, itemData.price, itemData.action, itemData.posId, consensustime)
            .then(() => {
                console.log(`item added ${itemData.serial} - ${itemData.action} -${consensustime}`);
                WebSockets.sendNotification(itemData.serial, 'System of records updated for '.concat(itemData.action))
            })
            .catch(err => {
                console.log(`error ${itemData.serial} - ${itemData.action} -${consensustime}`);
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

