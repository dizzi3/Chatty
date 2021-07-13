import React, { useEffect, useState } from 'react'
import Logo from '../Logo/Logo'
import RoomsNav from '../LeftSideNav/RoomsNav'
import Messages from '../Messages/Messages'
import MessageInput from '../MessageInput/MessageInput'
import './clean-chat-style.css'

function CleanChat(props){

    const [rooms, setRooms] = useState([
        { roomID: 0, roomName: 'room0', newMsg: false, online: true },
        { roomID: 1, roomName: 'room1', newMsg: true, online: true }
    ])

    const [messages, setMessages] = useState([
        { username: 'qq', date: '2021-06-29T18:40:29.207+00:00',  content: 'lulz' }, 
        { username: 'qweqweq', date: '2021-06-29T18:40:29.207+00:00',  content: 'ccccc' }
    ])

    const roomChanged = (roomID) => {
        console.log('room changed, ID: ' + roomID)
    }

    const sendMessage = (message) => {
        console.log('u sent ' + message)
    }

    return (
        <div id='chatContainer'>
            <Logo />
            <RoomsNav rooms={rooms} roomChanged={roomChanged} />
            <Messages messages={messages} />
            <MessageInput onSendMessage={sendMessage} />
        </div>
    )

}

export default CleanChat