/**
 * author: Janica
 */

 import React from 'react';
 import Header from './Header';
 import Footer from './Footer';

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
            display_picture: 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small/profile-icon-design-free-vector.jpg'
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
            <Header/> 
            <div className='add-user-body'>
            <form>
                <h1> Add User </h1>
                <fieldset id="signup-field">
                    First Name: <input type="text" id="first_name" placeholder="Input your first name"></input><br />
                    Last Name: <input type="text" id="last_name" placeholder="Input your last name"></input><br />
                    User Role: <select id="user_role" value={user_role} onChange={handleChange}>
                        <option value="" disabled selected hidden>Choose user role...</option>
                        <option value="chair/head">Chair/Head</option>
                        <option value="ocs_rep">OCS Rep</option>
                        <option value="acs">ACS</option>
                        <option value="unit_rep">Unit Rep</option>
                        <option value="member">Member</option>
                    </select><br />
                    Username: <input type="text" id="username" placeholder="Create a username..." /><br />
                    Password: <input type="password" id="password"placeholder = "Create a password..."/><br />
                    Confirm Password: <input type="password" id="confirm_password" placeholder = "Confirm your password..."/><br />
                    Email: <input type="text" id="email"placeholder = "Input your email"/><br />
                    Phone number: <input type="text" id="phone_number"placeholder = "Enter your phone number"/><br />
                    
                </fieldset>
                <button onClick={readInput}>Create User</button>
                <br></br><span id="result"></span>
            </form>
            </div>
            <Footer/>
    </div> 
    )
}
 
 export default Add_User_Page;