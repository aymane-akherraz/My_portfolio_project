import './blogs.css';
import React, { useEffect, useRef, useState } from 'react';
import axios from './axiosConfig';
import { useDispatch } from 'react-redux';
import { emptyUser } from './userSlice';
import { Link, useLocation } from 'react-router-dom';
import Blog from './blog';
import { emptyBlogs } from './blogSlice';
import { emptyData } from './dataSlice';

const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [isAuth, setIsAuth] = useState(null);
  const dispatch = useDispatch();
  const myHeader = useRef(null);
  const myP = useRef(null);
  const myBtn = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await axios.get('/checkauth');
        if (r.status === 200) {
          setIsAuth(true);
        }
      } catch (err) {
        setIsAuth(false);
        dispatch(emptyUser());
        dispatch(emptyBlogs());
        dispatch(emptyData());
      }

      try {
        const res = await axios.get('/');
        setBlogs(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [dispatch, location.search]);

  useEffect(() => {
    if (myHeader.current) {
      myHeader.current.classList.add('show');
    }
    if (myP.current) {
      myP.current.classList.add('show');
    }
    if (myBtn.current) {
      myBtn.current.classList.add('show');
    }
  }, [blogs]);

  if (isAuth === null) {
    return <div className='loading' />;
  }

  return (
    <div className='parent'>
      {!isAuth && (
        <div className='landing'>
          <div className='mask'>
            <div className='content'>
              <h1 ref={myHeader}>Stay creative</h1>
              <p ref={myP}>Create a unique and beautiful blog easily</p>
              <Link ref={myBtn} className='link signIn main' style={{ padding: '15px 30px', borderRadius: '25px' }} to='/signup'>Create your blog</Link>
            </div>
          </div>
        </div>
      )}
      {blogs
        ? (
          <div className='blogs'>
            <h1>Recent Blogs</h1>
            {blogs.map((e) => (
              <Blog key={e.id} blog={e} />
            ))}
          </div>
          )
        : (
          <div className='loading' />
          )}
    </div>
  );
};

export default Home;
