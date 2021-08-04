import { socket } from '../services/socket'
import RoomsController from './RoomsController'

class UserSocketController{

    constructor(username, userID, roomsController, updateMessages){

        this.userID = userID
        this.username = username

        socket.connect()
    
        socket.emit('userConnected', {
            username: username, 
            userID: userID
        })
    
        socket.on('userStatusChanged', (users) => {
    
            roomsController.setUserPrivateMessageRooms(users, userID)
            
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
            
            }else
                socket.emit('updateRooms')

        })

        socket.on('newMessageSender', (message) => {
            this.emitGetMessagesFromServer(message)
        })

    }

    isMessageFromTheCurrentRoom(message){
        return ((message.roomType === 'room' && message.to === RoomsController.currentRoomData.roomID) ||
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

        }
        
    }

    async onRoomChanged(data){

        await socket.emit('removeNewMsgFrom', {
            userID: this.userID,
            from: data.roomID
        })

        socket.emit('updateRooms')

        if(data.roomType === 'private')
            socket.emit('getMessages', { roomType: data.roomType, sender: this.userID, receiver: data.roomID })

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