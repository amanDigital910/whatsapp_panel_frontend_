
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BgImage from '../../assets/loginbg.webp';
import usernameSvgLogo from '../../assets/icons/username-svg-logo.svg'
import passwordSvgLogo from '../../assets/icons/password-svg-logo.svg'
import loginBackground from '../../assets/whatsApp_Panel_Login_Background_2.png'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName: username, password }),
            });

            const data = await response.json();

            if (data?.message === 'Invalid credentials') {
                setError("Invalid credentials");
            } else if (data?.message === 'Login successful') {
                // Store user data and token in localStorage
                localStorage.setItem("userData", JSON.stringify(data?.data));
                localStorage.setItem("userToken", data?.data?.token);

                // Navigate based on user role
                const userRole = data?.data?.user?.role;
                if (userRole === 'superAdmin' || userRole === 'admin') {
                    navigate("/AdminDashboard");
                } else {
                    navigate("/dashboard");
                }
            } else {
                setError("Something went wrong, please try again.");
            }

            setLoading(false);

        } catch (err) {
            setLoading(false);
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div className=' flex bg-gray-300 md:flex-col md:h-full min-h-screen md:py-0 w-full'>
            <div className=' md:ml-0 md:mx-4 md:my-4 my-0 px-4 py-12 flex flex-col w-1/2 md:w-full md:h-full md:overflow-auto h-screen overflow-hidden  flex-1 items-start justify-start gap-1 bg-[#120d50]'>
                <div className='flex flex-col gap-4 md:gap-2'>
                    {/* md:rounded-bl-none md:rounded-t-xl rounded-l-xl */}
                    <h1 className='text-[30px] font-bold text-white p-0 m-0'>WhatsApp Bulk Messages</h1>
                    <p className='text-xl md:text-lg text-white p-0 m-0 flex justify-around'>
                        What are WhatsApp bulk messages? WhatsApp bulk messages are a very effective method businesses uses to contact leads and build customer loyalty. Bulk message campaigns can include videos and images, as well as the ability to express their message with an unlimited number of characters.
                    </p>
                </div>
                <div className='w-full flex justify-center '>
                    <img alt='Whatsapp Login Background' src={loginBackground} className=' md:w-96  w-[440px] h-full' />
                </div>
            </div>
            {/* Login Form */}
            <div className="relative z-50  md:my-4 my-0 md:mb-4 p-4 flex px-4 w-1/2 md:w-full md:h-full h-auto flex-1 justify-center items-center bg-white shadow-lg ">
                {/* md:rounded-b-xl md:rounded-tr-none rounded-r-xl  */}
                <div className='w-full border-[#120d50]'>
                    <div className='p-2'>
                        <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">Login</h2>
                        <form onSubmit={handleLogin}>
                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                            {/* Username / Email Field */}
                            <div className="mb-6">
                                <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="username">
                                    User Name
                                </label>
                                <div className="shadow-sm flex flex-row appearance-none rounded-lg w-full py-3 pl-3 gap-3
                             text-gray-700 leading-tight bg-white border-2 border-gray-300 hover:border-blue-500 
                             focus-within:border-sky-500 focus-within:outline-sky-500 focus-within:invalid:border-pink-500
                              focus-within:invalid:outline-pink-500 invalid:border-pink-500 invalid:text-pink-600 
                              disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none
                               dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20">
                                    <img alt='Username SVG Logo' className='w-5 h-5' src={usernameSvgLogo} />
                                    <input
                                        className="w-full pr-3 border-none bg-transparent focus:outline-none text-gray-700"
                                        id="username"
                                        type="text"
                                        placeholder="Enter your user name"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="mb-6 relative">
                                <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="password">
                                    Password
                                </label>

                                <div className="shadow-sm flex flex-row appearance-none rounded-lg w-full py-3 pl-3 gap-3
                             text-gray-700 leading-tight bg-white border-2 border-gray-300 hover:border-blue-500 
                             focus-within:border-sky-500 focus-within:outline-sky-500 focus-within:invalid:border-pink-500
                              focus-within:invalid:outline-pink-500 invalid:border-pink-500 invalid:text-pink-600 
                              disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none
                               dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20">
                                    <img alt='Username SVG Logo' className='w-5 h-5' src={passwordSvgLogo} />
                                    <input
                                        className="w-full pr-3 border-none bg-transparent focus:outline-none text-gray-700" id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                {/* Icon for toggling password visibility */}
                                <div
                                    className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer mt-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </div>
                            </div>


                            {/* Submit Button */}
                            <div className="w-full">
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold fs-5 py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full tracking-wider"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage