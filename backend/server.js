const express = require('express')
const bodyParser = require('body-parser');
const dotEnv = require('dotenv')
const app = express();
const Mirror = require('./mirror')
const DbService = require('./database')
const cors = require('cors')

dotEnv.config();

const PORT = process.env.PORT || 3128;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.json())
app.use(cors())

console.log('start mirror listen')
Mirror.startListening()

app.get('/v1/items', function (req, res) {
    DbService.getItems()
        .then(items => {
            return res.json(items)
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(501)
        })
})
app.get('/v1/item/:serial', function (req, res) {
    DbService.getItem(req.params.serial)
        .then(items => {
            return res.json(items)
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(501)
        })
})

app.listen(PORT, function () {
    console.log(`App running on localhost:${PORT}`)
})
