import React from 'react'
import RoomsNav from '../LeftSideNav/RoomsNav'
import './clean-chat-style.css'

class CleanChat extends React.Component{

    constructor(props){

        super(props)

        this.rooms = [
            { roomID: 0, roomName: 'room0', newMsg: false, online: true },
            { roomID: 1, roomName: 'room1', newMsg: true, online: true },
            { roomID: 2, roomName: 'room2', newMsg: true, online: false }
        ]

    }

    render(){

        return <RoomsNav rooms={this.rooms} />

    }

}

export default CleanChat