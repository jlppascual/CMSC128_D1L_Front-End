import React from 'react'
import {VscSettings}  from 'react-icons/vsc';
import Header from './Header';
import Footer from './Footer';

class View_Student_Details extends React.Component{
    constructor(props){
        super(props)

        this.state={
            student_details:[],
            record_details:[],
            term_details:[],
            course_details:[]
        }
    }

    componentDidMount (){
        const link = window.location.href
        const id = link.slice(link.lastIndexOf('/')+1,link.length)
        // console.log(id)
        fetch('http://localhost:3001/api/0.1/student/'+id,{
            method:'GET'
        }).then(response=> {return response.json()})
        .then(json=>{
            this.setState({student_details:json.result.output})
            this.setState({record_details:json.result.output.record_data})
            this.setState({term_details:json.result.output.record_data.term_data})      
            this.setState({course_details:json.result.output.record_data.term_data.course_data})            
      

        })
    }
    render(){
        let student = this.state.student_details;
        let record = this.state.record_details;
        let terms = this.state.term_details;
        // let courses = this.state.course_details;
        console.log(terms)
        return(
        <div>
            <Header/>
            <div>
               LAST NAME: {student.last_name} <br/> 
               FIRST NAME: {student.first_name} <br/>
               MIDDLE NAME: {student.middle_name} <br/>
               SUFFIX: {student.suffix}<br/>
               STUDENT NUMBER: {student.student_number}<br/>
               GWA: {record.gwa}<br/>
               TOTAL UNITS: {record.total_units} 
               <br/><br/>
                {terms!=[]? terms.map((term, i)=>{
                    return <span key={i}>{term.semester}/{term.acad_year} total weights: {term.total_weights} total units: {term.total_units} <br/>
                    <h2>Course Grade Units Weight Cumulated</h2>
                    {term.course_data!=[]? term.course_data.map((course)=>{
                        return <div><div className='headers'>
                            {course.course_code} {course.grade} {course.units} {course.weight} {course.cumulated}<br/>
                            </div></div>
                    }):""}
                    </span>
                }):""}

            </div>
            <Footer/>
        </div>)
    }

}

export default View_Student_Details;