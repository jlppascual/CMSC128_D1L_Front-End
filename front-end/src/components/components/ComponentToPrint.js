import React from "react";

class ComponentToPrint extends React.Component{
    constructor(props){
        super(props)

        this.state={
            record: this.props.record
        }
    }
    render(){
        console.log(this.state.record)
        return(
            <div className='view-print-preview'>
            {this.state.record != undefined ? 
                <table className='view-print-table'>
                    <thead className='view-print-thead'>
                        <tr>
                            <th className='view-print-cell-header'>NAME</th>
                            <th className='view-print-cell-header'>GWA</th>
                            <th className='view-print-cell-header'>DEGREE PROGRAM</th>
                        </tr>
                    </thead>
                    <tbody className = 'view-print-tbody'>
                        {this.state.record.map((rec, i) => {
                            return (
                                
                                <tr className='view-print-element'>
                                    <a className = "print-tile" href={'/summary/'+rec.student_id}><td className='view-print-cell'>{i+1}. {rec.last_name}, {rec.first_name}{rec.middle_name? ', '+rec.middle_name:""}
                                    {rec.suffix ? ', ' + rec.suffix : ''}</td></a>
                                    <td className='view-print-cell'>{rec.gwa}</td>
                                    <td className='view-print-cell'>{rec.degree_program}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>:
            <div>"No students saved"</div>}
            </div>
        )
    }
}
export default ComponentToPrint;