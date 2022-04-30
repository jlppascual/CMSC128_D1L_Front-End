import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

import useStore from './hooks/authHook'
import UPLB from '../images/UPLB.png'
import '../css/login.css'

// changed to function to use hooks
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { setUser, setIsAuthenticated } = useStore();     // from zustand store

    const navigate = useNavigate();     // hook for navigation
    
    // handles login action and 
    const login = (e) => {
        e.preventDefault();

        fetch('http://localhost:3001/api/0.1/auth' ,{
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password})
            }
        )
        .then(response => response.json())
        .then(body => {
            if(!body.success) alert(body.message);
            else{
                setUser(body.user);
                setIsAuthenticated(body.success);
                navigate('/home');
            }
        })
    }

    return(
        <div className = {'login'}> 
        <div className= {'login-header'}>
            <img src = {UPLB} className="uplb-logo" alt="uplb logo"/>
            <h3 className="web-name">University of the Philippines Los Baños</h3>
                
        </div>
        <div className={'login-body'}>
        <form>
            {/* Username field */}
            <label>Username:</label>&nbsp;
            <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} /><br/>

            {/* Password field */}
            <label>Password:</label>&nbsp;&nbsp;
            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} /><br/>

            {/* Submit */}
            <input type="submit" value="Submit" onClick={login}/>
        </form><br/>
        </div>
    </div> 
    )
}

export default Login;
