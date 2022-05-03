/**
 * author: Jem, Leila
 */

 import React, { useEffect, useState, useRef } from 'react';
 import { useNavigate } from 'react-router-dom';
 import {BsSearch}  from 'react-icons/bs';
 import {AiFillDelete} from 'react-icons/ai';
 import '../css/view_students.css'

 import Header from './Header';
 import Footer from './Footer';
 import View_Student_Details from './View_Student_Details'

 const View_Students =()=>{

    const [record, setRecord] = useState();
    const [state, changeState]= useState('0');
    const [orderValue, setOrderValue] = useState("name");
    const [searchValue, setSearchValue] = useState("name");
    const [input, setInput] = useState("")
    const prev_state = useRef();
    const orderFilter = [
        {label: 'order by', value:''},
        {label: 'name', value:'name'},
        {label:'gwa',value:'gwa'}
    ]
    const searchFilter = [
        {label: 'search by', value:''},
        {label: 'name', value:'name'},
        {label:'student number',value:'student_number'}
    ]
    const viewFilter = [
        {label: 'view by', value:''},
        {label: 'All', value:'All'},
        {label:'BACA',value:'BACA'}
    ]

    prev_state.current = [orderValue];


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

    useEffect(()=>{
        if(prev_state.current != [orderValue]){
            prev_state.current = [orderValue];
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
        }
    },[orderValue]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let url = '';
        if(searchValue ==="name"){
            url = 'http:localhost:3001/api/0.1/student/search?name='
        }else{
            url = 'http:localhost:3001/api/0.1/student/search?student_number='
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
        fetch('http://localhost:3001/api/0.1/student/search?name=' + [input])
        .then((response) => {return response.json()})
        .then(json => {
            if(json.result.success){
                setRecord(json.result.output);
                console.log(json.result.output)  // Contains the list of match users
            }
            else{
                console.log(json.result.message) // Message: No results found
            }
        })}
    }

    const orderChange=(e)=>{
        setOrderValue(e.target.value);
    }

    const searchChange=(e)=>{
        setSearchValue(e.target.value);
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

    const DropDown =({value,options,onChange})=>{
        return(
            <label>
                {/* {label} */}
                <select value={value} onChange={onChange}>
                    {options.map((option,i)=>(
                      <option key={i} value = {option.value}>{option.label}</option>
                    ))}
                </select>
            </label>
        );
    }

        return(
        <div>
            <Header/>
            <div className='view-student-body'>
            <input type = "text" className = "input" placeholder = "Search by Name"
                value = {input} onChange = {handleUserInput} required></input>
                <button onClick={handleSubmit}><i ><BsSearch /></i></button>                
            
                <DropDown options={searchFilter} value = {searchValue} onChange={searchChange}/>
                <DropDown options={orderFilter} value = {orderValue} onChange={orderChange}/>
                <DropDown options={viewFilter} value = {searchValue} onChange={searchChange}/>

                {record != undefined? record.map((rec,i)=>{
                    return <span key={i}><div className='student-tile'>
                        <a href={"/view-student-details/"+ rec.student_id} className="student-details">
                        {i+1}. {rec.last_name}, {rec.first_name}, {rec.middle_name} {rec.suffix} {rec.student_number} {rec.degree_program} {rec.gwa} 
                        </a>
                    <button onClick={()=>{onDelete({rec})}}><AiFillDelete/></button>
                    </div></span>
                }): <div>"No students saved"</div>}

            </div>
            <Footer/>
        </div>
        );
 }
 export default View_Students;