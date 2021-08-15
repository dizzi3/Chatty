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
const cors = require('cors')
const fetch = require('node-fetch')
require('./database/mongoose')

const UserSocket = require('./UserSocket')
const MessageModel = require('./database/models/MessageModel')
const RoomModel = require('./database/models/RoomModel')
const User = require('./database/models/UserModel')
const MultiRoom = require('./MultiRoom')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', router)

loadRooms()

io.on('connection', (socket) => {


    socket.on('disconnect', () => {

        //TODO: UNCOMMENT!!
        UserSocket.setOffline({ socketID: socket.id })
        
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

        joinRooms(socket, data.userID)

        socket.emit('updateMultiRooms', { multiRooms: MultiRoom.rooms, newMsgsFrom: socketUser.newMsgFrom })
        io.sockets.emit('userStatusChanged', UserSocket.sockets)
    }) 

    socket.on('msg', async (msg) => {

        await fetch('http://localhost:3012/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: msg.content,
                fromUser: msg.fromUser,
                userId: msg.fromUserId,
                to: msg.to,
                date: msg.date
            })
        })

        if(msg.roomType === 'private'){
            
            const toUser = UserSocket.findSocketByUserID(msg.to)

            if(toUser.newMsgFrom.indexOf(msg.fromUserId) === -1)
                toUser.newMsgFrom.push(msg.fromUserId)

            User.findOneAndUpdate( { _id: msg.to }, {
                $addToSet: {
                    newMsgFrom: msg.fromUserId
                }
            }, function(error, success){})

            io.sockets.in(msg.to).emit('newMessageReceiver', msg)

        }else{

            const joinedUsersIDs = MultiRoom.getUsersInRoom(msg.to)

            joinedUsersIDs.forEach(function(value, key){
                const userID = value

                const user = UserSocket.findSocketByUserID(userID)

                if(user && user.userID !== msg.fromUserId){

                    if(user.newMsgFrom.indexOf(msg.to) === -1)
                        user.newMsgFrom.push(msg.to)

                    User.findOneAndUpdate( { _id: user.userID }, {
                        $addToSet: {
                            newMsgFrom: msg.to
                        }
                    }, function(error, success){})

                    io.sockets.in(user.userID).emit('newMessageReceiver', msg)
                }
            })

        }
        
        io.sockets.in(msg.fromUserId).emit('newMessageSender', msg)
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

    socket.on('updatePrivateRooms', () => {
        socket.emit('userStatusChanged', UserSocket.sockets)
    })

    socket.on('updateMultiRooms', () => {
        const user = UserSocket.findSocket({socketID: socket.id})
        socket.emit('updateMultiRooms', { multiRooms: MultiRoom.rooms, newMsgsFrom: user.newMsgFrom })
    })

    socket.on('getUsersInRoom', (roomID) => {

        if(roomID === null)
            return

        const usersIDs = MultiRoom.getUsersInRoom(roomID)

        let users = []

        if(usersIDs === null)
            return

        usersIDs.forEach((userID, index) => {
            const user = UserSocket.findSocketByUserID(userID)

            if(user !== undefined){
                users.push({
                    username: user.username,
                    online: user.online}
                )
            }
        })

        socket.emit('setUsersInRoom', users)
    })

})

server.listen(config.port, () => {
    console.log('Server is listening on http://localhost:' + config.port)
})

function loadRooms() {

    MultiRoom.rooms = []

    RoomModel.find({}, (err, rooms) => {
        
        if(err)
            return

        rooms.forEach((room, index) => {
            MultiRoom.rooms.push(new MultiRoom(room))
        })

    })

}

function joinRooms(socket, userID){
    socket.leave(socket.id)
    socket.join(userID)
    
    MultiRoom.rooms.forEach((room, index) => {
        if(room.didUserJoin(userID))
            socket.join(room._id)

    })
}