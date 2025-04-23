import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions';
import socialmedia from '../../assets/whatsApp_Panel_Login_Background_5.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import usernameSvgLogo from '../../assets/icons/username-svg-logo.svg';
import passwordSvgLogo from '../../assets/icons/password-svg-logo.svg';
import './style.css'; // Assuming you have imported your custom CSS

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginUrl = `http://147.93.106.185:3000/api/auth/login`
  console.log("Login Url",loginUrl);  

  // Accessing state from Redux store
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.user);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(login(username, password)); // Dispatch login action
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Navigate based on user role
      const userRole = user?.role;
      if (userRole === 'super_admin' || userRole === 'admin') {
        navigate('/AdminDashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-cover bg-center px-4">
      {/* Background Image */}
      <img
        src={socialmedia}
        alt="social media background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Login Box */}
      <div className="relative z-20 w-full max-w-lg bg-[#e0dada] bg-opacity-40 backdrop-blur-sm rounded-lg shadow-[10px_20px_60px_rgba(0,0,0,0.9)] m-4 p-8">
        <form onSubmit={handleLogin}>
          {error && (
            <p className="text-[#ff2a2a] text-2xl mb-4 font-bold">{error}</p>
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
                type="text"
                placeholder="Enter your user name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  backgroundColor: 'transparent', // Prevent background change when autofilled
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
                  backgroundColor: 'transparent', // Prevent background change when autofilled
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
              className="bg-green-600 hover:bg-green-700 text-black font-bold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#120d50] w-full md:text-lg text-xl"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
