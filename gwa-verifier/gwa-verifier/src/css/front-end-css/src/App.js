import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login  from './components/Login';
import Home from './components/Home';
import Add_Student from './components/Add_Student_Page'
import View_Students from './components/View_Students'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route exact path='/home' element={<Home />} />
        <Route exact path='/add-student' element={<Add_Student/>}/>
        <Route exact path='/view-student' element={<View_Students/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
