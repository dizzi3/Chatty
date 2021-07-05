import React, { useEffect, useState } from 'react'
import './chat-style.css'
import { useLocation } from 'react-router-dom'
import axios from '../../axios'
import { socket } from '../../services/socket'
import dateHelper from '../../DateHelper'
import { ALL_CHAT_NAME } from '../../config'
import { RiMessage2Fill } from 'react-icons/ri'
import ReactDom from 'react-dom'

function Chat(props){

    const location = useLocation()
    const username = location.state.username
    const userId = location.state.userId

    const [msg, setMsg] = useState('')
    const [currentRoom, setCurrentRoom] = useState(ALL_CHAT_NAME)
    const [roomType, setRoomType] = useState('room')

    useEffect(() => {

        socket.off('msg')

        socket.on('msg', (data) => {
            
            if((data.roomType === 'room' && data.to === currentRoom) ||
               (data.roomType === 'private' && data.fromUserId === currentRoom )){

                displayMessage(data)

                let from
                if(data.roomType === 'private')
                    from = data.fromUserId
                else
                    from = data.to

                socket.emit('removeNewMsgFrom', {
                    userID: userId,
                    from: from
                })

            }
            else
                setNewMessageIcon(data)

        })

    }, [currentRoom])

    const setNewMessageIcon = (data) => {

        const users = document.getElementById('users').children
        for(let i = 0; i < users.length; i++){

            const userButton = users[i].firstChild

            let from
            if(data.roomType === 'private')
                from = data.fromUserId
            else
                from = data.to

            if(userButton.getAttribute('data-userID') === from){
                const msgDiv = userButton.children['newMsgIcon']
                ReactDom.render(<RiMessage2Fill/>, msgDiv)
            }

        }
        

    }

    const createUserButton = (user, thisUser) => {
        const usersSection = document.getElementById('users')
        const userItem = document.createElement('li')
                
        let status = ''
        if(user.online)
            status = '<span style="color: green">online</span>'
        else
            status = '<span style="color: red">offline</span>'

        const iconElement = '<span style="white-space: pre;">  </span><span id="newMsgIcon" class="msgIcon"></span>'

        const buttonText = user.username + ' ' + status + iconElement

        const userButton = document.createElement('button')
        userButton.className = 'userButton'
        userButton.innerHTML = buttonText

        if(thisUser.newMsgFrom.includes(user.userID)){
            const msgDiv = userButton.children['newMsgIcon']
            ReactDom.render(<RiMessage2Fill/>, msgDiv)
        }

        userButton.setAttribute('data-userID', user.userID)

        userButton.onclick = () => {

            setRoomType('private')
            setCurrentRoom(userButton.getAttribute('data-userID'))

            socket.emit('getMessages', {
            
                sender: userId,
                receiver: userButton.getAttribute('data-userID'),
                roomType: 'private'

            })

            socket.emit('removeNewMsgFrom', {
                userID: userId,
                from: userButton.getAttribute('data-userID')
            })

            const msgDiv = userButton.children['newMsgIcon']
            msgDiv.innerHTML = ''
        }

        userItem.appendChild(userButton)
        usersSection.appendChild(userItem)
    }

    const displayMessage = (data) => {

        const msgList = document.getElementById('messages')

        const msgItem = document.createElement('li')

        const dateString = dateHelper.getShortDateString(new Date(data.date))

        msgItem.innerHTML = '<span style="font-weight: bold;">' + data.fromUser + 
                            '</span> <span class="dateStyle">' + dateString + '</span></br>' + data.content

        msgList.appendChild(msgItem)

        scrollToTheBottomOfMsgList()
    }

    useEffect(() => {
        
        socket.connect()

        socket.on('userStatusChanged', (users) => {

            const usersSection = document.getElementById('users')
            usersSection.innerHTML = ''

            let thisUser
            users.forEach((user, index) => {
                if(user.username === username)
                    thisUser = user
            })

            createAllChatButton(thisUser)

            users.forEach((user, index) => {

                if(!(user.username === username))
                    createUserButton(user, thisUser)
                
            })
        })

        socket.on('updateMessages', (messages) => {

            const msgList = document.getElementById('messages')
            msgList.innerHTML = ''

            messages.forEach((message, index) => {
                
                displayMessage(message)

            })

        })

        socket.emit('userConnected', {
            username: location.state.username,
            userID: location.state.userId
        })

        initializeChatMessages()  

    }, [] )

    const initializeChatMessages = () => {
        socket.emit('getMessages', {

            to: ALL_CHAT_NAME,
            roomType: 'room'

        })
    }
    

    const createAllChatButton = (user) => {
        const usersSection = document.getElementById('users')
        const item = document.createElement('li')
                
        let status = '<span style="color: green">online</span>'

        const buttonText = 'All chat ' + status

        const button = document.createElement('button')

        button.className = 'userButton'

        const iconElement = '<span style="white-space: pre;">  </span><span id="newMsgIcon" class="msgIcon"></span>'
        button.innerHTML = buttonText + iconElement

        if(user.newMsgFrom.includes(ALL_CHAT_NAME)){
            const msgDiv = button.children['newMsgIcon']
            ReactDom.render(<RiMessage2Fill/>, msgDiv)
        }

        button.setAttribute('data-userID', ALL_CHAT_NAME)

        button.onclick = () => {
            setCurrentRoom(ALL_CHAT_NAME)
            setRoomType('room')

            socket.emit('getMessages', {

                to: ALL_CHAT_NAME,
                roomType: 'room'

            })

            socket.emit('removeNewMsgFrom', {
                userID: userId,
                from: button.getAttribute('data-userID')
            })

            const msgDiv = button.children['newMsgIcon']
            msgDiv.innerHTML = ''
            
        }

        item.appendChild(button)
        usersSection.appendChild(item)
    }

    const changeMsgHandler = (event) => {
        const value = event.target.value
        setMsg(value)
    }

    const scrollToTheBottomOfMsgList = () => {
        const msgList = document.getElementById('messages')
        msgList.scrollTo(0, msgList.scrollHeight)  
    }

    const OnSendMessage = async () => {
        
        try{

            let date = new Date().toISOString()

            const data = {
                fromUser: username,
                content: msg,
                date: new Date().toISOString(),
                to: currentRoom,
                roomType: roomType,
                fromUserId: userId
            }

            socket.emit('msg', data)

            if(roomType !== 'room')
                displayMessage(data)

            await axios.post('/chat', {
                content: msg,
                fromUser: username,
                userId: userId,
                to: currentRoom,
                date: date
            })


        }catch(error){

            //TODO: implement error handling
            //console.log(error.response.data.message)
            console.log(error)  

        }
        
    }

    return (

        <div className="chatStyle">

            <div id="chatSection">

                <ul id="messages"></ul>

                <input type="text" 
                        value={msg}
                        onChange={changeMsgHandler}></input>

                <br></br>

                <button onClick={ OnSendMessage }>Send</button>

            </div>

            <div id="usersSection">
                <ul id="users"> 

                </ul>

            </div>

        </div>

    )

}

export default Chat