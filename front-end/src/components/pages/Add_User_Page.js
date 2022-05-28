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
import { Icon } from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';
import dp_default from '../../images/user_dp/dp_default.jpg'

const Add_User_Page=()=>{

    const {REACT_APP_HOST_IP} = process.env

    const { user, setAuth } = useStore();
    const navigate = useNavigate();     // navigation hook

    const [userRole, setRole] = useState("");
    const [fileName, setfileName] = useState("");
    const [fileData, setFileData] = useState();

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
            display_picture: fileName,
            user_id:user.user_id
        };

        await sendData(user_details);
    }

    const fileChangeHandler = (e) => {
        setFileData(e.target.files[0]);
        setfileName(e.target.files[0].name)
    };

    const sendData=(user_details)=>{
        // Handle File Data from the state Before Sending
        const pic = new FormData();
        pic.append("image", fileData);

        fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/user/photo', {
            credentials:'include',
            method: "POST",
            body: pic,
        })
        .then((result) => {
            console.log("File Sent Successful");
        })
        .catch((err) => {
            console.log(err.message);
        });

        const password_format = /^(?=.*[-_.!"'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/
        const username_format = /^[A-Za-z]\w*$/
        const mail_format = /^[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*@[a-zA-Z]+([.-]?[a-zA-Z0-9]+)*(.[a-zA-Z]{2,3})+$/
        const phone_format = /^\+639[0-9]{9,}$/
        if(user_details.first_name === ""){
            notifyError("missing first name")
        }else if(user_details.last_name === "") {
            notifyError("missing last name")
        } else if(user_details.password === "") {
            notifyError("missing password")
        } else if(user_details.user_role === "") {
            notifyError("please select a user role")
        } else if(user_details.user_name === "") {
            notifyError("missing username")
        } else if(user_details.email === "") {
            notifyError("missing email")
        } else if(user_details.phone_number !== "" && user_details.phone_number !== undefined) {
            if(!user_details.phone_number.match(phone_format)){notifyError("please follow +639XXXXXXXXX format")};
        } else if(!user_details.username.match(username_format)){
            notifyError("username must start with a letter")
        }else if(!user_details.email.match(mail_format)){
            notifyError("invalid mail")
        }else if(!user_details.password.match(password_format)){
            notifyError("password must be at least 8 characters and contains at least 1 upper-case letter, 1 lower-case letter, and a special character");
        }else if(user_details.password !== user_details.confirm_password){
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

    const [type, setType] = useState('password')
    const [icon, setIcon] = useState(eyeOff)
    const [type1, setType1] = useState('password')
    const [icon1, setIcon1] = useState(eyeOff)


    const handleToggle = () => {
        if(type === 'text'){
            setIcon(eyeOff);
            setType('password');
        } else {
            setIcon(eye);
            setType('text');
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

    return(
        <div>
            <div className='add-user-body'>
            <form className='signup-field'>
                <h2> Create Account </h2>
                <input type="text" className = "field" id="first_name" placeholder="◯ First Name" required></input><br />
                <input type="text" className = "field" id="last_name" placeholder="◯ Last Name" ></input><br />
                <select className = "rolefield" id="user_role" value={userRole} onChange={handleChange}>
                    <option value=""disabled defaultValue hidden >▽ User Role</option>
                    <option value="ocs rep">OCS Rep</option>
                    <option value="acs">ACS</option>
                    <option value="unit rep">Unit Rep</option>
                    <option value="member">Member</option>
                </select><br />
                <input type="text" className = "field" id="username" placeholder="◯ Username" required /><br />
                <i onClick={handleToggle}id = "visibilityBtn" className='eyeUsers'><Icon icon = {icon} ></Icon></i>
                <input type={type} className = "field" id="password"placeholder = "◯ Password"/><br />
                <i onClick={handleToggle1}id = "visibilityBtn" className='eyeUsers'><Icon icon = {icon1} ></Icon></i>
                <input type={type1} className = "field" id="confirm_password" placeholder = "◯ Confirm Password" /><br />
                <input type="text" className = "field" id="email"placeholder = "◯ Email"/><br />
                <input type="text" className = "field" id="phone_number"placeholder = "◯ Phone Number [+639XXXXXXXXX]"/><br />
                <input type="file" accept=".png, .jpg, .jpeg" name="image" onChange={fileChangeHandler} />
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