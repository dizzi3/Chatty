import React from 'react'
import './chat-style.css'
import { useLocation } from 'react-router-dom'

function Chat(props){

    const location = useLocation()
    const id = location.state._id

    return (

        <div className="chatStyle">{id}</div>

    )

}

export default Chat