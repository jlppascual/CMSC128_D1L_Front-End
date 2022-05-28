import React, { useEffect, useState, useRef } from 'react';
import Footer from '../components/Footer';
import UPLB from '../../images/uplb.png';
import Logo from '../../images/asteris-logo.webp'
import { notifyError } from '../components/Popups/toastNotifUtil';
import { ToastContainer } from 'react-toastify';
import { notifySuccess } from '../components/Popups/toastNotifUtil';
import '../../css/forgotpassword.css'
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () =>{
    const {REACT_APP_HOST_IP} = process.env;
    const [otpClicked, setOTPClicked] = useState(false);
    const navigate = useNavigate();

    const submitChange=()=>{
        const password_format = /^(?=.*[-_.!"'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/
        let local_email = document.getElementById('email-field').value;
        let new_pass = document.getElementById('newpassword-field').value
        let conf_pass = document.getElementById('confpassword-field').value
        let local_otp = document.getElementById('otp-field').value
        console.log(new_pass, conf_pass, local_email)

        if(!new_pass || !conf_pass || !local_otp){
            notifyError('Please complete fields')
        }else if(!new_pass.match(password_format)){
            notifyError("password must be at least 8 characters and contains at least 1 upper-case letter, 1 lower-case letter, and a special character");
        }else if(new_pass !== conf_pass){
            notifyError("Passwords do not match!")
        }else{
            fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/user/password/reset',{
                method: 'POST',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    email: local_email,
                    new_password: new_pass,
                    otp: local_otp
                })
            }).then(response=>{return response.json()})
            .then(json=>{
                if(json.success){
                    notifySuccess(json.message)
                }else(
                    notifyError(json.message)
                )
            })

        }
        
    }
    const fetchOTP=async()=>{ 
        await setOTPClicked(true)
        let local_email = document.getElementById('email-field').value;
        console.log(local_email)
        if(local_email === '' || local_email === undefined){
            notifyError("please input your email")
        }else{
            fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/auth/otp',{
                method: 'POST',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({email: local_email})
                
            }).then(response => {return response.json()})
            .then(json=>{notifySuccess(json.message)})
        }
    }

    return(
        <div>
            <div className='outer-container'>
                <div className='header'>
                    <p><img src={Logo} alt="" className='asteris-logo-login'/></p>
                    <img src = {UPLB} id="uplb-logo" alt="UPLB logo"/>
                    <div className='text-header'>
                        <p className="univ-name">UNIVERSITY OF THE PHILIPPINES LOS BAÑOS</p>
                        <p className="college-name">College of Arts and Sciences</p>
                        
                    </div>     
                </div>

                <div className='reset-box'>
                    <p className='box-header'>Password Reset</p>
                    <hr/>
                    <div className='email-box'>
                        <p> Please enter your email address to reset your password</p> 
                        <input type='text' id='email-field' className='email-reset' placeholder='Enter your email address'/>
                        <button className='otp-button' onClick={fetchOTP}>Get OTP</button>
                    </div>
                    <hr/>
                    <div className='reset-pass-box'>
                        <div><b>Password:</b><input type='text' id='newpassword-field' className='fields-reset' placeholder='Enter new password'/><br/></div>
                        <div><b>Confirm Password:</b><input type='text' id='confpassword-field' className='fields-reset' placeholder='Confirm new password'/><br/></div>
                        <div><b>OTP:</b><input type='text' id='otp-field' className='fields-reset' placeholder='Enter OTP'/><br/></div>
                    </div>
                    <div className='reset-buttons'>
                        <button className='cancel-button' onClick={()=>{navigate('/')}}>Cancel</button>
                        {otpClicked? (<button className='sub-button' onClick={submitChange}>Reset Password</button>)
                        :((<button className='disabled-sub-button'>Reset Password</button>))
                        }
                    </div>   
                </div>
            </div>
            <ToastContainer className='toast-container'/>
            <Footer/>
        </div>
    )

}

export default ForgotPassword;