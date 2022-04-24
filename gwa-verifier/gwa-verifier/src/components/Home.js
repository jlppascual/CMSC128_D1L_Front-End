/*
    Author: Christian, Leila

    This is the source code for the path '/home'
*/

import React from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer'
import '../css/home.css';

class Home extends React.Component{

    render(){
        return(
            <div>
                <Header />
                <Menu />
                <div className='home-body'>
                    <div className={'row'}>
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
                                    {/* <div class="inside-card">
                                        <h4>Announcement 3</h4>
                                        <p>This contains information about announcement 3.</p>
                                    </div> */}
                            </div>
                        </div>

                        {/* for web description column */}
                        <div className={'column'}>
                            <div className={'card'}>
                                <h3>Web Description</h3>
                                <p className={'web-desc'}>Lorem ipsum dolor sit amet. Cum dolorem deserunt ad officiis velit et omnis laudantium sit enim illo id excepturi architecto aut ullam maxime aut accusantium sunt. Sit earum eligendi et nemo quia 33 soluta enim. Et esse iusto id saepe inventore ex galisum quas. Et facere corporis in nisi consequatur hic sunt expedita non commodi repellat quo fugit consectetur.
                                <br/><br/>
                                Aut similique distinctio ea illum corrupti et explicabo voluptate ut delectus deserunt aut blanditiis quia quo quod velit. Qui voluptas dolores a illum incidunt ad tenetur galisum aut totam nihil rem consectetur consequatur et recusandae labore.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Home;