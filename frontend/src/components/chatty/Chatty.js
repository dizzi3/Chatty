import React from 'react'
import Login from '../login/Login'
import SignIn from '../sign-in/SignIn'
import CleanChat from '../chat/CleanChat'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'

class Chatty extends React.Component{

    render() {

        return(

            <div className="App">
                
                <Router>

                    <Route exact path="/">
                        <Redirect to="/login" />
                    </Route>

                    <Route path='/chat'>
                        <CleanChat />
                    </Route>

                    <Route path='/login'>
                        <Login />
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