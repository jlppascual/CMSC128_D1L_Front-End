import React, { useState} from 'react';
import Header from '../components/Header'
import Footer from '../components/Footer'
import Menu from '../components/Menu'
import '../../css/settings.css'
import { BsEaselFill } from 'react-icons/bs';

const Settings =()=>{

    const[isToggled, setToggle] = useState(false);
    const[type, setType] = useState("")

    const settings_list=[
        {label:"change username", value:'username'},
        {label:"change password", value:'password'}
    ]

    const Popup=(props)=>{

        return(
            <div className="popup-box">
                <div className="box">
                    {props.content}
                </div>
            </div>
        )
    }

    const handleChange=(foo)=>{
        setToggle(!isToggled);

        if(isToggled===false){
            setType("")
        }else{
            if(foo.value==='username'){
                setType('username')
            }else{
                setType('password')
            }
        }
    }

    return(
        <div>
            <Menu/>
            <Header/>
            <div className="settings-box">
                <ul className='settings-tile'>
                    {settings_list.map((foo,i)=>{
                        return <li key={i}>{foo.label} <button onClick={handleChange({foo})}>Edit</button></li>
                    })}
                </ul>
                {isToggled===true? <Popup content="Change Username"/> :""}
            </div>
            <Footer/>
        </div>
    )
}

export default Settings;