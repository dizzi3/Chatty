class MultiRoom{

    _id = ''
    name = ''
    founder = ''
    type = ''
    joinedUsers = []

    static rooms = []

    constructor(data){
        this._id = data._id
        this.name = data.name
        this.founder = data.founder
        this.type = data.type
        this.joinedUsers = data.joinedUsers
    }

    didUserJoin(userID){
        if(this.founder === userID || this.joinedUsers.includes(userID))
            return true

        return false
    }

    static getUsersInRoom(roomID){
        let room = null

        MultiRoom.rooms.forEach((r, index) => {
            if(String(r._id) === roomID)
                room = r
        })

        if(room === null)
            return null

        let users = room.joinedUsers.slice()
        users.push(room.founder)

        return users
    }

}

module.exports = MultiRoom