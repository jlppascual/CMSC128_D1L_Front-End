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

    const confirmClicked=()=>{
        if(popType ==='username'){

            let new_uname = document.getElementById('new-username').value

            if(new_uname ===""){
                alert("Warning: field empty! Please input new username!")
            }else{
                fetch('http://localhost:3001/api/0.1/user/'+user.user_id+'/username' ,{
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
                    fetch('http://localhost:3001/api/0.1/user/'+user.user_id+'/password' ,{
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
        // console.log(props)
        return (
            <div>
            {props.type === 'username'? (
               <div> 
                   <input type="text" id="new-username" placeholder="input your username"></input><br/>
                   <button onClick={confirmClicked} >Confirm</button> <button onClick={cancelClicked}>Cancel</button>
                </div>
            ) : (
            <div>
                <input type="password" id="current-password" placeholder="input current password"></input><br/>
                <input type="password" id="new-password" placeholder="input new password"></input><br/>
                <input type="password" id="confirm-password" placeholder="confirm new password"></input><br/>
                <button onClick={confirmClicked}>Confirm</button> <button onClick={cancelClicked}>Cancel</button>
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