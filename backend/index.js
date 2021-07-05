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
const User = require('./database/models/UserModel')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', router)

io.on('connection', (socket) => {

    socket.on('disconnect', () => {

        //TODO: UNCOMMENT!!
        //UserSocket.setOffline({ socketID: socket.id })
        
        io.sockets.emit('userStatusChanged', UserSocket.sockets)
    })

    socket.on('userConnected', async (data) => {
        
        let socketUser = UserSocket.sockets.find( ({ userID }) => userID === data.userID)
        
        if(socketUser === undefined){

            socketUser = new UserSocket({
                socketID: socket.id,
                username: data.username,
                userID: data.userID,
                online: true
            })

            UserSocket.addSocket(socketUser)

        }else{
            socketUser.online = true
            socketUser.socketID = socket.id
        }

        await User.findOne({ _id: data.userID  }, function(err, user){

            if(!err){

                for(let i = 0; i < user.newMsgFrom.length; i++)
                    socketUser.newMsgFrom.push(user.newMsgFrom[i])
            }

        })

        socket.leave(socket.id)
        socket.join(data.userID)
        socket.join('/')

        io.sockets.emit('userStatusChanged', UserSocket.sockets)
    }) 

    socket.on('msg', async (msg) => {

        if(msg.roomType === 'private'){
            
            const toUser = UserSocket.findSocketByUserID(msg.to)

            if(toUser.newMsgFrom.indexOf(msg.fromUserId) === -1)
                toUser.newMsgFrom.push(msg.fromUserId)

            User.findOneAndUpdate( { _id: msg.to }, {
                $addToSet: {
                    newMsgFrom: msg.fromUserId
                }
            }, function(error, success){})

        }else{

            const socketsIDs = io.sockets.in(msg.to).adapter.sids
            socketsIDs.forEach(function(value, key){
                const socketID = key

                const user = UserSocket.findSocket({ 'socketID' : socketID })

                if(user && user.userID !== msg.fromUserId){
                    
                    if(user.newMsgFrom.indexOf(msg.to) === -1)
                        user.newMsgFrom.push(msg.to)

                    User.findOneAndUpdate( { _id: user.userID }, {
                        $addToSet: {
                            newMsgFrom: msg.to
                        }
                    }, function(error, success){})

                }
            })

        }

        io.sockets.in(msg.to).emit('msg', msg)
    })

    socket.on('removeNewMsgFrom', (data) => {

        const userSocket = UserSocket.findSocketByUserID(data.userID)

        userSocket.newMsgFrom = userSocket.newMsgFrom.filter(from => from !== data.from)

        User.findOneAndUpdate({ _id: data.userID }, {

            $pull: {
                newMsgFrom: data.from
            }

        }, function(error, success) {} )

    })

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });

    socket.on('getMessages', (data) => {

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