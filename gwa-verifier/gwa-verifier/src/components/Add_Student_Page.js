/**
 * author: Jem, Thomas
 */
import React from 'react';

class Add_Student_Page extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            fileContent: undefined,
            arrayData:[],
            student_number:'',
            last_name:'',
            first_name:'',
            middle_name:'',
            suffix:'',
            degree_program:'',
            total_units:0,
            gwa:0.0
        }
        this.submitButton = this.submitButton.bind(this);
        this.parseData = this.parseData.bind(this);
        this.sendData = this.sendData.bind(this);
    }

    ///function to update the currently read CSV File
    setCSVFile(e){
        try{
            e.preventDefault();
            const reader = new FileReader();

            //loads the results from the readAsText
            reader.onload = function(e){
                const text = e.target.result;
                document.getElementById("textarea").value = text;
            }
            reader.readAsText(e.target.files[0]);

        }catch(e){console.log(e)}
    }

    parseData(){
        let content = this.state.fileContent;

        //separates file content by new line
        const rows = content.slice(content.indexOf('\n')+1).split('\n');

        //returns filecontent in an array of strings splited by ','
        const newArray = rows.map(row =>{
            //separate each line content by a comma
            return row.split(',');
        })
        
        this.setState({arrayData: newArray}, function(){
            let array = this.state.arrayData;
            this.setState({student_number:array[1][4], last_name:array[2][4], first_name:array[3][4], middle_name:array[4][4],suffix:array[5][4], 
                degree_program:array[6][4], total_units:array[7][4], gwa:array[8][4]})
        })
    }

    ///function to read the read csv file as text
    submitButton=async (e)=>{
        e.preventDefault();
        await this.setState({fileContent:document.getElementById('textarea').value})
        await this.parseData();
        await this.sendData();
    }

    sendData(){
        fetch('http://localhost:3001/api/0.1/student',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                student_data:{
                    last_name: this.state.last_name,
                    first_name: this.state.first_name,
                    middle_name:this.state.middle_name,
                    suffix: this.state.suffix,
                    student_number: this.state.student_number,
                    degree_program: this.state.degree_program
                }
            })
        }).then((response) => {return response.json()})
        .then(json => alert(json.result.message))
    }

    render(){
        return(

            <form>
                <h1>Add Student Page</h1>
                <input type='file' accept='.csv' id='csvFile' onChange={this.setCSVFile}
                ></input>
                <br/><br/>
                <button onClick={this.submitButton}>Submit</button> 
                <br/><br/> 
                <textarea id='textarea' hidden={true}></textarea>  
                {this.state.arrayData.length>0? 
                <div>{this.state.last_name}<br/>{this.state.first_name}<br/>{this.state.middle_name}<br/>
                {this.state.student_number}<br/>{this.state.degree_program}<br/></div>:''}            
            </form>
        );
    }
}

export default Add_Student_Page;