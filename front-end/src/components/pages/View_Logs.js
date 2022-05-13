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
    const[input, setInput] = useState("");
    const [downloadLink, setDownloadLink] = useState('')
    const[logs, changeLogs] = useState([]);
    const[viewValue, setViewValue] = useState("");
    const [activity, setActivity] = useState("");
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
                    changeLogs(json.result.output)
                    // console.log(json.result.output)
                }else{
                    alert(json.result.message)
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
                    changeLogs(json.result.output)
                    // getUser(logs)
                }else{
                    alert(json.result.message)
                }
            })           
        }
 
    }

     useEffect(()=>{
        if(!isAuthenticated) {
            navigate('/')
            alert("You are not logged in!")
        }else{
            if(user.user_role === "CHAIR/HEAD"){
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/log",
                {
                    method: "GET",
                    credentials:'include'
                })
                .then(response => {return response.json()})
                .then(json=>{
                    if(json.result.success){
                        changeLogs(json.result.output)
                        // getUser(logs)
                        // console.log(json.result.output)
                    }else{
                        alert(json.result.message)
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
        
        if (viewValue==="user"){
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/log/user/"+user.user_id,
            {
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                if(json.result.success){
                    changeLogs(json.result.output)
                    // getUser(logs)
                }else{
                    alert(json.result.message)
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
                    changeLogs(json.result.output)
                    // getUser(logs)
                }else{
                    alert(json.result.message)
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
                    console.log(json.result.output)
                    changeLogs(json.result.output)
                }else{
                    alert(json.result.message)
                }
            })
        }
        },[viewValue, activity]);

     const DropDown =({value,options,onChange, type})=>{
        return(
            <label>
                <select className="view-dropdown"  value={value} onChange={onChange}>
                    {type === "search"? <option value = "" disabled>search by</option>: type==="view"?  <option value = "" disabled>VIEW BY</option>: <option value = "" disabled>SELECT ACTIVITY</option> }
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
                <div className='view-logs'>
                    <div className='view-logs-header'>
                    <p className="log-title">User Logs</p>
                        <ul className='filter-list'>
                            <a download="asteris_logs.txt" href={downloadLink} className="text-download"> DOWNLOAD <i className='download-icon'><BsDownload/></i></a>
                           <li><DropDown value = {viewValue} options = {view_options} onChange = { viewChange } type="view"/></li>
                            {viewValue === "activity"? (
                                <li><DropDown value = {activity} options = {activities} onChange = { handleActivity } type="activity"/></li>
                            ): ""}
                        </ul> 
                    </div>
                    <hr className='view-line'></hr>

                    <div className="search-field">
                        <input type = "text" name = "input" placeholder = "🔎 Search by YYYY-MM-DD"
                        value = {input} onChange = {handleUserInput} className = "input-search" required></input>
                        <button onClick={handleSubmit} className = "search-button"><i className = "icon"><BsSearch /></i></button>
                    </div>   

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
 