/**
 * authors: Janica, Andrew
 */

 import React, { useEffect, useState, useRef } from 'react';
 import Menu from '../components/Menu'
 import Header from '../components/Header';
 import Footer from '../components/Footer';
 import useStore from '../hooks/authHook'
 import { useNavigate } from 'react-router-dom';
 import {VscSettings}  from 'react-icons/vsc';
 import DeleteConfirmPopup from '../components/Popups/DeleteConfirmPopup';
 import '../../css/view_users.css'
 import { ToastContainer } from 'react-toastify';
 import { notifyError, notifySuccess } from '../components/Popups/toastNotifUtil';
 import '../../css/toast_container.css';

 export default function View_Users_Page (){

    const {REACT_APP_HOST_IP} = process.env
    const [users, setUsers] = useState([]);
    const [input,setInput] = useState("")
    const [pageState, setPage] = useState('0');
    const [viewValue, setViewValue] = useState("");
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [toDelete, setToDelete] = useState("")

    const { user, setAuth } = useStore();
    const navigate = useNavigate();     // navigation hook
    const prev_view_state = useRef();

    const viewFilter = [
        {label:'ALL', value:'ALL'}, 
        {label:'OCS REP', value:'OCS REP'}, 
        {label:'ACS', value:'ACS'},
        {label:'UNIT REP', value:'UNIT REP'},
        {label:'MEMBER', value:'MEMBER'},
    ]

    prev_view_state.current = [viewValue];
 
    useEffect(() =>{
        if(user.user_role==="CHAIR/HEAD"){
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/user",
            {
                method: "GET",
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                setUsers(json.result.output)
                if(json.result.session){
                    setAuth(user,json.result.session)
                }            
            })
        }else{
            navigate("/home")
            notifyError("Must be an admin to access this page")
        }
        
     },[pageState]);

     //if viewValue changes, this function is executed
    useEffect(()=>{
        if(prev_view_state.current != [viewValue]){
            prev_view_state.current = [viewValue];
            if (viewValue==="ALL"||viewValue===""){
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/user",
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
                        setUsers(json.result.output)
                    }else{
                        setUsers(undefined)
                    }
                })
            } else {
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/user/role/"+ [viewValue],
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
                        setUsers(json.result.output)
                    
                    }else{
                        setUsers(undefined)
                    }
                })
            }
        }
    },[viewValue]);
 
     const handleUserInput = (e) => {
         const value = e.target.value;
         setInput(value);
            if (viewValue!=="ALL" || viewValue!==""){
            setViewValue("ALL")
        }
     }
 
     const handleSubmit = (e) => {
        e.preventDefault();
    
        let url = 'http:'+REACT_APP_HOST_IP+':3001/api/0.1/user/search?name=';
        
        //if a specific role is selected, url changes to view users by role
        if(viewValue === "OCS REP" || viewValue === "ACS" || viewValue === "UNIT REP" || viewValue === "MEMBER"){
            url = 'http://'+REACT_APP_HOST_IP+':3001/api/0.1/user/role/' + viewValue + '/search?name='
        }else{ //default search
            url = 'http://'+REACT_APP_HOST_IP+':3001/api/0.1/user/search?name='
        }

        //if search input is empty, check if a user role is selected, else do the default search
        if(input === "" || input === undefined){
            let url_role;

            if( viewValue === "OCS REP" || viewValue === "ACS" || viewValue === "UNIT REP" || viewValue === "MEMBER"){
                url_role = 'http://'+REACT_APP_HOST_IP+':3001/api/0.1/user/role/' + viewValue
            }else{
                url_role = 'http://'+REACT_APP_HOST_IP+':3001/api/0.1/user'
            }
    
            fetch(url_role,{
                method: "GET",
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                if(json.result.success){
                    setUsers(json.result.output)
                }else{
                    notifyError(json.result.message)
                }
            })
        } else {
            fetch(url + [input],{
                credentials:'include'
            })
            .then((response) => {return response.json()})
            .then(json => {
                if(json.result.success){
                    // Contains the list of match users
                    setUsers(json.result.output);
                }
                else{
                    notifyError(json.result.message) // Message: No results found
                }
            })
        }
    }

     const viewChange=(e)=>{
        setViewValue(e.target.value);
    }

    const onDelete=(todeluser)=>{
        setShowDeleteConfirmation(true);
        setToDelete(todeluser);
    }
     const confirmDelete = async(decision,details) => {
        setShowDeleteConfirmation(false)
        if(decision){
            let delete_id = toDelete.user.user_id
            fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/user/'+ delete_id+'/'+user.user_id,{
                method: "DELETE",
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    details
                })
            }).then(response =>{ return response.json()})
            .then(json=>{
   
               if(json.result.success){
                    notifySuccess(json.result.message)
                    setPage(!pageState)            
               }
            })
        }
     }
 
     const DropDown =({value,options,onChange})=>{
        return(
            <label>
                <select className='view-user-dropdown' value={value} onChange={onChange}>
                    {<option className='option' value = "" disabled hidden>VIEW BY</option>}
                    {options.map((option,i)=>(
                        <option key={i} value = {option.value}>{option.label}</option>
                    ))}
                </select>
            </label>
        );
    }

        return(
            <div>
                
                <div className="view-users-body">
                
                <div className='top-header'>
                <p className="title"> Accounts{users?<span> {users.length}</span>:""}</p>  
                <hr className='users-line'/>

                
                <ul className='view-user-header'>
                    <li><DropDown options={viewFilter} value = {viewValue} onChange={viewChange}/></li>
                </ul>
                
                
                <div className="users-search-field">
                    <input type = "text" name = "input" placeholder = "🔎 Search by name"
                    value = {input} onChange = {handleUserInput} className = "user-search" required></input>
                    <button onClick={handleSubmit} className = "users-search-button"><i className = "search-icon"><VscSettings /></i></button>
                </div>
                </div>
               
                <div className='tile-page'>
                    {users != undefined? users.map((user, i) => {
                            if (i % 2 === 0) {
                                return <span key={i}>
                                    <div className="user-tile" >
                                    {!user.display_picture?
                                        (<img src = {require(`../../images/user_dp/dp_default.jpg`)} className='user-dp' onClick={()=> navigate('/user/'+user.user_id)}/>):
                                        (<img src = {require(`../../images/user_dp/${user.display_picture}`)} className='user-dp' onClick={()=> navigate('/user/'+user.user_id)}/>)
                                    }
                                    <div className='user-name' onClick={()=> navigate('/user/'+user.user_id)}>
                                        {user.first_name} {user.last_name} <br />
                                        <span onClick={()=> navigate('/user/'+user.user_id)}>{user.user_role}</span>
                                    </div>
                                        <button onClick={()=>{onDelete({user})}} className = "delete-button">Remove</button></div>
                                </span>
                            } else {
                                return <span key={i}>
                                    <div className="user-odd-tile" >
                                    {!user.display_picture?
                                        (<img src = {require(`../../images/user_dp/dp_default.jpg`)} className='user-dp' onClick={()=> navigate('/user/'+user.user_id)}/>):
                                        (<img src = {require(`../../images/user_dp/${user.display_picture}`)} className='user-dp' onClick={()=> navigate('/user/'+user.user_id)}/>)
                                    }
                                    {/* <img src = {require(`../../images/user_dp/${user.display_picture}`)} className='user-dp' onClick={()=> navigate('/user/'+user.user_id)}/> */}
                                    <div className='user-name' onClick={()=> navigate('/user/'+user.user_id)}>
                                        {user.first_name} {user.last_name} <br />
                                        <span onClick={()=> navigate('/user/'+user.user_id)}>{user.user_role}</span >
                                    </div>
                                    <button onClick={()=>{onDelete({user})}} className = "delete-button">Remove</button>
                                    </div>
                                </span>
                            }
                    }): <div className="no-users">
                        <p>No users found.</p>
                        <button onClick={()=> navigate('/users/new')}> Add User Account</button>
                        </div>}
                </div>
                
                {showDeleteConfirmation===true? <DeleteConfirmPopup props={{confirmDelete: confirmDelete.bind()}} />:""}</div>
            <Header />
            <Menu/>
            <ToastContainer className='toast-container'/>
            <Footer/>
        </div> 
    )
 }