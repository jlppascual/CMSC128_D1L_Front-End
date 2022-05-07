/**
 * author: Janica, Andrew
 */

 import React, { useEffect, useState} from 'react';
 import Menu from '../components/Menu'
 import Header from '../components/Header';
 import Footer from '../components/Footer';
 import '../../css/view_users.css'
 import useStore from '../hooks/authHook'
 import { useNavigate } from 'react-router-dom';
 import {VscSettings}  from 'react-icons/vsc';

 export default function View_Users_Page ({todos, setTodos}){

    const InitialState = {
        name: '',
        users: []
    }

    const [pageState, setPage] = useState('0');

    const { user, isAuthenticated, setAuth } = useStore();
    const navigate = useNavigate();     // navigation hook
    const [todo, setTodo] = useState(InitialState)
 
    useEffect(() =>{
        if(!isAuthenticated) {
            navigate('/')
            alert("You are not logged in!")
        }else{
            fetch("http://localhost:3001/api/0.1/user",
            {
                method: "GET",
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                setTodo({users:json.result.output})
                if(json.result.session){
                    setAuth(user,json.result.session)
                }
            })
        }

     },[isAuthenticated,pageState])
 
     const handleUserInput = (e) => {
         const value = e.target.value;
         setTodo({name: value});
     }
 
     const handleSubmit = (e) => {
         e.preventDefault();
         fetch('http://localhost:3001/api/0.1/user/search?name=' + todo.name,{
             credentials:'include'
         })
         .then((response) => {return response.json()})
         .then(json => {
             if(json.result.success){
                 setTodo({users:json.result.output});
                //  alert(json.result.output)  // Contains the list of match users
             }
             else{
                 alert(json.result.message) // Message: No results found
             }
         })
     }

     const onDelete = (deleteUser) => {

        let delete_id = deleteUser.user.user_id
         fetch('http://localhost:3001/api/0.1/user/'+ delete_id+'/'+user.user_id,{
             method: "DELETE",
             credentials:'include',
             headers:{
                 'Content-Type':'application/json'
             }
         }).then(response =>{ return response.json()})
         .then(json=>{

            if(json.result.success){
                setPage(!pageState)            
            }
         })
     }
 

     
     return(
        <div>
            <Menu/>
            <Header/> 
            <div className="view-users-body">
            <form>
                <p className="user-title">Accounts</p>
                
                <div className="search-field">
                    <input type = "text" name = "name" placeholder = "🔎 Search by name"
                    value = {todo.name} onChange = {handleUserInput} className = "user-search" required></input>
                    <button onClick={handleSubmit} className = "search-button"><i className = "icon"><VscSettings /></i></button>                </div>
            </form>
            {todo.users != undefined? todo.users.map((user, i) => {
                    if (i % 2 === 0) {
                        return <span key={i}>
                            <div className="user-tile">
                                {user.last_name} <br></br>{user.first_name}<br></br> {user.user_role}
                            <button onClick={()=>{onDelete({user})}} className = "delete-button">Remove</button>
                            </div>
                        </span>
                    } else {
                        return <span key={i}>
                            <div className="user-odd-tile">
                                {user.last_name} <br></br>{user.first_name}<br></br> {user.user_role}
                            <button onClick={()=>{onDelete({user})}} className = "delete-button">Remove</button>
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
