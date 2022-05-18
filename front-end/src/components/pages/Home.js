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
                        <p className={'web-desc'}>The product is intended to be utilized by the CAS Scholarships, Honors, and Awards Committee <b>(SHAC)</b> as a digitized GWA verification tool to aid committee members in evaluating graduating students’ grade records. Hence, this document details the entire ASTERIS functionality set along with an extensive list of features that are accessible to the end user.
                        <br /> <br />
                        The product, <b>ASTERIS</b>, is defined as a web application developed using a modified version of the MERN—denoted as: MongoDB, Express, React, and Node.js—technology stack. Reflective of the development team’s preferences, the MongoDB component had been substituted by MariaDB. 
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