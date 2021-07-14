import { socket } from '../services/socket'

class UserSocketController{

    constructor(username, userID, roomsController){

        socket.connect()
    
        socket.emit('userConnected', {
            username: username, 
            userID: userID
        })
    
        socket.on('userStatusChanged', (users) => {
    
            roomsController.setNewRooms(users, userID)
            
        })

    }
}

export default UserSocketController