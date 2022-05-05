/**
 * author: Jem, Leila
 */
 import React, { useEffect, useState, useRef } from 'react';
 import {BsSearch}  from 'react-icons/bs';
 import {AiFillDelete} from 'react-icons/ai';
 import '../css/view_students.css'
 import Header from './Header';
 import Footer from './Footer';
 import Menu from './Menu';
 import View_Student_Details from './View_Student_Details'

 const View_Students =()=>{

    const [record, setRecord] = useState();
    const [state, changeState]= useState('0');
    const [orderValue, setOrderValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [viewValue, setViewValue] = useState("");
    const [input, setInput] = useState("")
    const prev_order_state = useRef();
    const prev_view_state = useRef();
    const orderFilter = [
        {label: 'name', value:'name'},
        {label:'gwa',value:'gwa'}
    ]
    const searchFilter = [
        {label: 'name', value:'name'},
        {label:'student number',value:'student_number'}
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

    //if state changes, this function is executed
     useEffect(()=>{
        fetch("http://localhost:3001/api/0.1/student?orderby="+[orderValue],
        {
            method: "GET"
        })
        .then(response => {return response.json()})
        .then(json=>{
            console.log(json)
            if(json.result.success){
                setRecord(json.result.output)
            }else{
                alert(json.result.message)
            }
        }) 
    },[state]);

    //if orderValue changes, this function is executed
    useEffect(()=>{
        if(prev_order_state.current != [orderValue]){
            prev_order_state.current = [orderValue];
            if(viewValue === "ALL" || viewValue === ""){
                fetch("http://localhost:3001/api/0.1/student?orderby="+[orderValue],
                {
                    method: "GET"
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
                fetch("http://localhost:3001/api/0.1/student/degree/"+ [viewValue]+"?orderby="+[orderValue],
                {
                    method: "GET"
                })
                .then(response => {return response.json()})
                .then(json=>{
                    // console.log(json.result)
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
                fetch("http://localhost:3001/api/0.1/student?orderby="+[orderValue],
                {
                    method: "GET"
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
                fetch("http://localhost:3001/api/0.1/student/degree/"+ [viewValue]+"?orderby="+[orderValue],
            {
                method: "GET"
            })
            .then(response => {return response.json()})
            .then(json=>{
                // console.log(json.result)
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
      
        let url = 'http:localhost:3001/api/0.1/student/search?name=';
        if(searchValue === "student_number"){
            url = 'http://localhost:3001/api/0.1/student/search?student_number='

        }else{
            url = 'http://localhost:3001/api/0.1/student/search?name='
        }

        if(input === ""){
            fetch("http://localhost:3001/api/0.1/student?orderby="+[orderValue],
        {
            method: "GET"
        })
        .then(response => {return response.json()})
        .then(json=>{
            console.log(json)
            if(json.result.success){
                setRecord(json.result.output)
            }else{
                alert(json.result.message)
            }
        })} else {

        fetch(url + [input])
        .then((response) => {return response.json()})
        .then(json => {
            if(json.result.success){
                console.log(json.result.output)  // Contains the list of match users
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
        setViewValue(e.target.value);
    }

    const handleUserInput = (e) => {
        const value = e.target.value;
        setInput(value);
    }

    const onDelete=async (student)=>{
        console.log(student)
        let student_id = student.rec.student_id
        await fetch('http://localhost:3001/api/0.1/student/'+student_id,{
            method: "DELETE",
        }).then(response =>{ return response.json()})
        .then(json=>{
            console.log(json)
            if(json.result.success){
                window.alert(json.result.message)
                changeState(!state)
            }
        })
    }

    const DropDown =({value,options,onChange, type})=>{
        return(
            <label>
                <select value={value} onChange={onChange}>
                    {type === "search"? <option value = "" disabled>search by</option>: type==="view"?  <option value = "" disabled>view by</option>: <option value = "" disabled>order by</option> }
                    {options.map((option,i)=>(
                      <option key={i} value = {option.value}>{option.label}</option>
                    ))}
                </select>
            </label>
        );
    }

    return(
        <div>
            <Header />
            <Menu />
            <div className='view-student-body'>
      
                <div className='view-student-header'>
                    <span>Student Records</span>
                    <ul className='view-student-list'>
                        <li><DropDown options={searchFilter} className='view-student-dropdown' value = {searchValue} onChange={searchChange}/></li>
                        <li><DropDown options={orderFilter} className='view-student-dropdown' value = {orderValue} onChange={orderChange}/></li>
                        <li><DropDown options={viewFilter} className='view-student-dropdown' value = {searchValue} onChange={searchChange}/></li>
                    </ul>
                </div>
                <hr className='view-student-line'/>
                <div className='view-student-search'>
                    <input type = "text" className = 'view-student-input' placeholder = "Search by name, student number, or degree program..."
                    value = {input} onChange = {handleUserInput} required></input>
                    <a href='#' onClick={handleSubmit} ><BsSearch className='view-student-sicon'/></a>      
                </div>
                <div className='view-student-preview'>
                    {record != undefined ? 
                        <table className='view-student-table'>
                            <thead className='view-student-thead'>
                                <tr>
                                    <th className='view-student-cell-header'>NAME</th>
                                    <th className='view-student-cell-header'>STUDENT NUMBER</th>
                                    <th className='view-student-cell-header'>DEGREE PROGRAM</th>
                                </tr>
                            </thead>
                            <tbody class = 'view-student-tbody'>
                                {record.map((rec, i) => {
                                    return (
                                        <tr className='view-student-element'>
                                            <td className='view-student-cell'>{rec.last_name}, {rec.first_name} {rec.middle_name[0]}.
                                            {rec.suffix ? ', ' + rec.suffix : ''}</td>
                                            <td className='view-student-cell'>{rec.student_number}</td>
                                            <td className='view-student-cell'>{rec.degree_program}</td>
                                            <a href='#' onClick={()=>{onDelete({rec})}}><AiFillDelete className='view-student-edit-icon'/></a>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>:
                    
                    <div>"No students saved"</div>
                    }
                </div>

            </div>
            <Footer />
        </div>
        );
 }

 export default View_Students;