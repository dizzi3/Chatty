const express = require('express')
const app = express()
const server = require('http').createServer(app)
const { Server } = require('socket.io')

const io = new Server(server, { 
    cors: { 
        origin: "http://localhost:3006",
        methods: ["GET", "POST"]
    } 
})

const config = require('./config')
const path = require('path')
const bodyParser = require('body-parser')
const router = require('./routes/router')
require('./database/mongoose')
const cors = require('cors')
const UserSocket = require('./UserSocket')
const MessageModel = require('./database/models/MessageModel')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', router)

function logMapElements(value, key, map) {
    console.log(`map.get('${key}') = ${value}`)
}

io.on('connection', (socket) => {
    console.log('user connected, socket id: ' + socket.id)
    //console.log(socket.handshake)

    socket.on('disconnect', () => {
        console.log('user ' + socket.id + ' disconnected')

        UserSocket.setOffline({ socketID: socket.id })
        UserSocket.printSockets()
        
        io.sockets.emit('userStatusChanged', UserSocket.sockets)
    })

    socket.on('userConnected', (data) => {

        let socketUser = UserSocket.sockets.find( ({ userID }) => userID === data.userID)

        if(socketUser === undefined){
            UserSocket.addSocket(new UserSocket({
                socketID: socket.id,
                username: data.username,
                userID: data.userID,
                online: true
            }))
        }else{
            socketUser.online = true
            socketUser.socketID = socket.id
        }

        socket.leave(socket.id)
        socket.join(data.userID)
        socket.join('/')

        //UserSocket.printSockets()
        io.sockets.emit('userStatusChanged', UserSocket.sockets)
    }) 

    socket.on('msg', (msg) => {
        console.log(msg)
        
        //socket.to(msg.to).emit('msg', msg)
        io.sockets.in(msg.to).emit('msg', msg)

        //socket.to(msg.to).allSockets.emit('msg', msg)
        console.log('emitted')
    })

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });

    socket.on('getMessages', (data) => {
        console.log(data)

        if(data.roomType === 'private'){

            sender = data.sender
            receiver = data.receiver

            MessageModel.find({ $or:[ 
                {$and:[ { 'to': receiver }, { 'userId': sender } ]},
                {$and:[ { 'to': sender }, { 'userId': receiver } ]} ] },
                 (err, messages) => {

                if(err)
                    return

                socket.emit('updateMessages', messages)
            })



        }else{
            to = data.to
            MessageModel.find({ 'to' : to }, (err, messages) => {

                if(err)
                    return

                socket.emit('updateMessages', messages)
            })
        }

    })

})

server.listen(config.port, () => {
    console.log('Server is listening on http://localhost:' + config.port)
})