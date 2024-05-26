import Navbar from './Navbar';
import Home from './blogs';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './register';
import Login from './login';
import Profile from './Profile';
import './App.css';
import BlogDetails from './blogDetails';
import Create from './createBlog';
import Myblogs from './Myblogs';
import Update from './Editblog';
import ScrollToTop from './Srollup';
import { useSelector } from 'react-redux';

function App () {
  const user = useSelector((state) => state.user);

  return (
    <Router>
      <div className='App'>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/blogs/:id' element={<BlogDetails />} />
          <Route path='/blogs/create' element={<Create />} />
          <Route path='/myblogs' element={<Myblogs />} />
          <Route path='/myblogs/:id' element={user.id ? <Update /> : <Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
