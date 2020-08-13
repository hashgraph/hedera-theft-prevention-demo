<template>
    <v-container>
        <v-banner
                single-line
                sticky
        >
            Point of sale demonstration
        </v-banner>
            <v-row class="text-center" align="stretch">
            <v-col cols="4">
                <v-card>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline">Sale or return</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <div class="my-2">
                                <v-btn block x-large color="success" dark @click="setupForSale()">Sale</v-btn>
                            </div>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <div class="my-2">
                                <v-btn block x-large color="warning" dark @click="setupForReturn()">Return</v-btn>
                            </div>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card v-if="action=='SALE'">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline">Sale</v-list-item-title>
                            <v-form v-model="saleValid">
                                <v-container
                                    fill-height
                                    fluid>
                                    <v-row>
                                        <v-col>
                                            <v-text-field
                                                v-model="saleSerial"
                                                :rules="saleSerialRules"
                                                label="Serial Number"
                                                required
                                                ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field
                                                    v-model.number="salePrice"
                                                    :rules="salePriceRules"
                                                    label="Price"
                                            >
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-form>
                            <v-list-item v-if="saleValid">
                                <v-list-item-content>
                                    <div class="my-2">
                                        <v-btn block x-large color="success" dark :disabled="!sellEnabled" @click="sellItem">Confirm Sale</v-btn>
                                    </div>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
                <v-card v-if="action=='RETURN'">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline">Return</v-list-item-title>
                            <v-form v-model="returnValid">
                                <v-container
                                        fill-height
                                        fluid>
                                    <v-row>
                                        <v-col>
                                            <v-combobox
                                                    v-model="returnSerial"
                                                    :items="soldItems"
                                                    label="Select an item to return"
                                                    @input.native="returnSerial=$event.srcElement.value"
                                            ></v-combobox>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field
                                                    v-model.number="returnPrice"
                                                    :rules="returnPriceRules"
                                                    label="Price"
                                            >
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field
                                                    v-model="posId"
                                                    :rules="returnPosIdRules"
                                                    label="Point of sale Id"
                                            >
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-form>
                            <v-list-item v-if="returnValid">
                                <v-list-item-content>
                                    <div class="my-2">
                                        <v-btn block x-large color="success" dark @click="checkReturn">Check Return</v-btn>
                                    </div>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card v-if="result=='SOLD'">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline">Sale Result</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Sale details</v-list-item-title>
                            <v-list-item-subtitle>Serial: {{ saleSerialSold }}</v-list-item-subtitle>
                            <v-list-item-subtitle>Price: {{ salePriceSold }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon large color="green darken-2">mdi-check-bold</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Sale confirmed</v-list-item-title>
                            <v-list-item-subtitle><a :href=saleTxUrl target=_blank>
                                {{ txId }}</a>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
                <v-card v-if="result=='RETURNEDPASS'">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline">Return Result</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Return details</v-list-item-title>
                            <v-list-item-subtitle>Serial: {{ returnSerialReturned }}</v-list-item-subtitle>
                            <v-list-item-subtitle>Price: {{ returnPriceReturned }}</v-list-item-subtitle>
                            <v-list-item-subtitle v-if="consensusTime">Sale Date: {{ consensusTime }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon large color="green darken-2">mdi-check-bold</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <div>
                                <v-list-item-title v-if="consensusTime">Return approved</v-list-item-title>
                                <v-list-item-title v-else>Return confirmed</v-list-item-title>
                            </div>
                            <v-list-item-subtitle><a :href=saleTxUrl target=_blank>
                                {{ txId }}</a>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="consensusTime">
                        <v-list-item-content>
                            <div class="my-2">
                                <v-btn block x-large color="success" dark @click="confirmReturn">Confirm Return</v-btn>
                            </div>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
                <v-card v-if="result=='RETURNEDALREADY'">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline">Return Result</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Return details</v-list-item-title>
                            <v-list-item-subtitle>Serial: {{ returnSerialReturned }}</v-list-item-subtitle>
                            <v-list-item-subtitle>Price: {{ returnPriceReturned }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon large color="red darken-2">mdi-close</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Item already returned</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
                <v-card v-if="result=='RETURNEDFAIL'">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline">Return Result</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Return details</v-list-item-title>
                            <v-list-item-subtitle>Serial: {{ returnSerialReturned }}</v-list-item-subtitle>
                            <v-list-item-subtitle>Price: {{ returnPriceReturned }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon large color="red darken-2">mdi-close</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Return denied</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <p class="text-right">Point of sale device id:{{ posId }}</p>
    </v-container>
</template>

<script>
    import axios from 'axios'
    import { bus } from '../main'
    import {v4 as uuid} from 'uuid'

    export default {
        name: "PointOfSale",
        data: () => ({
            action: '',
            result: '',
            txId: '',
            saleTxUrl: "https://kabuto.sh",
            saleValid: false,
            saleSerial: '',
            saleSerialSold: '',
            saleSerialRules: [
                v => !!v || 'Serial number is required'
            ],
            salePrice: 0,
            salePriceSold: 0,
            salePriceRules: [
                v => v.toString().length > 0 || 'Price is required',
                v => parseFloat(v) === v || 'Price must be a number',
            ],
            returnValid: false,
            returnSerial: '',
            returnSerialReturned: '',
            returnPrice: 0,
            returnPriceReturned: 0,
            returnPriceRules: [
                v => v.toString().length > 0 || 'Price is required',
                v => parseFloat(v) === v || 'Price must be a number',
            ],
            returnPosIdRules: [
                v => v.toString().length > 0 || 'Point of sale Id is required',
            ],
            consensusTime: '',
            sequenceNumber: '',
            runningHash: '',
            soldItems: [],
            posId: uuid().substr(1,7),
            sellEnabled: false
        }),
        methods: {
            setupForSale: function () {
                this.action = 'SALE'
                this.result = ''
                this.txId = ''
                this.saleTxUrl = ''
                this.saleValid = true
                this.saleSerial = uuid().substring(1, 13)
                this.saleSerialSold = ''
                this.salePrice = 0
                this.salePriceSold = 0

                this.returnValid = false
                this.returnSerial = ''
                this.returnSerialReturned = ''
                this.returnPrice = 0
                this.returnPriceReturned = 0
                this.sellEnabled = true
            },
            setupForReturn: function () {
                this.action = 'RETURN'
                this.result = ''
                this.txId = ''
                this.saleTxUrl = ''
                this.saleValid = false
                this.saleSerial = ''
                this.salePrice = 0

                this.returnValid = false
                this.returnSerial = ''
                this.returnPrice = 0
            },
            sellItem: function () {
                // call POA with sale details
                this.sellEnabled = false
                let body = {}
                let payload = {}
                this.saleSerialSold = this.saleSerial
                this.salePriceSold = this.salePrice
                payload.serial = this.saleSerialSold
                payload.price = this.salePriceSold.toString()
                payload.action = 'sell'
                payload.posId = this.posId
                body.payload = JSON.stringify(payload)
                this.socketSubscribe(payload.serial)
                axios.post('/poa/action', body)
                    .then(response => {
                        this.txId = response.data.transactionId
                        // left pad nanos to 9 digits with 0
                        const txParts = this.txId.split("@")
                        const txTime = txParts[1].split('.')
                        const nanos = txTime[1].padStart(9,'0')
                        this.txId = txParts[0].concat('@').concat(txTime[0]).concat('.').concat(nanos)
                        bus.$emit('showProgress', 'Sale Succeeded')
                        this.saleTxUrl = 'https://explorer.kabuto.sh/testnet/search?q='.concat(this.txId)
                        this.result = 'SOLD'
                        this.soldItems.push(this.saleSerialSold)
                    })
                    .catch(e => {
                        console.log(e)
                        bus.$emit('showError', 'Sale Failed ' + e)
                    })

            },
            checkReturn: function () {
                // check POA with return details
                let payload = {}
                this.returnSerialReturned = this.returnSerial
                this.returnPriceReturned = this.returnPrice
                payload.serial = this.returnSerialReturned
                payload.price = this.returnPriceReturned.toString()
                payload.action = 'sell' // checking for a `sell` action in the past
                payload.posId = this.posId

                axios.get('/poa/action/?payload='.concat(JSON.stringify(payload)))
                    .then(response => {
                        this.txId = response.data[0].transactionId
                        const txParts = this.txId.split("@")
                        const txTime = txParts[1].split('.')
                        const nanos = txTime[1].padStart(9,'0')
                        this.txId = txParts[0].concat('@').concat(txTime[0]).concat('.').concat(nanos)
                        this.consensusTime = response.data[0].consensusTimestamp
                        this.sequenceNumber = response.data[0].sequenceNumber
                        this.runningHash = response.data[0].runningHash

                        axios.get('/inventory/v1/item/'.concat(payload.serial))
                        .then(response => {
                            let canBeReturned = true
                            if (response.data.length > 0) {
                                if (response.data[response.data.length - 1].action === 'return') {
                                    canBeReturned = false
                                } else {
                                    canBeReturned = true
                                }
                            } else {
                                canBeReturned = false
                            }
                            if (canBeReturned) {
                                bus.$emit('showSuccess', 'Return Approved')
                                this.saleTxUrl = 'https://explorer.kabuto.sh/testnet/search?q='.concat(this.txId)
                                this.result = 'RETURNEDPASS'
                            } else  {
                                bus.$emit('showError', 'Item already returned')
                                this.saleTxUrl = 'https://explorer.kabuto.sh/testnet/search?q='.concat(this.txId)
                                this.result = 'RETURNEDALREADY'
                            }
                        })
                        .catch(e => {
                            console.log(e)
                            this.result = 'RETURNEDFAIL'
                            bus.$emit('showError', 'An error occurred')
                        })
                    })
                    .catch(e => {
                        console.log(e)
                        this.result = 'RETURNEDFAIL'
                        bus.$emit('showError', 'Return refused')
                    })

            },
            confirmReturn: function () {
                let body = {}
                let payload = {}
                payload.serial = this.returnSerialReturned
                payload.price = '0'
                payload.action = 'return'
                payload.posId = this.posId
                body.payload = JSON.stringify(payload)

                this.socketSubscribe(payload.serial)
                axios.post('/poa/action', body)
                    .then(response => {
                        this.txId = response.data.transactionId
                        const txParts = this.txId.split("@")
                        const txTime = txParts[1].split('.')
                        const nanos = txTime[1].padStart(9,'0')
                        this.txId = txParts[0].concat('@').concat(txTime[0]).concat('.').concat(nanos)
                        this.consensusTime = ''

                        bus.$emit('showProgress', 'Return confirmed')
                        this.saleTxUrl = 'https://explorer.kabuto.sh/testnet/search?q='.concat(this.txId)
                        this.result = 'RETURNEDPASS'
                    })
                    .catch(e => {
                        console.log(e)
                        this.result = 'RETURNEDFAIL'
                        bus.$emit('showError', 'Return error ' + e)
                    })

            },
            socketSubscribe(serial) {
                this.$socketClient.connect()
                this.$socketClient.onOpen = () => {
                    this.$socketClient.sendObj({serial: serial})
                }
                this.$socketClient.onMessage = (msg) => {
                    bus.$emit('showSuccess', msg.data)
                }
                this.$socketClient.onClose = () => {
                    console.log('socket closed')
                }
                this.$socketClient.onError = () => {
                    console.log('socket error')
                }
            }
        }
    }
</script>

<style scoped>

</style>
