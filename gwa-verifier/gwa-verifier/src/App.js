import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Default from './components/Default';
import Home from './components/Home';
import Add_Student from './components/Add_Student_Page'
import View_Students from './components/View_Students'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Default />} />
        <Route path='/home' element={<Home />} />
        <Route path='/add-student' element={<Add_Student/>}/>
        <Route path='/view-student' element={<View_Students/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
