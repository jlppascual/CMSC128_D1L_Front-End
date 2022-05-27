import React, {Fragment} from "react";
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
                <h2 className="summary-title">CAS Graduating Students</h2>
                <span className="system-watermark">ASTERIS CAS - UPLB &nbsp;&nbsp;&nbsp;&nbsp;{new Date().toLocaleString()}&nbsp;&nbsp;&nbsp;&nbsp;
                {this.state.user.first_name} {this.state.user.last_name} ({this.state.user.user_role})</span> 
                <p className="filter">{this.props.view != "ALL" && this.props.view !=""? <span>{this.props.view}</span> :"All CAS Students"} 
                &nbsp;&nbsp;-&nbsp;&nbsp;{this.props.order == "gwa"? <span>GWA (ascending)</span>:"Alphabetical"}</p> 
                <span className="watermark-textt">ASTERIS</span>
                 <span className="watermark-text">ASTERIS</span>
                <div className="watermark"></div>
                <br />
            {this.props.record != undefined ? 
                <table className='view-print-table'>
                    
                    
                    <thead className='view-print-thead'>
                        <tr>
                            <th className='view-print-cell-header'>NO.</th>
                            <th className='view-print-cell-header'>NAME</th>
                            <th className='view-print-cell-header'>DEGREE PROGRAM</th>
                            <th className='view-print-cell-header'>GWA</th>
                            <th className='view-print-cell-header'>LATIN HONOR</th>
                        </tr>
                    </thead>
                    <tbody className = 'view-print-tbody'>
                        
                        {this.props.record.map((rec, i) => {
                            return (
                                <Fragment>
                                <tr className='view-print-element' key = {i}>
                                    <td className='gwa-cell' >{i+1}</td>
                                    <td className='name-cell' >{rec.last_name}, {rec.first_name}{rec.middle_name? ', '+rec.middle_name:""}
                                    {rec.suffix ? ', ' + rec.suffix : ''}</td>
                                    <td className='degree-cell'>{rec.degree_program}</td>
                                    <td className='gwa-cell'>{rec.gwa}</td>
                                    <td className='latin-cell'>{rec.latin_honor}</td>
                                </tr>
                                <tr className='view-print-element' key = {i}>
                                    <td className='gwa-cell' >{i+1}</td>
                                    <td className='name-cell' >{rec.last_name}, {rec.first_name}{rec.middle_name? ', '+rec.middle_name:""}
                                    {rec.suffix ? ', ' + rec.suffix : ''}</td>
                                    <td className='degree-cell'>{rec.degree_program}</td>
                                    <td className='gwa-cell'>{rec.gwa}</td>
                                    <td className='latin-cell'>{rec.latin_honor}</td>
                                </tr>
                                <tr className='view-print-element' key = {i}>
                                    <td className='gwa-cell' >{i+1}</td>
                                    <td className='name-cell' >{rec.last_name}, {rec.first_name}{rec.middle_name? ', '+rec.middle_name:""}
                                    {rec.suffix ? ', ' + rec.suffix : ''}</td>
                                    <td className='degree-cell'>{rec.degree_program}</td>
                                    <td className='gwa-cell'>{rec.gwa}</td>
                                    <td className='latin-cell'>{rec.latin_honor}</td>
                                </tr>
                                <tr className='view-print-element' key = {i}>
                                    <td className='gwa-cell' >{i+1}</td>
                                    <td className='name-cell' >{rec.last_name}, {rec.first_name}{rec.middle_name? ', '+rec.middle_name:""}
                                    {rec.suffix ? ', ' + rec.suffix : ''}</td>
                                    <td className='degree-cell'>{rec.degree_program}</td>
                                    <td className='gwa-cell'>{rec.gwa}</td>
                                    <td className='latin-cell'>{rec.latin_honor}</td>
                                </tr>
                                
                                
                                </Fragment>
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