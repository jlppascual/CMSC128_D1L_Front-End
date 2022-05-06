/*
    Author: Christian

    This is the source code for the header of the application
*/

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Dp from '../images/dp_default.jpg';
import '../css/header.css'

class Header extends React.Component{

    constructor(props){
        super(props)

        this.state={
            // checks if user is normal or admin, placeholder for now ...
            // will be changed once incorporated with backend
            userType: 'Admin'   
        }
    }
    
    render(){
        return(
            <div className='header-main'>
                <div className='green-shape'></div>
                <div className='yellow-shape'></div>
                <h1 className='header-name' onClick={()=> window.location.href='/home'}>ASTERIS</h1>
                <div className='header-right'>
                    <span className='header-user'>{ this.state.userType }</span>
                    <img src = {Dp} className={'header-dp'}/>
                    <Dropdown>
                        <div className={'header-dropdown'}>
                            <Link to = '/' className={'header-dropitem'}>
                                Profile
                            </Link>
                            <Link to = '/settings' className={'header-dropitem'}>
                                Settings
                            </Link>
                            <Link to = '/' className={'header-dropitem'}>
                                Logout
                            </Link>
                        </div>
                    </Dropdown>
                </div>
                
            </div>
        );
    }
}

function Dropdown(props){
    const [open, setOpen] = useState(false);
    return(
        <span>
            <a onClick={() => setOpen(!open)}>
                <svg width="24" height="19" className={'header-caret'}>
                    <path d = "M 6 2 L 14 2 M 10 8 L 14 2 L 6 2"></path>
                </svg>
            </a>
            {open && props.children}
        </span>
    );
}
export default Header;