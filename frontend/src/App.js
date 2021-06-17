import React from 'react'
import './App.css'
import Chat from './components/chat/Chat'
import Login from './components/login/Login'
import SignIn from './components/sign-in/SignIn'
import { BrowserRouter as Router, Route } from 'react-router-dom'

function App(){

  return (

    <div className="App">
      
      <Router>

        <Route path='/chat'>
          <Chat />
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

export default App