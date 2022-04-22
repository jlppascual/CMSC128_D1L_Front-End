/*
    Author: Christian

    This is the source code for the header of the application
*/

import React from 'react';
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
            <div className={'header-main'}>
                <h1 className={'header-name'}>GWA Verifier</h1>
                <ul className={'header-right'}>
                    <span className={'header-user'}>{ this.state.userType }</span>
                    <img src = {Dp} className={'header-dp'}/>
                    {//<a href='#'><img src = {Caret} className={'header-caret'}/></a>
                    }
                    <a href='#'>
                        <svg width="24" height="19" className={'header-caret'}>
                            <path d = "M 6 2 L 14 2 M 10 8 L 14 2 L 6 2"></path>
                        </svg>
                    </a>
                </ul>
                
            </div>
        );
    }
}

export default Header;