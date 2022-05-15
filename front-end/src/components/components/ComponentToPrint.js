import React from "react";
import '../../css/print-page.css'
import useStore from '../hooks/authHook'

class ComponentToPrint extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            user: this.props.user
        }
       
    }

    render(){
        console.log(this.state.user)
        return(
            <div className='view-print-preview'>
                <span className="system-watermark">ASTERIS CAS - UPLB</span> <span className="date-watermark">{new Date().toLocaleString()}</span><br />
                <p className="user-watermark">{this.state.user.first_name} {this.state.user.last_name}</p>
                
            {this.props.record != undefined ? 
                <table className='view-print-table'>
                    <span className="watermark-text">ASTERIS</span>
                    
                    <thead className='view-print-thead'>
                        <tr>
                            <th className='view-print-cell-header'>NAME</th>
                            <th className='view-print-cell-header'>GWA</th>
                            <th className='view-print-cell-header'>DEGREE PROGRAM</th>
                        </tr>
                    </thead>
                    <tbody className = 'view-print-tbody'>
                        <div className="watermark">
                        </div>
                        {this.props.record.map((rec, i) => {
                            return (
                                <tr className='view-print-element'>
                                    <td className='name-cell'>{i+1}. {rec.last_name}, {rec.first_name}{rec.middle_name? ', '+rec.middle_name:""}
                                    {rec.suffix ? ', ' + rec.suffix : ''}</td>
                                    <td className='gwa-cell'>{rec.gwa}</td>
                                    <td className='degree-cell'>{rec.degree_program}</td>
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