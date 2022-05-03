/**
 * author: Janica, Andrew
 */

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import {BsSearch}  from 'react-icons/bs';
import {AiFillDelete} from 'react-icons/ai';

class View_Users_Page extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            name: '',
            users: []
        }
    }

    componentDidMount(){
        fetch("http://localhost:3001/api/0.1/user",
        {
            method: "GET"
        })
        .then(response => {return response.json()})
        .then(json=>{
            this.setState({users:json.result.output})
        })
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        this.setState({[name]: value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/0.1/user/search?name=' + this.state.name)
        .then((response) => {return response.json()})
        .then(json => {
            if(json.result.success){
                this.setState({users:json.result.output});
                console.log(json.result.output)  // Contains the list of match users
            }
            else{
                console.log(json.result.message) // Message: No results found
            }
        })
    }
    onDelete(user){
        let user_id = user.user.user_id
        fetch('http://localhost:3001/api/0.1/user/'+ user_id,{
            method: "DELETE",
            headers:{
                'Content-Type':'application/json'
            }
        }).then(response =>{ return response.json()})
        .then(json=>{
            console.log(json)
            if(json.result.success){
                this.componentDidMount();
            }
        })
    }

    render(){
       return(
           <div>
               <Header/> 
               <div classname='view-users-body'>
               <form>
                   <h1> View Users </h1>
                    Search User: <input type = "text" name = "name" placeholder = "Search by Name"
                    value = {this.state.name} onChange = {this.handleUserInput} required></input>
                    <button onClick={this.handleSubmit}><i ><BsSearch /></i></button>
               </form>
                    {this.state.users != [] ? this.state.users.map((user, i)=>{
                        return <span key={i}><div className="user-tile">{i+1}. {user.username}, {user.user_role}, {user.privileges}
                        <button onClick={()=>{this.onDelete({user})}}><AiFillDelete/></button></div></span>
                    }): ""}
               </div>
               <Footer/>
       </div> 
       )
   }
}

export default View_Users_Page;
