import React, { useState } from 'react';
import '../../../css/studentprompts.css'
const addStudentPopup=({props})=>{

    const handleButton = async() => {
        await props.closePrompts(false);
    }
    
    return(
        console.log(props.prompts),
        <div className="popup-box">
            <p className='details-text'>Results:</p>
            <div className="prompts-container">
                {props.prompts.length > 0? (
                    props.prompts.map(async(prompt,i)=>{
                     return <tr className='prompt-element' key = {i}>
                         { prompt.success? <td className='prompt-cell-success'>{prompt.message}</td>
                         :<td className='prompt-cell-error'>{prompt.message}</td>}
                         </tr>
                    })
                ):"" }
            </div> 
                <div className='close-buttons'>
                    <button onClick={() => {handleButton(false)}} className = 'close-btn'>Close</button>                    
                </div>
        </div>
    )
}
export default addStudentPopup;