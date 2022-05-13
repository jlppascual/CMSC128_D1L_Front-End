import React, {useState, Fragment, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../hooks/authHook'
import Menu from '../components/Menu'
import Header from '../components/Header';
import Footer from '../components/Footer';
import Read_Row from '../components/Read_Row';
import Edit_Row from '../components/Edit_Row';
import DeletePopup from '../components/Popups/DeletePopup';
import DetailsPopup from '../components/Popups/DetailsPopup';
import {BiEdit, BiTrash}  from 'react-icons/bi';
import {RiAlertLine}  from 'react-icons/ri';
import '../../css/studentdetails.css'

const View_Student_Details =()=>{
    const[pageState, setPage] = useState(false)
    const[editable, setEditable] = useState(false);
    const[warnings, setWarnings] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState("")
    const [showCancelConfirmation, setShowCancelConfirmation] = useState("")
    const [showEditConfirmation, setShowEditConfirmation] = useState("")
    const [showWarnings, setShowWarnings] = useState(false)
    
    const [state, setState]= useState({
        student_details:[],
        record_details:[],
        term_details:[],        
    })

    let new_courses=[]

    const { user, isAuthenticated } = useStore();
    const navigate = useNavigate();     // navigation hook

    useEffect(()=>{
        if(!isAuthenticated) {
            navigate('/')
            alert("You are not logged in!")}
        else{
            const link = window.location.href
            const id = link.slice(link.lastIndexOf('/')+1,link.length)
            // console.log(id)
            fetch('http://localhost:3001/api/0.1/student/'+id,{
                method:'GET',
                credentials:'include'
            }).then(response=> {return response.json()})
            .then(json=>{
                setState(
                    {student_details:json.result.output.record,
                    record_details:json.result.output.record.record_data,
                    term_details:json.result.output.record.record_data.term_data,
                    course_details:json.result.output.record.record_data.term_data.course_data,
                    warnings:json.result.output.warnings })         
            })
        }
    },[isAuthenticated, pageState])
    
    const handleDelete=(event)=>{
        event.preventDefault();
        setShowDeleteConfirmation(true)
    }

    const confirmDelete = async(decision)=>{
        setShowDeleteConfirmation(false)
        if(decision){
            const student = state.student_details.student_id
            await fetch('http://localhost:3001/api/0.1/student/'+student+'/'+user.user_id,{
                method: "DELETE",
                credentials:'include'
            }).then(response =>{ return response.json()})
            .then(json=>{
                if(json.result.success){
                    window.alert(json.result.message)
                    navigate('/students')
                }
            })
        }
    }

    const handleWarnings = (event) => {
        event.preventDefault();
        setShowWarnings(!showWarnings)
    }

    const handleEdit=(event)=>{
        event.preventDefault();
        if(editable === true){
            setShowCancelConfirmation(true)
        }
        else{
            setEditable(true)
        }
    }

    const handleCancel=(event)=>{
        event.preventDefault();
        setShowCancelConfirmation(true)
        
    }
    
    const handleUpdate=async(event)=>{
        event.preventDefault();
        if (!isCompleteFields(new_courses)){
            alert("Please complete missing fields")
        }
        else setShowEditConfirmation(true)
        
    }
    const confirmEdit = async(decision,details)=>{
        setShowEditConfirmation(false)
        document.getElementById("submit-changes-btn").disabled = false;
        document.getElementById("cancel-editing-btn").disabled = false;
        if(decision){
            const edited = getEdits();
            const new_terms = edited.terms;
            const new_record = edited.record;
            setEditable(false)
            const updatedStudent = {
                new_courses,
                new_terms,
                new_record,
            }
            console.log(details)
            console.log(updatedStudent)

            fetch("http://localhost:3001/api/0.1/student/"+ state.student_details.student_id, {
                method:'PATCH',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    updatedStudent,
                    details,
                    user_id: user.user_id,
                    
                }) 
            })
            .then((response) => {return response.json()})
            .then(json => {
                if(json.result.success){
                    const student = state.student_details
                    const full_name = student.first_name+" "+student.last_name+", "+student.degree_program+":\n"
                    let message =  full_name+json.result.message
                    alert(message)
                    setPage(!pageState)
                }
            })
        }
    }

    const getEdits = () =>{
        let terms_count = state.term_details.length
        let terms = []
        let temp_term;
        for (let i = 0; i < terms_count; i++) {
            let term_id = state.term_details[i].term_id
            let total_weights = Number(document.getElementsByName("weights-term"+i)[0].innerHTML)
            let no_of_units = document.getElementsByName("units-term"+i)[0].innerHTML
            temp_term = {term_id,total_weights,no_of_units}
            terms.push(temp_term)
        }
        let cumulative_sum = document.getElementsByName("record-cumulative")[0].innerHTML;
        let total_units = document.getElementsByName("record-units")[0].innerHTML;
        let gwa = document.getElementsByName("record-gwa")[0].innerHTML
        let record = {record_id:state.record_details.record_id,cumulative_sum, total_units, gwa}
        return {terms,record}
    }

    const isCompleteFields = (courses) =>{
        let flag = true;
        for (let i = 0; i < courses.length; i++) {
            if (courses[i].course_code === "" || courses[i].grade === "" || courses[i].units === "" ){
                flag = false;
                break;
            }
        }
        return flag;
    }

    const updateCourse=(updatedCourse)=>{
        new_courses = new_courses.filter(course => course.course_id !== updatedCourse.course_id)
        new_courses.push(updatedCourse)
    }

    const CancelPopup=({})=>{
        return(
            <div className="popup-box">
                <p className='cancel-text'>Are you sure you want to cancel editing?</p>
                
                <div className='buttons'>
                    <button onClick={() => {setShowCancelConfirmation(false)}} className = 'no-btn'>No</button>
                    <button onClick={() => {setShowCancelConfirmation(false), setEditable(false);}} className = 'yes-btn'>Yes</button>
                </div>
            </div>
        )
    }

    const WarningPopup=({})=>{
        console.log(state.warnings)
        return(
            <div className="warning-popup-box">
                <h3 className='warning-header'>Record Warnings</h3>
                {state.warnings.length > 0? 
                <div className='warnings-body'>
                    {state.warnings.map((warning,i) => {
                        return <div key = {i} className = "warning">
                            <h5>{warning.course}</h5>
                            <h5>{warning.term}</h5>
                            
                            <p>{warning.details}</p>
                            <span>{warning.warning_type}</span>
                        </div>
                    })}
                </div>
                : <p>No record warnings found</p>}
            </div>
        )
    }

    return(
        <div>
        <div className='details-body'>
            
            <div className = "top-header">
                <div className='icons'>
                    <i className = "icon" onClick={handleEdit}><BiEdit size= {25}/></i>
                    <i className = "icon" onClick={handleDelete}><BiTrash size= {25}/></i>
                    <i className = "icon" onClick={handleWarnings}><RiAlertLine size= {25}/></i>
                    {state.warnings && state.warnings.length > 0? <span className="warning-badge">{state.warnings.length}</span>
                    : ""}
                </div>
                <p className="student-name">{state.student_details.last_name}, {state.student_details.first_name} {state.student_details.middle_name} {state.student_details.suffix} </p>
                <hr className='student-line'></hr>
            </div>
            
            < div className='student-record'>
            <div className='student-info-left'>
                <div><b>Degree Program:</b> <span className='info-l'>{state.student_details.degree_program}</span></div>  <br/>
                <div><b>Student No.:</b> <span className='info-l'>{state.student_details.student_number}</span></div> <br/>
                <div><b>Latin Honor:</b> {state.student_details.latin_honor !== ""?<span name={"record-gwa"} className='info-l'> {state.student_details.latin_honor}</span>: <span name={"record-gwa"} className='info-l'>-</span>}</div><br/>
            </div>
            <div className='student-info-right'>
                <div><b>Total weights:</b> <span name={"record-cumulative"} className='info-r'>{state.record_details.cumulative_sum}</span></div>  <br/>
                <div><b>Total Units:</b> <span name={"record-units"} className='info-r'>{state.record_details.total_units}</span></div>  <br/>
                <div><b>GWA:</b> <span name={"record-gwa"} className='info-r'>{state.record_details.gwa}</span></div><br/>
            </div>
            <br/>
            <hr className='record-line'></hr>
            <br/>
            <div className='record'>
            {state.term_details!=[]? state.term_details.map((term, i)=>{
                let headStyle = {textAlign:'left'}
                return <span key={i} name = {"term"+i}>
                <form>
                    <table className='record-table'>
                        <thead className='record-head'>
                            <tr style={headStyle}>
                                <th style = {{paddingLeft:'40px'}}>Course Code</th> 
                                <th style = {{paddingLeft:'40px'}}>Grade</th>
                                <th style = {{paddingLeft:'40px'}}>Units</th>
                                <th style = {{paddingLeft:'40px'}}>Weight</th>
                                <th style = {{paddingLeft:'40px'}}>Enrolled</th>   
                            </tr>

                        </thead>
                        
                        <tbody>
                            <tr style={headStyle}>
                                <td colSpan="100%" ><hr /></td>
                            </tr>
                            {term.course_data!=[]? term.course_data.map((course,index)=>(
                                <Fragment key={index}>
                                    {editable === true ? (
                                    <Edit_Row func={{updateCourse: updateCourse.bind()}} term_index = {i} course = {course} index = {index}/>
                                    ) : (
                                    <Read_Row course = {course} index = {index}/>
                                    ) }
                                </Fragment>
                                
                            )):""}
                        </tbody>
                    </table>
                </form>
                <div className = "term-summary">
                Term: <u>{term.semester}/{term.acad_year}</u> &nbsp;&nbsp;&nbsp;&nbsp;  <span >|</span> &nbsp;&nbsp;&nbsp;&nbsp;
                Total units: <u name = {"units-term"+i}>{term.no_of_units}</u> &nbsp;&nbsp;&nbsp;&nbsp;  <span >|</span> &nbsp;&nbsp;&nbsp;&nbsp;
                Total weights: <u name = {"weights-term"+i}>{term.total_weights} </u> &nbsp;&nbsp;&nbsp;&nbsp;<span>|</span> &nbsp;&nbsp;&nbsp;&nbsp;
                GPA: <u name = {"gpa-term"+i}>{parseFloat((term.total_weights/term.no_of_units).toFixed(4))} </u>
                </div>
                <br/>
                </span>
                
            }):""}</div></div>
            {showDeleteConfirmation ? <DeletePopup props={{confirmDelete: confirmDelete.bind()}} />:""}
            {showEditConfirmation ? <DetailsPopup props={{confirmEdit: confirmEdit.bind()}} />:""}
            {showCancelConfirmation ? <CancelPopup />:""}
            {showWarnings ? <WarningPopup />:""}
            <div className = "bottom-space">
                {editable === true ? <span>
                    <button type = "button" onClick={handleCancel} className="cancel-edit-btn" id="cancel-editing-btn">Cancel Editing</button>
                    <button type = "button" onClick={handleUpdate} className="submit-btn" id="submit-changes-btn">Submit Changes</button>
                    </span>:""}
            </div>
        </div>
        
        <Header/>
        <Menu />
        <Footer/>
        </div>
    )
}


export default View_Student_Details;