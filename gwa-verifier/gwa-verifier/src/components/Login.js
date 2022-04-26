import React from 'react';
import UPLB from '../images/uplb.png'
import '../css/login.css'
import { Navigate } from 'react-router-dom'

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state={
            // loginAttempts: 0,
            redirect: false,
        }
        this.login=this.login.bind(this);
    }

    login(e){
            // uncomment when integrated with backend
        // fetch('http:localhost:3001/api/0.1/login' ,{
        //     method: POST, 
        //     body: {
        //           username: document.getElementById('username').value,
        //           password: document.getElementById('password').value,
        //     }
        //  })
        //  .then(response => response.json())
        //  .then(body => {
        //     // validation code
        // })
        
        // placeholder action for now
        this.setState({ redirect: true });
        e.preventdefault();
    }

    render(){
        if (this.state.redirect) return <Navigate to={ '/home' } />
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
                    <button onClick = { this.login }>login</button>
                </form>
            </div>
        </div> 
        )
    }
}

export default Login;