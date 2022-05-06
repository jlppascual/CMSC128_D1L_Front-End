/**
 * author: Janica
 */

 import React, { useState } from 'react';
 import Header from '../components/Header';
 import Footer from '../components/Footer';
 import '../../css/add_users.css'

const Add_User_Page=()=>{
    let user_role = "";

    const readInput = async (e) =>{
        e.preventDefault();
        document.getElementById("result").innerHTML = document.getElementById("username").value + " " + document.getElementById("password").value;

            let user_details={
            first_name: document.getElementById("first_name").value,
            last_name: document.getElementById("last_name").value,
            user_role: document.getElementById("user_role").value,
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            confirm_password: document.getElementById("confirm_password").value,
            email: document.getElementById("email").value,
            phone_number: document.getElementById("phone_number").value,
            display_picture: 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small/profile-icon-design-free-vector.jpg',
            user_id:'d545afff-ca32-11ec-b248-98fa9bd5dc59'
        };

        await sendData(user_details);
        // alert("User has been created!");
     }

    const sendData=(user_details)=>{
         fetch('http://localhost:3001/api/0.1/user', {
             method: 'POST',
             headers:{
                 'Content-Type':'application/json'
             },
             body: JSON.stringify(user_details)
         }).then((response) => {return response.json()})
         .then(json => console.log(json.result.message))
     }

     const handleChange=()=>{
         user_role = document.getElementById("user_role").value;
     }

    return(
        <div>
            <div className='add-user-body'>
            <form className='signup-field'>
                <h2> Create Account </h2>
                    <input type="text" id="field" placeholder="🔘 First Name"></input><br />
                    <input type="text" id="field" placeholder="🔘 Last Name"></input><br />
                    <select id="rolefield" value={user_role} onChange={handleChange}>
                        <option value="" disabled selected hidden>🔽 User Role</option>
                        <option value="ocs_rep">OCS Rep</option>
                        <option value="acs">ACS</option>
                        <option value="unit_rep">Unit Rep</option>
                        <option value="member">Member</option>
                    </select><br />
                    <input type="text" id="field" placeholder="🔘 Username" /><br />
                    <input type="password" id="field"placeholder = "🔘 Password"/><br />
                    <input type="password" id="field" placeholder = "🔘 Confirm Password"/><br />
                    <input type="text" id="field"placeholder = "🔘 Email"/><br />
                    <input type="text" id="field"placeholder = "🔘 Phone Number"/><br />
                    <input type="submit" value="Confirm" className='confirm-button' onClick={readInput}/>
                    <input type="reset" value="Reset"className='reset-button'/>
                <br></br><span id="result"></span>
            </form>
            </div>
            <Header />
            <Footer/>
    </div> 
    )
}

export default Add_User_Page;