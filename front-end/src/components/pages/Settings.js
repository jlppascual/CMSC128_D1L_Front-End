import React, { useState} from 'react';

const Settings =()=>{
    const settings_list=[
        {label:"change username"},
        {label:"change password"}
    ]

    const Popup=(props)=>{

        return(
            <div className="popup-box">
                <div className="box">
                    {props.content}
                </div>
            </div>
        )
    }

    const onClick=()=>{
        
    }

    return(
        <div>
            <ul>
            {settings_list.map((foo, i)=>{
                return <li key={i}>{foo.label}</li>
            })}
            </ul>
        </div>
    )
}

export default Settings;