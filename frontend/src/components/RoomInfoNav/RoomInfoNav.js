import React from 'react'
import './styles/room-inf-nav-style.css'
import RoomsController from '../../Controllers/RoomsController'

class RoomInfoNav extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            joinedUsers : props.joinedUsers
        }
    }

    componentDidUpdate(previousProps){
        if(this.props.joinedUsers !== previousProps.joinedUsers){
            this.setState({
                joinedUsers: this.props.joinedUsers
            })
        }
    }

    getJoinedUsersText(){
        const nOfUsers = this.state.joinedUsers.length

        if(nOfUsers === 1)
            return '1 user joined ' + RoomsController.currentRoomData.roomName

        return nOfUsers + ' users joined ' + RoomsController.currentRoomData.roomName
    }
    
    getUserStatus(){
        let status = ''

        this.state.joinedUsers.forEach((user, index) => {
            const onlineDot = this.getDotSpan(user.online)

            status += onlineDot + this.getWhiteSpaceSpan() + user.username + '\n'
        })

        return status
    }

    getDotSpan(online){
        if(online)
            return '<span class="onlineDot"></span>'
        else
            return '<span class="offlineDot"></span>'
    }

    getWhiteSpaceSpan(){
        return '<span style="white-space: pre;">  </span>'
    }

    render(){
        return(
            <div id="container">
                <div className="joinedUsers">{this.getJoinedUsersText()}
                    <span className="usersDetails" dangerouslySetInnerHTML={{ __html: this.getUserStatus()}}/>
                </div>
            </div>
        )
    }

}

export default RoomInfoNav