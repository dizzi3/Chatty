const express = require('express')
const app = express()
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const config = require('./config')

const router = require('./routes/router')

app.use('/', router)

io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('msg', (msg) => {
        console.log(msg)
    })
})

server.listen(config.port, () => {
    console.log('Server is listening on http://localhost:' + config.port)
})