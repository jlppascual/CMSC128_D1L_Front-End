/*
    Author: Christian, Leila

    This is the source code for the path '/home'
*/

import React from 'react';
import Header from './Header';
import Footer from './Footer.js';

class Home extends React.Component{

    render(){
        return(
            <div>
                <Header />
                <Footer />
            </div>
        );
    }
}

export default Home;