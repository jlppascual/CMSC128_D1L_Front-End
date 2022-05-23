import React from 'react';
import '../../css/footer.css';
import { HiCode } from "react-icons/hi";
import { MdEmail, MdPlace } from "react-icons/md";
import { RiPhoneFill } from "react-icons/ri";


class Footer extends React.Component{
    render(){
        return(
            <footer>
                <div className='info-leftmost'> <HiCode className='dot'/> asteris ver. 2.0 bode</div>
                <div className='info-left'> <MdEmail className='dot'/> casdo.uplb@up.edu.ph</div>
                <div className='info-left'> <RiPhoneFill className='dot'/> (049) 501-5822</div>
                <div className='info-left'> <MdPlace className='dot'/> CAS Building, UPLB</div>
                <div className='copyright'>© CMSC 128 D-1L 2nd Sem AY 2021-2022. University of the Philippines Los Baños.</div>
            </footer>       
        );
    }
}

export default Footer