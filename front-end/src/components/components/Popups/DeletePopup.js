import React, { useState } from 'react';
import '../../../css/deletepopup.css'

const DeletePopup=({props})=>{

    const handleButton =async(choice) => {
        await props.confirmDelete(choice)
    }
    
    return(
        <div className="popup-box">
           
                <p className='delete-text'>Are you sure you want to delete?</p>
                
                <div className='buttons'>
                    <button onClick={() => {handleButton(false)}} className = 'cancel-btn'>Cancel</button>
                    <button onClick={() => {handleButton(true)}} className = 'confirm-btn'>Confirm</button>
                    
                </div>
        </div>
    )
}
export default DeletePopup;