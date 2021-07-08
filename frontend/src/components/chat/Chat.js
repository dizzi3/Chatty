import React, { useEffect, useRef, useState } from 'react'
import './chat-style.css'
import { useLocation } from 'react-router-dom'
import axios from '../../axios'
import { socket } from '../../services/socket'
import dateHelper from '../../DateHelper'
import { ALL_CHAT_NAME } from '../../config'
import { RiMessage2Fill } from 'react-icons/ri'
import ReactDom from 'react-dom'
import { Scrollbars } from 'react-custom-scrollbars'

function Chat(props){

    const location = useLocation()
    const username = location.state.username
    const userId = location.state.userId

    const [msg, setMsg] = useState('')
    const [currentRoom, setCurrentRoom] = useState(ALL_CHAT_NAME)
    const [roomType, setRoomType] = useState('room')

    const scrollbar = useRef(null)

    useEffect(() => {

        socket.off('msg')

        socket.on('msg', async (data) => {
            
            if((data.roomType === 'room' && data.to === currentRoom) ||
               (data.roomType === 'private' && data.fromUserId === currentRoom )){

                await displayMessage(data)

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

    }, [currentRoom, userId]) 

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

    const displayMessage = (data) => {

        const msgList = document.getElementById('messages')

        const msgItem = document.createElement('li')

        const dateString = dateHelper.getDateString(new Date(data.date))

        msgItem.innerHTML = '<span class="msgFromUser">' + data.fromUser + 
                            '</span> <span class="dateStyle">' + dateString + 
                            '</span></br><span class="msgContent">' + data.content + 
                            '</span>'


        msgList.appendChild(msgItem)

        if(scrollbar)
            scrollbar.current.scrollToBottom()
    }

    const setAutoSendMsgOnEnterEvent = () => {
        var input = document.getElementById('messageInput')

        input.addEventListener('keyup', (event) => {

            if(event.key === 'Enter'){
                event.preventDefault()

                document.getElementById('sendButton').click()
                input.value = ''
                setMsg('')
            }
        })
    }

    useEffect(() => {
        
        socket.connect()

        const createAllChatButton = (user) => {
            const usersSection = document.getElementById('users')
            const item = document.createElement('li')
                    
            const dot = '<span class="onlineDot"></span>'
    
            const buttonText = dot + '<span style="white-space: pre;">  </span>All chat'
    
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

        const createUserButton = (user, thisUser) => {
            const usersSection = document.getElementById('users')
            const userItem = document.createElement('li')
                    
            let dot
            if(user.online)
                dot = '<span class="onlineDot"></span>'
            else
                dot = '<span class="offlineDot"></span>'
    
            const iconElement = '<span style="white-space: pre;">  </span><span id="newMsgIcon" class="msgIcon"></span>'
    
            const buttonText = dot + '<span style="white-space: pre;">  </span>' + user.username + iconElement
    
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
            username: username,
            userID: userId
        })

        initializeChatMessages()  
        setAutoSendMsgOnEnterEvent()

    }, [userId, username] ) 

    const initializeChatMessages = () => {
        socket.emit('getMessages', {

            to: ALL_CHAT_NAME,
            roomType: 'room'

        })
    }

    const changeMsgHandler = (event) => {
        const value = event.target.value
        setMsg(value)
    }

    const OnSendMessage = async () => {
        
        if(msg === '')
            return

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

            <div id="logo">
                CHATTY
            </div>

            <div id="usersSection">
                <ul id="users"> 

                </ul>

            </div>

            <div id="chatSection">

                <div className="messagesOuterBox">
                    
                    <Scrollbars ref={scrollbar}
                    renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{display:"none"}}/>}
                    renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" style={{display:"none"}}/>}
                     style={{ width: 995, height: 690 }}>
                        <ul id="messages">
                        
                        </ul>
                    </Scrollbars>
                    
                </div>

                <input type="text" 
                        value={msg}
                        onChange={changeMsgHandler}
                        className="msgInput"
                        id='messageInput'></input>

                <br></br>

                <button onClick={ OnSendMessage }
                        className="sendMsgButton"
                        id="sendButton">Send</button>

            </div>

            <div id="sideBar">
                <ul id="sideBarItems">
                    <div class="onlineUsers">2 mens online
                        <span class="usersInRoom">3 gentlemens offline<br/>esssaaaa<br/>wtfff</span>
                    </div>
                </ul>
            </div>


        </div>

    )

}

export default Chat