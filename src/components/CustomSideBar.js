import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import creditCardIcon from '../assets/icons/credit-card.png';
import dashboardIcon from '../assets/icons/dashboard.png';
import home from '../assets/icons/home.png';
import world from '../assets/icons/world.png';
import exchange from '../assets/icons/exchange.png';
import groupIcon from '../assets/icons/group.png';
import templateIcon from '../assets/icons/template.png';
import ProfileIcon from '../assets/profile_Logo.png';
import UserIcon from '../assets/icons/user1.png';
import whatsappIcon from '../assets/icons/whatsapp.png';
import ProfileImgBG from '../assets/profile_img_logo_bg.jpg';
import useIsMobile from '../hooks/useMobileSize';
import './style.css'

const SideBar = ({ isOpen, toggleDropdown, activeDropdown }) => {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate("/login")
    }
    const location = useLocation();

    const isMobile = useIsMobile();

    const sidebarMenu = [
        {
            label: "Admin Dashboard",
            to: "/admindashboard",
            icon: dashboardIcon
        },
        {
            label: "Transaction Logs",
            to: "/Transitiontable",
            icon: dashboardIcon
        },
        {
            label: "Dashboard",
            to: "/Dashboard",
            icon: home
        },
        {
            label: "Wa Virtual",
            icon: whatsappIcon,
            dropdown: [
                { label: "Quick / CSV Campaign", to: "/user/virtualcampaign" },
                // { label: "CSV Campaign", to: "/user/csvvirtual" },
                { label: "Button Campaign", to: "/user/buttoncampaign" },
                { label: "DP Campaign", to: "/user/dpcampaign" },
                { label: "Poll Campaign", to: "/user/virtualpollcampaign" }, //new One
                { label: "WhatsApp Report", to: "/user/whatsappreport" }
            ]
        },
        {
            label: "Wa Personal",
            icon: whatsappIcon,
            dropdown: [
                { label: "Quick / CSV Campaign", to: "/personal/campaign" },
                // { label: "Personal Csv Campaign", to: "/personal/personal-csv" },
                { label: "Button Campaign", to: "/personal/button" },
                { label: "Group/Comm. Campaign", to: "/personal/group" }, //new One
                { label: "Channel Create & \nSend Bulk Mess. Campaign", to: "/personal/group-community" }, //new One
                { label: "Poll Campaign", to: "/personal/poll/campaign" },
                { label: "WhatsApp Report", to: "/personal/report" },
                { label: "Scan WhatsApp No.", to: "/personal/scan" }
            ]
        },
        {
            label: "Wa Int. Virtual",
            icon: world,
            dropdown: [
                { label: "Quick / CSV Campaign", to: "/international/campaign" },
                // { label: "CSV Campaign", to: "/international/csvcampaign" },
                { label: "Button Campaign", to: "/international/buttoncampaign" },
                { label: "Whatsapp Reports", to: "/international/whatsappreport" }
            ]
        },
        {
            label: "Wa Int. Personal",
            icon: exchange,
            dropdown: [
                { label: "Quick / CSV Campaign", to: "/international/personal/campaign" },
                // { label: "Csv Campaign", to: "/international/personal/csvcampaign" },
                { label: "Button Campaign", to: "/international/personal/buttoncampaign" },
                { label: "Poll Campaign", to: "/international/personal/pollcampaign" },
                { label: "Whatsapp Reports", to: "/international/personal/report" },
                { label: "Scan Whatsapp No.", to: "/international/personal/scan" }
            ]
        },
        {
            label: "Template",
            to: "/template",
            icon: templateIcon
        },
        {
            label: "Group",
            to: "/group",
            icon: groupIcon
        },
        {
            label: "Manage Credits",
            to: "/managecredit",
            icon: creditCardIcon
        },
        {
            label: "Manage Users",
            to: "/manageuser",
            icon: UserIcon
        },
    ];

    return (
        <>
            {(!isMobile || isOpen) && (
                <div className={` ${isOpen ? "w-60" : "ml-20 w-0"} md:ml-0 text-white flex flex-nowrap md:absolute `}>
                    <div
                        style={{ height: "100%", paddingBottom: '151px', }}
                        className={`mt-[4.4rem] fixed top-0 left-0 h-full bg-[#406dc7] text-white ${isOpen ? "transition-all duration-100 ease-in w-60" : "w-20 transition-all duration-100 ease-out"} z-50  overflow-y-auto hide-scrollbar`}
                    >
                        {/* Sidebar Header */}
                        <div className={`relative  overflow-hidden border-r-2 border-[#406dc7] ${isOpen ? "h-60  w-60 " : "h-[70px]"}`}>
                            {/* Background Image */}
                            <img
                                alt="Profile Background"
                                src={ProfileImgBG}
                                className="absolute top-0 left-0 w-full h-full object-cover bg-no-repeat"
                            />

                            {/* User Icon Overlay */}
                            <img
                                alt="User Icon"
                                src={ProfileIcon}
                                className={`absolute flex items-center justify-center w-full h-full bg-transparent
                        z-10 bg-cover ${isOpen ? 'p-4' : 'p-2'}`} />
                        </div>

                        {/* Menu Items */}
                        <ul className="space-y-1 py-0 px-0">
                            {sidebarMenu.map((item, index) => {
                                const isActiveParent = item.to && location.pathname === item.to;
                                const isDropdownActive = item.dropdown?.some(sub => location.pathname === sub.to);

                                return (
                                    <li key={index} className="text-white">
                                        {item.dropdown ? (
                                            <div className="group">
                                                <button
                                                    onClick={() => toggleDropdown(index)}
                                                    className={`w-full flex items-center p-3 hover:underline underline-offset-4 transition ${isOpen ? "justify-between" : "justify-center"}  ${isDropdownActive && 'bg-green-700 font-semibold'}`}
                                                >
                                                    <div className={`flex items-center ${isOpen ? "space-x-2" : ""} justify-center`}>
                                                        <img src={item.icon} width={20} height={20} alt="" />
                                                        {isOpen && <span className="text-lg ">{item.label}</span>}
                                                    </div>
                                                    {isOpen && (
                                                        <svg
                                                            className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === index ? "rotate-180" : ""}`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    )}
                                                </button>

                                                {activeDropdown === index && isOpen && (
                                                    <ul className="mt-1 space-y-1  duration-300 ease-in-out p-0">
                                                        {item.dropdown.map((subItem, subIndex) => {
                                                            const isActiveSub = location.pathname === subItem.to;

                                                            return (
                                                                <li key={subIndex} className='p-0' >
                                                                    <Link
                                                                        to={subItem.to}
                                                                        className={`block pl-[42px] pr-2 py-2 text-base text-white no-underline hover:underline underline-offset-4 ${isActiveSub ? 'bg-green-700 font-semibold' : ''}`}
                                                                    >
                                                                        {subItem.label}
                                                                    </Link>
                                                                </li>
                                                            )})}
                                                    </ul>
                                                )}
                                            </div>
                                        ) : (
                                            <Link
                                                to={item.to}
                                                // className={`w-full flex items-center rounded px-2 hover:bg-green-700 transition ${isOpen ? "justify-between" : "justify-center"}`}
                                                className={`flex items-center text-white  no-underline hover:underline underline-offset-4 px-2 py-2 ${isOpen ? "justify-start space-x-2" : "justify-center"} ${isActiveParent && 'bg-green-700 font-semibold'}`}
                                            >
                                                <div className={`flex items-center ${isOpen ? "space-x-2" : ""} p-2 justify-center`}>
                                                    <img src={item.icon} width={20} height={20} alt="" />
                                                    {isOpen && <span className="text-lg">{item.label}</span>}
                                                </div>
                                            </Link>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>

                        {/* Logout */}
                        {/* {isOpen && (
                            <div className="px-4 pb-4">
                                <button
                                    className="w-full py-2 mt-4 bg-white text-green-700 font-semibold rounded hover:bg-green-100 "
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )} */}
                    </div>
                </div>
            )}
        </>
    );
}

export default SideBar