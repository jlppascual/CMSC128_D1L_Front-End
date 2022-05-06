import React from 'react';

const Read_Row = ({course}) => {
    return (
            <tr>
                <td>{course.course_code}</td>
                <td>{course.grade}</td>
                <td>{course.units}</td>
                <td>{course.weight}</td>
                <td>{course.cumulated}</td>
            </tr>
    )
}

export default Read_Row