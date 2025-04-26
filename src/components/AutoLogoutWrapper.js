/* eslint-disable react-hooks/exhaustive-deps */
// components/AutoLogoutWrapper.jsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions';

const AutoLogoutWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const timeoutDuration = 30 * 60 * 1000; // 30 minutes

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dispatch(logout());
      navigate('/login');
    }, timeoutDuration);
  };

  useEffect(() => {
    const events = ['mousemove', 'click', 'keydown', 'scroll'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // set the initial timer

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timerRef.current);
    };
  }, []);

  return children;
};

export default AutoLogoutWrapper;
