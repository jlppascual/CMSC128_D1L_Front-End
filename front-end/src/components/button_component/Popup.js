import React, { useState } from 'react';

const Popup=(props)=>{

    return(
        <div className="popup-box">
            <div className="box">
                Are you sure you want to delete?
                <button>Confirm</button>
                <button >Cancel</button>
            </div>
        </div>
    )
}
export default Popup;