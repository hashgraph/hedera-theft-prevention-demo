<template>
    <v-container>
        <v-row class="text-center" align="stretch">
            <v-col cols="3">
                <v-card>
                    <v-list-item>
                        <v-list-item-content class="headline">Product Lifecycle Manager Portal</v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <div class="my-2">
                                <v-btn block x-large :color=overviewColor dark @click="overview()">Overview</v-btn>
                            </div>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <div class="my-2">
                                <v-btn block x-large :color=managementColor dark @click="deviceManagement()">Device Mgmt</v-btn>
                            </div>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <div class="my-2">
                                <v-btn block x-large :color=historyColor dark @click="history()">History</v-btn>
                            </div>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
            <v-col cols="9">
                <v-card v-if="action=='OVERVIEW'">
                    <v-list-item-title class="headline">Overview</v-list-item-title>
                    <v-col class="text-right">
                        <v-btn
                               right
                               color="deep-purple lighten-2"
                               text
                               @click="overview"
                        >
                            <v-icon>mdi-reload</v-icon>
                        </v-btn>
                    </v-col>
                    <v-data-table
                            :headers="overviewHeaders"
                            :items="items"
                            :items-per-page="10"
                            class="elevation-1"
                            @click:row="overviewSelect"
                    >
                        <template v-slot:item.status="{ item }">
                            <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
                        </template>
                    </v-data-table>
                </v-card>
                <v-card v-if="action=='MANAGE'">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline">Manage</v-list-item-title>
                            <v-select
                                    :items="allitems"
                                    label="Choose an item"
                                    @change="itemChoose"
                            ></v-select>
                            <v-col class="text-right">
                                <v-btn v-if="selectedSerial"
                                        right
                                        color="deep-purple lighten-2"
                                        text
                                        @click="getselectedSerial"
                                >
                                    <v-icon>mdi-reload</v-icon>
                                </v-btn>
                            </v-col>
                            <v-data-table
                                    :headers="itemHeaders"
                                    :items="items"
                                    :items-per-page="10"
                                    class="elevation-1"
                            >
                                <template v-slot:item.status="{ item }">
                                    <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
                                </template>
                                <template v-slot:item.proof="{ item }">
                                    <v-btn
                                            :href=item.url
                                            target="_blank"
                                            text
                                    >
                                        <v-icon>mdi-open-in-new</v-icon>
                                    </v-btn>
                                </template>
                            </v-data-table>
                        </v-list-item-content>
                    </v-list-item>
                    <v-card-actions>
                        <v-col class="text-right">
                            <v-btn
                                    right
                                    color="deep-purple lighten-2"
                                    text
                                    :disabled="!canBeActivated"
                                    @click="activate(true)"
                            >
                                Activate
                            </v-btn>
                            <v-btn
                                    right
                                    color="deep-purple lighten-2"
                                    text
                                    :disabled="!canBeDeActivated"
                                    @click="activate(false)"
                            >
                                De-activate
                            </v-btn>
                        </v-col>
                    </v-card-actions>
                </v-card>
                <v-card v-if="action=='HISTORY'">
                    <v-list-item-title class="headline">History</v-list-item-title>
                    <v-col class="text-right">
                        <v-btn
                                right
                                color="deep-purple lighten-2"
                                text
                                @click="history"
                        >
                            <v-icon>mdi-reload</v-icon>
                        </v-btn>
                    </v-col>
                    <v-data-table
                            :headers="itemHeaders"
                            :items="items"
                            :items-per-page="10"
                            class="elevation-1"
                            @click:row="overviewSelect"
                    >
                        <template v-slot:item.status="{ item }">
                            <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
                        </template>
                        <template v-slot:item.proof="{ item }">
                            <v-btn
                                    :href=item.url
                                    target="_blank"
                                    text
                            >
                                <v-icon>mdi-open-in-new</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <p class="text-right">Point of sale device id:{{ posId }}</p>
    </v-container>
</template>

