import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Menu from '../components/Menu'
import useStore from '../hooks/authHook'
import '../../css/settings.css'

const Settings =()=>{

    const {REACT_APP_HOST_IP} = process.env

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

    const confirmClicked=()=>{
        if(popType ==='username'){

            let new_uname = document.getElementById('new-username').value

            if(new_uname ===""){
                alert("Warning: field empty! Please input new username!")
            }else{
                fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/user/'+user.user_id+'/username' ,{
                    method: 'PATCH',
                    credentials:'include', 
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                          new_username : new_uname
                    })
                 }).then(response=>{return response.json()})
                    .then(json=>{
                        if(json.result.success){
                            setToggle(!isToggled)
                            alert(json.result.message)
                        }else{
                            alert(json.result.error)
                        }
                    })
            }
        }else{
            if(popType==="password"){
                let old_pass = document.getElementById('current-password').value
                let new_pass = document.getElementById("new-password").value
                let confirm_pass = document.getElementById("confirm-password").value

                if(new_pass === confirm_pass){
                    
                    console.log(document.getElementById('current-password').value,new_pass, confirm_pass)
                    fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/user/'+user.user_id+'/password' ,{
                        method: 'PATCH', 
                        credentials:'include',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify({
                              oldPassword: old_pass,
                              modifiedPassword: new_pass
                        })
                     }).then(response=>{return response.json()})
                        .then(json=>{
                            if(json.result.success){
                                setToggle(!isToggled)
                                alert(json.result.message)
                            }else{
                                alert(json.result.message)
                            }})
                }
            }
        }
    }

    const cancelClicked=async()=>{
        await setToggle(!isToggled);
        setType("");
    }

    const Popup=(props)=>{
        return (
            <div className="popup-box">
                 {props.type === 'username'? (
                <div> 
                    <div  className='username-box'>
                            New Username:<input type="text" id="new-username" placeholder="input your username"></input><br/>
                        </div>
                        <div className='popup-buttons'>
                            <button className="confirm" onClick={confirmClicked}>Confirm</button> <button className="cancel" onClick={cancelClicked}>Cancel</button>
                        </div>                
                    </div>
                ) : (
                <div>
                    <div className='password-box'>
                        Current Password:<input type="password" id="current-password" placeholder="input current password"></input><br/>
                        New Password:<input type="password" id="new-password" placeholder="input new password"></input><br/>
                        Confirm Password:<input type="password" id="confirm-password" placeholder="confirm new password"></input><br/>
                    </div>
                    <div className='popup-buttons'>
                        <button className="confirm" onClick={confirmClicked}>Confirm</button> <button className="cancel" onClick={cancelClicked}>Cancel</button>
                    </div>
                </div>
                )}
            </div>

        )
    }

    const handleChange=async(foo)=>{
        await setToggle(!isToggled);

        if(foo.value==='username'){
             setType('username')
        }else if(foo.value ==='password'){
             setType('password')
        }else(
            setType("")
        )
        
    }

    return(
        <div>
            <div className='settings-container'>
            {/* <div className='top-box'>
                <p className='header'>Settings</p>
                <hr className="line"></hr>
            </div> */}
                <div className="settings-box">
                    <ul>
                        {settings_list.map((foo,i)=>{
                            return <li key={i} className='settings-tile'>{foo.label} <button className='edit-button' onClick={()=>handleChange(foo)}>Edit</button></li>
                        })}
                    </ul>
                    {isToggled===true? <Popup type={popType}/>:""}
                </div>
            </div>
            <Header/>
            <Menu/>
            <Footer/>
        </div>
    )
}

export default Settings;