/**
 * author: Jem, Leila
 */
 import React from 'react';
 import Header from './Header';
 import Footer from './Footer';
 
 class View_Students extends React.Component{
     constructor(props){
         super(props);
 
         this.state = {
            record:[]
         }
     }

    componentDidMount(){
        fetch("http://localhost:3001/api/0.1/student",
        {
            method: "GET"
        })
        .then(response => {return response.json()})
        .then(json=>{
            this.setState({record:json.result.output})
        })
    }
 
     render(){
         return(
         <div>
             <Header/>
             <div className='view-student-body'>
                 {this.state.record != []? this.state.record.map((record,i)=>{
                     return <span key={i}><div className='student-tile'>{i+1}. {record.last_name}, {record.first_name}, {record.middle_name} {record.suffix}   {record.student_number}    {record.degree_program}</div></span>
                 }): ""}
                 
             </div>
             <Footer/>
         </div>
         );
     }
 }
 
 export default View_Students;