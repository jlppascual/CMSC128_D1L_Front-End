/**
 * author: Jem, Leila
 */
 import React, { useState } from 'react';
 import { Link } from 'react-router-dom';
 import Header from './Header';
 import Footer from './Footer';
 
 class View_Students extends React.Component{
     constructor(props){
         super(props);
 
         this.state = {
            record:[],
            orderfilter:[
                {label: 'order by', value:''},
                {label: 'name', value:'name'},
                {label:'gwa',value:'gwa'}
            ],
            ordervalue:"name",

         }
         this.onDelete = this.onDelete.bind(this)
         this.onHandleChange = this.onHandleChange.bind(this)
         
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

    onDelete(student_id){
        fetch('http://localhost:3001/api/0.1/student/'+student_id,{
            method: "DELETE",
        })
        .then(response => response.json())
        .then(json=>{
            console.log(json)
            this.setState({})
            // if(json.result.success){
            //     this.componentDidMount();
            // }
        })
    }
 
     render(){
         return(
         <div>
             <Header/>
             <div className='view-student-body'>
                <input placeholder="Search for student"/>
                <DropDown
                // label = "View"
                options={this.state.orderfilter}
                value = {this.state.ordervalue}
                onChange={this.onHandleChange}/>
                 {this.state.record != []? this.state.record.map((record,i)=>{
                     return <span key={i}><div className='student-tile'>{i+1}. {record.last_name}, {record.first_name}, {record.middle_name} 
                     {record.suffix} {record.student_number} {record.degree_program} {record.gwa} 
                     <button onClick={() => this.onDelete(record.student_id)}>Delete</button>
                    </div></span>
                 }): ""}

             </div>
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