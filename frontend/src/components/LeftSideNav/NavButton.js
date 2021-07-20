import React from 'react'
import ReactDom from 'react-dom'
import { RiMessage2Fill } from 'react-icons/ri'
import './styles/nav-button-style.css'

class NavButton extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            roomID: props.roomID,
            roomName: props.roomName,
            newMsg: props.newMsg,
            online: props.online,
            roomType: props.roomType
        }

        this.button = React.createRef()
    }

    componentDidMount(){
        this.initializeButton()
    }

    initializeButton(){
        const dotSpan = this.getDotSpan()
        const newMessageIconSpan = this.getNewMessageIconSpan()

        const innerHTML = dotSpan + this.state.roomName + newMessageIconSpan

        this.button.current.innerHTML = innerHTML
        this.button.current.onclick = () => {
            this.buttonOnClick()
        }

        this.initializeNewMessageIcon()
    }

    getDotSpan = () => {
        if(this.state.online)
            return '<span class="onlineDot"></span>' + this.getWhiteSpaceSpan()
        else
            return '<span class="offlineDot"></span>' + this.getWhiteSpaceSpan()
    }

    getWhiteSpaceSpan = () => {
        return '<span style="white-space: pre;">  </span>'
    }

    getNewMessageIconSpan = () => {
        return this.getWhiteSpaceSpan() + 
               '<span id="newMsgIcon" class="msgIcon"></span>'
    }

    initializeNewMessageIcon = () => {

        const iconSpan = this.button.current.children['newMsgIcon']

        if(this.state.newMsg)
            ReactDom.render(<RiMessage2Fill/>, iconSpan)
        else
            iconSpan.innerHTML = ''
            
    }

    buttonOnClick = () => {
        this.props.setCurrentRoom({ roomID: this.state.roomID, roomType: this.state.roomType })
    }

    render(){
        return(

            <button id='navButton' ref={this.button}/>

        )
    }

}

export default NavButton