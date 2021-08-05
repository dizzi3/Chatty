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

}

module.exports = MultiRoom