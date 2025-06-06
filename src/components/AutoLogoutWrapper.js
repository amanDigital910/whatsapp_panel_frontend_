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
  const token = getSecureItem('userToken');
  const userData = getSecureItem('userData');

  const handleLogout = useCallback(() => {
    removeSecureItem(token);
    removeSecureItem(userData);
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate, token, userData]);

  const resetTimer = useCallback(() => {
    setSecureItem(token, Date.now().toString());

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleLogout();
    }, timeoutDuration);
  }, [handleLogout, timeoutDuration, token]);

  useEffect(() => {
    // Check on load: has timeout already passed?
    const lastActivity = localStorage.getItem(token);
    if (lastActivity && Date.now() - parseInt(lastActivity) > timeoutDuration) {
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
  }, [handleLogout, resetTimer, timeoutDuration, token]);

  return children;
};

export default AutoLogoutWrapper;
