class UserSocket{

    socketID = ''
    username = ''
    userID = ''
    online = false
    newMsgFrom = []

    static sockets = []

    constructor(data){

        this.socketID = data.socketID
        this.username = data.username
        this.userID = data.userID
        this.online = data.online

    }

    static setOffline(data){
        UserSocket.findSocket(data).online = false
    }

    static setOnline(data){
        UserSocket.findSocket(data).online = true
    }

    static findSocket(data){
        return UserSocket.sockets.find( ({ socketID }) => socketID === data.socketID)
    }

    static findSocketByUserID(id){
        return UserSocket.sockets.find( ({userID}) =>  userID === id)
    }

    static addSocket(socket){
        UserSocket.sockets.push(socket)
    }

    static printSockets(){
        UserSocket.sockets.forEach((value, index) => {
            console.log(value)
        })
    }

}

module.exports = UserSocket