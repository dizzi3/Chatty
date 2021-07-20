import { socket } from '../services/socket'

class UserSocketController{

    constructor(username, userID, roomsController, updateMessages){

        this.userID = userID

        socket.connect()
    
        socket.emit('userConnected', {
            username: username, 
            userID: userID
        })
    
        socket.on('userStatusChanged', (users) => {
    
            roomsController.setUserRooms(users, userID)
            
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

    }

    onRoomChanged(data){

        if(data.roomType === 'private')
            socket.emit('getMessages', { roomType: data.roomType, sender: this.userID, receiver: data.roomID })

    }

}

export default UserSocketController