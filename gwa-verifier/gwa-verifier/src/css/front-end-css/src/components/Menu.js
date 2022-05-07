import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import  { AiOutlineClose } from 'react-icons/ai'
import { IconContext } from 'react-icons/lib';
import { Link } from 'react-router-dom';
import { SidebarDataUser, SidebarDataStudent } from './menu_components/SidebarData';
import useStore from './hooks/authHook'
import '../css/menu.css'

class Menu extends React.Component{
    render(){
        
        return(
            <Menubar />
        );
    }
}

function Menubar(){
    const [ sidebar, setSidebar ] = useState(false)
    const { user } = useStore();
    let user_title;
    if(user && user.user_role == "ADMIN") user_title = "User"
    else user_title = ""

    const showSidebar = () => setSidebar(!sidebar);
    
    return(
        <IconContext.Provider value={{ color: 'black' }}>
            <div className='menu-navbar'>
                <Link to='#' className='menu-bars'>
                    <FaBars className='menu-icon' onClick={showSidebar}/>
                </Link >
                <div className="menu-name" >Menu</div>
            </div>
            <nav className={sidebar ? 'menu-side active' : 'menu-side'}>
                <ul key = {1} onClick={showSidebar}>
                    <li className={'menu-navbar-toggle'}>
                        <Link to='#' className={'menu-bars'}>
                            <AiOutlineClose className={'menu-icon'}/>
                        </Link>
                    </li>
                    <br />
                    <div className='entity-title'>Student</div>
                    { SidebarDataStudent.map((item, index) => {
                        return(
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span className={'menu-span'}>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                    <br /> <br />
                    <div className='entity-title'>{user_title}</div>
                    {user && user.user_role == "ADMIN"? 
                     SidebarDataUser.map((item, index) => {
                        user_title = "User";
                        return(
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span className={'menu-span'}>{item.title}</span>
                                </Link>
                            </li>
                        );
                    }) : user_title = ""}
                    
                </ul>
            </nav>
        </IconContext.Provider>
    );
}


export default Menu;