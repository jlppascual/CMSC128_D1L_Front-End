/**
 * author: Jem, Thomas
 */
import React from 'react';
import Header from './Header';
import Footer from './Footer';

class Add_Student_Page extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            arrayData:[],
            headers:[],
            term_data:[],
            courses:[],
            student_number:'',
            last_name:'',
            first_name:'',
            middle_name:'',
            suffix:'',
            degree_program:'',
            total_units:0,
            gwa:0.0,
            semester:'',
            acad_year:'',
            cumulated_sum:0,
            weight_per_term:0
        }
        this.submitButton = this.submitButton.bind(this);
        this.parseData = this.parseData.bind(this);
        this.sendData = this.sendData.bind(this);
        this.getRecords = this.getRecords.bind(this);
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

    parseData=async()=>{
        let content = this.state.fileContent;

        //separates file content by new line
        const rows = content.slice(content.indexOf('\n')+1).split('\n');

        //returns filecontent in an array of strings splited by ','
        const newArray = rows.map(row =>{
            //separate each line content by a comma
            return row.split(',');
        })
        
        await this.setState({arrayData: newArray}, function(){
            let array = this.state.arrayData;
            this.setState({student_number:array[1][4], last_name:array[2][4], first_name:array[3][4], middle_name:array[4][4],suffix:array[5][4], 
                degree_program:array[6][4], total_units:array[7][4], gwa:array[8][4]})

        })

        await this.getRecords();
    }

    getRecords = async()=>{
        let array = this.state.arrayData;
        let headers = [];
        let courses = [];
        let term_data=[];
        let term = {};

        for(var i = 1; i < array[10].length; i++){
            if (array[10][i] != ''){
                headers.push(array[10][i])
            }
        }
        await this.setState({headers});
        
        for(var j = 11; j < array.length; j++){
            if(array[j][1] != ''){
                let sem = array[j][7].slice(0,array[j][7].indexOf('/'));
                let year = array[j][7].slice(array[j][7].indexOf('/')+1, array[j][7].length)
                let no_of_units = Number(array[j][6]);
                //if course is found at the beginning of the record
                if(courses.length <=0 && array[j][7] != ''){
                    courses.push({course_code: array[j][1], grade: array[j][2], units: array[j][3], 
                    weight: Number(array[j][4]), cumulated: Number(array[j][5])})


                    await this.setState({semester: sem})
                    await this.setState({acad_year: year});
                    await this.setState({no_of_units: no_of_units});
                }
                // indicates that the course is included in a new term
                else if (array[j][7] != ''){
                    // if a new term is found, push the previous states and courses first before renewing
                    if(courses[0] != ''){
                        term={acad_year: this.state.acad_year, semester: this.state.semester, no_of_units:this.state.no_of_units, 
                            total_weights: this.state.weight_per_term, course_data: courses}
                        term_data.push(term);
                    }

                    await this.setState({semester: sem})
                    await this.setState({acad_year: year});
                    await this.setState({no_of_units: no_of_units});

                    courses = [];
                    term = {};
 
                    await this.setState({courses})
                    
                    courses.push({course_code: array[j][1], grade: array[j][2], units: array[j][3], 
                    weight: Number(array[j][4]), cumulated: Number(array[j][5])})
                // all courses under the current term will be appended until a new term is found
                }else{
                    courses.push({course_code: array[j][1], grade: array[j][2], units: array[j][3], 
                        weight: Number(array[j][4]), cumulated: Number(array[j][5])})

                    this.setState({weight_per_term: Number(array[j][5])})
                }

            }else{break;}
             this.setState({cumulated_sum: Number(array[j][5])})
        }
         this.setState({term_data})
    }

    ///function to read the read csv file as text
    submitButton=async (e)=>{
        e.preventDefault();
        await this.setState({fileContent:document.getElementById('textarea').value})
        await this.parseData();
        await this.sendData();
    }

    sendData(){
        let record_data= {
            gwa: Number(this.state.gwa),
            total_units: Number(this.state.total_units),
            cumulative_sum: this.state.cumulated_sum,
            term_data: this.state.term_data
        };
        console.log(record_data);

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
                },
                record_data: {
                    gwa: Number(this.state.gwa),
                    total_units: Number(this.state.total_units),
                    cumulative_sum: this.state.cumulated_sum,
                    term_data: this.state.term_data
                }
            })
        }).then((response) => {return response.json()})
        .then(json => alert(json.result.message))
    }

    render(){
        return(
        <div>
            <Header/>
            <div className='add-student-body'>
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
                    {this.state.student_number}<br/>{this.state.degree_program}<br/>{this.state.gwa}<br/>{this.state.total_units}<br/></div>:''}            
                </form>
            </div>
            <Footer/>
        </div>
        );
    }
}

export default Add_Student_Page;