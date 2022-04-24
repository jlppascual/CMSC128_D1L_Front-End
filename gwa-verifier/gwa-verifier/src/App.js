import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Default from './components/Default';
import Home from './components/Home';
import Add_Student from './components/Add_Student_Page'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Default />} />
        <Route path='/home' element={<Home />} />
        <Route path='/add-student' element={<Add_Student/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
