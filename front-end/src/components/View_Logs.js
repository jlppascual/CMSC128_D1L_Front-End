/**
 * author: Andrew
 */

 import React, { useState, useEffect} from 'react';
 import Header from './Header';
 import Footer from './Footer';
 
 const View_Logs=()=>{
     const[name, changeName] = useState('');
     const[logs, changeLogs] = useState([]);

     useEffect(()=>{
        fetch("http://localhost:3001/api/0.1/log",
        {
            method: "GET"
        })
        .then(response => {return response.json()})
        .then(json=>{
            if(json.result.success){
                changeLogs(json.result.output)
            }else{
                alert(json.result.message)
            }
        })
     })

    const handleUserInput = (e) => {
        const value = e.target.value;
        changeName(value);
    }

    return(
        <div>
            <Header/> 
            <div className='view-logs-body'>
            <form>
                <h1> View logs </h1>
                 <input type="text" id="user"></input> 
            </form>
                 {logs != [] ? logs.map((log, i)=>{
                     var timestamp = log.time_stamp.replace("T", " ").replace("Z", " ");
                     return <span key={i}><div className="log-tile">{i+1}. {log.user_id} {timestamp} {log.activity_type}: {log.details}
                 </div></span>
                 }): ""}
            </div>
            <Footer/>
    </div> 
    )

 }
 export default View_Logs;
 