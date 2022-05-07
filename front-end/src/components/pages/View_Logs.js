/**
 * author: Andrew
 */

 import React, { useState, useEffect} from 'react';
 import { BsSearch } from 'react-icons/bs';
 import Header from '../components/Header';
 import Footer from '../components/Footer';
 import Menu from '../components/Menu'
 import '../../css/view_logs.css'
 
 const View_Logs=()=>{
     const[input, setInput] = useState("");
     const[logs, changeLogs] = useState([]);

     useEffect(()=>{
        fetch("http://localhost:3001/api/0.1/log",
        {
            method: "GET",
            credentials:'include'
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
        setInput(value);
    }

    return(
        <div>
            <div className='view-logs-body'>
                <div className='view-logs'>
                    <form>
                    <p className="log-title">User Logs</p>
                    <hr className='line'></hr>
                        <div className='view-logs-header'></div>
                        {/* <div className='"search-field'><input type="text" name="input" placeholder="🔎 Search log"
                             value = {input} onChange = {handleUserInput} className = "user-search" required></input>
                              <button onClick={handleSubmit} className = "search-button"><i className = "icon"><BsSearch /></i></button></div> */}
                    </form>
                    <div className ='view-log-preview'>
                        <table className='view-log-table'>
                        <thead className='view-log-thead'>
                            <tr>
                            <th className='user-header'>USER</th>
                                <th className='time-header'>TIME</th>
                                <th className='activity-header'>ACTIVITY</th>
                                <th className='details-header'>DETAILS</th>
                            </tr>
                        </thead>
                        <tbody className = 'view-log-tbody'>
                            {logs != [] ? logs.map((log, i)=>{
                                var timestamp = log.time_stamp.replace("T", " ").replace("Z", " ");
                                return (
                                <tr className='view-log-element'>
                                <span key={i}><td className="user-cell">{i+1}. {log.user_id} </td>
                                <td className='time-cell'>{timestamp}</td>
                                <td className='activity-cell'>{log.activity_type}</td>
                                <td className='details-cell'> {log.details!==null? log.details:""}</td>
                                </span>
                                </tr>)
                            }): <div className='no-logs'> No logs existing </div>}
                            </tbody>
                        </table>
                    </div> 
                </div>
            </div>
            <Header/> 
            <Menu />
            <Footer/>
    </div> 
    )

 }
 export default View_Logs;
 