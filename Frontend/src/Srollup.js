import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (pathname !== '/' || search === '?logout=true') {
      document.documentElement.scrollTop = 0;
    }
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
