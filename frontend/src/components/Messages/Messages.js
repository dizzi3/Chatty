import React from 'react'
import './styles/messages-styles.css'
import DateHelper from '../../DateHelper'
import Scrollbar from 'smooth-scrollbar'

class Messages extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            messages: props.messages
        }
    }

    componentDidMount(){
        this.initializeMessages()
        this.initializeSmoothScrollbar()
    }

    initializeSmoothScrollbar(){
        Scrollbar.init(document.querySelector('#messages'), {
            damping: 0.1
        })
    }

    componentDidUpdate(){
        this.initializeMessages()
    }


    initializeMessages(){

        this.state.messages.forEach(message => {

            const msgList = document.getElementById('messages')
            const msgItem = document.createElement('li')

            const dateString = DateHelper.getDateString(new Date(message.date))

            msgItem.innerHTML = '<span class="username">' + message.username + '</span>' +
                                ' <span class="date">' + dateString + '</span>' + 
                                '</br><span class="content">' + message.content + '</span>'

            msgList.appendChild(msgItem)  
        })

        this.scrollToTheBottom()
    }

    scrollToTheBottom(){
        const msgList = document.getElementById('messages')
        msgList.scrollTo(0, msgList.lastChild.getBoundingClientRect().bottom)
    }

    render(){
        return (

            <div id='messagesContainer'>

                <ul id='messages'>

                </ul>

            </div>

        )
    }

}

export default Messages