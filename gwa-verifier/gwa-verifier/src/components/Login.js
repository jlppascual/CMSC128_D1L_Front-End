import { useNavigate } from 'react-router-dom'

import useStore from './hooks/authHook'
import UPLB from '../images/UPLB.png'
import Footer from '../components/Footer'
import '../css/login.css'

// changed to function to use hooks
const Login = () => {

    const { setUser, setIsAuthenticated, user } = useStore();     // from zustand store
    const navigate = useNavigate();     // hook for navigation
    let alert_message;

    // handles login action and 
    const login = (e) => {
        e.preventDefault();

        const credentials = {
            username: document.getElementById('login-username').value,
            password: document.getElementById('login-password').value
        }

        fetch('http://localhost:3001/api/0.1/auth' ,{
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( credentials )
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
        
        <div className = 'login'>
        <div className='header'>
        <p className="app-name">ASTERIS</p>
            <img src = {UPLB} id="uplb-logo" alt="UPLB logo"/>
            <div className='text-header'>
                <p className="univ-name">UNIVERSITY OF THE PHILIPPINES LOS BAÑOS</p>
                <p className="college-name">College of Arts and Sciences</p>
                
            </div>   
            
        </div>
        <div>
        <form className='login-form'>
            <h2>User Login</h2>
            <input type='text' className= "form-field" id='login-username' placeholder='⭕ Username'/><br/>
            <input type='password' className= "form-field" id='login-password' placeholder='⭕ Password'/><br/>

            {/* Submit */}
            <input type="submit" value="LOG IN" className='submit-btn' onClick={login}/>
        </form><br/>
        </div>
        <Footer />

    </div> 
    )
}

export default Login;
