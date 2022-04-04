import React from 'react';
import UPLB from './images/UPLB.png'
import './Login.css'

function Login(){
    return(
    <div className = 'Login'> 
        <div className='Header'>
                <div className='header-logo'>
                    <img src = {UPLB} className="uplb-logo" alt="uplb logo"/>
                    <h2>University of the Philippines Los Baños</h2>
                </div>
        </div>
    </div> 
    )
}

export default Login;