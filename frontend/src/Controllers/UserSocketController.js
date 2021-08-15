import { socket } from '../services/socket'
import RoomsController from './RoomsController'

class UserSocketController{

    constructor(username, userID, roomsController, updateMessages, setUsersInfoForCurrentRoom){

        this.userID = userID
        this.username = username

        this.setUsersInfoForCurrentRoom = setUsersInfoForCurrentRoom

        socket.connect()
    
        socket.emit('userConnected', {
            username: username, 
            userID: userID
        })
    
        socket.on('userStatusChanged', (users) => {
            roomsController.setUserPrivateMessageRooms(users, userID)
            socket.emit('getUsersInRoom', RoomsController.currentRoomData.roomID)
        })

        socket.on('updateMultiRooms', (data) => {
            roomsController.setMultiRooms(data, userID)
        })

        socket.on('updateMessages', (messages) => {
            
            let msgs = []
            for(const message of messages){
                msgs.push({
                    content: message.content,
                    username: message.fromUser,
                    date: message.date
                })
            }

            updateMessages(msgs)

        })

        socket.on('newMessageReceiver', (message) => {
            
            if(this.isMessageFromTheCurrentRoom(message)){
                
                this.clearNewMsgFrom(message)
                this.emitGetMessagesFromServer(message)
            
            }else{
                if(message.roomType === 'private')
                    socket.emit('updatePrivateRooms')
                else
                    socket.emit('updateMultiRooms')
            }

        })

        socket.on('newMessageSender', (message) => {
            this.emitGetMessagesFromServer(message)
        })

        socket.on('setUsersInRoom', (users) => {
            this.setUsersInfoForCurrentRoom(users)
        })

    }

    isMessageFromTheCurrentRoom(message){
        return ((message.roomType === 'multi' && message.to === RoomsController.currentRoomData.roomID) ||
        (message.roomType === 'private' && message.fromUserId === RoomsController.currentRoomData.roomID))
    }

    clearNewMsgFrom(message){
        let from
        
        if(message.roomType === 'private')
            from = message.fromUserId
        else
            from = message.to

        socket.emit('removeNewMsgFrom', {
            userID: this.userID,
            from: from
        })
    }

    emitGetMessagesFromServer(message){

        if(message.roomType === 'private'){

            socket.emit('getMessages', {
                roomType: message.roomType,
                sender: message.fromUserId,
                receiver: message.to
            })

        }else{

            socket.emit('getMessages', {
                to: message.to
            })

        }
        
    }

    async onRoomChanged(data, setUsersInfoForCurrentRoom){

        await socket.emit('removeNewMsgFrom', {
            userID: this.userID,
            from: data.roomID
        })

        if(data.roomType === 'private'){
            socket.emit('updatePrivateRooms')
            socket.emit('getMessages', { roomType: data.roomType, sender: this.userID, receiver: data.roomID })
        }
        else{
            socket.emit('updateMultiRooms')
            socket.emit('getMessages', { roomType: data.roomType,  to: data.roomID})
            socket.emit('getUsersInRoom', data.roomID)
        }
    }

    sendMessage(message){

        const currentRoomData = RoomsController.currentRoomData

        socket.emit('msg', {
            content: message, 
            fromUser: this.username,
            fromUserId: this.userID,
            to: currentRoomData.roomID,
            date: new Date().toISOString(),
            roomType: currentRoomData.roomType
        })

    }

}

export default UserSocketController