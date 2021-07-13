import React, { useState } from 'react'
import './message-input-style.css'

function MessageInput(props){

    const [msg, setMsg] = useState('')

    const msgChangedHandler = (event) => {
        const msg = event.target.value
        setMsg(msg)
    }
    
    const onSendMessage = () => {
        props.onSendMessage(msg)
    }
    
    return (
    
        <div id='inputContainer'>
    
            <input type='text'
                   value={ msg }
                   onChange={ msgChangedHandler }
                   className='msgInput'></input>
    
            <br/>

            <button onClick={ onSendMessage }
                    className='sendButton'>Send</button>
    
        </div>
    
    )

}

export default MessageInput