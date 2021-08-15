import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './clean-chat-style.css'
import UserSocketController from '../../Controllers/UserSocketController'
import Logo from '../Logo/Logo'
import RoomsNav from '../LeftSideNav/RoomsNav'
import Messages from '../Messages/Messages'
import MessageInput from '../MessageInput/MessageInput'
import RoomsController from '../../Controllers/RoomsController'
import RoomInfoNav from '../RoomInfoNav/RoomInfoNav'

function CleanChat(props){

    const location = useLocation()

    const [userSocket, setUserSocket] = useState([])

    const [privateMsgRooms, setPrivateMsgRooms] = useState([])
    const [multiRooms, setMultiRooms] = useState([])

    const [messages, setMessages] = useState([])

    const [usersInCurrentRoom, setUsersInCurrentRoom] = useState([])
    const [currentRoomType, setCurrentRoomType] = useState()

    useEffect(() => {

        const username = location.state.username
        const userID = location.state.userID

        const roomsController = new RoomsController(updatePrivateMsgRooms, updateMultiRooms)
        setUserSocket(new UserSocketController(username, userID, roomsController, 
                                               updateMessages, setUsersInfoForCurrentRoom))

    }, [location.state.username, location.state.userID] )

    const roomChanged = (data) => {
        RoomsController.currentRoomData = data
        setCurrentRoomType(data.roomType)
        userSocket.onRoomChanged(data)
    }

    const setUsersInfoForCurrentRoom = (users) => {
        setUsersInCurrentRoom(users)
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
            {currentRoomType === 'multi' ? <RoomInfoNav joinedUsers={usersInCurrentRoom}/> : null}
            <MessageInput onSendMessage={sendMessage} />
        </div>
    )

}

export default CleanChat