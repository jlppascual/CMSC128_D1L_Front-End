import useStore from './hooks/authHook'
import UPLB from '../images/uplb.png'
import '../css/login.css'
import { useNavigate } from 'react-router-dom'

// changed to function to use hooks
const Login = () => {

    const { setUser, setIsAuthenticated } = useStore();     // from zustand store

    const navigate = useNavigate();     // hook for navigation
    
    // handles login action and 
    const login = (e) => {
        e.preventDefault();
        
        const credentials = {
            email: document.getElementById('username').value,
            password: document.getElementById('password').value
        }

        fetch('http://localhost:3001/api/0.1/auth' ,{
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
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
                <fieldset>
                    Username: <input type="text" id="username" 
                    placeholder="enter your username..." 
                    /><br />
                    Password: <input type="password" id="password"
                    placeholder = "enter your password..."/>
                </fieldset>
                <button onClick={login}>Login</button>
            </form>
        </div>
    </div> 
    )
}

export default Login;
