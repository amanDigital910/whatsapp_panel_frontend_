import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions/authAction';
import socialmedia from '../../assets/whatsApp_Panel_Login_Background_5.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import usernameSvgLogo from '../../assets/icons/username-svg-logo.svg';
import passwordSvgLogo from '../../assets/icons/password-svg-logo.svg';
import './style.css';
import { toast } from 'react-toastify';
import { getSecureItem } from '../utils/SecureLocalStorage';

const UserLogin = () => {
  const { loading = false, error = null, isAuthenticated = false } = useSelector((state) => state.userLogin) || {};
  const userRole = JSON.parse(getSecureItem("userData"));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [localLoading, setLocalLoading] = useState(loading);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorValid, setErrorValid] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // Redirect if password change is required

    if (!username || !password) {
      setErrorValid("Please enter both username and password.");
      return;
    } else if (username || password) {
      setErrorValid("")
    }

    setErrorValid("");

    // Dispatch and wait for login to complete
    const result = dispatch(login(username, password));

      // If login failed, exit early
      if (result?.error) {
        return;
      }
    } catch (err) {
      toast.error("Unexpected error during login.");
    } finally {
      setLocalLoading(false);
    }

  };

  useEffect(() => {
    if (isAuthenticated) {
      // Navigate based on user role
      const usersRole = userRole?.role;

      if (usersRole === 'super_admin' || usersRole === 'admin') {
        toast.success('Welcome Admin!');
        navigate('/admin-dashboard');
      } else if (usersRole === 'reseller') {
        toast.success('Welcome Reseller!');
        navigate('/dashboard');
      } else if (usersRole === 'user') {
        toast.success('Welcome User!');
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [isAuthenticated, navigate, userRole]);

  useEffect(() => {
    if (error) {
      setLocalLoading(true); // Set local loading to true on error
      const timer = setTimeout(() => {
        setLocalLoading(false); // Stop loading after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [error]);

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-cover bg-center px-4">
      {/* Background Image */}
      <img
        src={socialmedia}
        alt="social media background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Login Box */}
      <div className="relative z-20 w-full max-w-lg bg-[#e0dada] bg-opacity-40 backdrop-blur-sm rounded-lg shadow-[10px_20px 60px_rgba(0,0,0,0.9)] m-4 p-8">
        <form onSubmit={handleLogin}>
          {(error || errorValid) && (
            <p className="text-[#e72b2b] text-xl mb-2 font-bold" aria-live="assertive">
              {errorValid && <span>{errorValid}</span>}
              {error && <span>{error} </span>}
            </p>
          )}

          {/* Username */}
          <div className="mb-6">
            <label
              className="block text-black md:text-lg text-xl mb-2 font-bold"
              htmlFor="username"
            >
              User Name
            </label>
            <div className="shadow-sm flex flex-row appearance-none rounded-lg w-full py-3 pl-3 gap-3 text-black leading-tight bg-white border-4 border-gray-300 hover:border-[#120d50] focus-within:border-[#120d50] focus-within:outline-[#120d50]">
              <img alt="Username Logo" className="w-8 h-8" src={usernameSvgLogo} />
              <input
                className="w-full pr-3 border-none bg-transparent focus:outline-none text-gray-700 md:text-xl text-2xl"
                id="username"
                autoComplete='username'
                type="text"
                placeholder="Enter your user name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  backgroundColor: 'transparent',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <label className="block text-black md:text-lg text-xl mb-2 font-bold" htmlFor="password">
              Password
            </label>
            <div className="shadow-sm flex items-center flex-row appearance-none rounded-lg w-full py-3 pl-3 pr-3 gap-3 text-black leading-tight bg-white border-4 border-gray-300 hover:border-[#120d50] focus-within:border-[#120d50] focus-within:outline-[#120d50]">
              <img alt="Password Logo" className="w-8 h-8" src={passwordSvgLogo} />
              <input
                className="w-full pr-3 border-none bg-transparent focus:outline-none text-gray-700 md:text-xl text-2xl"
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  backgroundColor: 'transparent',
                }}
              />
              <div
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="w-full">
            <button
              className={`bg-green-600 hover:bg-green-700 text-black font-bold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#120d50] w-full md:text-lg text-xl ${localLoading ? 'opacity-90 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={localLoading}
            >
              {localLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
