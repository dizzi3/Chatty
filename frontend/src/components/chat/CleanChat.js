import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './clean-chat-style.css'
import UserSocketController from '../../Controllers/UserSocketController'
import Logo from '../Logo/Logo'
import RoomsNav from '../LeftSideNav/RoomsNav'
import Messages from '../Messages/Messages'
import MessageInput from '../MessageInput/MessageInput'
import RoomsController from '../../Controllers/RoomsController'

function CleanChat(props){

    const location = useLocation()
    let roomsController

    useEffect(() => {

        const username = location.state.username
        const userID = location.state.userID

        roomsController = new RoomsController(updateRooms)
        const userSocket = new UserSocketController(username, userID, roomsController)

    }, [])

    const [rooms, setRooms] = useState([])

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

    const updateRooms = (rooms) => {
        setRooms(rooms)
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