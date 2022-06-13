/*
    Source code description: this source code contains the the utility functions for 
    toastr prompts found on the upper right of the screen whenever a success or failure
    in result is met.
*/

// imports the package from the react-taostify package to use the prompts
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// prompt that would appear if the user encountered an error in their action
export const notifyError = (notif) => {
    toast.error(notif, { 
        position: toast.POSITION.TOP_RIGHT,
        autoClose: true,
    });
}

// prompt that would appear if the user encountered a success in their action
export const notifySuccess = (notif) => {
    toast.success(notif, { 
        position: toast.POSITION.TOP_RIGHT,
        autoClose: true,
     });

}

// prompt that would appear for the deletion details of the user
export const notifyDelete = (notif) => {
    toast.success(notif, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: true, 
        onClose:()=>(window.location.href='/students'),
    });
}