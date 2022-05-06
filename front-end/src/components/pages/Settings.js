import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Menu from '../components/Menu'
import useStore from '../hooks/authHook'
import '../../css/settings.css'

const Settings =()=>{

    const[isToggled, setToggle] = useState(false);
    const[popType, setType] = useState("")

    const { user, isAuthenticated } = useStore();
    const navigate = useNavigate();     // navigation hook
 
    useEffect(() =>{
        if(!isAuthenticated) {
            navigate('/')
            alert("You are not logged in!")
        }},[])


    const settings_list=[
        {label:"change username", value:'username'},
        {label:"change password", value:'password'}
    ]

    const Popup=(props)=>{
        // console.log(props)
        return (
            <div>
            {props.type === 'username'? (
               <div> 
                   <input type="text" id="new-username" placeholder="input your username"></input><br/>
                   <button>Confirm</button> <button>Cancel</button>
                </div>
            ) : (
            <div>
                <input type="password" id="current password" placeholder="input current password"></input><br/>
                <input type="password" placeholder="input new password"></input><br/>
                <input type="password" placeholder="confirm new password"></input><br/>
                <button>Confirm</button> <button>Cancel</button>
            </div>
            )}
            </div>

        )
    }

    const handleChange=async(foo)=>{
        await setToggle(!isToggled);

        if(foo.value==='username'){
             setType('username')
        }else{
             setType('password')
        }
        
    }

    return(
        <div>
            <Menu/>
            <Header/>
            <div className="settings-box">
                <ul className='settings-tile'>
                    {settings_list.map((foo,i)=>{
                        return <li key={i}>{foo.label} <button onClick={()=>handleChange(foo)}>Edit</button></li>
                    })}
                </ul>
                {isToggled===true? <Popup type={popType}/>:""}
                {/* {popType} */}
            </div>
            <Footer/>
        </div>
    )
}

export default Settings;