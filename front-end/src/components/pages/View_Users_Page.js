import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {BsSearch}  from 'react-icons/bs';
import {VscSettings}  from 'react-icons/vsc';
import '../../css/view_users.css'

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
            if(json.result.success){
                this.setState({users:json.result.output})
            }else{
                alert(json.result.message)
            }
        })
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        this.setState({[name]: value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.name === ""){
            this.componentDidMount();
        } else {
        fetch('http://localhost:3001/api/0.1/user/search?name=' + this.state.name)
        .then((response) => {return response.json()})
        .then(json => {
            if(json.result.success){
                this.setState({users:json.result.output});
                console.log(json.result.output)  // Contains the list of match users
            }
            else{
                alert("User not found!")
                console.log(json.result.message) // Message: No results found
            }
        })}
    }

    onDelete(user){
        console.log(user)
        let user_id = user.user.user_id
        fetch('http://localhost:3001/api/0.1/user/'+ user_id+'/d545afff-ca32-11ec-b248-98fa9bd5dc59',{
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
               <div className="view-users-body">
               <form>
                   <p className="user-title">Accounts</p>
                   <div className="search-field">
                       <input type = "text" name = "name" placeholder = "🔎 Search by name"
                       value = {this.state.name} onChange = {this.handleUserInput} className = "user-search" required></input>
                       <button onClick={this.handleSubmit} className = "search-button"><i className = "icon"><VscSettings /></i></button>
                   </div>
               </form>
               {this.state.users != [] ? this.state.users.map((user, i) => {
                       if (i % 2 === 0) {
                           return <span key={i}>
                               <div className="user-tile">
                                   {user.last_name} <br></br>{user.first_name}<br></br> {user.user_role}
                               <button onClick={()=>{this.onDelete({user})}} className = "delete-button">Remove</button>
                               </div>
                           </span>
                       } else {
                           return <span key={i}>
                               <div className="user-odd-tile">
                                   {user.last_name} <br></br>{user.first_name}<br></br> {user.user_role}
                               <button onClick={()=>{this.onDelete({user})}} className = "delete-button">Remove</button>
                               </div>
                           </span>
                       }
               }): ""}
               </div>
               <Header />
               <Footer/>
       </div> 
       )
    }
}

export default View_Users_Page;