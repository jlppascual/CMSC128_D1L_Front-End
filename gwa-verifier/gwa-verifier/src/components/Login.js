import React from 'react';
import UPLB from '../images/uplb.png'
import '../css/login.css'
import {Link} from 'react-router-dom'

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:'',
        }
    }

    render(){
        return(
            <div className = 'Login'> 
            <div className='header'>
                <img src = {UPLB} className="uplb-logo" alt="uplb logo"/>
                <h3 className="web-name">University of the Philippines Los Baños</h3>
                    
            </div>
            <div classname='Body'>
                <form>
                    <fieldset id="signin-field">
                        Username: <input type="text" id="username" 
                        placeholder="enter your username..." 
                        /><br />
                        Password: <input type="password" id="password"
                        placeholder = "enter your password..."/>
                    </fieldset>
                    <Link to='/home'><button>login</button></Link>
                </form>
            </div>
        </div> 
        )
    }

}

// function Login(){
//     return(

//     )
// }

export default Login;