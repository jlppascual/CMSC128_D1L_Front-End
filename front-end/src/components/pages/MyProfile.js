import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Menu from '../components/Menu'
import useStore from '../hooks/authHook'
import '../../css/profile.css'
import USER from '../../images/dp_default.jpg'
import {HiMail}  from 'react-icons/hi';
import {RiPhoneFill,RiSettings5Line}  from 'react-icons/ri';
import { notifyError, notifySuccess } from '../components/Popups/toastNotifUtil';
import { ToastContainer } from 'react-toastify';
import '../../css/toast_container.css';
import { Icon } from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';

const MyProfile =()=>{

    const {REACT_APP_HOST_IP} = process.env
    const navigate = useNavigate()
    const [pageState, setPage] = useState(false)
    const[isToggled, setToggle] = useState(false);
    const[showSettings, setShowSettings] = useState(false);
    const[popType, setType] = useState("")
    const[user_logs, setLogs] = useState([])
    const [emptyLogs, setEmptyMessage] = useState("Loading logs...");
    const [students, setStudents] = useState([]);
    const [users, setUsers] = useState([]);
    const [type, setType0] = useState('password')
    const [icon, setIcon] = useState(eyeOff)
    const [type1, setType1] = useState('password')
    const [icon1, setIcon1] = useState(eyeOff)
    const [type2, setType2] = useState('password')
    const [icon2, setIcon2] = useState(eyeOff)
    const [toEdit, setToEdit] = useState('');
    const [toPassCred, setToPassCred] = useState('');


    const { user, setAuth} = useStore();
    
    const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
    const validNumber = new RegExp('^(09|9|639)[0-9]{9}$');

    useEffect(()=>{
       
        fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/user/all",
        {
            method: "GET",
            credentials:'include'
        })
        .then(response => {return response.json()})
        .then(json=>{
            if(json.result.success){
                setUsers(json.result.output) 
            }          
        })
        fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/all",
        {
            method: "GET",
            credentials:'include'
        })
        .then(response => {return response.json()})
        .then(json=>{
            if(json.result.success){
                setStudents(json.result.output)
                setPage(!pageState)
            }          
        })        
    },[user])

    useEffect(()=>{
       
        fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/log/user/"+ user.user_id,
        {
            method: "GET",
            credentials:'include'
        })
        .then(response => {return response.json()})
        .then(json=>{
            if(json.result.success){
                formatLogs(json.result.output)    
            }
            else{
                formatLogs(undefined)
                setEmptyMessage("No logs to display for this user")    
            }         
        })
        
        
    },[pageState])

    const formatLogs = (logs) => {
        if(logs && students && students.length > 0 && users && users.length > 0){
            for (let i = 0; i < logs.length; i++) {
                for (let j = 0; j < students.length; j++) {
                    if(logs[i].subject_entity==="Student" && logs[i].subject_id === students[j].student_id){ 
                        logs[i]['subject_name'] = students[j].first_name +" "+ students[j].last_name
                        break
                    }
                }
                for (let j = 0; j < users.length; j++) {
                    if(logs[i].subject_entity==="User" && logs[i].subject_id === users[j].user_id){ 
                        logs[i]['subject_name'] = users[j].first_name+" "+users[j].last_name
                        break
                    }
                }
            }
            setLogs(logs)
        }
        else{
            setLogs(undefined)
            setEmptyMessage("Loading logs...")
        }
    }
    
    const settings_list=[
        {label:"Change username", value:'username'},
        {label:"Change password", value:'password'},
        {label:"Change email", value:'email'},
        {label:"Change mobile number", value:'number'}
    ]

    const userLogout=()=>{ 
        fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/auth' ,{
            method:'GET',
            credentials:'include'
        })
        .then(response => response.json())
        .then(body => {
            if(!body.success) notifyError(body.message);
            else{
                navigate('/');
                setTimeout(() => {
                    setAuth(null, false);
                }, 500);
            }
        })
    }

    const confirmClicked=()=>{
        if(popType ==='username'){
            let new_uname = document.getElementById('new-username').value
            const username_format = /^[A-Za-z]\w*$/

            if(new_uname ===""){
                notifyError("Warning: field empty! Please input new username!")
            }else if(!new_uname.match(username_format)){
                notifyError("username must start with a letter")
            }else{
                setType('pass-validation');
                setToEdit('username');
                setToPassCred(new_uname);
            }
        } else if(popType==="password"){
                let old_pass = document.getElementById('current-password').value
                let new_pass = document.getElementById("new-password").value
                let confirm_pass = document.getElementById("confirm-password").value
                const password_format = /^(?=.*[-_.!"'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/

                if(!new_pass.match(password_format)){
                    notifyError("password must be at least 8 characters and contains at least 1 upper-case letter, 1 lower-case letter, and a special character");
                }else if(new_pass !== confirm_pass){
                    notifyError("passwords do not match!")
                }else{
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
                            if (json.result.session.silentRefresh) {
                                setAuth(json.result.session.user, json.result.session.silentRefresh)
                            }
                            if(json.result.success){
                                setToggle(!isToggled)
                                notifySuccess(json.result.message)
                                userLogout()
                            }else{
                                notifyError(json.result.message)
                            }})
                }
            }else if(popType==="email"){
                let new_email = document.getElementById('new-email').value;
                
                if(new_email !== ''){
                    if (validEmail.test(new_email)){
                        setType('pass-validation');
                        setToEdit('email');
                        setToPassCred(new_email);
                    } else{
                        notifyError('Invalid email format')
                    }
                } else {
                    notifyError('Email field is missing');
                }
                
            } else if(popType==="number"){
                let new_number = document.getElementById('new-number').value;
                
                if(new_number !== ''){
                    if (validNumber.test(new_number)){
                        setType('pass-validation');
                        setToEdit('number');
                        setToPassCred(new_number);
                    } else{
                        notifyError('Invalid mobile number format');
                    }
                }
                else{
                    notifyError('Mobile number field is missing');
                }
            } else if(popType === 'pass-validation'){
                let pass_validation = document.getElementById('pass-validation').value;
                
                if(toEdit === 'email'){
                    fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/user/'+user.user_id+'/email', {
                        method: 'PATCH', 
                        credentials:'include',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify({
                            password: pass_validation,
                            new_email: toPassCred
                      })
                    }).then(response=>{return response.json()})
                    .then(json=>{
                        if (json.result.session.silentRefresh) {
                            setAuth(json.result.session.user, json.result.session.silentRefresh)
                        }
                        if(json.result.success){
                            setToggle(!isToggled)
                            notifySuccess(json.result.message)
                        }else{
                            notifyError(json.result.message)
                        }})
                } else if (toEdit === 'number'){
                    fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/user/'+user.user_id+'/number', {
                        method: 'PATCH', 
                        credentials:'include',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify({
                            password: pass_validation,
                            new_number: toPassCred
                      })
                    }).then(response=>{return response.json()})
                    .then(json=>{
                        if (json.result.session.silentRefresh) {
                            setAuth(json.result.session.user, json.result.session.silentRefresh)
                        }
                        if(json.result.success){
                            setToggle(!isToggled)
                            notifySuccess(json.result.message)
                        }else{
                            notifyError(json.result.message)
                        }})
                }else if (toEdit === 'username'){
                    fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/user/'+user.user_id+'/username' ,{
                        method: 'PATCH',
                        credentials:'include', 
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify({
                            password: pass_validation,
                            new_username : toPassCred
                        })
                     }).then(response=>{return response.json()})
                        .then(async json=>{
                            if (json.result.session.silentRefresh) {
                                setAuth(json.result.session.user, json.result.session.silentRefresh)
                            }
                            if(json.result.success){
                                setToggle(!isToggled)
                                notifySuccess(json.result.message)
                                userLogout()  
                            }else{
                                notifyError(json.result.message)
                            }
                        })
                }
                
            }
    }

    const cancelClicked=async()=>{
        await setToggle(!isToggled);
        setType("");
    }


    const handleChange=async(foo)=>{
        await setToggle(!isToggled);

        if(foo.value === 'username'){
             setType('username');
        }else if(foo.value ==='password'){
             setType('password');
        }else if (foo.value === 'email'){
            setType('email');
        } else if (foo.value === 'number'){
            setType('number');
        } else {
            setType('');
        }
    }

    const handleSettings = () =>{
        setShowSettings(!showSettings)
    }

    const handleToggle = () => {
        if(type === 'text'){
            setIcon(eyeOff);
            setType0('password');
        } else {
            setIcon(eye);
            setType0('text');
        }
    }

    const handleToggle1 = () => {
       if(type1 === 'text'){
           setIcon1(eyeOff);
           setType1('password'); 
       } else {
           setIcon1(eye);
           setType1('text');
       }
   }

   const handleToggle2 = () => {
    if(type2 === 'text'){
        setIcon2(eyeOff);
        setType2('password'); 
    } else {
        setIcon2(eye);
        setType2('text');
    }
    }

    let body = "";
        // checks what field will be edited by the user before rendering it in the body of the popup
        if(popType === 'username'){
            body = 
            <div> 
                <div  className='username-box'>
                    <p className='change-popup-text'>Change Username</p>
                    <input type="text" className = "setting-fields"id="new-username" placeholder="Enter new username"></input><br/>
                    <div className='popup-buttons'>
                        <button className="cancel" onClick={cancelClicked}>Cancel</button> <button className="confirm" onClick={confirmClicked}>Confirm</button> 
                    </div> 
                </div>               
            </div>
        } else if(popType === 'password'){
            body = 
            <div>
                <div className='password-box'>
                <p className='change-popup-text'>Change Password</p>
                    <input type={type} className = "setting-fields" id="current-password" placeholder="Enter current password"></input><br/>
                    <i onClick={handleToggle} id = "visibilityBtn" className='eyeProfile'><Icon icon = {icon} ></Icon></i>
                    <input type={type1} className = "setting-fields" id="new-password" placeholder="Enter new password"></input><br/>
                    <i onClick={handleToggle1} id = "visibilityBtn" className='eyeProfile'><Icon icon = {icon1} ></Icon></i>
                    <input type={type2} className = "setting-fields" id="confirm-password" placeholder="Confirm new password"></input><br/>
                    <i onClick={handleToggle2} id = "visibilityBtn" className='eyeProfile1'><Icon icon = {icon2} ></Icon></i>
                </div>
                <div className='popup-buttons'>
                    <button className="cancel" onClick={cancelClicked}>Cancel</button><button className="confirm" onClick={confirmClicked}>Confirm</button> 
                </div>
            </div>
        } else if(popType === 'email'){
            body =
            <div> 
                <div  className='username-box'>
                    <p className='change-popup-text'>Change Email</p>
                    <input type="text" className = "setting-fields"id="new-email" placeholder="Enter new email"></input><br/>
                    <div className='popup-buttons'>
                        <button className="cancel" onClick={cancelClicked}>Cancel</button> <button className="confirm" onClick={confirmClicked}>Confirm</button> 
                    </div> 
                </div>               
            </div>
        } else if(popType === 'number'){
            body =
            <div> 
                <div  className='username-box'>
                    <p className='change-popup-text'>Change Mobile Number</p>
                    <span className='number-prompt'>+63</span><input type="number" className = "setting-fields-number" id="new-number" placeholder='9XXXXXXXXX'></input><br/>
                    <div className='popup-buttons'>
                        <button className="cancel" onClick={cancelClicked}>Cancel</button> <button className="confirm" onClick={confirmClicked}>Confirm</button> 
                    </div> 
                </div>               
            </div>
        } else if(popType === 'pass-validation'){
            body =
            <div> 
                <div  className='username-box'>
                    <p>Please enter password</p>
                    <input type="password" className = "setting-fields" id="pass-validation" placeholder="Enter password"></input><br/>
                    <div className='popup-buttons'>
                        <button className="cancel" onClick={cancelClicked}>Cancel</button> <button className="confirm" onClick={confirmClicked}>Confirm</button> 
                    </div> 
                </div>               
            </div>
        }

    let popUp = 
    <div className="settings-popup-box">
        {body}
    </div>
    return(
        <div>
            <div>
            <div className='body'>
            <div className='user-header'>
                <img src = {USER} className = "user-photo" />
                <p className='profile-title'>{user.first_name} &nbsp;{user.last_name}</p> 
                <p className='username'>{user.username}</p>
                <p className='user-role'>{user.user_role}</p>
                <ul className='contact-info'>
                    <li><HiMail size={28} className="contact-icon"/><span>{user.email}</span></li>
                    {user.phone_number? <li style = {{paddingTop:'0px'}}><RiPhoneFill size={28} className="contact-icon"/><span>{user.phone_number}</span></li>:""}
                </ul>
                <button className ="settings-icon" onClick={()=> {handleSettings()}}><RiSettings5Line size={25} /></button>
                {showSettings ?
                    <ul className='settings-box'>
                    {settings_list.map((foo,i)=>{
                        return <button key={i} className='edit-button' onClick={()=>handleChange(foo)}>{foo.label} </button>
                    })}
                    </ul>
                :
                ""}
            </div>
            <br />
            <hr className='profile-line' />
            <p className='user-logs-title'>USER LOGS</p>
            <div className ='view-log-preview' style = {{width: '60%',
                    marginLeft:'20%',
                    height: '35%',}}>
                    {user_logs !== undefined ? 
                    <div className='table-wrap'>
                        <table className='view-log-table'>
                        <thead className='view-log-thead'>
                            <tr className='header-row'>
                                <th className='log-header'>DATE TIME</th>
                                <th className='log-header' >ACTIVITY</th>
                                <th className='log-header' >SUBJECT</th>
                                <th className='log-header' >DETAILS</th>
                            </tr>
                        </thead>
                        <tbody className = 'view-log-tbody'>
                                
                            {user_logs.map((log, i)=>{
                            var time_stamp = log.time_stamp.split(" ")
                            return (
                            <tr className='view-log-element' key={i}>
                            <td className='log-cell' >{time_stamp[0]}<br /> {time_stamp[1]}</td>
                            <td className='log-cell'>{log.activity_type}</td>
                            { log.subject_entity === "User"? <td className='subject-cell' onClick ={()=>{navigate('/user/'+log.subject_id)}}>  <span>{log.subject_name}</span></td>
                                : log.subject_entity === "Student"? <td className='subject-cell' onClick ={()=>{navigate('/student/'+log.subject_id)}}>  <span>{log.subject_name}</span></td>
                                :
                                <td className='subject-cell'>-</td>}
                            <td className='log-cell'> {log.details!==null? log.details:"-"}</td>
                            </tr>)
                            })}
                        </tbody>
                    </table>
                    </div>
                    : 
                    <div className='no-logs'>{emptyLogs}</div>}
                    </div> 
            </div>
            {isToggled===true? popUp:""}
            <Header/>
            <Menu/>
            <Footer/>
        </div>
            <Header/>
            <Menu/>
            <Footer/>
            <ToastContainer className='toast-container'/>
        </div>
    )
}

export default MyProfile;
