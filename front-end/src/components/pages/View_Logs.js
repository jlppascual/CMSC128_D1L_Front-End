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
    const [chosenUser, setChosenUser] = useState("");
    const [emptyLogs, setEmptyMessage] = useState("");
    const { user, isAuthenticated } = useStore();
    


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
        if(!isAuthenticated) {
            navigate('/')
            alert("You are not logged in!")
        }else{
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
                            setPage(!pageState);
                        }
                                
                    })
                
                
            }else{
                navigate('/home')
                alert("Must be an admin to access this page")
            }
        }
     },[isAuthenticated])

     //create a text file of logs
     useEffect(()=>{
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
            if(json.result.success){
                formatLogs(json.result.output)
            }else{
                changeLogs([])
                //setEmptyMessage(json.result.message)
            }
        })
     },[pageState])

     useEffect(()=>{
        
        if (viewValue==="user"){

            console.log(chosenUser)
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/log/user/"+chosenUser,
            {
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                if(json.result.success){
                    formatLogs(json.result.output)
                    
                    // getUser(logs)
                }else{
                    changeLogs([])
                    //setEmptyMessage(json.result.message)
                }
            })
        }else if(viewValue==="activity"){
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/log/activity/"+activity,
            {
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                if(json.result.success){
                    formatLogs(json.result.output)
                    
                    // getUser(logs)
                }else{
                    changeLogs([])
                    //setEmptyMessage(json.result.message)
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
                if(json.result.success){
                    formatLogs(json.result.output)
                    
                }else{
                    changeLogs([])
                    //setEmptyMessage(json.result.message)
                }
            })
        }
        },[viewValue, activity,chosenUser]);
        
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
            console.log(logs,users)
            if(logs && users){
                for (let i = 0; i < logs.length; i++) {
                    for (let j = 0; j < users.length; j++) {
                        console.log(logs[i].user_id)
                        console.log(users[j].value)
                        if(logs[i].user_id === users[j].value){
                            console.log(users[j].value)
                            logs[i]['user_name'] = users[j].label
                            console.log(logs[i])
                            break
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
    
            {logs != [] ? (
                logs.map((log, i)=>{
                    var timestamp = log.time_stamp.replace("T", " ").replace("Z", " ");
                    var details = (log.details!==null? log.details:"")
                    data.push(i+1 + ". " + timestamp + " " + log.activity_type + details+"\n")
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
                    if(json.result.success){
                        formatLogs(json.result.output)
                        
                        // console.log(json.result.output)
                    }else{
                        changeLogs([])
                        //setEmptyMessage(json.result.message)
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
                    if(json.result.success){
                        formatLogs(json.result.output)
                        
                        // getUser(logs)
                    }else{
                        changeLogs([])
                        //setEmptyMessage(json.result.message)
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

    // const getUser=()=>{
    //     if(logs!== undefined || logs !== []){
    //         changeLogs(logs.map((log, i)=>{      
    //             fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/user/"+log.user_id,{
    //                 credentials:'include'
    //             })
    //             .then(response => {return response.json()})
    //             .then(json=>{
    //                 if(json.result.success){
    //                     let name = json.result.output.last_name+", "+json.result.output.first_name
    //                     log["activity_type"] = log.activity_type;
    //                     log["details"]=log.details;
    //                     log["prev_version"]=log.prev_version;
    //                     log["subject_entity"]=log.subject_entity;
    //                     log["subject_id"]=log.subject_id;
    //                     log["time_stamp"]=log.time_stamp;
    //                     log["user_id"]=log.user_id;
    //                     log["user_name"]=name;
    //                 }else{
    //                     // console.log(json.result.message)
    //                 }
    //             }) 
    //         }))
    //     }
    // }

    return(
        // console.log(logs),
        <div>
            <div className='view-logs-body'>
                <p className="title">User Logs</p>
                <hr className='view-line'></hr>
                
                <div className='view-logs-header'>
                
                    <ul className='filter-list'>
                        <a download="asteris_logs.txt" href={downloadLink} className="text-download"> DOWNLOAD <i className='download-icon'><BsDownload/></i></a>
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
                    {logs !== [] ? 
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
                                <td className="log-cell">{log.user_name}</td>
                                <td className='log-cell'>{time_stamp[0]}<br /> {time_stamp[1]}</td>
                                <td className='log-cell'>{log.activity_type}</td>
                                <td className='log-cell'> {log.subject_entity!==null? log.subject_entity:"-"}</td>
                                <td className='log-cell'> {log.details!==null? log.details:"-"}</td>
                               
                                </tr>)
                                })}
                            </tbody>
                        </table>
                        <p>{logs.length}</p>
                    </div>
                    : 
                    <div className='no-logs'>No logs to display{emptyLogs} </div>}
                    </div> 
                    
            </div>
            <Header/> 
            <Menu />
            <Footer/>
    </div> 
    )

 }
 export default View_Logs;
 