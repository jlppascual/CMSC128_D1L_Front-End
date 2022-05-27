import React, { useState } from 'react';
import '../../../css/studentprompts.css'
const addStudentPopup=({props})=>{

    const handleButton = async() => {
        await props.closePrompts(false);
    }

    const prompts = props.prompts;
    
    return(
        <div className="popup-box">
            <p className='details-text'>Results:</p>
            <div className="prompts-container">
                {props.prompts.length > 0? (
                    props.prompts.map((prompt,i)=>{
                     return <tr className='prompt-element' key = {i}>
                         <td className='prompt-cell'>{prompt}</td></tr>
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