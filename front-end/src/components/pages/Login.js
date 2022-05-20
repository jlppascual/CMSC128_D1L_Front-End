import { useNavigate } from 'react-router-dom';
import useStore from '../hooks/authHook';
import UPLB from '../../images/uplb.png';
import Footer from '../components/Footer';
import { ToastContainer } from 'react-toastify';
import { notifyError } from '../components/Popups/toastNotifUtil';
import '../../css/login.css';
import '../../css/toast_container.css';


// changed to function to use hooks
const Login = () => {

    const {REACT_APP_HOST_IP} = process.env

    const { setAuth } = useStore();     // from zustand store
    const navigate = useNavigate();     // hook for navigation


    // handles login action and 
    const login = (e) => {
        e.preventDefault();
        const credentials = {
            username: document.getElementById('login-username').value,
            password: document.getElementById('login-password').value,
        }
       
        const password_format = /^(?=.*[-_.!"'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/
        // const password_format = /^(?=.[0-9])(?=.[-.!"'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9-._!"'#%&,:;<>=@{}~$()*+/\?\[\]\^\|]{8,}$/ 
        const username_format = /^[A-Za-z]\w*$/
        if(!credentials.username.match(username_format)){
            notifyError("username must start with a letter")
        }else if(!credentials.password.match(password_format)){
            notifyError("password must be at least 8 characters and contains at least 1 upper-case letter, 1 lower-case letter, and a special character");
        }else{
            fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/auth' ,{
                method:'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( credentials )
            }
        )
        .then(response => response.json())
        .then(body => {
            if(!body.success) notifyError(body.message);
            else{
                setAuth(body.user, body.success);
                navigate('/home');
            }
        })
        }
    }

    return(
        <div>
            <div className='login-body'>
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
                
            </div>
            <ToastContainer className={'toast-container'}/>
            <Footer />
        </div> 
    )
}

export default Login;