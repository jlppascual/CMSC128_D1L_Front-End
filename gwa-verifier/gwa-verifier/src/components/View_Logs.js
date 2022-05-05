/**
 * author: Andrew
 */

 import React from 'react';
 import Header from './Header';
 import Footer from './Footer';
 
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
 
     render(){
        return(
            <div>
                <Header/> 
                <div classname='view-logs-body'>
                <form>
                    <h1> View logs </h1>
                     <input type="text" id="user"></input> 
                </form>
                     {this.state.logs != [] ? this.state.logs.map((log, i)=>{
                         var timestamp = log.time_stamp.replace("T", " ").replace("Z", " ");
                         return <span key={i}><div className="log-tile">{i+1}. {log.user_id} {timestamp} {log.activity_type}: {log.details}
                     </div></span>
                     }): ""}
                </div>
                <Footer/>
        </div> 
        )
    }
 }
 
 export default View_Logs;
 