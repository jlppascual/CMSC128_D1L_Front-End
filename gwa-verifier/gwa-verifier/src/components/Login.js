import React from 'react';
import UPLB from '../images/uplb.png'
import '../css/login.css'
import {Link} from 'react-router-dom'

function Login(){
    return(
    <div className = 'Login'> 
        <div className='header'>
            <img src = {UPLB} className="uplb-logo" alt="uplb logo"/>
            <h3 className="web-name">University of the Philippines Los Baños</h3>
                
        </div>
        <div classname='Body'>
            <Link to='/add-student'><button>add student</button></Link>
        </div>
    </div> 
    )
}

export default Login;