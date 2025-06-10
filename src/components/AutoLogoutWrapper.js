import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/authAction';
import { useNavigate } from 'react-router-dom';
import { getSecureItem, removeSecureItem, setSecureItem } from '../pages/utils/SecureLocalStorage';

const AutoLogoutWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  // const timeoutDuration = 30 * 60 * 1000; // 30 minute
  const timeoutDuration = 10 * 60 * 1000; // 10 Minute

  const handleLogout = useCallback(() => {
    removeSecureItem('userToken');
    removeSecureItem('userData');
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  const resetTimer = useCallback(() => {
    // Store last active time
    setSecureItem('lastActivity', Date.now().toString());

    // Reset inactivity timeout
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(handleLogout, timeoutDuration);
  }, [handleLogout, timeoutDuration]);

  useEffect(() => {
    const lastActivity = getSecureItem("lastActivity");
    const timeSinceLastActivity = Date.now() - parseInt(lastActivity || 0);

    if (lastActivity && timeSinceLastActivity > timeoutDuration) {
      handleLogout();
    } else {
      resetTimer();
    }

    const events = ['mousemove', 'mousedown', 'click', 'scroll', 'keydown', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [handleLogout, resetTimer, timeoutDuration]);

  return children;
};

export default AutoLogoutWrapper;
