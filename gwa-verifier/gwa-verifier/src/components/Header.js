/*
    Author: Christian

    This is the source code for the header of the application
*/

import React from 'react';
import Dp from '../images/dp_default.jpg';
import Caret from '../images/drop_down.svg';
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
                <h1>GWA Verifier</h1>
                <ul className={'header-right'}>
                    <span className={'header-user'}>{ this.state.userType }</span>
                    <img src = {Dp} className={'header-dp'}/>
                    <img src = {Caret} className={'header-caret'}/>
                </ul>
                 
            </div>
        );
    }
}

export default Header;