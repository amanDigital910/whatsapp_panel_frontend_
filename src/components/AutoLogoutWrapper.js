/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions';
import { useNavigate } from 'react-router-dom';

const AutoLogoutWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  // const timeoutDuration = 30 * 60 * 1000; // 30 minute
  const timeoutDuration = 10 * 60 * 1000; // 10 Minute

  const handleLogout = useCallback(() => {
    localStorage.removeItem('logoutTime');
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    const logoutTime = Date.now() + timeoutDuration;
    localStorage.setItem('logoutTime', logoutTime);
    timerRef.current = setTimeout(handleLogout, timeoutDuration);
  }, [handleLogout]);

  // On initial load, check if the user should be logged out
  useEffect(() => {
    const logoutTime = parseInt(localStorage.getItem('logoutTime'), 10);
    if (logoutTime && Date.now() > logoutTime) {
      handleLogout();
    } else {
      resetTimer();
    }

    const events = ['mousemove', 'click', 'keydown', 'scroll'];

    for (const event of events) {
      window.addEventListener(event, resetTimer);
    }

    return () => {
      for (const event of events) {
        window.removeEventListener(event, resetTimer);
      }
      clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  return children;
};

export default AutoLogoutWrapper;
