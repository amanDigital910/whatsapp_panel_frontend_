import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import creditCardIcon from '../assets/icons/credit-card.png';
import dashboardIcon from '../assets/icons/dashboard.png';
import home from '../assets/icons/home.png';
import world from '../assets/icons/world.png';
import exchange from '../assets/icons/exchange.png';
import groupIcon from '../assets/icons/group.png';
import templateIcon from '../assets/icons/template.png';
import ProfileIcon from '../assets/profile_Logo.png';
import UserIcon from '../assets/icons/user1.png';
import whatsappOfficialIcon from '../assets/icons/wp_bulk.png';
import whatsappIcon from '../assets/icons/whatsapp.png';
import ProfileImgBG from '../assets/profile_img_logo_bg.jpg';
import useIsMobile from '../hooks/useMobileSize';
import './style.css'

const SideBar = ({ isOpen, toggleDropdown, activeDropdown }) => {

    const location = useLocation();

    const isMobile = useIsMobile();

    const [openNestedKeys, setOpenNestedKeys] = useState(new Set());


    const toggleNestedDropdown = (parentIndex, nestedIndex) => {
        const key = `${parentIndex}-${nestedIndex}`;
        setOpenNestedKeys(prev => {
            const newSet = new Set();
            if (!prev.has(key)) {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const sidebarMenu = [
        {
            label: "Admin Dashboard",
            to: "/admin-dashboard",
            icon: dashboardIcon
        },
        {
            label: "Transaction Logs",
            to: "/transitiontable",
            icon: dashboardIcon
        },
        {
            label: "Dashboard",
            to: "/dashboard",
            icon: home
        },
        {
            label: "Wa Virtual",
            icon: whatsappIcon,
            dropdown: [
                { label: "Quick Campaign", to: "/virtual-quick-csv" },
                { label: "DP Campaign", to: "/virtual-dp" },
                { label: "Button Campaign", to: "/virtual-button" },
                // { label: "CSV Campaign", to: "/user/csvvirtual" },
                { label: "WhatsApp Report", to: "/virtual-whatsapp-report" }
            ]
        },
        {
            label: "Wa Personal",
            icon: whatsappIcon,
            dropdown: [
                { label: "Quick Campaign", to: "/personal-quick-csv" },
                { label: "Button Campaign", to: "/personal-button" },
                { label: "Group/Comm. Campaign", to: "/personal-group-community" }, //new One
                { label: "Channel Create & \nSend Bulk Mess. Campaign", to: "/personal-channel-create-bulk-sms" }, //new One
                { label: "Poll Campaign", to: "/personal-poll" },
                { label: "WhatsApp Report", to: "/personal-whatsapp-report" },
                { label: "Scan Whatsapp", to: "/personal-scan-whatsapp" }
            ]
        },
        {
            label: "Wa Int. Virtual",
            icon: world,
            dropdown: [
                { label: "Quick Campaign", to: "/international-virtual-quick-csv" },
                // { label: "CSV Campaign", to: "/international-csvcampaign" },
                { label: "Button Campaign", to: "/international-virtual-button" },
                { label: "Whatsapp Reports", to: "/international-virtual-whatsapp-report" }
            ]
        },
        {
            label: "Wa Int. Personal",
            icon: exchange,
            dropdown: [
                { label: "Quick Campaign", to: "/international-personal-quick-csv" },
                // { label: "Csv Campaign", to: "/international-personal-csvcampaign" },
                { label: "Button Campaign", to: "/international-personal-button" },
                { label: "Poll Campaign", to: "/international-personal-poll" },
                { label: "Whatsapp Reports", to: "/international-personal-whatsapp-report" },
                { label: "Scan Whatsapp", to: "/international-personal-scan-whatsapp" }
            ]
        },
        {
            label: "Whatsapp Official",
            icon: whatsappOfficialIcon,
            dropdown: [
                { label: "Dashboard ", to: "/whatsapp-official-dashboard" },
                { label: "Send Whatsapp ", to: "/whatsapp-send-official" },
                { label: "Reports", to: '/whatsapp-reports' },
                {
                    label: "Whatsapp Setting",
                    subDropdown: [
                        { label: "Phones", to: "/whatsapp-phones" },
                        { label: "Templates", to: "/whatsapp-template" },
                        { label: "User Trigger", to: "/whatsapp-user-trigger" },
                        { label: "Flows", to: "/whatsapp-flows" },
                        { label: "Pricing", to: "/whatsapp-pricing" },
                        { label: "Webhook", to: "/whatsapp-webhook" },
                    ]
                },
                { label: "Whatsapp Billing", to: "/whatsapp-billing" },
                { label: "Whatsapp API", to: "/whatsapp-api" },
                {
                    label: "Setting",
                    subDropdown: [
                        { label: "Profile", to: "/whatsapp-profile" },
                        { label: "Company ", to: "/whatsapp-company" },
                        { label: "Team", to: "/whatsapp-team" },
                        { label: "Security", to: "/whatsapp-security" },
                    ],
                }
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
            to: "/manage-credit",
            icon: creditCardIcon
        },
        {
            label: "Manage User",
            to: "/manage-user",
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
                                const isDropdownActive = item.dropdown?.some(sub => location.pathname === sub.to || sub.subDropdown?.some(nested => location.pathname === nested.to));

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
                                                    <ul className="mt-1 space-y-1 duration-300 ease-in-out p-0">
                                                        {item.dropdown.map((subItem, subIndex) => {
                                                            const isActiveSub = subItem.to && location.pathname === subItem.to;
                                                            const isSubDropdownActive = subItem.subDropdown?.some(subItem => location.pathname === subItem.to);
                                                            const nestedKey = `${index}-${subIndex}`;
                                                            const isNestedOpen = openNestedKeys.has(nestedKey);

                                                            const hasNested = Array.isArray(subItem.subDropdown);

                                                            return (
                                                                <li key={subIndex}>
                                                                    <Link
                                                                        to={subItem.to}
                                                                        key={subIndex}
                                                                        onClick={() => {
                                                                            if (hasNested) toggleNestedDropdown(index, subIndex);
                                                                        }}
                                                                        className={`py-0 m-0 flex items-center justify-between pr-4 ${isActiveSub || isSubDropdownActive ? 'bg-green-700 font-semibold' : ''} `}>
                                                                        <p className={`block m-0 pl-[42px] pr-2 py-2 text-base text-white no-underline hover:underline underline-offset-4 `}>
                                                                            {subItem.label}
                                                                        </p>
                                                                        {hasNested && (
                                                                            <svg
                                                                                className={`w-4 h-4 transition-transform duration-200 text-white ${isNestedOpen ? 'rotate-180' : ''
                                                                                    }`}
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                            </svg>
                                                                        )}
                                                                    </Link>
                                                                    {hasNested && isNestedOpen && (
                                                                        <ul className="mt-1 p-0">
                                                                            {subItem.subDropdown.map((nestedItem, nestedIndex) => {

                                                                                return (
                                                                                    <li key={nestedIndex} className='mt-1 space-y-1 duration-300 ease-in-out p-0'>
                                                                                        <Link
                                                                                            to={nestedItem.to}
                                                                                            className={`py-2  pl-14 m-0 flex items-center justify-between text-white no-underline hover:underline ${location.pathname === nestedItem.to
                                                                                                ? 'bg-green-500 font-bold'
                                                                                                : ''
                                                                                                }`}
                                                                                        >
                                                                                            {nestedItem.label}
                                                                                        </Link>
                                                                                    </li>
                                                                                )
                                                                            })}
                                                                        </ul>
                                                                    )}
                                                                </li>
                                                            )
                                                        })}
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