<script>
    import {v4 as uuid} from 'uuid'
    import axios from 'axios'
    import {bus} from "@/main";

    export default {
        name: "Lifecycle",
        data() {
            return {
                overviewColor: 'primary',
                managementColor: 'primary',
                historyColor: 'primary',
                action: '',
                posId: uuid().substr(1, 7),
                overviewHeaders: [
                    //serial, price, action, consensustime, posId
                    {text: 'Serial', align: 'start', value: 'serial'},
                    {text: 'Price', value: 'price'},
                    {text: 'Status', value: 'status'},
                    {text: 'Date', value: 'date'},
                    {text: 'POS Id', value: 'posId'},
                ],
                items: [],
                canBeActivated: false,
                canBeDeActivated: false,
                itemHeaders: [
                    //serial, price, action, consensustime, posId
                    {text: 'Serial', align: 'start', value: 'serial'},
                    {text: 'Price', value: 'price'},
                    {text: 'Status', value: 'status'},
                    {text: 'Date', value: 'date'},
                    {text: 'POS Id', value: 'posId'},
                    {text: 'proof', value: 'proof'}
                ],
                allitems: [],
                selectedSerial: ''
            }
        },
        methods: {
            activate: function(activate) {
                let body = {}
                let payload = {}
                payload.serial = this.selectedSerial
                payload.price = '0'
                if (activate) {
                    payload.action = 'activate'
                } else {
                    payload.action = 'deactivate'
                }

                payload.posId = this.posId
                body.payload = JSON.stringify(payload)

                this.socketSubscribe(this.selectedSerial)
                axios.post('/poa/action', body)
                    .then(() => {
                        if (activate) {
                            bus.$emit('showProgress', 'Device activated')
                        } else {
                            bus.$emit('showProgress', 'Device deactivated')
                        }
                    })
                    .catch(e => {
                        console.log(e)
                        bus.$emit('showError', 'Action Failed ' + e)
                    })
            },
            itemChoose: function(serial) {
                this.selectedSerial = serial
                this.getselectedSerial()
            },
            getItems: function() {
                this.allitems = []
                axios.get('/inventory/v1/items/')
                    .then(response => {
                        let responseItems = []
                        response.data.forEach(function(responseItem) {
                            const item = {}
                            item.serial = responseItem.serial

                            if (responseItem.serial in responseItems) {
                                // do nothing
                            } else {
                                responseItems[responseItem.serial] = item
                            }

                        })
                        for (let item in responseItems) {
                            this.allitems.push(responseItems[item].serial)
                        }
                    })
                    .catch(e => {
                        console.log(e)
                    })
            },
            getselectedSerial: function() {
                axios.get('/inventory/v1/item/'.concat(this.selectedSerial))
                    .then(response => {
                        let responseItems = []
                        let canBeActivated = false
                        let canBeDeActivated = false
                        response.data.forEach(function(responseItem) {
                            const item = {}
                            item.serial = responseItem.serial
                            if (responseItem.action === 'sell') {
                                item.price = responseItem.price
                            } else {
                                item.price = ''
                            }
                            if (responseItem.action === 'sell') {
                                item.status = 'sold'
                                canBeActivated = true
                                canBeDeActivated = false
                            }
                            else if (responseItem.action === 'activate') {
                                item.status = 'activated'
                                canBeActivated = false
                                canBeDeActivated = true
                            }
                            else if (responseItem.action === 'deactivate') {
                                item.status = 'deactivated'
                                canBeActivated = true
                                canBeDeActivated = false
                            }
                            else {
                                item.status = 'returned'
                                canBeActivated = false
                                canBeDeActivated = false
                            }

                            item.date = new Date(responseItem.consensustime).toLocaleString()
                            item.posId = responseItem.posId
                            item.url = responseItem.consensusTime

                            responseItems.push(item)
                        })
                        this.items = responseItems
                        this.getTransactionIds()
                        this.canBeActivated = canBeActivated
                        this.canBeDeActivated = canBeDeActivated
                    })
                    .catch(e => {
                        console.log(e)
                    })
            },
            getTransactionIds: function() {
                let promises = []

                for (let i=0; i < this.items.length; i++) {
                    let payload = {}
                    payload.serial = this.items[i].serial
                    if (this.items[i].price === '') {
                        payload.price = '0'
                    } else {
                        payload.price =  this.items[i].price.toString()
                    }
                    if (this.items[i].status === 'sold') {
                        payload.action = 'sell'
                    } else if (this.items[i].status === 'activated') {
                        payload.action = 'activate'
                    } else if (this.items[i].status === 'deactivated') {
                        payload.action = 'deactivate'
                    } else if (this.items[i].status === 'returned') {
                        payload.action = 'return'
                    }
                    payload.posId = this.items[i].posId

                    promises.push(axios.get('/poa/action/?payload='.concat(JSON.stringify(payload))).catch(() => null))
                }
                axios.all(promises).then(response => {
                    for (let index=0; index < response.length; index++) {
                        let txId = response[index].data[0].transactionId
                        const txParts = txId.split("@")
                        const txTime = txParts[1].split('.')
                        const nanos = txTime[1].padStart(9,'0')
                        txId = txParts[0].concat('@').concat(txTime[0]).concat('.').concat(nanos)
                        this.items[index].url = 'https://explorer.kabuto.sh/testnet/search?q='.concat(txId)
                    }
                })
                .catch(e => {
                    console.log(e)
                })
            },
            overviewSelect: function(row, data) {
                this.selectedSerial = data.item.serial
                this.overviewColor = 'primary'
                this.managementColor = 'success'
                this.historyColor = 'primary'
                this.action = 'MANAGE'
                this.getselectedSerial()
                this.getItems()
            },
            getStatusColor: function(item) {
                if (item === 'sold') return 'green'
                else if (item === 'activated') return 'orange'
                else if (item === 'deactivated') return 'green'
                else return 'red'
            },
            overview: function () {
                this.overviewColor = 'success'
                this.managementColor = 'primary'
                this.historyColor = 'primary'
                this.action = 'OVERVIEW'
                axios.get('/inventory/v1/items')
                    .then(response => {
                        let responseItems = {}
                        response.data.forEach(function(responseItem) {
                            const item = {}
                            let setPrice = false
                            item.serial = responseItem.serial
                            if (responseItem.action === 'sell') {
                                item.status = 'sold'
                                item.price = responseItem.price
                                setPrice = true
                            } else if (responseItem.action === 'activate') item.status = 'activated'
                            else if (responseItem.action === 'deactivate') item.status = 'deactivated'
                            else item.status = 'returned'

                            item.date = new Date(responseItem.consensustime).toLocaleString()
                            item.posId = responseItem.posId

                            if (responseItem.serial in responseItems) {
                                if (setPrice) {
                                    responseItems[responseItem.serial].price = item.price
                                }
                                // responseItems[responseItem.serial].status = item.status
                                // responseItems[responseItem.serial].date = item.date
                                // responseItems[responseItem.serial].posId = item.posId
                            } else {
                                responseItems[responseItem.serial] = item
                            }
                        })

                        this.items = []
                        for (let item in responseItems) {
                            this.items.push(responseItems[item])
                        }

                    })
                    .catch(e => {
                        console.log(e)
                    })
            },
            deviceManagement: function () {
                this.items = []
                this.overviewColor = 'primary'
                this.managementColor = 'success'
                this.historyColor = 'primary'
                this.action = 'MANAGE'
                this.getItems()
            },
            history: function () {
                this.items = []
                this.overviewColor = 'primary'
                this.managementColor = 'primary'
                this.historyColor = 'success'
                this.action = 'HISTORY'
                axios.get('/inventory/v1/items')
                    .then(response => {
                        for (let i=0; i < response.data.length; i++) {
                            const item = {}
                            item.serial = response.data[i].serial
                            item.price = response.data[i].price
                            if (response.data[i].action === 'sell') item.status = 'sold'
                            else if (response.data[i].action === 'activate') item.status = 'activated'
                            else if (response.data[i].action === 'deactivate') item.status = 'deactivated'
                            else item.status = 'returned'

                            item.date = new Date(response.data[i].consensustime).toLocaleString()
                            item.posId = response.data[i].posId
                            item.url = ''
                            this.items.push(item)
                        }
                        this.getTransactionIds()
                    })
                    .catch(e => {
                        console.log(e)
                    })
            },
            socketSubscribe(serial) {
                this.$socketClient.connect()
                this.$socketClient.onOpen = () => {
                    this.$socketClient.sendObj({serial: serial})
                }
                this.$socketClient.onMessage = (msg) => {
                    bus.$emit('showSuccess', msg.data)
                    if (this.action === 'MANAGE') {
                        this.getselectedSerial()
                        this.getItems()
                    }
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
