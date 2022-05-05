/**
 * author: Andrew
 */

 import React from 'react';
 import Header from './Header';
 import Footer from './Footer';
 import {BsSearch}  from 'react-icons/bs';
 import {AiFillDelete} from 'react-icons/ai';
 
 class View_Logs extends React.Component{
     constructor(props){
         super(props);
 
         this.state = {
             name: '',
             logs: []
         }
     }
 
     componentDidMount(){
         fetch("http://localhost:3001/api/0.1/log",
         {
             method: "GET"
         })
         .then(response => {return response.json()})
         .then(json=>{
             if(json.result.success){
                 this.setState({logs:json.result.output})
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

     /*
     handleSubmit = (e) => {
         e.preventDefault();
         if(this.state.name === ""){
             this.componentDidMount();
         } else {
         fetch('http://localhost:3001/api/0.1/log/search?name=' + this.state.name)
         .then((response) => {return response.json()})
         .then(json => {
             if(json.result.success){
                 this.setState({logs:json.result.output});
                 console.log(json.result.output)  // Contains the list of match logs
             }
             else{
                 console.log(json.result.message) // Message: No results found
             }
         })}
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
     */
 
     render(){
        return(
            <div>
                <Header/> 
                <div classname='view-logs-body'>
                <form>
                    <h1> View logs </h1>
                     {/* Search Log: <input type = "text" name = "name" placeholder = "Search by Name"
                     value = {this.state.name} onChange = {this.handleUserInput} required></input>
                     <button onClick={this.handleSubmit}><i ><BsSearch /></i></button> */}
                     <input type="text" id="user"></input> 
                </form>
                     {this.state.logs != [] ? this.state.logs.map((log, i)=>{
                         var timestamp = log.time_stamp.replace("T", " ").replace("Z", " ");
                         return <span key={i}><div className="log-tile">{i+1}. {timestamp} {log.activity_type}: {log.details}
                      {/* <button onClick={()=>{this.onDelete({log})}}><AiFillDelete/></button> */}
                     </div></span>
                     }): ""}
                </div>
                <Footer/>
        </div> 
        )
    }
 }
 
 export default View_Logs;
 