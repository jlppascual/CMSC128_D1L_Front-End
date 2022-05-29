/**
 * author: Jem, Leila
 */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {BsSearch}  from 'react-icons/bs';
import {AiFillDelete} from 'react-icons/ai';
import useStore from '../hooks/authHook'
import useLoadStore from '../hooks/loaderHook';
import '../../css/view_students.css'
import Header from '../components/Header';
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import DeletePopup from '../components/Popups/DeletePopup';
import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from '../components/Popups/toastNotifUtil';
import { RiAlertLine } from 'react-icons/ri'
import '../../css/toast_container.css';
import Row_Loader from '../loaders/Row_Loader';

const View_Students =()=>{

    const {REACT_APP_HOST_IP} = process.env
    const [record, setRecord] = useState();
    const [state, changeState]= useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [viewValue, setViewValue] = useState("");
    // reference: https://www.freecodecamp.org/news/how-to-work-with-multiple-checkboxes-in-react/?fbclid=IwAR0UqtIok1fIaGpvkHEmbDslOMN_DrunOE58lrdxAiTKRUmpMtTkgUaEF6g
    const [checkedState, setCheckedState] = useState([]);
    const [studentsToDel, setStudentsDel] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState("")
    const [showConfirmationMany, setShowConfirmationMany] = useState("")
    const [toDelete, setToDelete] = useState("")
    const [message, setMessage] = useState("Loading students...")
    const [selectedValue, setSelectVal] = useState(false);
    const prev_view_state = useRef();
    
    let input ;

    const searchFilter = [
        {label: 'NAME', value:'name'},
        {label:'STUDENT NUMBER',value:'student_number'}
    ]

    const viewFilter = [
        {label:'ALL', value:'ALL'}, 
        {label:'BACA', value:'BACA'}, 
        {label:'BAPHLO', value:'BAPHLO'},
        {label:'BASOC', value:'BASOC'},
        {label:'BSAGRICHEM', value:'BSAGRICHEM'},
        {label:'BSAMAT', value:'BSAMAT'},
        {label:'BSAPHY', value:'BSAPHY'},
        {label:'BSBIO', value:'BSBIO'},
        {label:'BSCHEM', value:'BSCHEM'},
        {label:'BSCS', value:'BSCS'},
        {label:'BSMATH', value:'BSMATH'},
        {label:'BSMST', value:'BSMST'},
        {label:'BSSTAT', value:'BSSTAT'},
    ]

    prev_view_state.current = [viewValue];

    const { user, setAuth } = useStore();
    const { isLoading, setIsLoading } = useLoadStore();

    const navigate = useNavigate();     // navigation hook


    //if state changes, this function is executed
    useEffect(()=>{
        setRecord(undefined)
        setIsLoading(true)
        fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student?orderby="+"",
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
                setRecord(json.result.output)
            }else{
                setRecord(undefined)
                setMessage(json.result.message)
            }
        })
        // setIsLoading(false)
        setTimeout(() => setIsLoading(false), 3000)
    },[state]);

    // if students exist/updated, creates an array of checkboxes with the record length
    useEffect(()=>{
        if(record === undefined){""}
        else setCheckedState(new Array(record.length).fill(false))
    }, [record])

    //handles checking of checkbox
    const handleCheckChange=async(position)=>{
        let updatedCheckedState = [];
        checkedState.map((item, index)=>{
            index === position ? item === true? updatedCheckedState.push(false): updatedCheckedState.push(true): updatedCheckedState.push(item)
        })

        await setCheckedState(updatedCheckedState);

        let students = []

        updatedCheckedState.map((item,index)=>{
            {
                if(item == true){

                    students.push(record[index].student_id)
                }
            }
        })

        setStudentsDel(students);
    }

    //if viewValue changes, this function is executed
    useEffect(()=>{
        setIsLoading(true)
        if(prev_view_state.current != [viewValue]){
            prev_view_state.current = [viewValue];
            if (viewValue==="ALL" || viewValue===""){
                setRecord(undefined)
                setMessage("Loading students...")
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student?orderby="+"",
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
                        setRecord(json.result.output)
                    }else{
                        setRecord(undefined)
                        setMessage(json.result.message)
                    }
                })
            } else{
                setRecord(undefined)
                setMessage("Loading students...")
                fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/degree/"+ [viewValue]+"?orderby="+"",
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
                    setRecord(json.result.output)
                }else{
                    setRecord(undefined)
                    setMessage(json.result.message)
                }
            })}
        }
        setIsLoading(false)
    },[viewValue]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true)

        let url = 'http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/search?name=';

        if(searchValue === "student_number"){
            url = 'http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/search?student_number='
        }

        if(input === "" || input === undefined){
            setRecord(undefined)
            setMessage("Loading students...")
            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student?orderby="+"",
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
                setRecord(json.result.output)
            }else{
                setRecord(undefined)
                setMessage(json.result.message)
            }
        })} else {
        if(viewValue !== ""){setViewValue("ALL")}
        setRecord(undefined)
        setMessage("Loading results...")
        fetch(url + input,{
            credentials:'include'
        })
        .then((response) => {return response.json()})
        .then(json => {
            if (json.result.session.silentRefresh) {
                setAuth(json.result.session.user, json.result.session.silentRefresh)
            }
            if(json.result.success){
                // Contains the list of match users
                if(searchValue === "student_number"){
                    setRecord([json.result.output]);
                }else{
                    setRecord(json.result.output);
                }
            }
            else{
                setRecord(undefined)
                setMessage(json.result.message)
            }
        })}
        setIsLoading(false)
    }

    const selectChange=async()=>{
        await setSelectVal(!selectedValue)
    }

    useEffect(()=>{
        let updatedCheckedState = [];

        if(selectedValue===true){
            checkedState.map((item, index)=>{
                updatedCheckedState.push(true)
            })
        }else{
            checkedState.map((item, index)=>{
                updatedCheckedState.push(false)
            })
        }

        setCheckedState(updatedCheckedState);

        let students = []

        updatedCheckedState.map((item,index)=>{
            {
                if(item == true){
                    students.push(record[index].student_id)
                }
            }
        })

        setStudentsDel(students);

    },[selectedValue])

    const searchChange=(e)=>{
        setSearchValue(e.target.value);
    }

    const viewChange=(e)=>{
        setViewValue(e.target.value);
    }

    const handleUserInput = (e) => {
        input = e.target.value;
        if (viewValue!=="ALL" || viewValue!==""){
            setViewValue("ALL")
        }
    }

    const confirmDelete= async(decision, reason) =>{
        setShowConfirmation(false)
        setIsLoading(true)
        if(decision){
            const student = toDelete.student_id
            await fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/'+student+'/'+user.user_id,{
                method: "DELETE",
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    details: reason,
                    user_id: user.user_id,
                }) 
            }).then(response =>{ return response.json()})
            .then(json=>{
                if (json.result.session.silentRefresh) {
                    setAuth(json.result.session.user, json.result.session.silentRefresh)
                }
                if(json.result.success){
                    notifySuccess(json.result.message)
                    changeState(!state)
                }
            })
        }
        setIsLoading(false)
    }

    const confirmDeleteMany= async(decision, reason) =>{
        setShowConfirmationMany(false)
        setIsLoading(true)
        if(decision){
            await fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/delete/'+user.user_id,{
                method: "DELETE",
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    details: reason,
                    students_to_delete: studentsToDel,
                }) 
            }).then(response =>{ return response.json()})
            .then(json=>{
                if (json.result.session.silentRefresh) {
                    setAuth(json.result.session.user, json.result.session.silentRefresh)
                }
                if(json.result.success){
                    notifySuccess(json.result.message)
                    changeState(!state)
                    changeState(!state)
                }else{
                    notifyError(json.result.message)
                }
            })
        }
        if(selectedValue===true){
            await setRecord([]);
            await changeState(!state)
            await changeState(!state)
            setSelectVal(false);
        }
        setIsLoading(false)
    }

    const onDelete=(student)=>{
        setShowConfirmation(true)
        setToDelete(student);
    }

    const onDeleteMany = ()=>{
        setShowConfirmationMany(true);
        setToDelete(studentsToDel);
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
        
            <p className="title">Student Records {record?<span> {record.length}</span>:""}</p>

            <hr className='add-line'></hr>      

            <div className='view-student-header'>
                <ul className='view-student-list'>
                    <li><DropDown options={searchFilter} className='view-student-dropdown' value = {searchValue} onChange={searchChange} type ="search"/></li>
                    <li><DropDown options={viewFilter} className='view-student-dropdown' value = {viewValue} onChange={viewChange} type="view"/></li>
                </ul>
            </div>
            <div className='view-student-search'>
                <input type = "text" className = 'view-student-input' placeholder = "🔎 Search a student record" value = {input} onChange = {handleUserInput} required></input>
                <a onClick={handleSubmit} ><BsSearch className='student-search-icon'/></a>      
            </div>
            <div className='view-student-preview'>
                { 
                    record != undefined ? 
                    <div className='student-table-wrap'>
                    <table className='view-student-table'>
                        <thead className='view-student-thead'>
                            {
                                isLoading? <></> :
                                <tr className='header-row'>
                                    <th className='student-header'><input className='general-checkbox'type = 'checkbox' checked = {selectedValue} value = {selectedValue} onChange={selectChange} /><AiFillDelete onClick={()=>{onDeleteMany()}} className='delete-many-icon'/></th>
                                    <th className='student-header' style ={{textAlign:'left', paddingLeft: '20px'}}>NAME</th>
                                    <th className='student-header'>STUDENT NUMBER</th>
                                    <th className='student-header'>DEGREE PROGRAM</th>
                                    <th className='student-header'></th>
                                </tr>
                            }
                            
                        </thead>
                        
                        <tbody className = 'view-student-tbody'>
                            {
                                // Display loader
                                isLoading ? <Row_Loader type='STUDENTS_LIST' />

                                // Display data
                                : record.map((rec, i) => {
                                    return (
                                        <tr key={i} className='view-student-element' style={{}}>
                                            <td className='student-cell'><input className='student-checkbox'style ={{paddingLeft:'10px'}} type = 'checkbox' checked = {checkedState[i]} value = {checkedState[i]} onChange={()=>handleCheckChange(i)}></input></td>
                                            <td className='student-cell' onClick={()=> navigate('/student/'+rec.student_id)} style ={{textAlign:'left', paddingLeft: '20px'}}><div style={{float:'left'}}>{rec.last_name}, {rec.first_name}{rec.middle_name? ', '+rec.middle_name:""} {rec.suffix ? ', ' + rec.suffix + " ": ''}</div> {rec.warning_count > 0? <div className="student-warning-badge"><RiAlertLine />
                                            <span className='badge-text'>no. of warnings: {rec.warning_count}</span></div> : ""}</td>
                                            <td className='student-cell' onClick={()=> navigate('/student/'+rec.student_id)}>{rec.student_number}</td>
                                            <td className='student-cell' onClick={()=> navigate('/student/'+rec.student_id)}>{rec.degree_program}</td>
                                            <td className='student-cell' style ={{textAlign:'right', paddingRight: '30px'}} onClick={()=>{onDelete(rec)}}><AiFillDelete className='view-student-delete-icon'/></td>
                                        </tr>                                        
                                    );
                                })
                            }
                        </tbody>
                        {showConfirmation===true? <DeletePopup props={{confirmDelete: confirmDelete.bind()}} />:""}
                        {showConfirmationMany===true? <DeletePopup props={{confirmDelete: confirmDeleteMany.bind()}}/>:""}
                    </table></div>:
                <div className='empty-students'>
                    <p>{message}</p>
                    {message==="Loading students..."?"":message==="Loading results..."?"":<button onClick={()=> navigate('/student/new')}> Add Student Records</button>}
                </div>
                }
            </div>
        </div>
        <Header />
        <Menu />
        <ToastContainer className='toast-container'/>
        <Footer />
    </div>
    );
}

export default View_Students;