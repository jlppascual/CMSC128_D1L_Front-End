import React, {useState, Fragment, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../hooks/authHook'
import Menu from '../components/Menu'
import Header from '../components/Header';
import Footer from '../components/Footer';
import Read_Row from '../components/Read_Row';
import Edit_Row from '../components/Edit_Row';
import DeletePopup from '../components/Popups/DeletePopup';
import {BiEdit, BiTrash}  from 'react-icons/bi';
import {RiAlertLine}  from 'react-icons/ri';
import '../../css/studentdetails.css'


const View_Student_Details =()=>{
    const[pageState, setPage] = useState(false)
    const[editable, setEditable] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState("")
    const [showCancelConfirmation, setShowCancelConfirmation] = useState("")
    
    const [state, setState]= useState({
        student_details:[],
        record_details:[],
        term_details:[],        
    })

    let edited_courses=[]
    let empty_field = [];

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
                //console.log(json.result.output.record)
                setState(
                    {student_details:json.result.output.record,
                    record_details:json.result.output.record.record_data,
                    term_details:json.result.output.record.record_data.term_data,
                    course_details:json.result.output.record.record_data.term_data.course_data})         
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

    const handleClick=(event)=>{
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
        if(edited_courses.length == 0){
            alert("No changes made")
            setEditable(false)
        }
        else{
            setShowCancelConfirmation(true)
        }
    }
    
    const handleUpdate=async(event)=>{
        if (empty_field === 1){
            alert("Complete missing fields")
        } 
        else if(edited_courses.length === 0){
            alert("No changes made")
            setEditable(false)
        }
        else {
            event.preventDefault();
            setEditable(false)
            fetch("http://localhost:3001/api/0.1/student/"+ state.student_details.student_id, {
                method:'PATCH',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    changed_courses:edited_courses,
                    user_id: user.user_id,
                    details: "Kunwari nag-edit"
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

    const updateCourse=(empty, updatedCourse)=>{
        edited_courses = edited_courses.filter(course => course.course_id !== updatedCourse.course_id)
        edited_courses.push(updatedCourse)
        
        console.log(edited_courses)
        empty_field = empty
    }

    const CancelPopup=({})=>{
        return(
            <div className="popup-box">
                    <p className='cancel-text'>Are you sure you want to cancel all the changes?</p>
                    
                    <div className='buttons'>
                        <button onClick={() => {setShowCancelConfirmation(false)}} className = 'no-btn'>No</button>
                        <button onClick={() => {setShowCancelConfirmation(false), setEditable(false);}} className = 'yes-btn'>Yes</button>
                    </div>
            </div>
        )
    }

    return(
        <div>
        <div className='details-body'>
            
            <div className = "top-header">
                <div className='icons'>
                    <i className = "icon"><RiAlertLine size= {25}/></i>
                    <i className = "icon" onClick={handleClick}><BiEdit size= {25}/></i>
                    <i className = "icon" onClick={handleDelete}><BiTrash size= {25}/></i>
                    
                </div>
                <p className="student-name">{state.student_details.last_name}, {state.student_details.first_name} {state.student_details.middle_name} {state.student_details.suffix} </p>
            <hr className='line'></hr></div>
            
            < div className='student-record'>
            Degree Program: {state.student_details.degree_program} <br/>  
            Student No.: {state.student_details.student_number}<br/>
            Total Units: {state.record_details.total_units}  <br/>
            GWA: {state.record_details.gwa}<br/>
            
            <br/><br/>

            {state.term_details!=[]? state.term_details.map((term, i)=>{
                return <span key={i}>{term.semester}/{term.acad_year} total weights: {term.total_weights} total units: {term.no_of_units} <br/>
                <form>
                    <table>
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Grade</th>
                                <th>Units</th>
                                <th>Weight</th>
                                <th>Enrolled</th>
                                <th>Term</th>
                            </tr>
                        </thead>
                        <tbody>
                            {term.course_data!=[]? term.course_data.map((course,i)=>(
                                <Fragment key={i}>
                                    {editable === true ? (
                                    <Edit_Row func={{updateCourse: updateCourse.bind()}} course = {course} />
                                    ) : (
                                    <Read_Row course = {course} />
                                    ) }
                                </Fragment>
                            )):""}
                        </tbody>
                    </table>
                </form>
                {showDeleteConfirmation ? <DeletePopup props={{confirmDelete: confirmDelete.bind()}} />:""}
                {showCancelConfirmation ? <CancelPopup />:""}
                
                </span>
                
            }):""}</div>
            <div className = "bottom-space">
                {editable === true ? <span>
                    <button type = "button" onClick={handleCancel} className="cancel-edit-btn">Cancel Editing</button>
                    <button type = "button" onClick={handleUpdate} className="submit-btn">Submit Changes</button>
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