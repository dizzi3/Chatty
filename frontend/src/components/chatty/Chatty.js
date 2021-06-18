import React from 'react'
import Chat from '../chat/Chat'
import Login from '../login/Login'
import SignIn from '../sign-in/SignIn'
import { BrowserRouter as Router, Route } from 'react-router-dom'

class Chatty extends React.Component{

    render() {

        return(

            <div className="App">
                
            <Router>

                <Route path='/chat'>
                    <Chat />
                </Route>

                <Route path='/login'>
                    <Login onLogin={(data) => this.onLogin(data)}/>
                </Route>

                <Route path='/sign-in'>
                    <SignIn />
                </Route>

            </Router>

            </div>

        )
    }

}

export default Chatty