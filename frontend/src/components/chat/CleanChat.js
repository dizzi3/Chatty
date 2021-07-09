import React from 'react'
import RoomsNav from '../LeftSideNav/RoomsNav'
import Messages from '../Messages/Messages'
import Logo from '../Logo/Logo'
import './clean-chat-style.css'

class CleanChat extends React.Component{

    constructor(props){

        super(props)

        this.rooms = [
            { roomID: 0, roomName: 'room0', newMsg: false, online: true },
            { roomID: 1, roomName: 'room1', newMsg: true, online: true },
            { roomID: 2, roomName: 'room2', newMsg: true, online: false }
        ]

        this.messages = [
            { username: 'michael', date: '2021-06-29T18:40:29.207+00:00',  content: 'heheszkyheheszkyheheszkyheheszkyheheszkyheheszkyheheszky heheszkyheheszky dwqd wd qwdqw dqw dqwd q q q q q q qw dqw dqw dqw dqwqwd qwd qwd qw dqw ' }, 
            { username: 'qq', date: '2021-06-29T18:40:29.207+00:00',  content: 'lulz' }, 
            { username: 'qweqweq', date: '2021-06-29T18:40:29.207+00:00',  content: 'ccccc' },
            { username: 'michael', date: '2021-06-29T18:40:29.207+00:00',  content: 'heheszky' }, 
            { username: 'qq', date: '2021-06-29T18:40:29.207+00:00',  content: 'lulz' }, 
            { username: 'qweqweq', date: '2021-06-29T18:40:29.207+00:00',  content: 'ccccc' }, 
            { username: 'qq', date: '2021-06-29T18:40:29.207+00:00',  content: 'lulz' }, 
            { username: 'qweqweq', date: '2021-06-29T18:40:29.207+00:00',  content: 'ccccc' }, 
            { username: 'qweqweq', date: '2021-06-29T18:40:29.207+00:00',  content: 'ccccc' }, 
            { username: 'qq', date: '2021-06-29T18:40:29.207+00:00',  content: 'lulz' }, 
            { username: 'qweqweq', date: '2021-06-29T18:40:29.207+00:00',  content: 'ccccc' }, 
            { username: 'qweqweq', date: '2021-06-29T18:40:29.207+00:00',  content: 'ccccc' }, 
            { username: 'qq', date: '2021-06-29T18:40:29.207+00:00',  content: 'lulz' }, 
            { username: 'qweqweq', date: '2021-06-29T18:40:29.207+00:00',  content: 'ccccc' }, 
            { username: 'qweqweq', date: '2021-06-29T18:40:29.207+00:00',  content: 'ccccc' }, 
            { username: 'qq', date: '2021-06-29T18:40:29.207+00:00',  content: 'lulz' }, 
            { username: 'qweqweq', date: '2021-06-29T18:40:29.207+00:00',  content: 'ccccc' }, 
            { username: 'qweqweq', date: '2021-06-29T18:40:29.207+00:00',  content: 'ccccc' }, 
            { username: 'qq', date: '2021-06-29T18:40:29.207+00:00',  content: 'lulz' }, 
            { username: 'qweqweq', date: '2021-06-29T18:40:29.207+00:00',  content: 'ccccc' },
        ]

    }

    render(){

        return (
            <div id='chatContainer'>
                <Logo />
                <RoomsNav rooms={this.rooms} />
                <Messages messages={this.messages} />
            </div>
        )

    }

}

export default CleanChat