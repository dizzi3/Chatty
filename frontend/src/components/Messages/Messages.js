import React, { createRef } from 'react'
import './styles/messages-styles.css'
import { Scrollbars } from 'react-custom-scrollbars'
import DateHelper from '../../DateHelper'

class Messages extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            messages: props.messages
        }

        this.scrollbar = createRef()
    }

    componentDidMount(){
        this.initializeMessages()
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

            this.scrollToTheBottom()            
        })

    }

    scrollToTheBottom(){
        if(this.scrollbar)
            this.scrollbar.current.scrollToBottom()
    }

    render(){
        return (

            <div id='messagesContainer'>

                <Scrollbars ref={this.scrollbar}
                            renderTrackHorizontal={props => <div {...props} style={{display:"none"}}/>}
                            renderThumbHorizontal={props => <div {...props} style={{display:"none"}}/>}
                            style={{ width: 895, height: 590 }}>

                    <ul id='messages'>

                    </ul>

                </Scrollbars>

            </div>

        )
    }

}

export default Messages