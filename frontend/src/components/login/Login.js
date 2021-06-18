import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'
import './login-style.css'
import axios from '../../axios'

function Login(props){

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const history = useHistory()

    const changeUsernameHandler = (event) => {
        const value = event.target.value
        setUsername(value)
    }

    const changePasswordHandler = (event) => {
        const value = event.target.value
        setPassword(value)
    }
   
    const OnLogin = async () => {
    
        try{
            const res = await axios.post('/login', {
                username: username,
                password: password
            })
            
            history.push({
                pathname: "/chat",
                state: { _id : res.data._id }
            })

        }catch(error){
            
            //TODO: display a message about wrong username/password
            console.log(error.response.data.message)
        }
    }

    return (

        <div>
            
            <div className="loginStyle" >
                
                <label>Username: </label>
                <input type="text"
                        value={username}
                        onChange={changeUsernameHandler}></input>

                <br></br>
                
                <label>Password: </label>
                <input type="password"
                        value={password}
                        onChange={changePasswordHandler}></input>

                <br></br>

                <button onClick={() => OnLogin()}>Log in</button>

            </div>

        </div>

    )

}

export default Login