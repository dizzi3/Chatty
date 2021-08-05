import React from 'react'
import './styles/room-nav-style.css'
import ReactDOM from 'react-dom'
import NavButton from './NavButton'

class RoomsNav extends React.Component{

    constructor(props){
        super(props)
        
        this.state = {
            privateMsgRooms : props.privateMsgRooms,
            multiRooms : props.multiRooms
        }

        this.setCurrentRoom =  this.setCurrentRoom.bind(this)   
    }

    componentDidMount(){
        this.createPrivateRooms()
        this.createMultiRooms()
    }

    createPrivateRooms = () => {

        const roomsList = document.getElementById('privateRooms')

        for(const room of this.state.privateMsgRooms){
            const roomItem = document.createElement('li')
            
            ReactDOM.render(<NavButton 
                            roomID={room.roomID}
                            roomName={room.roomName}
                            newMsg={room.newMsg}
                            online={room.online}
                            roomType={room.roomType}
                            setCurrentRoom={this.setCurrentRoom} />, roomItem)

            roomsList.appendChild(roomItem)
        }
        
    }

    createMultiRooms = () => {
        const roomsList = document.getElementById('multiRooms')
        
        for(const room of this.state.multiRooms){
            const roomItem = document.createElement('li')

            ReactDOM.render(<NavButton
                            roomID={room.roomID}
                            roomName={room.roomName}
                            newMsg={room.newMsg}
                            online={room.online}
                            roomType={room.roomType}
                            setCurrentRoom={this.setCurrentRoom} />, roomItem)

            roomsList.appendChild(roomItem)
        }
    }

    componentDidUpdate(previousProps){
        this.updateProps(previousProps)
        this.clearRooms()
        this.createPrivateRooms()
        this.createMultiRooms()
    }

    updateProps(previousProps){

        if(this.props.privateMsgRooms !== previousProps.privateMsgRooms){
            this.setState({
                privateMsgRooms: this.props.privateMsgRooms
            })
        }

        if(this.props.multiRooms !== previousProps.multiRooms){
            this.setState({
                multiRooms: this.props.multiRooms
            })
        }

    }

    clearRooms = () => {
        const privateRoomsList = document.getElementById('privateRooms')
        const multiRoomsList = document.getElementById('multiRooms')

        privateRoomsList.innerHTML = ''
        multiRoomsList.innerHTML = ''
    }

    setCurrentRoom = (data) => {
        this.props.roomChanged(data)
    }

    render(){
        return(

            <div id='roomsContainer'>

                <ul id='privateRooms'>

                </ul>

                <ul id='multiRooms'>

                </ul>

            </div>

    )}

}

export default RoomsNav