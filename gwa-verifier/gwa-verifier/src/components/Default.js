/*
    This is the source folder for the path '/' or the default page
*/ 

import '../css/default.css';
import Login from './Login.js';
import Footer from './Footer.js';
// import Homepage from './Homepage.js';
import React from 'react';

class Default extends React.Component{

    render(){
        return(
        <div className="App">
            <Login/>
            <Footer/>
            {/* <Homepage/> */}
        </div>);
    }
}




export default Default;
