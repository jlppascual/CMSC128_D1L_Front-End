/*
    Source code description: this source code contains the state information for the delete popup used for 
    deleting users confirmation
*/

// import necessary package
import React, { useState } from 'react';
import '../../../css/deletepopup.css'

// defining the component
const DeleteConfirmPopup=({props})=>{
    const maxchar = 500     // max char for the input field

    // hooks for keeping track of the states of the changes to be made in the interface
    const [delete_confirm, setDeleteConfirm] = useState("")
    const [char_count, setCharCount] = useState(0)
    const [char_color, setCharColor] = useState('black')
    const [alert_message, setAlert] = useState('')
    
    // handles the event that changes made in the text field occur
    const handleDeletionChange = (e) =>{
        setDeleteConfirm(e.target.value)
        setCharCount(e.target.value.length)
        if(e.target.value.length > maxchar) setCharColor('red')
        else setCharColor('black')
        if(e.target.value.length==maxchar) setAlert("")
        if(e.target.value.length == 10) setAlert("")
    }

    // handles the event that the user clicks either the confirm or cancel button
    const handleButton =async(choice) => {
        if(!choice) await props.confirmDelete(choice,delete_confirm)    // checks which button is pressed
        
        // checks if the input is valid
        if(char_count <= maxchar ){
            if(choice && char_count >= 10){
                await props.confirmDelete(choice,delete_confirm)
            }
            else setAlert("Details must not be less than 10 characters.")
        }
        else setAlert("Details must not exceed 500 characters.")
    }
    
    // defining what will be rendered in the UI
    return(
        <div className="details-popup-box">

                <p className='details-text'>Reason for Deletion</p>
                <textarea className = "details-area" value={delete_confirm} onChange={(e)=>handleDeletionChange(e)} placeholder = "Reason" wrap="hard" ></textarea>
                <p className = 'character-count' style={{color: char_color}}>{maxchar - char_count}</p>
                <i className='alert-msg' style={{color: 'red'}}>{alert_message}</i>
                <div className='details-buttons'>
                    <button onClick={() => {handleButton(false)}} className = 'details-cancel-btn'>Cancel</button>
                    <button onClick={() => {handleButton(true)}} className = 'details-confirm-btn'>Confirm</button>
                    
                </div>
        </div>
    )
}
export default DeleteConfirmPopup;
