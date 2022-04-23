import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import  { AiOutlineClose } from 'react-icons/ai'
import { IconContext } from 'react-icons/lib';
import { Link } from 'react-router-dom';
import { SidebarData } from './menu_components/SidebarData';
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

    const showSidebar = () => setSidebar(!sidebar);
    return(
        <IconContext.Provider value={{ color: 'black' }}>
            <div className={'navbar'}>
                <Link to='#' className={'menu-bars'}>
                    <FaBars className={'menu-icon'} onClick={showSidebar}/>
                </Link>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className={'nav-menu-items'} onClick={showSidebar}>
                    <li className={'navbar-toggle'}>
                        <Link to='#' className={'menu-bars'}>
                            <AiOutlineClose className={'menu-icon'}/>
                        </Link>
                    </li>
                    { SidebarData.map((item, index) => {
                        return(
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span className={'menu-span'}>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </IconContext.Provider>
    );
}


export default Menu;