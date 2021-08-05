class RoomsController{

    static currentRoomData = {}

    constructor(updatePrivateMsgRooms, updateMultiRooms){
        this.updatePrivateMsgRooms = updatePrivateMsgRooms
        this.updateMultiRooms = updateMultiRooms
    }

    setUserPrivateMessageRooms(users, thisUserID){

        const rooms = []
        const newMsgsFrom = this.getThisUserNewMsgsFrom(users, thisUserID)

        for(const user of users){
            
            if(user.userID === thisUserID)
                continue

            const newMsg = this.getNewMessageStatus(user.userID, newMsgsFrom)

            rooms.push({ roomID: user.userID, roomName: user.username, newMsg: newMsg,
                         online: user.online, roomType: 'private' })
        }

        this.updatePrivateMsgRooms(rooms)
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

    setMultiRooms(data, thisUserID){
        
        const rooms = []
        
        const allMultiRooms = data.multiRooms
        const newMsgsFrom = data.newMsgsFrom

        for(const room of allMultiRooms){

            if(!this.didUserJoinMultiRoom(room, thisUserID))
                continue
            
            const newMsg = this.getNewMessageStatus(room._id, newMsgsFrom)

            rooms.push({ roomID: room._id, roomName: room.name, newMsg: newMsg,
                         online: true, roomType: 'multi' })

        }
        
        this.updateMultiRooms(rooms)
    }

    didUserJoinMultiRoom(room, userID){
        if(room.founder === userID || room.joinedUsers.includes(userID))
            return true

        return false
    }

}

export default RoomsController