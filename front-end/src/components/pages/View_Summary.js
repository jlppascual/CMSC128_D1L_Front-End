/**
 * author: Jem, Leila
 */
 import React, { useEffect, useState, useRef } from 'react';
 import {BsSearch}  from 'react-icons/bs';
 import Header from '../components/Header';
 import Footer from '../components/Footer';
 import Menu from '../components/Menu'
 import { useReactToPrint } from 'react-to-print';
 import ComponentToPrint from '../components/ComponentToPrint'
 import '../../css/view_summary.css'
 
 const View_Summary =()=>{

    const [record, setRecord] = useState();
    const [state, changeState]= useState('0');
    const [orderValue, setOrderValue] = useState("");
    const [viewValue, setViewValue] = useState("");
    const [input, setInput] = useState("")
    const prev_order_state = useRef();
    const prev_view_state = useRef();
    const[isVisible, setVisibility] = useState(false);

    const orderFilter = [
        {label: 'name', value:'name'},
        {label:'gwa',value:'gwa'}
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

    // for printing
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    //if state changes, this function is executed
     useEffect(()=>{
        fetch("http://localhost:3001/api/0.1/student/summary?orderby="+[orderValue],
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
        }) 
    },[state]);

    //if orderValue changes, this function is executed
    useEffect(()=>{
        if(prev_order_state.current != [orderValue]){
            prev_order_state.current = [orderValue];
            if(viewValue === "ALL" || viewValue===""){
                fetch("http://localhost:3001/api/0.1/student/summary?orderby="+[orderValue],
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
            }else{
                fetch("http://localhost:3001/api/0.1/student/summary/degree/"+ [viewValue]+"?orderby="+[orderValue],
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
            if (viewValue==="ALL"){
                fetch("http://localhost:3001/api/0.1/student/summary?orderby="+[orderValue],
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
                fetch("http://localhost:3001/api/0.1/student/summary/degree/"+ [viewValue],
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
        if(input === ""){
            fetch("http://localhost:3001/api/0.1/student/summary?orderby="+[orderValue],
        {
            method: "GET",
            credentials:'include'
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

        fetch('http://localhost:3001/api/0.1/student/summary/search?name=' +[input]+'&&orderby='+[orderValue]),{
            credentials:'include'
        }
        .then((response) => {return response.json()})
        .then(json => {
            if(json.result.success){
                setRecord(json.result.output);
            }
            else{
                alert(json.result.message) // Message: No results found
            }
        })}
    }

    const orderChange=(e)=>{
        setOrderValue(e.target.value);
    }

    const viewChange=(e)=>{
        setViewValue(e.target.value);
    }

    const handleUserInput = (e) => {
        const value = e.target.value;
        setInput(value);
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
            <div className='view-summary-body'>
                <div className='view-summary-header'>
                    <span> Summary of Graduating Students</span>
                    <ul className="view-summary-list">
                        <li><DropDown options={orderFilter} value = {orderValue} onChange={orderChange} type={"order"}/></li>
                        <li><DropDown options={viewFilter} value = {viewValue} onChange={viewChange} type={"view"}/></li>
                        <li><button onClick={handlePrint} className="print-button">  Print </button> </li>            
                    </ul>
                </div>    

                <hr className='view-summary-line'/>

                <div className="view-summary-search">
                    <input type = "text" className = "view-summary-input" placeholder = "Search by Name"
                    value = {input} onChange = {handleUserInput} required></input>
                    <a href="#"onClick={handleSubmit}><BsSearch className='view-summary-sicon'/></a>  
                </div>

                <div className='view-summary-preview'>
                    {record != undefined ? 
                        <table className='view-summary-table'>
                            <thead className='view-summary-thead'>
                                <tr>
                                    <th className='view-summary-cell-header'>NAME</th>
                                    <th className='view-summary-cell-header'>GWA</th>
                                    <th className='view-summary-cell-header'>DEGREE PROGRAM</th>
                                </tr>
                            </thead>
                            <tbody className = 'view-summary-tbody'>
                                {record.map((rec, i) => {
                                    return (
                                        <tr className='view-summary-element'>
                                           <td className='view-summary-cell'> <a className = "summary-tile" href={'/student/'+rec.student_id}>{i+1}. {rec.last_name}, {rec.first_name}{rec.middle_name? ', '+rec.middle_name:""}
                                            {rec.suffix ? ', ' + rec.suffix : ''}</a></td>
                                            <td className='view-summary-cell'>{rec.gwa}</td>
                                            <td className='view-summary-cell'>{rec.degree_program}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>:<div>"No students saved"</div>}
                </div>
                <div style={{display:"none"}}><ComponentToPrint record={record} ref={componentRef}/></div> 
            </div>
            <Header/>
            <Menu/>
            <Footer/>
        </div>
        );
 }

 export default View_Summary;