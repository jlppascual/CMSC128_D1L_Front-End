/*
    Author: Christian, Leila

    This is the source code for the path '/home'
*/

import React from 'react';
import Header from './Header';
import Menu from './Menu';

class Home extends React.Component{

    render(){
        return(
            <div>
                <Header />
                <Menu />
            </div>
        );
    }
}

export default Home;