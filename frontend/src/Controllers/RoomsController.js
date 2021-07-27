class RoomsController{

    static currentRoomData = {}

    constructor(updateRooms){
        this.updateRooms = updateRooms
    }

    setUserRooms(users, thisUserID){

        const rooms = []
        const newMsgsFrom = this.getThisUserNewMsgsFrom(users, thisUserID)

        for(const user of users){
            
            if(user.userID === thisUserID)
                continue

            const newMsg = this.getNewMessageStatus(user.userID, newMsgsFrom)

            rooms.push({ roomID: user.userID, roomName: user.username, newMsg: newMsg,
                         online: user.online, roomType: 'private' })
        }

        this.updateRooms(rooms)
    }

    getThisUserNewMsgsFrom(users, thisUserID){

        for(const user of users){
            if(user.userID === thisUserID)
                return user.newMsgFrom
        }

    }

    getNewMessageStatus(roomID, newMsgsFrom){

        if(newMsgsFrom.includes(roomID))
            return true

        return false
    }

}

export default RoomsController