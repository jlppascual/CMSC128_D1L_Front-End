/**
 * author: Andrew
 */

 import React, { useState, useEffect} from 'react';
 import { useNavigate } from 'react-router-dom';
 import Header from '../components/Header';
 import Footer from '../components/Footer';
 import Menu from '../components/Menu'
 import useStore from '../hooks/authHook';
 import '../../css/view_logs.css'
import { BsSearch, BsDownload } from 'react-icons/bs';
 
 const View_Logs=()=>{

    const {REACT_APP_HOST_IP} = process.env
    const navigate = useNavigate();
    const [pageState, setPage] = useState(false)
    const [input, setInput] = useState("");
    const [downloadLink, setDownloadLink] = useState('')
    const [logs, changeLogs] = useState([]);
    const [viewValue, setViewValue] = useState("");
    const [activity, setActivity] = useState("");
    const [users,setUsers] = useState([]);
    const [students, setStudents] = useState([]);
    const [chosenUser, setChosenUser] = useState("");
    const [emptyLogs, setEmptyMessage] = useState("");
    const { user, setAuth } = useStore();
    

    const view_options = [
        {label: "ALL", value: "all" },
        {label: "ACTIVITY" , value: "activity" },
        {label: "USER" , value: "user" }

    ];

    const activities = [
        {label: "USER LOGIN", value: "User%20logged%20in"},
        {label: "CREATE USER", value: "Created%20a%20user%20account"},
        {label: "DELETE USER", value: "Deleted%20a%20user%20account"},
        {label: "CHANGE USERNAME", value: "Changed%20user%20username"},
        {label: "CHANGE PASSWORD", value: "Changed%20user%20password"},
        {label: "ADD STUDENT", value: "Added%20a%20student%20record"},
        {label: "EDIT STUDENT", value: "Edited%20a%20student%20record"},
        {label: "DELETE STUDENT", value: "Deleted%20a%20student%20record"},
        {label: "ADDED USER", value: "Created%20a%20user%20account"},

    ]

     useEffect(()=>{
        
        if(user.user_role === "CHAIR/HEAD"){
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/user/all",
                {
                    method: "GET",
                    credentials:'include'
                })
                .then(response => {return response.json()})
                .then(json=>{
                    if(json.result.success){
                        formatUsers(json.result.output)
                        
                    }
                            
                })
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/all",
            {
                method: "GET",
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                setStudents(json.result.output)
                setPage(!pageState);
                
            })
        }else{
            navigate('/home')
            alert("Must be an admin to access this page")
        }
        
     },[user])

     //create a text file of logs
     useEffect(()=>{
         console.log("here")
         makeTextFile()
         
     },[logs])

    

     useEffect(()=>{
        
        fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/log",
        {
            method: "GET",
            credentials:'include'
        })
        .then(response => {return response.json()})
        .then(json=>{
            if (json.result.session.silentRefresh) {
                setAuth(json.result.session.user, json.result.session.silentRefresh)
            }

            if(json.result.success){
                formatLogs(json.result.output)
            }else{
                setEmptyMessage(json.result.message)
                
            }
        })
     },[pageState])

     useEffect(()=>{

        if (viewValue==="user"){
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/log/user/"+chosenUser,
            {
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                if (json.result.session.silentRefresh) {
                    setAuth(json.result.session.user, json.result.session.silentRefresh)
                }
                if(json.result.success){
                    formatLogs(json.result.output)
                }else{
                    formatLogs(undefined)
                    setEmptyMessage(json.result.message)
                }
            })
        }else if(viewValue==="activity"){
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/log/activity/"+activity,
            {
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                if (json.result.session.silentRefresh) {
                    setAuth(json.result.session.user, json.result.session.silentRefresh)
                }
                if(json.result.success){
                    formatLogs(json.result.output)
                }else{
                    formatLogs(undefined)
                    setEmptyMessage(json.result.message)
                }
            })
        }else{
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/log",
            {
                method: "GET",
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                if (json.result.session.silentRefresh) {
                    setAuth(json.result.session.user, json.result.session.silentRefresh)
                }
                if(json.result.success){
                    formatLogs(json.result.output)
                }else{
                    formatLogs(undefined)
                    setEmptyMessage(json.result.message)
                }
            })
        }
        },[viewValue, activity, chosenUser]);

        
        const formatUsers = (users) =>{
            let user_list = []
            if(users !== []){
                users.forEach(user => {
                    user_list.push({
                        label: user.first_name+" "+user.last_name,
                        value: user.user_id})
                });
            }
            setUsers(user_list)
        }
    
        const formatLogs = (logs) => {
            if(logs && students && users){
                for (let i = 0; i < logs.length; i++) {
                    for (let j = 0; j < students.length; j++) {
                        if(logs[i].subject_entity==="Student" && logs[i].subject_id === students[j].student_id){ 
                            logs[i]['subject_name'] = students[j].first_name +" "+ students[j].last_name
                            break
                        }
                    }
                    for (let j = 0; j < users.length; j++) {
                        if(logs[i].user_id === users[j].value){ 
                            logs[i]['user_name'] = users[j].label
                        }
                        if(logs[i].subject_entity==="User" && logs[i].subject_id === users[j].value){ 
                            logs[i]['subject_name'] = users[j].label
                        }
                    }
                }
            }
            changeLogs(logs)
        }
    
        const viewChange=(e)=>{
            e.preventDefault();
            setViewValue(e.target.value);
        }
    
    
        const handleUserInput=(e)=>{
            setInput(e.target.value);
        }
    
        const handleActivity=(e)=>{
            setActivity(e.target.value);
        }
    
        const handleUser=(e)=>{
            setChosenUser(e.target.value);
        }
    
        const makeTextFile=()=>{
            let data=[];
    
            {logs != undefined ? (
                logs.map((log, i)=>{
                    var user_name = log.user_name
                    var subject_name = (log.subject_name? log.subject_name:"")
                    var details = (log.details!==null? log.details:"")
                    data.push(i+1 + ". " + user_name +"    "+ log.time_stamp + "    " + log.activity_type + "    " +subject_name+ "    "+ details+"\n")
                })
            ):("")}
    
            const file = new Blob([data.join("\n")],{type:"text/plain"});
            // this part avoids memory leaks
            if (downloadLink !== '') window.URL.revokeObjectURL(downloadLink)
    
            // update the download link state
            setDownloadLink(window.URL.createObjectURL(file))
        }
    
        const handleSubmit=()=>{
            if (input != ""){
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/log/date/"+ input,
                {
                    method: 'GET',
                    credentials:'include'
                }).then(response => {return response.json()})
                .then(json=>{
                    if (json.result.session.silentRefresh) {
                        setAuth(json.result.session.user, json.result.session.silentRefresh)
                    }

                    if(json.result.success){
                        formatLogs(json.result.output)
                    }else{
                        formatLogs(undefined)
                        setEmptyMessage(json.result.message)
                    }
                })
            }else{
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/log",
                {
                    method: "GET",
                    credentials:'include'
                })
                .then(response => {return response.json()})
                .then(json=>{
                    if (json.result.session.silentRefresh) {
                        setAuth(json.result.session.user, json.result.session.silentRefresh)
                    }

                    if(json.result.success){
                        formatLogs(json.result.output)
                    }else{
                        formatLogs(undefined)
                        setEmptyMessage(json.result.message)
                    }
                })           
            }
        }

     const DropDown =({value,options,onChange, type})=>{
        return(
            <label>
                <select className="view-dropdown"  value={value} onChange={onChange}>
                    {type === "search"? <option value = "" disabled hidden>search by</option>: type==="view"?  <option value = "" disabled hidden>VIEW BY</option>:type==="activity"? <option value = "" disabled hidden>SELECT ACTIVITY</option>: type === "user"? <option value = "" disabled hidden>SELECT USER</option>:""}
                    {options.map((option,i)=>(
                      <option key={i} value = {option.value}>{option.label}</option>
                    ))}
                </select>
            </label>
        );
    }

    return(

        <div>
            <div className='view-logs-body'>
                <p className="title" style = {{marginLeft:'15%'}}>User Logs {logs?<span> {logs.length}</span>:""}</p>
                <hr className='view-line'></hr>
                
                <div className='view-logs-header'>
                
                    <ul className='filter-list'>
                        <a download={"asteris_logs ("+new Date().toLocaleString()+").txt"} href={downloadLink} className="text-download"> DOWNLOAD <i className='download-icon'><BsDownload/></i></a>
                        <li><DropDown value = {viewValue} options = {view_options} onChange = { viewChange } type="view"/></li>
                        {viewValue === "activity"? (
                            <li><DropDown value = {activity} options = {activities} onChange = { handleActivity } type="activity"/></li>
                        ): viewValue === "user"? (
                            <li><DropDown value = {chosenUser} options = {users} onChange = { handleUser } type="user"/></li>
                        ): ""}
                    </ul> 
                </div>
                    

                    <div className="search-field">
                        <input type = "text" name = "input" placeholder = "🔎 Search by YYYY-MM-DD"
                        value = {input} onChange = {handleUserInput} className = "input-search" required></input>
                        <a onClick={handleSubmit} ><BsSearch className='student-search-icon'/></a>
                        
                    </div>   

                    <div className ='view-log-preview'>
                    {logs !==undefined ? 
                    <div className='table-wrap'>
                        <table className='view-log-table'>
                        <thead className='view-log-thead'>
                            <tr className='header-row'>
                                <th className='log-header'>USER</th>
                                <th className='log-header'>DATE TIME</th>
                                <th className='log-header'>ACTIVITY</th>
                                <th className='log-header'>SUBJECT</th>
                                <th className='log-header'>DETAILS</th>
                            </tr>
                        </thead>
                        <tbody className = 'view-log-tbody'>
                                
                                {logs.map((log, i)=>{
                                var time_stamp = log.time_stamp.split(" ")
                                return (
                                <tr className='view-log-element' key={i}>
                                {log.user_id === user.user_id? <td className='subject-cell' onClick ={()=>{navigate('/profile')}} >{log.user_name}</td>
                                :<td className='subject-cell' onClick ={()=>{navigate('/user/'+log.user_id)}} >{log.user_name}</td>
                                }
                                <td className='log-cell'>{time_stamp[0]}<br /> {time_stamp[1]}</td>
                                <td className='log-cell'>{log.activity_type}</td>
                                {log.subject_name && log.subject_entity === "User"? <td className='subject-cell' onClick ={()=>{navigate('/user/'+log.subject_id)}}>  <span>{log.subject_name}</span></td>
                                : log.subject_name && log.subject_entity === "Student"? <td className='subject-cell' onClick ={()=>{navigate('/student/'+log.subject_id)}}>  <span>{log.subject_name}</span></td>
                                :
                                <td className='subject-cell'>-</td>}
                                <td className='log-cell'> {log.details!==null? log.details:"-"}</td>
                               
                                </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>
                    : 
                    <div className='no-logs'>{emptyLogs} </div>}
                    </div> 
                    
            </div>
            <Header/> 
            <Menu />
            <Footer/>
    </div> 
    )

 }
 export default View_Logs;
 