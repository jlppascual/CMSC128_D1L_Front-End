import React from 'react';
import '../css/footer.css';

class Footer extends React.Component{
    render(){
        return(
            <footer>
                <div className='info-left'><div className="dot" /> uplbemail@up.edu.ph</div>
                <div className='info-left'><div className="dot" /> (02)8-997-27-74</div>
                <div className='info-left'><div className="dot" /> CAS Building, UPLB</div>
                <div className='copyright'>© CMSC 128 D-1L 2nd Sem AY 2021-2022. University of the Philippines Los Baños</div>
            </footer>       
        );
    }
}

export default Footer