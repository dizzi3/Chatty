import React from 'react'
import './styles/messages-styles.css'
import DateHelper from '../../DateHelper'
import Scrollbar from 'smooth-scrollbar'

class Messages extends React.Component{

    static SCROLL_SPEED = 0.1

    constructor(props){
        super(props)
        
        this.state = {
            messages: props.messages
        }
    }

    async componentDidMount(){
        await this.initializeMessages()
        this.initializeScrollbar()
    }

    initializeMessages(){

        const msgList = document.getElementById('messages')

        this.state.messages.forEach(message => {

            const msgItem = document.createElement('li')

            const dateString = DateHelper.getDateString(new Date(message.date))

            msgItem.innerHTML = '<span class="username">' + message.username + '</span>' +
                                ' <span class="date">' + dateString + '</span>' + 
                                '</br><span class="content">' + message.content + '</span>'

            msgList.appendChild(msgItem)
        })
        
    }

    async initializeScrollbar(){

        await Scrollbar.init(document.querySelector('#messages'), {
            damping: Messages.SCROLL_SPEED
        })

        this.scrollToTheBottom()   
    }

    scrollToTheBottom(){
        const msgList = document.getElementById('messages')
        const scrollbar = Scrollbar.get(document.querySelector('#messages'))
        scrollbar.scrollTo(0, msgList.scrollHeight)
    }

    async componentDidUpdate(previousProps){
        
        if(this.updateProps(previousProps)){
            await this.destroyScrollbar()
            await this.clearMessages()
            await this.initializeMessages()
            this.initializeScrollbar()
        }
        
    }

    updateProps(previousProps){

        if(this.props.messages !== previousProps.messages){
            this.setState({
                messages: this.props.messages
            })

            return false
        }

        return true
    }

    clearMessages(){
        const msgList = document.getElementById('messages')

        while(msgList.firstChild)
            msgList.removeChild(msgList.firstChild)
    }

    destroyScrollbar(){
        const msgList = document.getElementById('messages')
        if(Scrollbar.has(msgList))
            Scrollbar.destroy(msgList)
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