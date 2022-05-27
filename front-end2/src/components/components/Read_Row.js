import React from 'react';

const Read_Row = ({course, index}) => {
    let bg_color;
    {index % 2 === 0? bg_color = 'rgba(0, 86, 63, 0.2)': bg_color = 'white'}
    return (
            
            <tr  style = {{lineHeight:2, backgroundColor: bg_color}}>
                <td style = {{paddingLeft:'45px'}}>{course.course_code}</td>
                <td style = {{paddingLeft:'45px'}}>{course.grade}</td>
                <td style = {{paddingLeft:'55px'}}>{course.units}</td>
                <td style = {{paddingLeft:'50px'}}>{course.weight}</td>
                <td style = {{paddingLeft:'50px'}}>{course.cumulated}</td>
            </tr>

    )
}

export default Read_Row