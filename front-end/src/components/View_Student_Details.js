import React, {useState, Fragment, useEffect} from 'react'
import {VscSettings}  from 'react-icons/vsc';
import Header from './Header';
import Footer from './Footer';
import Read_Row from './Read_Row';
import Edit_Row from './Edit_Row';


const View_Student_Details =()=>{
    const[editable, setEditable] = useState(false);
    const [state, setState]= useState({
        student_details:[],
        record_details:[],
        term_details:[],
        pageState:false,
        
    })
    let changed_courses = [];

    useEffect(()=>{
        const link = window.location.href
        const id = link.slice(link.lastIndexOf('/')+1,link.length)
        console.log(id)
        fetch('http://localhost:3001/api/0.1/student/'+id,{
            method:'GET'
        }).then(response=> {return response.json()})
        .then(json=>{
            //console.log(json.result.output.record)
            setState(
                {student_details:json.result.output.record,
                record_details:json.result.output.record.record_data,
                term_details:json.result.output.record.record_data.term_data,
                course_details:json.result.output.record.record_data.term_data.course_data})         
        })
    },[state.pageState])
   
   const handleClick=(event)=>{
        event.preventDefault();
        setEditable(!editable)
        console.log(editable)
    }
    
    const handleUpdate=(event)=>{
        event.preventDefault();
        setEditable(!editable)
        // update state?
        fetch("http://localhost:3001/api/0.1/student/"+ state.student_details.student_id, {
            method:'PATCH',
             headers:{
                 'Content-Type':'application/json'
             },
             body: JSON.stringify({
                 changed_courses,
                 user_id: "361b1b68-cf4a-4887-bec0-29884e2942ef",
                 details: "Kunwari nag-edit"
             }) 
        })
        .then((response) => {return response.json()})
        .then(json => {
            const student = state.student_details
            const full_name = student.first_name+" "+student.last_name+", "+student.degree_program+":\n"
            let message =  full_name+json.result.message
            alert(message)
        })
    }

    const updateCourse=(updatedCourse)=>{
        let courses = changed_courses.filter(course => course.course_id !== updatedCourse.course_id)
        courses.push(updatedCourse)
        changed_courses = courses
        
        console.log(changed_courses)
    }

    return(
    <div>
        <Header/>
        <div>
                LAST NAME: {state.student_details.last_name} <br/> 
                FIRST NAME: {state.student_details.first_name} <br/>
                MIDDLE NAME: {state.student_details.middle_name} <br/>
                SUFFIX: {state.student_details.suffix}<br/>
                STUDENT NUMBER: {state.student_details.student_number}<br/>
                GWA: {state.record_details.gwa}<br/>
                TOTAL UNITS: {state.record_details.total_units} <br />
               <br/>

               {editable === true?
                <button type = "button" onClick={handleUpdate}>UPDATE</button>:
                <button type = "button" onClick={handleClick}>EDIT</button>
                }
                <br/><br/>

                {state.term_details!=[]? state.term_details.map((term, i)=>{
                    return <span key={i}>{term.semester}/{term.acad_year} total weights: {term.total_weights} total units: {term.no_of_units} <br/>
                    <form>
                        <table>
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Grade</th>
                                    <th>Units</th>
                                    <th>Weight</th>
                                    <th>Cumulated</th>
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
                    </span>
                }):""}
        <Footer/>
        </div>
    </div>
    )
}


export default View_Student_Details;