const express = require('express')
const app = express()
const server = require('http').createServer(app)
const { Server } = require('socket.io')

const io = new Server(server, { 
    cors: { 
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    } 
})

const config = require('./config')
const path = require('path')
const bodyParser = require('body-parser')
const router = require('./routes/router')
require('./database/mongoose')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', router)

io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('msg', (msg) => {
        io.sockets.emit('msg', msg)
        console.log('emitted')
    })

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
})

server.listen(config.port, () => {
    console.log('Server is listening on http://localhost:' + config.port)
})