import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login  from './components/Login';
import Home from './components/Home';
import Add_Student from './components/Add_Student_Page'
import View_Students from './components/View_Students'
import View_Student_Details from './components/View_Student_Details'
import Add_User from './components/Add_User_Page'
import View_User from './components/View_Users_Page'
import View_Logs from './components/View_Logs'
import View_Summary from './components/View_Summary'



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route exact path='/home' element={<Home />} />
        <Route exact path='/student/new' element={<Add_Student/>}/>
        <Route exact path='/students' element={<View_Students/>}/>
        <Route exact path='/student/:id' element={<View_Student_Details/>}/>
        <Route path='/summary' element={<View_Summary/>}/>
        <Route path='/add-user' element={<Add_User/>}/>
        <Route path='/users' element={<View_User/>}/>
        <Route path='/logs' element={<View_Logs/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
