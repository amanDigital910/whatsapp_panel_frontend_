/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions';
import { useNavigate } from 'react-router-dom';

const AutoLogoutWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const timeoutDuration = 60 * 10 * 1000; // 30 minutes
  // const timeoutDuration = 1 * 30 * 1000; // 30 Seconds

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  }

  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(handleLogout, timeoutDuration);
  }, [handleLogout, timeoutDuration]);

  useEffect(() => {
    const events = ['mousemove', 'click', 'keydown', 'scroll'];

    for (const event of events) { window.addEventListener(event, resetTimer); }

    resetTimer(); // set the initialB2B Database Software
    return () => {
      for (const event of events) { window.removeEventListener(event, resetTimer); }
      clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  return children;
};

export default AutoLogoutWrapper;
