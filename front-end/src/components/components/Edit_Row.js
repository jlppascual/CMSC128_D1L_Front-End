import React, {useState} from "react";

const Edit_Row = ( {func, course}) => {
    const [course_code, setCourse] = useState(course.course_code);
    const [grade, setGrade] = useState(course.grade);
    const [units, setUnits] = useState(course.units);
    const [weight, setWeight] = useState(course.weight);
    const [cumulated, setCumulated] = useState(course.cumulated);

    const updatedCourse =
        {course_code: course_code,
        course_id: course.course_id,
        term_id: course.term_id,
        grade: grade,
        units: units,
        weight: weight,
        cumulated: cumulated};

        
    let empty = 0;
    //Check for empty fields
    if (course_code === "" || grade === "" || units === "" || weight === "" || cumulated === ""){
        empty = 1
    } else {
        empty = 0
    }
    //Check for changes
    if(course_code !== course.course_code || grade !== course.grade || units!== course.units || weight!== course.weight || cumulated !== course.cumulated){
        func.updateCourse(empty, updatedCourse);
    }


    return(
        <tr>
            <td>
                <input
                    type = "text"
                    required = "required"
                    placeholder= "Enter Course Code"
                    name = "course_code"
                    value = {course_code}
                    onChange = {(e)=> setCourse(e.target.value)}
                ></input>
            </td>
            <td>
                <input
                    type = "text"
                    required = "required"
                    placeholder= "Enter Grade"
                    name = "grades"
                    value = {grade}
                    onChange = {(e)=> setGrade(e.target.value)}
                ></input>
            </td>
            <td>
                <input
                    type = "text"
                    required = "required"
                    placeholder= "Enter Units"
                    name = "units"
                    value = {units}
                    onChange = {(e)=> setUnits(e.target.value)}
                ></input>
            </td>
            <td>
                <input
                    type = "text"
                    required = "required"
                    placeholder= "Enter Weight"
                    name = "weight"
                    value = {weight}
                    onChange = {(e)=> setWeight(e.target.value)}
                ></input>
            </td>
            <td>
                <input
                    type = "text"
                    required = "required"
                    placeholder= "Enter Cumulated"
                    name = "cumulated"
                    value = {cumulated}
                    onChange = {(e)=> setCumulated(e.target.value)}
                ></input>
                
            </td>
        </tr>
    )
}

export default Edit_Row