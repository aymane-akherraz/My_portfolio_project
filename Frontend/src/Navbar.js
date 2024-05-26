import './navbar.css';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useMatch } from 'react-router-dom';
import axios from './axiosConfig';
import { emptyUser } from './userSlice';
import { addBlog, editBlog, emptyBlogs } from './blogSlice';
import { emptyData } from './dataSlice';

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const blogData = useSelector((state) => state.data);
  const oldData = useSelector((state) => state.blogData);
  const location = useLocation();
  const [visible, setV] = useState(false);
  const [bool, setB] = useState(false);
  const menuRef = useRef(null);
  const iconRef = useRef(null);
  const myRef = useRef(null);
  const logo = useRef(null);
  const myBtn = useRef(null);
  const pubBtn = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const match = useMatch('/myblogs/:id');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
                iconRef.current && !iconRef.current.contains(event.target)) {
        setV(false);
      }
    };
    if (!user.id && location.pathname === '/') {
      const handleScroll = () => {
        if (document.documentElement.scrollTop > 58) {
          myRef.current.classList.add('navbar');
          logo.current.classList.remove('wLogo');
          logo.current.classList.add('bLogo');
          myBtn.current.classList.remove('signIn');
          myBtn.current.classList.add('signUp');
        } else {
          myRef.current.classList.remove('navbar');
          logo.current.classList.remove('bLogo');
          logo.current.classList.add('wLogo');
          myBtn.current.classList.remove('signUp');
          myBtn.current.classList.add('signIn');
        }
      };
      window.addEventListener('scroll', handleScroll);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScroll);
        setV(false);
      };
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      setV(false);
    };
  }, [location.pathname, user]);

  const logOut = async () => {
    const res = await axios.get('/logout');
    if (res.status === 200) {
      dispatch(emptyUser());
      dispatch(emptyBlogs());
      dispatch(emptyData());
      navigate('/?logout=true');
    }
  };

  const publishBlog = async () => {
    if (blogData.title && blogData.content) {
      const blog = { ...blogData };
      if (blog.img) {
        const formData = new FormData();
        formData.append('file', blog.img);
        try {
          const r = await axios.post('/upload', formData);
          if (r.status === 200) {
            blog.img = r.data;
          }
        } catch (err) {
          console.log(err);
        }
      }
      blog.author_id = user.id;
      const blogObj = { name: user.name, title: blog.title, summary: blog.summary };
      setB(true);
      pubBtn.current.classList.add('animate');
      const res = await axios.post('/blogs/create', blog);
      if (res.status === 201) {
        blogObj.id = res.data.id;
        blogObj.created_at = res.data.date;
        dispatch(addBlog(blogObj));
        pubBtn.current.classList.remove('animate');
        setB(false);
        navigate('/myblogs');
      }
    }
  };

  const updateBlog = async () => {
    const newblog = {};
    if (blogData.title !== oldData.title) {
      newblog.title = blogData.title;
    }
    if (blogData.summary !== oldData.summary) {
      newblog.summary = blogData.summary;
    }
    if (blogData.content !== oldData.content) {
      newblog.content = blogData.content;
    }
    if (JSON.stringify(newblog) !== '{}') {
      try {
        setB(true);
        pubBtn.current.classList.add('animate');
        const res = await axios.put(`/myblogs/${oldData.id}`, blogData);
        if (res.status === 200) {
          dispatch(editBlog({ id: parseInt(oldData.id), blog: blogData }));
          pubBtn.current.classList.remove('animate');
          setB(false);

          navigate('/myblogs');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <nav ref={myRef} className={!user.id && location.pathname === '/' ? '' : 'navbar'}>
      <div className='container'>
        <img src='/images/icons8-blogger-48.png' alt='logo' />
        <strong><Link to='/' ref={logo} className={!user.id && location.pathname === '/' ? 'wLogo' : 'bLogo'}>Blogger</Link></strong>
      </div>

      {location.pathname === '/' && !user.id &&
        <div className='user_conx'>
          <Link className='link signIn' to='/login' ref={myBtn}>Sign in</Link>
        </div>}
      {user.id &&
        <div className='user_conx'>
          {location.pathname !== '/blogs/create' && !match
            ? <Link className='link signUp' to='/blogs/create'>Write</Link>
            : location.pathname === '/blogs/create'
              ? <button onClick={publishBlog} ref={pubBtn} className='link signUp' disabled={bool}>Publish<span /></button>
              : match && <button onClick={updateBlog} ref={pubBtn} className='link signUp' disabled={bool}>Save & Publish<span /></button>}
          <img ref={iconRef} onClick={() => setV(prev => !prev)} className='userIcon' src='/images/icons8-utilisateur-48.png' alt='user icon' />
        </div>}
      {visible &&
        <div className='iconMenu' ref={menuRef}>
          <Link to='/profile'>My profile</Link>
          <Link to='/myblogs'>My blogs</Link>
          <Link onClick={logOut}>Log out</Link>
        </div>}
    </nav>
  );
};

export default Navbar;
