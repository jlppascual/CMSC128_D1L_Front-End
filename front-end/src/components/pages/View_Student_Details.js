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

const View_Student_Details =()=>{
    const[pageState, setPage] = useState(false)
    const[editable, setEditable] = useState(false);
    const {REACT_APP_HOST_IP} = process.env
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState("")
    const [showCancelConfirmation, setShowCancelConfirmation] = useState("")
    const [showEditConfirmation, setShowEditConfirmation] = useState("")
    const [showWarnings, setShowWarnings] = useState(false)
    const [new_courses, setNewCourses] = useState([])
    
    const [state, setState]= useState({
        student_details:[],
        record_details:[],
        term_details:[],        
    })

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
            fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/'+id,{
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
            await fetch('http://'+REACT_APP_HOST_IP+':3001/api/0.1/student/'+student+'/'+user.user_id,{
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
    
    const handleUpdate=()=>{
        if (!isCompleteFields()){
            alert("Please complete missing fields")
        }
        else if(!checkChanges()){
            alert("Please apply changes first")
        }
        else {
            setNewCourses(getCourses())
            setShowEditConfirmation(true)
        }
        
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

    const isCompleteFields = () =>{
        let temp;
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

        // for (let i = 0; i < courses.length; i++) {
        //     if (courses[i].course_code === "" || courses[i].grade === "" || courses[i].units === "" ){
        //         flag = false;
        //         return flag;
        //     }
        // }
        // return flag;
    }

    const checkChanges = () =>{
       let temp;
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
                    <i className = "icon" onClick={handleEdit}><BiEdit size= {25}/></i>
                    <i className = "icon" onClick={handleDelete}><BiTrash size= {25}/></i>
                    <i className = "icon" onClick={handleWarnings}><RiAlertLine size= {25}/></i>
                    {state.warnings && state.warnings.length > 0? <span className="warning-badge">{state.warnings.length}</span>
                    : ""}
                </div>:""
                }
                {!state.student_details.isDeleted?
                <i className = "back-icon" onClick={()=> navigate('/students')}><BiArrowBack size= {30} /></i>:""}
                {!state.student_details.isDeleted?
                <p className="student-name">{state.student_details.last_name}, {state.student_details.first_name} {state.student_details.middle_name} {state.student_details.suffix} </p>
                : <p className="student-name" style={{marginLeft:'16.5%'}}>{state.student_details.last_name}, {state.student_details.first_name} {state.student_details.middle_name} {state.student_details.suffix} </p>
                }
                {editable === true ? <span>
                    <button type = "button" onClick={handleCancel} className="cancel-edit-btn" id="cancel-editing-btn">Cancel Editing</button>
                    <button type = "button" onClick={handleUpdate} className="submit-edit-btn" id="submit-changes-btn">Submit Changes</button>
                    </span>:""}
                <hr className='student-line'></hr>
            </div>
            
            < div className='student-record'>
            <div className='student-info-left'>
                <div><b>Degree Program:</b> <span className='info-l'>{state.student_details.degree_program}</span></div>  <br/>
                <div><b>Student No.:</b> <span className='info-l'>{state.student_details.student_number}</span></div> <br/>
                <div><b>Latin Honor:</b> {state.student_details.latin_honor !== ""?<span className='info-l'> {state.student_details.latin_honor}</span>: <span className='info-l'>-</span>}</div><br/>
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
        <Footer/>
        </div>
    )
}


export default View_Student_Details;