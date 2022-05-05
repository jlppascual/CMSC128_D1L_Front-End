/**
 * author: Jem, Leila
 */
 import React, { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { Link } from 'react-router-dom';
 import {BsSearch}  from 'react-icons/bs';
 import {AiFillDelete} from 'react-icons/ai';
 import Header from './Header';
 import Footer from './Footer';
 import Menu from './Menu';
 import '../css/viewstudents.css'
 import View_Student_Details from './View_Student_Details'

 
 class View_Students extends React.Component{
     constructor(props){
         super(props);
 
         this.state = {
            record:[],
            orderfilter:[
                {label: 'name', value:'name'},
                {label:'gwa',value:'gwa'}
            ],
            ordervalue:"name",
            name: ''

         }
         this.onHandleChange = this.onHandleChange.bind(this);
         this.onDelete = this.onDelete.bind(this);
         this.handleSubmit = this.handleSubmit.bind(this);
         this.handleUserInput = this.handleUserInput.bind(this);
         this.clickStudentDetails = this.clickStudentDetails.bind(this);
     }

     componentDidMount(){
        fetch("http://localhost:3001/api/0.1/student?orderby=name",
        {
            method: "GET"
        })
        .then(response => {return response.json()})
        .then(json=>{
            // console.log(json)
            if(json.result.success){
                this.setState({record:json.result.output})
            }else{
                alert(json.result.message)
            }
        }) 
    }

    componentDidUpdate(prevprops, prevState){
        if(prevState.ordervalue != this.state.ordervalue){
            fetch("http://localhost:3001/api/0.1/student?orderby="+this.state.ordervalue,
            {
                method: "GET"
            })
            .then(response => {return response.json()})
            .then(json=>{
                // console.log(json)
                this.setState({record:json.result.output})
            })
        }
    }

    onHandleChange=(e)=>{
        this.setState({ordervalue:e.target.value});
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        this.setState({[name]: value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.name === ""){
            this.componentDidMount();
        } else {
        fetch('http://localhost:3001/api/0.1/student/search?name=' + this.state.name)
        .then((response) => {return response.json()})
        .then(json => {
            if(json.result.success){
                this.setState({record:json.result.output});
                console.log(json.result.output)  // Contains the list of match users
            }
            else{
                console.log(json.result.message) // Message: No results found
            }
        })
        }
    }

    onDelete(student){
        let student_id = student.record.student_id
        fetch('http://localhost:3001/api/0.1/student/'+student_id,{
            method: "DELETE",
        }).then(response =>{ return response.json()})
        .then(json=>{
            console.log(json)
            if(json.result.success){
                this.componentDidMount();
            }
        })

    }

    clickStudentDetails(student){
        // fetch('http://localhost:3001/api/0.1/student/'+student.record.student_id,{
        //     method:'GET'
        // }).then(response=> {return response.json()})
        // .then(json=>{
        //     console.log(json.result.output)
        //     // this.setState({student_details:json.result.output})
        // })
            // fetch('http://localhost:3001/api/0.1/student/'+student.record.student_id,{
            //     method:'GET'
            // }).then(response=> {return response.json()})
            // .then(json=>{
            //     console.log(json.result.output)
            //     // this.setState({student_details:json.result.output})
            // })
    }
 
     render(){
         return(
         <div>
             <Header/>
             
             <div className='body'>
                <p className="title">Student Records</p>
                <hr className='line'></hr>
                <div className='filters'>
                <input type = "text" name = "name" placeholder = "Search by Name"
                    value = {this.state.name} onChange = {this.handleUserInput} required></input>
                    <button onClick={this.handleSubmit}><i ><BsSearch /></i></button><br />                
                <label htmlFor="orderby">Order by:</label>
                <DropDown
                // label = "View"
                name = "orderby"
                options={this.state.orderfilter}
                value = {this.state.ordervalue}
                onChange={this.onHandleChange}
                />
                </div>
                <div className='content'>
                 {this.state.record != []? this.state.record.map((record,i)=>{
                     return <div key={i}>
                         <a href={"/view-student-details/"+ record.student_id} className='student-tile'>
                         {record.last_name}, {record.first_name} {record.middle_name} {record.suffix} {record.student_number} {record.degree_program} 
                     <button onClick={()=>{this.onDelete({record})}}><AiFillDelete/></button>
                     </a>
                     </div>
                 }): ""}
                </div>
             </div>
             <Menu />
             <Footer/>
         </div>
         );
     }
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
 export default View_Students;