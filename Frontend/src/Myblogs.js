import { useDispatch, useSelector } from 'react-redux';
import Blog from './blog';
import axios from './axiosConfig';
import { emptyUser } from './userSlice';
import { emptyBlogs, fetchBlogs } from './blogSlice';
import { emptyData } from './dataSlice';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const Myblogs = () => {
  const user = useSelector((state) => state.user);
  const blogs = useSelector((state) => state.blog);
  const [isAuth, setIsAuth] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/myblogs/${user.id}`);
        if (res.status === 200) {
          dispatch(fetchBlogs(res.data));
          setIsAuth(true);
        }
      } catch (error) {
        dispatch(emptyUser());
        dispatch(emptyBlogs());
        dispatch(emptyData());
        setIsAuth(false);
      }
    };
    fetchData();
  }, [dispatch, user.id]);

  if (isAuth === null) {
    return <div className='loading' />;
  }

  return (
    isAuth
      ? (
        <div className='blogs'>
          <h1>My blogs</h1>
          {
            blogs.map((e) => (
              <Blog key={e.id} blog={e} />
            ))
        }
        </div>)
      : (
        <Navigate to='/login' />
        )
  );
};

export default Myblogs;
