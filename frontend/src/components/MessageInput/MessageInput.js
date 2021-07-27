import React, { useEffect, useState } from 'react'
import './message-input-style.css'

function MessageInput(props){

    const [msg, setMsg] = useState('')

    const msgChangedHandler = (event) => {
        const msg = event.target.value
        setMsg(msg)
    }
    
    const onSendMessage = () => {
        props.onSendMessage(msg)

        var input = document.getElementById('msgInput')
        input.value = ''
        setMsg('')
    }

    const setSendMsgOnEnter = () => {
        
        var input = document.getElementById('msgInput')

        input.addEventListener('keyup', (event) => {

            if(event.key === 'Enter'){
                event.preventDefault()

                document.getElementById('sendButton').click()
            }
        })
    }

    useEffect(() => {

        setSendMsgOnEnter()

    }, [] )
    
    return (
    
        <div id='inputContainer'>
    
            <input type='text'
                   value={ msg }
                   onChange={ msgChangedHandler }
                   className='msgInput'
                   id='msgInput'></input>
    
            <br/>

            <button onClick={ onSendMessage }
                    className='sendButton'
                    id='sendButton'>Send</button>
    
        </div>
    
    )

}

export default MessageInput