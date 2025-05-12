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
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  const resetTimer = useCallback(() => {
    // Clear the existing timer
    clearTimeout(timerRef.current);
    // Set a new timer
    timerRef.current = setTimeout(handleLogout, timeoutDuration);
  }, [handleLogout, timeoutDuration]);

  useEffect(() => {
    resetTimer();
    // Define the events to listen for
    const events = ['mousemove', 'click', 'keydown', 'scroll'];
    // Add event listeners to reset the timer
    for (const event of events) {
      window.addEventListener(event, resetTimer);
    }

    // Cleanup function to remove event listeners and clear the timer
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
