import React from 'react';
import '../css/footer.css';

class Footer extends React.Component{
    render(){
        return(
            <footer>
                <div className={'uplb-email'}>O uplbemail@up.edu.ph</div>
                <div className={'uplb-contact'}>O (02)8-997-27-74</div>
                <div className={'uplb-address'}>O CAS Building, UPLB</div>
                <div className={'copyright'}>© CMSC 128 D-1L 2nd Sem AY 2021-2022. University of the Philippines Los Baños</div>
            </footer>       
        );
    }
}

export default Footer