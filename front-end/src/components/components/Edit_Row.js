import React, {useState} from "react";

const Edit_Row = ( {func, course, term_index,index}) => {
    const [course_code, setCourse] = useState(course.course_code);
    const [grade, setGrade] = useState(course.grade);
    const [units, setUnits] = useState(course.units);
    let [weight, setWeight] = useState(course.weight)
    const [cumulated, setCumulated] = useState(course.cumulated)

    let prevCumulated = 0
    let bg_color;
    {index % 2 === 0? bg_color = 'rgba(0, 86, 63, 0.2)': bg_color = 'white'}

    const updatedCourse =
        {course_code: course_code,
        course_id: course.course_id,
        term_id: course.term_id,
        grade: grade,
        units: units,
        weight: weight,
        cumulated: cumulated};

    // Check for empty fields
    if (course_code === "" || grade === "" || units === "" ){
        bg_color = 'rgba(141, 20, 54, 0.3)'
    } 
    
    func.updateCourse(updatedCourse);
    
    
    const computeCumulated =  (curr_weight) => {
        if(isNaN(curr_weight)) curr_weight = 0
        weight = Number(curr_weight)
        setWeight(weight)
        if(index > 0) {
            prevCumulated = document.getElementsByName("cumulated-"+term_index+"-"+(index-1))[0].value
        }
        else if(term_index > 0){
            let c_index = 10;
            let next_course = document.getElementsByName("cumulated-"+(term_index-1)+"-"+(c_index))[0]
            // iterate through the terms and get the last course
            while(next_course === undefined){
                next_course = document.getElementsByName("cumulated-"+(term_index-1)+"-"+(c_index--))[0]
            }
            if(isNaN(next_course.value)) next_course.value = 0
            prevCumulated = next_course.value
        }
        let sum = Number(prevCumulated) + Number(curr_weight)
        setCumulated(sum)
        let i = index+1
        let next= document.getElementsByName("weight-"+term_index+"-"+i)[0];

        // Update cumulated column of the current term of this course
        while(next !== undefined){
            if(isNaN(next.value)) next.value = 0
            sum = sum + Number(next.value)
            document.getElementsByName("cumulated-"+term_index+"-"+(i))[0].value = sum
            i++
            next = document.getElementsByName("weight-"+term_index+"-"+(i))[0]
        }
        // Compute cumulated column of the remaining terms
        computeNextCumulated(sum)
    }

    // Update cumulated column of the remaining terms
    const computeNextCumulated = (sum) =>{
        let t_index = term_index + 1
        let c_index;
        let next;
        // While there is a valid term
        while(checkTerm(t_index)){
            c_index = 0;
            next = document.getElementsByName("weight-"+t_index+"-"+c_index)[0];
            while(next !== undefined){
                if(isNaN(next.value)) next.value = 0
                sum = sum + Number(next.value)
                document.getElementsByName("cumulated-"+t_index+"-"+c_index)[0].value = sum
                c_index++
                next = document.getElementsByName("weight-"+t_index+"-"+c_index)[0]
            }
            t_index++
        }
        computeTermTotals()
    }

    const checkTerm = (t_index) => {
        if(document.getElementsByName("term"+t_index)[0] !== undefined){
            return true
        }
        else return false
    }

    const computeTermTotals = () =>{
        let t_index = 0;
        let cumulative = 0;
        let total_units =0;
        
        while(checkTerm(t_index)){
            let c_index = 0;
            let units = 0;
            let weights = 0;
            let curr_u = document.getElementsByName("units-"+t_index+"-"+c_index)[0];
            let curr_w = document.getElementsByName("weight-"+t_index+"-"+c_index)[0];
            while(curr_u !== undefined && curr_w !== undefined){
                if(isNaN(curr_u.value)) curr_u.value = 0;
                if(isNaN(curr_w.value)) curr_w.value = 0;
                units = units + Number(curr_u.value)
                if(t_index === term_index && c_index === index){
                    weights = weights + weight
                    
                }
                else{
                    weights = weights + Number(curr_w.value)
                }
                
                c_index++
                curr_u = document.getElementsByName("units-"+t_index+"-"+c_index)[0]
                curr_w = document.getElementsByName("weight-"+t_index+"-"+c_index)[0];
            }
            document.getElementsByName("weights-term"+t_index)[0].innerHTML = weights
            document.getElementsByName("units-term"+t_index)[0].innerHTML = units
            document.getElementsByName("gpa-term"+t_index)[0].innerHTML = parseFloat((weights/units).toFixed(4))
            cumulative = cumulative + weights
            total_units = total_units + units
            t_index++
        }
        document.getElementsByName("record-cumulative")[0].innerHTML = cumulative
        document.getElementsByName("record-units")[0].innerHTML = total_units
        document.getElementsByName("record-gwa")[0].innerHTML = parseFloat((cumulative/total_units).toFixed(4))
    }
   
    return(
        <tr>
            <td>
                <input
                    className="edit-cell"
                    type = "text"
                    required = "required"
                    placeholder= "Enter Course Code"
                    value = {course_code}
                    style = {{backgroundColor: bg_color}}
                    onChange = {(e)=> {setCourse(e.target.value)}}
                ></input>
            </td>
            <td>
                <input
                    className="edit-cell"
                    type = "text"
                    required = "required"
                    placeholder= "Enter Grade"
                    value = {grade}
                    style = {{backgroundColor: bg_color}}
                    onChange = {(e)=> {setGrade(e.target.value),computeCumulated(Number(e.target.value)*Number(units))}}
                ></input>
            </td>
            <td>
                <input
                    className="edit-cell"
                    type = "text"
                    required = "required"
                    placeholder= "Enter Units"
                    name = {"units-"+term_index+"-"+index}
                    value = {units}
                    style = {{backgroundColor: bg_color}}
                    onChange = {(e)=> {setUnits(e.target.value),computeCumulated(Number(e.target.value)*Number(grade))}}
                ></input>
            </td>
            <td>
                <input
                    className="edit-cell"
                    type = "text"
                    name = {"weight-"+term_index+"-"+index}
                    value = {weight}
                    style = {{backgroundColor: bg_color}}
                    onChange = {(e)=> {setWeight(e.target.value)}}
                    disabled
                ></input>
            </td>
            <td>
                <input
                    className="edit-cell"
                    type = "text"
                    name = {"cumulated-"+term_index+"-"+index}
                    value = {cumulated}
                    style = {{backgroundColor: bg_color}}
                    disabled
                ></input>
                
            </td>
        </tr>
    )
}

export default Edit_Row