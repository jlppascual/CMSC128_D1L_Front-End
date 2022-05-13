/**
 * author: Jem, Leila
 */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {BsSearch}  from 'react-icons/bs';
import {AiFillDelete, AiFillEye} from 'react-icons/ai';
import useStore from '../hooks/authHook'
import '../../css/view_students.css'
import Header from '../components/Header';
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import DeletePopup from '../components/Popups/DeletePopup';

const View_Students =()=>{

    const {REACT_APP_HOST_IP} = process.env
    const [record, setRecord] = useState();
    const [state, changeState]= useState('0');
    const [orderValue, setOrderValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [viewValue, setViewValue] = useState("");
    const [input, setInput] = useState("")
    const [showConfirmation, setShowConfirmation] = useState("")
    const [toDelete, setToDelete] = useState("")

    const prev_order_state = useRef();
    const prev_view_state = useRef();
    const orderFilter = [
        {label: 'NAME', value:'name'},
        {label:'GWA',value:'gwa'}
    ]
    const searchFilter = [
        {label: 'NAME', value:'name'},
        {label:'STUDENT NUMBER',value:'student_number'}
    ]
    const viewFilter = [
        {label:'ALL', value:'ALL'}, 
        {label:'BACA', value:'BACA'}, 
        {label:'BAPHLO', value:'BAPHLO'},
        {label:'BASOC', value:'BASOC'},
        {label:'BSAGCHEM', value:'BSAGCHEM'},
        {label:'BSAMAT', value:'BSAMAT'},
        {label:'BSAPHY', value:'BSAPHY'},
        {label:'BSBIO', value:'BSBIO'},
        {label:'BSCHEM', value:'BSCHEM'},
        {label:'BSCS', value:'BSCS'},
        {label:'BSMATH', value:'BSMATH'},
        {label:'BSMST', value:'BSMST'},
        {label:'BSSTAT', value:'BSSTAT'},
    ]

    prev_order_state.current = [orderValue];
    prev_view_state.current = [viewValue];

    const { user, isAuthenticated } = useStore();

    const navigate = useNavigate();     // navigation hook


    //if state changes, this function is executed
        useEffect(()=>{
        if(!isAuthenticated) {
            navigate('/')
            alert("You are not logged in!")
        }else{
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student?orderby="+[orderValue],
        {
            method: "GET",
            credentials:'include'
        })
        .then(response => {return response.json()})
        .then(json=>{
            if(json.result.success){
                setRecord(json.result.output)
            }else{
                // alert(json.result.message)
            }
        })}
    },[isAuthenticated, state]);

    //if orderValue changes, this function is executed
    useEffect(()=>{
        if(prev_order_state.current != [orderValue]){
            prev_order_state.current = [orderValue];
            if(viewValue === "ALL" || viewValue === ""){
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student?orderby="+[orderValue],
                {
                    method: "GET",
                    credentials: 'include'
                })
                .then(response => {return response.json()})
                .then(json=>{
                    if(json.result.success){
                        setRecord(json.result.output)
                    }else{
                        setRecord(undefined)
                    }
                })
            }else{
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/degree/"+ [viewValue]+"?orderby="+[orderValue],
                {
                    method: "GET",
                    credentials:'include'
                })
                .then(response => {return response.json()})
                .then(json=>{
                    if(json.result.success){
                        setRecord(json.result.output)
                    }else{
                        setRecord(undefined)
                    }
                })
            }

        }
    },[orderValue]);

    //if viewValue changes, this function is executed
    useEffect(()=>{
        if(prev_view_state.current != [viewValue]){
            prev_view_state.current = [viewValue];
            if (viewValue==="ALL" || viewValue===""){
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student?orderby="+[orderValue],
                {
                    method: "GET",
                    credentials:'include'
                })
                .then(response => {return response.json()})
                .then(json=>{
                    if(json.result.success){
                        setRecord(json.result.output)
                    }else{
                        setRecord(undefined)
                    }
                })
            } else{
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/degree/"+ [viewValue]+"?orderby="+[orderValue],
            {
                method: "GET",
                credentials:'include'
            })
            .then(response => {return response.json()})
            .then(json=>{
                if(json.result.success){
                    setRecord(json.result.output)
                }else{
                    setRecord(undefined)
                }
            })}
        }
    },[viewValue]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let url = 'http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/search?name=';

        if(searchValue === "student_number"){
            url = 'http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/search?student_number='

        }

        if(input === ""){
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student?orderby="+[orderValue],
        {
            method: "GET",
            credentials:'include'
        })
        .then(response => {return response.json()})
        .then(json=>{
            if(json.result.success){
                setRecord(json.result.output)
            }else{
                alert(json.result.message)
            }
        })} else {
        setViewValue("ALL")
        fetch(url + [input]+"&&orderby="+[orderValue],{
            credentials:'include'
        })
        .then((response) => {return response.json()})
        .then(json => {
            if(json.result.success){
                // Contains the list of match users
                if(searchValue === "student_number"){
                    setRecord([json.result.output]);
                }else{
                    setRecord(json.result.output);
                }
            }
            else{
                alert(json.result.message) // Message: No results found
            }
        })}
    }

    const orderChange=(e)=>{
        setOrderValue(e.target.value);
    }

    const searchChange=(e)=>{
        setSearchValue(e.target.value);
    }

    const viewChange=(e)=>{
        console.log(record)
        setViewValue(e.target.value);
    }

    const handleUserInput = (e) => {
        const value = e.target.value;
        setInput(value);
    }

    const confirmDelete= async(decision) =>{
        setShowConfirmation(false)
        if(decision){
            const student = toDelete.student_id
            await fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/'+student+'/'+user.user_id,{
                method: "DELETE",
                credentials:'include'
            }).then(response =>{ return response.json()})
            .then(json=>{
                if(json.result.success){
                    window.alert(json.result.message)
                    changeState(!state)
                }
            })
        }
    }
    const onDelete=(student)=>{
        setShowConfirmation(true)
        setToDelete(student);
    }

    const DropDown =({value,options,onChange, type})=>{
        return(
            <label>
                <select value={value} onChange={onChange} className='view-student-dropdown'>
                {type === "search"? <option value = "" disabled hidden>SEARCH BY</option>: type==="view"?  <option value = "" disabled hidden>VIEW BY</option>: <option value = "" disabled hidden>ORDER BY</option> }
                {options.map((option,i)=>(
                    <option key={i} value = {option.value} >{option.label}</option>
                ))}
                </select>
            </label>
        );
    }

    return(
        <div>
        <div className='view-student-body'>
        
            <p className="title">Student Records</p>
                
            <div className='view-student-header'>
                <ul className='view-student-list'>
                    <li><DropDown options={searchFilter} className='view-student-dropdown' value = {searchValue} onChange={searchChange} type ="search"/></li>
                    <li><DropDown options={orderFilter} className='view-student-dropdown' value = {orderValue} onChange={orderChange} type = "order"/></li>
                    <li><DropDown options={viewFilter} className='view-student-dropdown' value = {viewValue} onChange={viewChange} type="view"/></li>
                </ul>
            </div>
            
            <hr className='line'/>

            <div className='view-student-search'>
                <input type = "text" className = 'view-student-input' placeholder = "🔎 Search a student record" value = {input} onChange = {handleUserInput} required></input>
                <a href='#' onClick={handleSubmit} ><BsSearch className='student-search-icon'/></a>      
            </div>
            <div className='view-student-preview'>
                {record != undefined ? 
                    <table className='view-student-table'>
                        <thead className='view-student-thead'>
                            <tr>
                            <th className='name-header'>NAME</th>
                                <th className='studno-header'>STUDENT NUMBER</th>
                                <th className='degree-header'>DEGREE PROGRAM</th>
                            </tr>
                        </thead>
                        <tbody className = 'view-student-tbody'>
                            {record.map((rec, i) => {
                                    return (
                                        <tr className='view-student-element' key={i}>
                                        <td className='name-cell'><a className = "student-tile" href={'/student/'+rec.student_id}>{rec.last_name}, {rec.first_name}{rec.middle_name? ', '+rec.middle_name:""} {rec.suffix ? ', ' + rec.suffix : ''}</a></td>
                                            <td className='studno-cell'>{rec.student_number}</td>
                                        <td className='degree-cell'>{rec.degree_program}</td>
                                        <a onClick={()=>{onDelete(rec)}}><AiFillDelete className='view-student-edit-icon'/></a>
                                        
                                    </tr>
                                );
                            })}
                        </tbody>
                        {showConfirmation===true? <DeletePopup props={{confirmDelete: confirmDelete.bind()}} />:""}
                    </table>:
                <div>"No students saved"</div>
                }
            </div>
        </div>
        <Header />
        <Menu />
        <Footer />
    </div>
    );
}

export default View_Students;