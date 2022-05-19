import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifyError = (notif) => {
    toast.error(notif, { 
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
    });
}

export const notifySuccess = (notif) => {
    toast.success(notif, { 
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
     });
}