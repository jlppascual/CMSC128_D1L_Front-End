/**
 * author: Janica
 */
 import { useEffect } from 'react'
 import { useNavigate } from 'react-router-dom'
 import useStore from '../hooks/authHook'
 import React, { useState } from 'react';
 import Header from '../components/Header';
 import Footer from '../components/Footer';
 import Menu from '../components/Menu'
 import '../../css/add_users.css'
import { ToastContainer } from 'react-toastify';
import '../../css/toast_container.css';
import { notifyError, notifySuccess } from '../components/Popups/toastNotifUtil';

const Add_User_Page=()=>{

    const {REACT_APP_HOST_IP} = process.env

    const { user, setAuth } = useStore();
    const navigate = useNavigate();     // navigation hook

    const [userRole, setRole] = useState("");

    useEffect(() => {
        if(user.user_role !=="CHAIR/HEAD"){
            navigate("/home")
            notifyError("Must be an admin to access this page")
        }
        
    },)

    const readInput = async (e) =>{
        e.preventDefault();

        let user_details={
            first_name: document.getElementById("first_name").value,
            last_name: document.getElementById("last_name").value,
            user_role: document.getElementById("user_role").value,
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            confirm_password: document.getElementById("confirm_password").value,
            email: document.getElementById("email").value,
            phone_number: document.getElementById("phone_number").value,
            display_picture: 'profile-icon-design-free-vector.jpg',
            user_id:user.user_id
        };

        await sendData(user_details);
    }

    const sendData=(user_details)=>{
        if(user_details.password !== user_details.confirm_password) {
            notifyError("Passwords don't match!")
        } else{
            fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/user', {
                method: 'POST',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(user_details)
            }).then((response) => {return response.json()})
            .then(json =>{
                if (json.result.session.silentRefresh) {
                    setAuth(json.result.session.user, json.result.session.silentRefresh)
                }
                if(json.result.success){
                   notifySuccess(json.result.message)
                   clearInputs();
               }else{
                   notifyError(json.result.message)
               }}
            )
            
        }
     }

     const clearInputs=()=>{
        document.getElementById("first_name").value = ""
        document.getElementById("last_name").value = ""
        document.getElementById("user_role").value = ""
        document.getElementById("username").value = ""
        document.getElementById("password").value = ""
        document.getElementById("confirm_password").value = ""
        document.getElementById("email").value = ""
        document.getElementById("phone_number").value = ""
     }

     const handleChange=()=>{
         setRole(document.getElementById("user_role").value);
     }

    return(
        <div>
            <div className='add-user-body'>
            <form className='signup-field'>
                <h2> Create Account </h2>
                <input type="text" className = "field" id="first_name" placeholder="◯ First Name" required></input><br />
                <input type="text" className = "field" id="last_name" placeholder="◯ Last Name" required></input><br />
                <select className = "rolefield" id="user_role" value={userRole} onChange={handleChange}>
                    <option value=""disabled defaultValue hidden >▽ User Role</option>
                    <option value="ocs rep">OCS Rep</option>
                    <option value="acs">ACS</option>
                    <option value="unit rep">Unit Rep</option>
                    <option value="member">Member</option>
                </select><br />
                <input type="text" className = "field" id="username" placeholder="◯ Username" required /><br />
                <input type="password" className = "field" id="password"placeholder = "◯ Password" required/><br />
                <input type="password" className = "field" id="confirm_password" placeholder = "◯ Confirm Password" required/><br />
                <input type="text" className = "field" id="email"placeholder = "◯ Email" required/><br />
                <input type="text" className = "field" id="phone_number"placeholder = "◯ Phone Number"/><br />
                <div className='create-user-buttons'>
                    <input type="reset" value="Reset" className='reset-button'/>
                    <input type="submit" value="Confirm" className='confirm-button' onClick={readInput}/>
                </div>
            </form>
            </div>
            <Menu/>
            <Header />
            <ToastContainer className='toast-container' />
            <Footer/>
    </div> 
    )
}

export default Add_User_Page;