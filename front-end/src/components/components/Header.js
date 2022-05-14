/*
    Author: Christian

    This is the source code for the header of the application
*/
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Dp from '../../images/dp_default.jpg';
import Logo from '../../images/asteris-logo.png';
import useStore from '../hooks/authHook';
import '../../css/header.css'

const Header =()=>{

    const[userType, setType]=useState();
    const navigate = useNavigate();     // hook for navigation
    const {user, host} = useStore();
    
    const userLogout=()=>{ 
        
        fetch('http://'+host+':3001/api/0.1/auth' ,{
            method:'GET',
            credentials:'include'
        })
        .then(response => response.json())
        .then(body => {
            if(!body.success) alert(body.message);
            else{
                console.log(body);
                navigate('/');
                setAuth(null, false)
            }
        })
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

    useEffect(()=>{
        setType(user.first_name)
    },[userType])
    
    //**need to add useeffect to check if admin yung user */
    return(
        <div className='header-main'>
        <div className='green-shape'></div>
        <div className='yellow-shape'></div>
        <h1 className='header-name' onClick={()=> window.location.href='/home'}><img src={Logo} alt="" className='asteris-logo'/></h1>
        <div className='header-right'>
            <span className='header-user'>{ userType }</span>
            <img src = {Dp} className={'header-dp'}/>
            <Dropdown>
                <div className={'header-dropdown'}>
                    <Link to = '/' className={'header-dropitem'}>
                        Profile
                    </Link>
                    <Link to = '/settings' className={'header-dropitem'}>
                        Settings
                    </Link>
                    <div onClick= {userLogout} className={'header-dropitem'}>
                        Logout
                    </div>
                </div>
            </Dropdown>
        </div>
        
    </div>
    )

}
    

export default Header;