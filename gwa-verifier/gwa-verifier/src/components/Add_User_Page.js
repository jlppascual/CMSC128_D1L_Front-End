/**
 * author: Janica
 */

import React from 'react';
import Header from './Header';
import Footer from './Footer';

class Add_User_Page extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
        }

        this.readInput = this.readInput.bind(this);
    }

    readInput = async (e) =>{
       e.preventDefault();
       document.getElementById("result").innerHTML = document.getElementById("username").value + " " + document.getElementById("password").value;
       alert("User has been created!");
    }

    render(){
       return(
           <div>
               <Header/> 
               <div classname='add-user-body'>
               <form>
                   <h1> Add User </h1>
                   <fieldset id="signup-field">
                       Username: <input type="text" id="username" 
                       placeholder="Create a username..." 
                       /><br />
                       Password: <input type="password" id="password"
                       placeholder = "Create a password..."/>
                   </fieldset>
                   <button onClick={this.readInput}>Create User</button>
                   <br></br><span id="result"></span>
               </form>
               </div>
               <Footer/>
       </div> 
       )
   }
}

export default Add_User_Page;