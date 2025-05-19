/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/authAction';
import { useNavigate } from 'react-router-dom';

const AutoLogoutWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  // const timeoutDuration = 30 * 60 * 1000; // 30 minute
  const timeoutDuration = 10 * 60 * 1000; // 10 Minute

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // Set new timeout
    timerRef.current = setTimeout(() => {
      handleLogout();
    }, timeoutDuration);
  }, [handleLogout]);

  useEffect(() => {
    resetTimer();

    const events = ['mousemove', 'mousedown', 'click', 'scroll', 'keydown', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      // Cleanup on unmount
      for (const event of events) {
        window.removeEventListener(event, resetTimer);
      };
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  return children;
};

export default AutoLogoutWrapper;
