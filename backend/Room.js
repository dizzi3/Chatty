class Room{

    _id = ''
    founder = ''
    type = ''
    joinedUsers = []

    static rooms = []

    constructor(data){
        this._id = data._id
        this.founder = data.founder
        this.type = data.type
        this.joinedUsers = data.joinedUsers
    }

}