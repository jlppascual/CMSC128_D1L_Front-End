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

    // from zustand store
    const { isAuthenticated } = useStore();

    const navigate = useNavigate();     // navigation hook

    useEffect(() => {
        if(!isAuthenticated) {
            navigate('/')
            alert("You are not logged in!")}
        else {
            navigate('/home');
        }
    },[isAuthenticated])

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
                        <p className={'web-desc'}>Lorem ipsum dolor sit amet. Cum dolorem deserunt ad officiis velit et omnis laudantium sit enim illo id excepturi architecto aut ullam maxime aut accusantium sunt. Sit earum eligendi et nemo quia 33 soluta enim. Et esse iusto id saepe inventore ex galisum quas. Et facere corporis in nisi consequatur hic sunt expedita non commodi repellat quo fugit consectetur.
                        <br/><br/>
                        Aut similique distinctio ea illum corrupti et explicabo voluptate ut delectus deserunt aut blanditiis quia quo quod velit. Qui voluptas dolores a illum incidunt ad tenetur galisum aut totam nihil rem consectetur consequatur et recusandae labore.</p>
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