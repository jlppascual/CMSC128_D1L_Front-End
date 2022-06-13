/*
    Source code description: this source code contains the state information for the delete popup used for 
    deleting students confirmation.
*/

// import necessary packages
import React, { useState } from 'react';
import '../../../css/deletepopup.css';
import { notifyError } from './toastNotifUtil';

// defining the component
const DeletePopup=({props})=>{
    const maxchar = 500;                            // max character for the text field (details)
    const [char_count, setCharCount] = useState(0)  // hook for keeping track of the character count in text field

    // handles the event that the user inputs a character in the text field
    const handleDetailsChange = (e) =>{
        setCharCount(e.target.value.trim().length)
    }

    // handles the event of whether the user confirms the changes or cancels
    const handleButton = async(choice) => {
        let reason = document.getElementById('deletion-details').value.trim();  // this removes trailing and leading spaces
        if(!choice) await props.confirmDelete(choice, reason)
        // if(!choice) await props.confirmDelete(choice)
        else {
            if (reason === '') notifyError('Please enter a valid reason');
            else{
                if (reason.length < 10) notifyError('Reason must not be less than 10 characters');
                else await props.confirmDelete(choice, reason);
                // else await props.confirmDelete(choice);
            }
        }
    }
    
    // rendering the deletion confirmation popup
    return(
        <div className="popup-box">
                
                <p className='delete-text'>Are you sure you want to delete?</p>
                <p className='format-text'>Please use this format for consistency (<b>REASON</b> : [<b>REASON FOR DELETION</b>])</p> 

                <textarea className = 'deletion-details-textarea' id = 'deletion-details' onChange={(e) => handleDetailsChange(e)} maxLength={500} placeholder = "Provide reason for deletion" wrap="hard" ></textarea>
                <p className = 'details-character-count'>{maxchar - char_count}</p>
                
                <div className='buttons'>
                    <button onClick={() => {handleButton(false)}} className = 'cancel-btn'>Cancel</button>
                    <button onClick={() => {handleButton(true)}} className = 'confirm-btn'>Confirm</button>
                    
                </div>
        </div>
    )
}
export default DeletePopup;