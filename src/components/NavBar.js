import React, { useEffect, useRef, useState } from 'react';
import menuIcon from '../assets/icons/paragraph.png';
import bulkicon from '../assets/icons/wp_bulk.png';
import userImage from '../assets/profile.png';
import useIsMobile from '../hooks/useMobileSize';
import './style.css';
import { FaPowerOff } from 'react-icons/fa';
import { BsPersonCircle } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions';
import { getSecureItem } from '../pages/utils/SecureLocalStorage';

const NavBar = ({ setIsOpen, isOpen }) => {
    const isMobile = useIsMobile();
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const dropdownRef = useRef(null);
    const toggleRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const usersData = JSON.parse(getSecureItem("userData"));

    const handleOutsideClick = (event) => {
        if (
            (dropdownRef.current && !dropdownRef.current.contains(event.target)) &&
            (toggleRef.current && !toggleRef.current.contains(event.target))
        ) {
            setIsOpenMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleLogout = () => {
        // Dispatch the logout action to clear user data
        dispatch(logout());

        // Redirect the user to the login page or home page
        navigate("/login");  // Adjust the path based on your app
    };

    return (
        <nav className={`bg-[#383387] p-3 px-2 fixed w-full flex flex-wrap h-[70px] z-50 justify-between items-center text-white 
        ${isMobile ? 'left-0 w-full' : isOpen ? 'left-[240px] w-[calc(100%)]' : 'left-[80px] w-[calc(100%)]'}`}>
            <div className={`flex gap-2 items-center justify-center h-full ${isMobile && 'ml-[80px]'}`}>
                <div className={`z-50 absolute bg-[#406dc7] flex justify-center items-center p-2.5 top-0 px-4 h-full
                ${!isMobile ? (isOpen ? 'w-[240px] -left-[240px]' : 'w-[80px] -left-[80px]') : '!w-[80px] left-[0px]'}`}>
                    <img
                        alt="User  Icon"
                        src={bulkicon}
                        className={`flex items-center justify-center bg-transparent bg-cover
                            ${isMobile ? 'p-0 w-[30px] h-[30px]' : `w-[50px] h-[50px] ${isOpen ? 'p-1.5' : 'px-0 py-2'}`}`} />
                </div>
                <div
                    className="button-menu-mobile waves-effect hover:opacity-40 text-white cursor-pointer inline-block overflow-hidden select-none align-middle z-[1] transition-all duration-300 ease-out">
                    <img
                        src={menuIcon}
                        alt="Menu"
                        onClick={() => setIsOpen(!isOpen)}
                    />
                </div>
                <img src={bulkicon} alt="icon" width="30px" className='ms-4 h-8 flex' />
                <h1 className="font-bold text-[30px] m-0 md:hidden">Whatsapp Bulk Marketing</h1>
            </div>
            <div className={`absolute top-4 right-6 flex flex-row hover:opacity-40 text-white cursor-pointer ${!isMobile ? isOpen ? " mr-60 " : "mr-24" : " mr-6"}`}
                onClick={(e) => { setIsOpenMenu(prev => !prev); }}
                ref={toggleRef}
            >
                <img src={userImage} alt="User  Profile" width={40} height={15} className='flex flex-1 justify-end' />
            </div>
            {isOpenMenu && (
                <div ref={dropdownRef} className={`absolute right-0 mt-48 w-48 bg-white border rounded-lg shadow-lg z-50 ${!isMobile ? isOpen ? "mr-[260px]" : "mr-[100px]" : "mr-6"}`}>
                    <Link to={"/profile"} className='no-underline'>
                        <button className="bg-[#383387] w-full text-white text-lg px-4 py-3 rounded-t-lg font-medium flex items-center gap-2 cursor-pointer">
                            <BsPersonCircle /> {usersData ? usersData.username : "VikramRajput"}
                        </button>
                    </Link>
                    <button onClick={handleLogout} className="w-full px-4 py-3 flex items-center gap-2 text-red-500 text-lg hover:bg-gray-100 border-2 rounded-b-lg border-[#383387] cursor-pointer">
                        <FaPowerOff /> Logout
                    </button>
                    {/* </div> */}
                </div>
            )}
        </nav>
    )
}

export default NavBar;