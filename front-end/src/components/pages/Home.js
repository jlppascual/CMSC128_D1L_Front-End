/*
    Author: Christian, Leila
    This is the source code for the path '/home'
*/
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import useStore from '../hooks/authHook'
import Header from '../components/Header';
import Menu from '../components/Menu';
import Footer from '../components/Footer'
import '../../css/home.css';

// changed to a handler function to use hooks
const Home = () => {

    return(
        <div>
            <div className='home-body'>
                {/* for announcement column */}
                <div className={'column'}>
                    <div className={'card'}>
                        <h3>Announcements</h3>
                        <div className={'inside-card'}>
                            <h4>Announcement 1</h4>
                            <p>This contains information about announcement 1.</p>
                        </div>
                        <div className={'inside-card'}>
                            <h4>Announcement 2</h4>
                            <p>This contains information about announcement 2.</p>
                        </div>
                    </div>
                </div>

                {/* for web description column */}
                <div className={'column'}>
                    <div className={'card'}>
                        <h3>Web Description</h3>
                        <p className={'web-desc'}>The <b>Automated STudent Entry and Record Inspection Software</b> or <b>ASTERIS</b> for short, is an inhouse technology solution developed to aid in tackling the ever-increasing workload of the <b>UPLB CAS Scholarships, Honors, and Awards Committee</b> [herein defined as the <i>user</i>]—concisely referred to as <b>SHAC</b>.
                        <br /> <br />
                        ASTERIS serves as a digital student <b>general weighted average (GWA) verification interface</b> that provides extensive record inspection features accessible to SHAC members. The software enables collaborative student record processing over a network whilst ensuring that sensitive information security is given utmost priority.
                        </p>
                    </div>
                </div>
            </div>
            <Header />
            <Menu />
            <Footer/>
        </div>
    );
}

export default Home;