import React from 'react'
import './styles/room-nav-style.css'
import ReactDOM from 'react-dom'
import NavButton from './NavButton'

class RoomsNav extends React.Component{

    constructor(props){
        super(props)
        
        this.state = {
            rooms : props.rooms
        }

        this.setCurrentRoom =  this.setCurrentRoom.bind(this)   
    }

    componentDidMount(){
        this.createRooms()
    }

    createRooms = () => {

        const roomsList = document.getElementById('rooms')

        for(const room of this.state.rooms){
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
        this.createRooms()
    }

    updateProps(previousProps){

        if(this.props.rooms !== previousProps.rooms){
            this.setState({
                rooms: this.props.rooms
            })
        }

    }

    clearRooms = () => {
        const roomsList = document.getElementById('rooms')

        roomsList.innerHTML = ''
    }

    setCurrentRoom = (roomID) => {
        this.props.roomChanged(roomID)
    }

    render(){
        return(

            <div id='roomsContainer'>

                <ul id='rooms'>

                </ul>

            </div>

    )}

}

export default RoomsNav