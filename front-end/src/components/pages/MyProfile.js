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


    const { user, setAuth} = useStore();
 
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
        {label:"Change password", value:'password'}
    ]

    const userLogout=()=>{ 
        
        fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/auth' ,{
            method:'GET',
            credentials:'include'
        })
        .then(response => response.json())
        .then(body => {
            if(!body.success) alert(body.message);
            else{
                navigate('/');
                setAuth(null, false)
            }
        })
    }

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
                        if (json.result.session.silentRefresh) {
                            setAuth(json.result.session.user, json.result.session.silentRefresh)
                        }

                        if(json.result.success){
                            setToggle(!isToggled)
                            alert(json.result.message)
                            userLogout()
                            
                        }else{
                            alert(json.result.message)
                        }
                    })
            }
        }else{
            if(popType==="password"){
                let old_pass = document.getElementById('current-password').value
                let new_pass = document.getElementById("new-password").value
                let confirm_pass = document.getElementById("confirm-password").value

                if(new_pass === confirm_pass){
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
                                alert(json.result.message)
                                userLogout()
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
            <div className="settings-popup-box">
                 {props.type === 'username'? (
                <div> 
                    <div  className='username-box'>
                            <p>Change Username</p>
                            <input type="text" className = "setting-fields"id="new-username" placeholder="Enter new username"></input><br/>
                            <div className='popup-buttons'>
                            <button className="cancel" onClick={cancelClicked}>Cancel</button> <button className="confirm" onClick={confirmClicked}>Confirm</button> 
                        </div> 
                        </div>
                                       
                    </div>
                ) : (
                <div>
                    <div className='password-box'>
                    <p>Change Password</p>
                        <input type="password" className = "setting-fields" id="current-password" placeholder="Enter current password"></input><br/>
                        <input type="password" className = "setting-fields" id="new-password" placeholder="Enter new password"></input><br/>
                        <input type="password" className = "setting-fields" id="confirm-password" placeholder="Confirm new password"></input><br/>
                    </div>
                    <div className='popup-buttons'>
                        <button className="cancel" onClick={cancelClicked}>Cancel</button><button className="confirm" onClick={confirmClicked}>Confirm</button> 
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

    const handleSettings = () =>{
        setShowSettings(!showSettings)
    }

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
            {isToggled===true? <Popup type={popType}/>:""}
            <Header/>
            <Menu/>
            <Footer/>
        </div>

            <Header/>
            <Menu/>
            <Footer/>
        </div>
    )
}

export default MyProfile;