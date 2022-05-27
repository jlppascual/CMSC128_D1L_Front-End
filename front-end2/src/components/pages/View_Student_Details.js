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
import {BiEdit, BiTrash, BiArrowBack}  from 'react-icons/bi';
import {RiAlertLine}  from 'react-icons/ri';
import '../../css/studentdetails.css'
import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from '../components/Popups/toastNotifUtil';
import '../../css/toast_container.css';

const View_Student_Details =()=>{

    const {REACT_APP_HOST_IP} = process.env
    const[pageState, setPage] = useState(false)
    const[editable, setEditable] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState("")
    const [showCancelConfirmation, setShowCancelConfirmation] = useState("")
    const [showEditConfirmation, setShowEditConfirmation] = useState("")
    const [showWarnings, setShowWarnings] = useState(false)
    const [new_courses, setNewCourses] = useState([])
    const [new_degree, setDegree] = useState("")
    const [new_studno, setStudno] = useState("")
    const [new_fullname, setNewName] = useState({
        last_name:"",
        first_name:"",
        middle_name:"",
        suffix:""
    })
    const [state, setState]= useState({
        student_details:[],
        record_details:[],
        term_details:[],        
    })

    const { user, setAuth } = useStore();
    const navigate = useNavigate();     // navigation hook

    useEffect(()=>{
        const link = window.location.href
        const id = link.slice(link.lastIndexOf('/')+1,link.length)
        fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/'+id,{
            method:'GET',
            credentials:'include'
        }).then(response=> {return response.json()})
        .then(json=>{
            if (json.result.session.silentRefresh) {
                setAuth(json.result.session.user, json.result.session.silentRefresh)
            }
            setState(
                {student_details:json.result.output.record,
                record_details:json.result.output.record.record_data,
                term_details:json.result.output.record.record_data.term_data,
                course_details:json.result.output.record.record_data.term_data.course_data,
                warnings:json.result.output.warnings })         
        })
    },[pageState])

    useEffect(()=>{
        setDegree(state.student_details.degree_program);
        setStudno(state.student_details.student_number);
        setNewName({
            last_name: state.student_details.last_name,
            first_name: state.student_details.first_name,
            middle_name: state.student_details.middle_name,
            suffix: state.student_details.suffix
        })
    },[state])
    
    const handleDelete=(event)=>{
        event.preventDefault();
        setShowDeleteConfirmation(true)
    }

    const confirmDelete = async(decision)=>{
        setShowDeleteConfirmation(false)
        if(decision){
            const student = state.student_details.student_id
            await fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/'+student+'/'+user.user_id,{
                method: "DELETE",
                credentials:'include'
            }).then(response =>{ return response.json()})
            .then(json=>{
                if (json.result.session.silentRefresh) {
                    setAuth(json.result.session.user, json.result.session.silentRefresh)
                }
                if(json.result.success){
                    notifySuccess(json.result.message)
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
    
    const handleUpdate=()=>{
        
        if (!isCompleteFields()){
            notifyError("Please complete missing fields")
        }
        else if(!checkChanges()){
            notifyError("Please apply changes first")
        }
        else {
            setNewCourses(getCourses())
            setShowEditConfirmation(true)
        }
        
    }
    const confirmEdit = async(decision,details)=>{
        const studno_format = /^20[0-9]{2,}-[0-9]{5,}$/

        if(!new_studno.match(studno_format)){
            notifyError("invalid student number format")
            setStudno(state.student_details.student_number)
        }else{
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
                new_details: {
                    last_name: new_fullname.last_name,
                    first_name: new_fullname.first_name,
                    middle_name: new_fullname.middle_name,
                    suffix: new_fullname.suffix,
                    student_number: new_studno,
                    degree_program: new_degree
                }
            }

            fetch("http://"+REACT_APP_HOST_IP+":3001/api/0.1/student/"+ state.student_details.student_id, {

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
                    if (json.result.session.silentRefresh) {
                        setAuth(json.result.session.user, json.result.session.silentRefresh)
                    }
                    if(json.result.success){
                        const student = state.student_details
                        const full_name = student.first_name+" "+student.last_name+", "+student.degree_program+":\n"
                        let message =  full_name+json.result.message
                        notifySuccess(message)
                        setPage(!pageState)
                    }else{
                        setDegree(state.student_details.degree_program)
                        setStudno(state.student_details.student_number)
                    notifyError(json.result.message)}
                })
            }
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

    const isCompleteFields = () =>{
        let temp;
        if(document.getElementsByName('last_name') == "") return false;
        if(document.getElementsByName('first_name') == "") return false;
        if(document.getElementsByName('student_number') == "") return false;
        if(document.getElementsByName('degree_program') == "") return false;


        const terms = state.term_details
        for (let i = 0; i < terms.length; i++) {
            for (let j = 0; j < terms[i].course_data.length; j++) {
                temp = document.getElementsByName("code-"+i+"-"+j)[0]
                if(!temp) return false
                else if(temp && temp.value === "") return false
                temp = document.getElementsByName("grade-"+i+"-"+j)[0]
                if(!temp) return false
                else if(temp && temp.value === "") return false
                temp = document.getElementsByName("units-"+i+"-"+j)[0]
                if(!temp) return false
                else if(temp && temp.value === "") return false
            }
        }
        return true
    }

    const checkChanges = () =>{
       let temp;

       if(document.getElementsByName("first_name")!==state.student_details.first_name) return true;
       if(document.getElementsByName("last_name")!==state.student_details.last_name) return true;
       if(document.getElementsByName("middle_name")!==state.student_details.middle_name) return true;
       if(document.getElementsByName("suffix")!==state.student_details.suffix) return true;
       if(document.getElementsByName("student_number")!==state.student_details.student_number) return true;
       if(document.getElementsByName("degree_program")!==state.student_details.degree_program) return true;

        const terms = state.term_details
        for (let i = 0; i < terms.length; i++) {
            for (let j = 0; j < terms[i].course_data.length; j++) {
                
                temp = document.getElementsByName("code-"+i+"-"+j)[0]
                if(temp && temp.value !== terms[i].course_data[j].course_code) return true
                temp = document.getElementsByName("grade-"+i+"-"+j)[0]
                if(temp && temp.value !== terms[i].course_data[j].grade) return true
                temp = document.getElementsByName("units-"+i+"-"+j)[0]
                if(temp && temp.value !== terms[i].course_data[j].units) return true
                temp = document.getElementsByName("weight-"+i+"-"+j)[0]
                if(temp && temp.value !== terms[i].course_data[j].weight.toString()) return true
                temp = document.getElementsByName("cumulated-"+i+"-"+j)[0]
                if(temp && temp.value !== terms[i].course_data[j].cumulated.toString()) return true
            }
        }
        return false
    }

    const getCourses = () =>{
        let courses = [];
         const terms = state.term_details
         for (let i = 0; i < terms.length; i++) {
             for (let j = 0; j < terms[i].course_data.length; j++) {
                 courses.push({
                    course_id: terms[i].course_data[j].course_id,
                    term_id: terms[i].course_data[j].term_id,
                    course_code: document.getElementsByName("code-"+i+"-"+j)[0].value,
                    grade: document.getElementsByName("grade-"+i+"-"+j)[0].value,
                    units: document.getElementsByName("units-"+i+"-"+j)[0].value,
                    weight: Number(document.getElementsByName("weight-"+i+"-"+j)[0].value),
                    cumulated: Number(document.getElementsByName("cumulated-"+i+"-"+j)[0].value)
                 })
             }
         }
         return courses
     }

    const CancelPopup=({})=>{
        return(
            <div className="cancel-popup-box">
                <p className='cancel-text'>Are you sure you want to cancel editing?</p>
                
                <div className='cancel-edit-buttons'>
                    <button onClick={() => {setShowCancelConfirmation(false)}} className = 'no-btn'>No</button>
                    <button onClick={() => {setShowCancelConfirmation(false), setEditable(false);}} className = 'yes-btn'>Yes</button>
                </div>
            </div>
        )
    }

    const WarningPopup=({})=>{
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
            {state.student_details.isDeleted? <div className='deleted-watermark'>DELETED STUDENT RECORD</div>:""}
            <div className = "top-header">
                {!state.student_details.isDeleted?
                <div className='icons'>
                    <i className = "icon" onClick={handleEdit}><BiEdit size= {25} title="Edit student record"/></i>
                    <i className = "icon" onClick={handleDelete}><BiTrash size= {25} title="Delete student record"/></i>
                    <i className = "icon" onClick={handleWarnings}><RiAlertLine size= {25} title="Warnings"/></i>
                    {state.warnings && state.warnings.length > 0? <span className="warning-badge">{state.warnings.length}</span>
                    : ""}
                </div>:""
                }
                {!state.student_details.isDeleted?
                <i className = "back-icon" onClick={()=> navigate('/students')}><BiArrowBack size= {30} /></i>:""}
                {!state.student_details.isDeleted? 
                    editable == true? (
                        <div className='student-edit-name-container'>
                        <input className="student-edit-name" name='last_name'
                            type = "text"
                            required = "required"
                            placeholder= "Enter last name"
                            value = {new_fullname.last_name}
                            onChange = {(e)=>{setNewName({
                                last_name: e.target.value,
                                first_name: new_fullname.first_name,
                                middle_name: new_fullname.middle_name,
                                suffix: new_fullname.suffix
                            })}}
                        ></input>
                        <input className="student-edit-name" name='first_name'
                            type = "text"
                            required = "required"
                            placeholder= "Enter first name"
                            value = {new_fullname.first_name}
                            onChange = {(e)=>{setNewName({
                                last_name: new_fullname.last_name,
                                first_name: e.target.value,
                                middle_name: new_fullname.middle_name,
                                suffix: new_fullname.suffix
                            })}} 
                        ></input>
                        <input className="student-edit-name" name='middle_name'
                            type = "text"
                            required = "required"
                            placeholder= "Enter middle name"
                            value = {new_fullname.middle_name} 
                            onChange = {(e)=>{setNewName({
                                last_name: new_fullname.last_name,
                                first_name: new_fullname.first_name,
                                middle_name: e.target.value,
                                suffix: new_fullname.suffix
                            })}}
                        ></input>
                        <input className="student-edit-name" name='suffix'
                            type = "text"
                            required = "required"
                            placeholder= "Enter suffix name"
                            value = {new_fullname.suffix}
                            onChange = {(e)=>{setNewName({
                                last_name: new_fullname.last_name,
                                first_name: new_fullname.first_name,
                                middle_name: new_fullname.middle_name,
                                suffix: e.target.value
                            })}}
                        ></input></div>
                    )
                    :
                    (<p className="student-name">{state.student_details.last_name}, {state.student_details.first_name} {state.student_details.middle_name} {state.student_details.suffix} </p>)
                : <p className="student-name" style={{marginLeft:'16.5%'}}>{state.student_details.last_name}, {state.student_details.first_name} {state.student_details.middle_name} {state.student_details.suffix} </p>
                }
                {editable === true ? <span className='edit-btns'>
                    <button type = "button" onClick={handleCancel} className="cancel-edit-btn" id="cancel-editing-btn">Cancel Editing</button>
                    <button type = "button" onClick={handleUpdate} className="submit-edit-btn" id="submit-changes-btn">Submit Changes</button>
                    </span>:""}
                <hr className='student-line'></hr>
            </div>
            
            < div className='student-record'>
                {editable == true? (
                <div className='student-info-edit-left'>
                    <tr><b>Degree Program:</b><input className="edit-top-cell"
                        name = 'degree_program'
                        type = "text"
                        required = "required"
                        placeholder= "Enter degree program"
                        value = {new_degree}
                        onChange={(e)=>{setDegree(e.target.value)}}
                    ></input><br/></tr>
                    <tr><b>Student No.:</b><input className="info-edit-cell"
                        name = "student_number"
                        type = "text"
                        required = "required"
                        placeholder= "Enter student number"
                        value = {new_studno} 
                        onChange={(e)=>{setStudno(e.target.value)}}
                    ></input><br/></tr>
                    <tr><b>Latin Honor:</b> <input className = "info-edit-cell"
                        type = "text"
                        required = "required"
                    defaultValue = {state.student_details.latin_honor} 
                    ></input><br/></tr>
                </div>)
                :(
                <div className='student-info-left'>
                    <div><b>Degree Program:</b><span className='info-l'>{state.student_details.degree_program}</span></div><br/>
                    <div><b>Student No.:</b><span className='info-l'>{state.student_details.student_number !==""? state.student_details.student_number:'-'}</span></div><br/>
                    <div><b>Latin Honor:</b> {state.student_details.latin_honor !== ""?<span className='info-l'> {state.student_details.latin_honor}</span>: <span className='info-l'>-</span>}</div><br/>
                </div>)}
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
                                    <Edit_Row  term_index = {i} course = {course} index = {index}/>
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
            </div>
        </div>
        
        <Header/>
        <Menu />
        <ToastContainer className='toast-container'/>
        <Footer/>
        </div>
    )
}


export default View_Student_Details;