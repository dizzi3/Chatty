import React from 'react'
import RoomsNav from '../LeftSideNav/RoomsNav'
import Messages from '../Messages/Messages'
import Logo from '../Logo/Logo'
import './clean-chat-style.css'

class CleanChat extends React.Component{

    constructor(props){

        super(props)

        this.state = {

            rooms: [ 
                { roomID: 0, roomName: 'room0', newMsg: false, online: true },
                { roomID: 1, roomName: 'room1', newMsg: true, online: true }
            ],

            messages: [
                { username: 'qq', date: '2021-06-29T18:40:29.207+00:00',  content: 'lulz' }, 
                { username: 'qweqweq', date: '2021-06-29T18:40:29.207+00:00',  content: 'ccccc' }
            ]

        }

    }

    render(){

        return (
            <div id='chatContainer'>
                <Logo />
                <RoomsNav rooms={this.state.rooms} />
                <Messages messages={this.state.messages} />
            </div>
        )

    }

}

export default CleanChat