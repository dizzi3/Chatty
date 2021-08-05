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

    const [userSocket, setUserSocket] = useState([])

    const [privateMsgRooms, setPrivateMsgRooms] = useState([])
    const [multiRooms, setMultiRooms] = useState([])

    const [messages, setMessages] = useState([])

    useEffect(() => {

        const username = location.state.username
        const userID = location.state.userID

        const roomsController = new RoomsController(updatePrivateMsgRooms, updateMultiRooms)
        setUserSocket(new UserSocketController(username, userID, roomsController, updateMessages))

    }, [location.state.username, location.state.userID] )

    const roomChanged = (data) => {
        RoomsController.currentRoomData = data
        userSocket.onRoomChanged(data)
    }

    const sendMessage = (message) => {
        userSocket.sendMessage(message)
    }

    const updatePrivateMsgRooms = (rooms) => {
        setPrivateMsgRooms(rooms)
    }

    const updateMultiRooms = (rooms) => {
        setMultiRooms(rooms)
    }

    const updateMessages = (msgs) => {
        setMessages(msgs)
    }

    return (
        <div id='chatContainer'>
            <Logo />
            <RoomsNav privateMsgRooms={privateMsgRooms} multiRooms={multiRooms} roomChanged={roomChanged} />
            <Messages messages={messages} />
            <MessageInput onSendMessage={sendMessage} />
        </div>
    )

}

export default CleanChat