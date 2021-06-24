import React, { useEffect, useState } from 'react'
import './chat-style.css'
import { useLocation } from 'react-router-dom'
import axios from '../../axios'
import { socket } from '../../services/socket'

function Chat(props){

    useEffect(() => {

        socket.connect()

        socket.on('msg', (data) => {
            const msgList = document.getElementById('messages')
            const msgItem = document.createElement('li')
            msgItem.textContent = '[' + data.username + ']: ' + data.msg
            msgList.appendChild(msgItem)

            scrollToTheBottomOfMsgList()
        })

        socket.on('disconnect', () => {
            console.log('user ' + username + ' disconnected')
        })

        socket.on('userStatusChanged', (users) => {

            const usersSection = document.getElementById('users')
            usersSection.innerHTML = ''
            
            console.log(users)

            users.forEach((user, index) => {

                if(!(user.username === username)){

                    const userItem = document.createElement('li')
                
                    let status = ''
                    if(user.online)
                        status = "<span style='color: green'>online</span>"
                    else
                        status = '<span style="color: red">offline</span>'
    
                    userItem.innerHTML = '[' + user.username + '] is ' + status
                    usersSection.appendChild(userItem)

                }
                
            })
        })

        socket.emit('userConnected', {
            username: location.state.username,
            userID: location.state.userId
        })

    }, [] )


    const location = useLocation()
    const username = location.state.username
    const userId = location.state.userId

    const [msg, setMsg] = useState('')

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

            socket.emit('msg', {
                username: username,
                msg: msg
            })

            const res = await axios.post('/chat', {
                content: msg,
                fromUser: username,
                userId: userId
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

                <button onClick={ () => OnSendMessage() }>Send</button>

            </div>

            <div id="usersSection"> 

                <ul id="users">

                </ul>

            </div>

        </div>

    )

}

export default Chat