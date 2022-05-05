/**
 * author: Jem, Thomas
 */
 import React, { useRef, useState } from 'react';
 import Header from './Header';
 import Footer from './Footer';
 import Menu from './Menu'
 import '../css/addstudent.css'
 
 const Add_Student_Page=()=>{
     const [files, setFiles] = useState([]);
     const [results, setResults] = useState([]);
     const [term_data , setTermData] = useState([]);
     const [courses, setCourses] = useState([]);
     const [headers, setHeaders] = useState([]);
     const [ fullName, setFullName] = useState("");
     const semester= useRef();
     const acad_year = useRef();
     const num_of_units = useRef();
     const weightPerTerm = useRef();
     const [cumulated_sum, setCumulatedSum] = useState();
  
 
 
 
     //https://stackoverflow.com/a/67296403
     const setCSVFile = async (e) => {
   
         // Convert the FileList into an array and iterate
         let files = Array.from(e.target.files).map(file => {
             let filenames = []
             for (let i = 0; i< e.target.files.length; i++) {
                 filenames.push(e.target.files[i].name)
             }
             setFiles(filenames)
             
             // Define a new file reader
             let reader = new FileReader();
     
             // Create a new promise
             return new Promise(resolve => {
                 // Resolve the promise after reading file
                 reader.onload = () => resolve(reader.result);
                 // Read the file as a text
                 reader.readAsText(file);
             });
         });
     
         // At this point you'll have an array of results
         let res = await Promise.all(files);
         await setResults(res)
     }
 
     const getRecords = async(array) =>{
         let headers = [];
         let courses = [];
         let term_data=[];
         let term = {};
         let cumulative_sum = 0;
 
         for(var i = 1; i < array[10].length; i++){
             if (array[10][i] != ''){
                 headers.push(array[10][i])
             }
         }
         await setHeaders(headers);
         for(var j = 11; j < array.length; j++){
 
             if(array[j][1] != ''){
 
                 let sem = array[j][7].slice(0,array[j][7].indexOf('/'));
                 let year = array[j][7].slice(array[j][7].indexOf('/')+1, array[j][7].length)
                 let no_of_units = Number(array[j][6]);
                 console.log(sem, year, no_of_units)
                 
                 //if course is found at the beginning of the record
                 if(courses.length <=0 && array[j][7] != ''){
                     courses.push({course_code: array[j][1], grade: array[j][2], units: array[j][3], 
                     weight: Number(array[j][4]), cumulated: Number(array[j][5])})
 
                     semester.current = sem;
                     acad_year.current = year;
                     num_of_units.current = no_of_units; 
 
                 }
                 // indicates that the course is included in a new term
                 else if (array[j][7] != ''){
                     // if a new term is found, push the previous states and courses first before renewing
                     if(courses[0] != ''){
                         term={acad_year: acad_year.current, semester: semester.current, no_of_units: num_of_units.current, 
                             total_weights: weightPerTerm.current, course_data: courses}
                         term_data.push(term);
                     }
                     console.log(term_data)
                     semester.current = sem;
                     acad_year.current = year;
                     num_of_units.current = no_of_units;
                 
                     courses = [];
                     term = {};
  
                     await setCourses(courses)
                     
                     courses.push({course_code: array[j][1], grade: array[j][2], units: array[j][3], 
                     weight: Number(array[j][4]), cumulated: Number(array[j][5])})
                 // all courses under the current term will be appended until a new term is found
                 }else{
                     courses.push({course_code: array[j][1], grade: array[j][2], units: array[j][3], 
                         weight: Number(array[j][4]), cumulated: Number(array[j][5])})
 
                     weightPerTerm.current=(Number(array[j][5]))
                 }
 
             }else{break;}
             await setCumulatedSum(Number(array[j][5]))
             cumulative_sum = Number(array[j][5])
         }
 
         await setTermData(term_data)
         console.log(term_data)
 
         let data ={
             student_data: {
                 student_number:array[1][4], 
                 last_name:array[2][4], 
                 first_name:array[3][4], 
                 middle_name:array[4][4],
                 suffix:array[5][4], 
                 degree_program:array[6][4], 
                 
             },
             record_data:{
                 total_units:Number(array[7][4]), 
                 gwa:Number(array[8][4]),
                 cumulative_sum,
                 term_data
             }
         }
         console.log(data.record_data)
         setFullName(data.first_name+" "+data.last_name+ " " + data.degree_program)
 
         return data
     }
 
     const parseData = async(content)=>{
        
         //separates file content by new line
         let rows = content.slice(content.indexOf('\n')+1).split('\n');
 
         //returns filecontent in an array of strings splited by ','
         let array = rows.map(row =>{
             //separate each line content by a comma
             return row.split(',');
         })
         return getRecords(array);
     }
 
     ///function to read the read csv file as text
     const submitButton=(e)=>{
         e.preventDefault();
         if(results.length > 0){
             results.map(async(result) => {
                 let data = await parseData(result);
                 await sendData(data);
             });
             setFiles([]);
         }
     }
 
     const sendData = async(data)=>{
         fetch('http://localhost:3001/api/0.1/student',{
             method:'POST',
             headers:{
                 'Content-Type':'application/json'
             },
             body: JSON.stringify({
                 student_data: data.student_data,
                 record_data: data.record_data
             })
         }).then((response) => {return response.json()})
         .then(json => {
             if(json.result.success){
                 const student = json.result.output.record
                 const full_name = student.first_name+" "+student.last_name+", "+student.degree_program+":\n"
                 let message =  full_name+json.result.message
                 alert(message)
             }
             else{
                 let message =  fullName+json.result.message
                 alert(message)
             }
         })
     }
 
     return(
     <div>
         <Header/>
         
         <div className='body'>
             <form>
                 <p className="title">Add Student Records</p>
                 <hr className='line'></hr>
                 
                 <label htmlFor="file-acceptor" className='file-accept'> Click here to add students
                 </label>
                 <label htmlFor="file-acceptor" className='plus-sign'> + </label>
                 <input type='file' accept='.csv' id='file-acceptor' multiple="multiple" onChange={setCSVFile}/>
                 <div className='chosen-files'>
                     {files != []? 
                     files.map((file,i) => {
                         return <span key={i} className='file'>
                         <p>{i+1}. {file}</p>
                         </span>
                     }): ""}
                 </div>
                 <br/><br/>
                 <button onClick={submitButton} className="submit-button">Submit</button> 
                 <br/><br/>          
             </form>
         </div>
         <Menu />
         <Footer/>
     </div>
     );
 }
 
 
 export default Add_Student_Page;