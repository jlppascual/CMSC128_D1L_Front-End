import React from "react";
import '../../css/print-page.css'

class ComponentToPrint extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            user: this.props.user,
        }
    }
   
    render(){
        return(
            <div className='view-print-preview'>
                <span className="system-watermark">ASTERIS CAS - UPLB</span> <span className="date-watermark">{new Date().toLocaleString()}</span><br />
                <p className="user-watermark">{this.state.user.first_name} {this.state.user.last_name}</p>
                {console.log(this.state.view, this.state.order)}
                <span className="view-filter"> VIEW BY:&nbsp;&nbsp;{this.props.view != "ALL" && this.props.view !=""? <span>{this.props.view}</span> :"All CAS Students"} </span> 
                <span className="order-filter"> ORDER BY: &nbsp;&nbsp;{this.props.order == "gwa"? <span>GWA (ascending)</span>:"Alphabetical"}</span>
                <span className="watermark-text">ASTERIS</span>
                <div className="watermark"></div>
                <br />
            {this.props.record != undefined ? 
                <table className='view-print-table'>
                    
                    
                    <thead className='view-print-thead'>
                        <tr>
                            <th className='view-print-cell-header'>NAME</th>
                            <th className='view-print-cell-header'>DEGREE PROGRAM</th>
                            <th className='view-print-cell-header'>GWA</th>
                            <th className='view-print-cell-header'>LATIN HONOR</th>
                        </tr>
                    </thead>
                    <tbody className = 'view-print-tbody'>
                        
                        {this.props.record.map((rec, i) => {
                            return (
                                <tr className='view-print-element' key = {i}>
                                    <td className='name-cell' >{i+1}. {rec.last_name}, {rec.first_name}{rec.middle_name? ', '+rec.middle_name:""}
                                    {rec.suffix ? ', ' + rec.suffix : ''}</td>
                                    <td className='degree-cell'>{rec.degree_program}</td>
                                    <td className='gwa-cell'>{rec.gwa}</td>
                                    <td className='latin-cell'>{rec.latin_honor}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>:
                <div>{this.props.message}</div>}
            </div>
        )
    }
}
export default ComponentToPrint;