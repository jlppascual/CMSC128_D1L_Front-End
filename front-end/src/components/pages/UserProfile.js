import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Menu from '../components/Menu'
import useStore from '../hooks/authHook'
import '../../css/profile.css'
import USER from '../../images/dp_default.jpg'
import {HiMail}  from 'react-icons/hi';
import {RiPhoneFill}  from 'react-icons/ri';
import {BiArrowBack} from 'react-icons/bi'


const UserProfile =()=>{

    const {REACT_APP_HOST_IP} = process.env
    const { user, setAuth } = useStore();
    const navigate = useNavigate();     // navigation hook

    const [user_profile, setUserProfile] = useState('')
    const [user_logs, setUserLogs] = useState([])
    
    useEffect(()=>{
        if(user.user_role==="CHAIR/HEAD"){
            const link = window.location.href
            const id = link.slice(link.lastIndexOf('/')+1,link.length)
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/user/"+ id,
            {
                method: "GET",
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                setUserProfile(json.result.output)
                if(json.result.session){
                    setAuth(user,json.result.session)
                }            
            })
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/log/user/"+ id,
            {
                method: "GET",
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                if (json.result.session.silentRefresh) {
                    setAuth(json.result.session.user, json.result.session.silentRefresh)
                }

                setUserLogs(json.result.output)
                if(json.result.session){
                    setAuth(user,json.result.session)
                }            
            })
        }else{
            navigate("/home")
            alert("Must be an admin to access this page")
        }
    },[user])

    return(
        <div>
            <div className='body'>
            <div className='user-header'>
            <i className = "back-icon" onClick={()=> navigate('/users')} style={{top:"20px",left:"20%"}}><BiArrowBack size= {35} /></i>
                <img src = {USER} className = "user-photo" />
                <p className='profile-title'>{user_profile.first_name} {user_profile.last_name}</p>
                <p className='username'>{user_profile.username}</p>
                <p className='user-role'>{user_profile.user_role}</p>
                <ul className='contact-info'>
                    <li><HiMail size={28} className="contact-icon"/><span>{user_profile.email}</span></li>
                    {user_profile.phone_number? <li style = {{paddingTop:'0px'}}><RiPhoneFill size={28} className="contact-icon"/><span>{user_profile.phone_number}</span></li>:""}
                </ul>
                
            </div>
            <br />
            <hr className='profile-line' />
            <p className='user-logs-title'>USER LOGS</p>
            <div className ='view-log-preview' style = {{width: '60%',
                    marginLeft:'20%',
                    height: '40%',
                    backgroundColor: '#ebebeb'}}>
                    {user_logs !== undefined ? 
                    <div className='table-wrap'>
                        <table className='view-log-table'>
                        <thead className='view-log-thead'>
                            <tr className='header-row'>
                                <th className='log-header' style={{backgroundColor: '#ebebeb'}}>DATE TIME</th>
                                <th className='log-header' style={{backgroundColor: '#ebebeb'}}>ACTIVITY</th>
                                <th className='log-header' style={{backgroundColor: '#ebebeb'}}>SUBJECT</th>
                                <th className='log-header' style={{backgroundColor: '#ebebeb'}}>DETAILS</th>
                            </tr>
                        </thead>
                        <tbody className = 'view-log-tbody'>
                                
                                {user_logs.map((log, i)=>{
                                var time_stamp = log.time_stamp.split(" ")
                                return (
                                <tr className='view-log-element' key={i}>
                                <td className='log-cell'>{time_stamp[0]}<br /> {time_stamp[1]}</td>
                                <td className='log-cell'>{log.activity_type}</td>
                                <td className='log-cell'> {log.subject_entity!==null? log.subject_entity:"-"}</td>
                                <td className='log-cell'> {log.details!==null? log.details:"-"}</td>
                               
                                </tr>)
                                })}
                            </tbody>
                        </table>
                        {/* <p>{user_logs.length}</p> */}
                    </div>
                    : 
                    <div className='no-logs'>No logs to display </div>}
                    </div> 
            </div>
            <Header/>
            <Menu/>
            <Footer/>
        </div>
    )
}

export default UserProfile;