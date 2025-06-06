/* eslint-disable array-callback-return */
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import creditCardIcon from '../assets/icons/credit-card.png';
import dashboardIcon from '../assets/icons/dashboard.png';
import home from '../assets/icons/home.png';
import world from '../assets/icons/world.png';
import exchange from '../assets/icons/exchange.png';
import groupIcon from '../assets/icons/group.png';
import templateIcon from '../assets/icons/template.png';
import DeveloperAPI from '../assets/icons/developers-api.png';
import ProfileIcon from '../assets/profile_Logo.png';
import UserIcon from '../assets/icons/user1.png';
import whatsappOfficialIcon from '../assets/icons/wp_bulk.png';
import whatsappIcon from '../assets/icons/whatsapp.png';
import ProfileImgBG from '../assets/profile_img_logo_bg.jpg';
import useIsMobile from '../hooks/useMobileSize';
import './style.css'

import { getSecureItem } from '../pages/utils/SecureLocalStorage';
import { ActiveDropdownSymbol, DropdownSymbol } from '../assets';

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
            // permissionKey: "adminDashboard",
            icon: dashboardIcon,
            dropdown: [
                { label: "Dashboard", to: "/admin-dashboard", },
                { label: "Create Campaign", to: "/create-campaigns", },
                { label: "All Campaigns", to: "/all-campaigns", },
                { label: "All Templates", to: "/all-templates", },
                { label: "All Groups", to: "/all-groups", },
                { label: "Manage Developer API", to: "/manage-developer-api", },
            ]
        },
        {
            label: "Transaction Logs",
            to: "/transitiontable",
            icon: dashboardIcon,
            // permissionKey: "transactionLogs"
        },
        {
            label: "Dashboard",
            to: "/dashboard",
            icon: home
        },
        {
            label: "Wa Virtual",
            icon: whatsappIcon,
            permissionKey: "virtual",
            dropdown: [
                { label: "Quick Campaign", to: "/virtual-quick-csv" },
                { label: "Button Campaign", to: "/virtual-button" },
                { label: "DP Campaign", to: "/virtual-dp" },
                { label: "WhatsApp Report", to: "/virtual-whatsapp-report" }
            ]
        },
        {
            label: "Wa Personal",
            icon: whatsappIcon,
            permissionKey: "personal",
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
            permissionKey: "internationalVirtual",
            dropdown: [
                { label: "Quick Campaign", to: "/international-virtual-quick-csv" },
                { label: "Button Campaign", to: "/international-virtual-button" },
                { label: "Whatsapp Reports", to: "/international-virtual-whatsapp-report" }
            ]
        },
        {
            label: "Wa Int. Personal",
            icon: exchange,
            permissionKey: "internationalPersonal",
            dropdown: [
                { label: "Quick Campaign", to: "/international-personal-quick-csv" },
                { label: "Button Campaign", to: "/international-personal-button" },
                { label: "Poll Campaign", to: "/international-personal-poll" },
                { label: "Whatsapp Reports", to: "/international-personal-whatsapp-report" },
                { label: "Scan Whatsapp", to: "/international-personal-scan-whatsapp" }
            ]
        },
        {
            label: "Credit History",
            to: "/credit-history",
            icon: home
        },
        {
            label: "Whatsapp Official",
            icon: whatsappOfficialIcon,
            permissionKey: "whatsappOfficial",
            dropdown: [
                { label: "Dashboard", to: "/whatsapp-dashboard" },
                { label: "Send Whatsapp", to: "/whatsapp-send" },
                {
                    label: "Reports",
                    subDropdown: [
                        { label: "Campaigns", to: "/whatsapp-reports/campaigns" },
                        { label: "WhatsApp Logs", to: "/whatsapp-reports/whatsapp-logs" },
                        { label: "Click Logs", to: "/whatsapp-reports/click-logs" },
                        { label: "Daily Stats", to: "/whatsapp-reports/daily-stats" },
                        { label: "User Response", to: "/whatsapp-reports/user-responses" },
                        { label: "Exports", to: "/whatsapp-reports/exports" },
                    ]
                },
                {
                    label: "Whatsapp Setting",
                    subDropdown: [
                        { label: "Phones", to: "/whatsapp-settings/phones" },
                        { label: "Templates", to: "/whatsapp-settings/templates" },
                        { label: "User Trigger", to: "/whatsapp-settings/user-trigger" },
                        { label: "Flows", to: "/whatsapp-settings/flows" },
                        { label: "Pricing", to: "/whatsapp-settings/pricing" },
                        { label: "Webhook", to: "/whatsapp-settings/webhook" },
                    ]
                },
                { label: "Whatsapp Billing", to: "/whatsapp-billing" },
                { label: "Whatsapp API", to: "/whatsapp-api" },
                {
                    label: "Setting",
                    subDropdown: [
                        { label: "Profile", to: "/whatsapp-profile/setting" },
                        { label: "Company ", to: "/whatsapp-profile/company" },
                        { label: "Team", to: "/whatsapp-profile/team" },
                        { label: "Security", to: "/whatsapp-profile/security" },
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
        {
            label: "Developer API",
            icon: DeveloperAPI,
            // permissionKey: "developerAPI",
            dropdown: [
                {
                    label: "Personal API",
                    subDropdown: [
                        { label: "Manage API", to: "/personal/developer-api" },
                        { label: "Whatsapp Report", to: "/personal/whatsapp-report" }
                    ]

                },
                {
                    label: "International API",
                    subDropdown: [
                        { label: "Manage API", to: "/international/developer-api" },
                        { label: "Whatsapp Report", to: "/international/whatsapp-report" }
                    ]

                }
            ]
        },
    ];

    const userRolePermission = {
        permissions: {
            virtual: false,
            personal: false,
            internationalVirtual: true,
            internationalPersonal: true,
        }
    }
    const userRole = JSON.parse(getSecureItem("userData"));
    const userPermissions = userRolePermission?.permissions || {};

    function filterMenuItems(menu) {
        return menu.reduce((acc, item) => {
            const isRestrictedForUser =
                userRole?.role === "user" &&
                ["Manage User", "Manage Credits"].includes(item.label);

            const isAdminOnly =
                !["super_admin"].includes(userRole?.role) &&
                ["Admin Dashboard", "Transaction Logs"].includes(item.label);

            const lacksPermission =
                item.permissionKey && !userPermissions[item.permissionKey];

            if (isRestrictedForUser || isAdminOnly || lacksPermission) {
                return acc; // skip item
            }

            // Handle dropdown (1 level)
            if (item.dropdown) {
                const filteredDropdown = item.dropdown.filter(sub => {
                    return !sub.permissionKey || userPermissions[sub.permissionKey];
                });

                if (filteredDropdown.length > 0) {
                    acc.push({ ...item, dropdown: filteredDropdown });
                }
                return acc;
            }

            acc.push(item);
            return acc;
        }, []);
    }
    // if (newItem.dropdown) {
    //     newItem.dropdown = filterMenuItems(newItem.dropdown);
    // }

    // if (newItem.subDropdown) {
    //     newItem.subDropdown = filterMenuItems(newItem.subDropdown);
    // }


    const filteredSidebarMenu = filterMenuItems(sidebarMenu);

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
                            {filteredSidebarMenu.map((item, index) => {
                                const isActiveParent = item.to && location.pathname === item.to;
                                const isDropdownActive = item.dropdown?.some(sub => location.pathname === sub.to || sub.subDropdown?.some(nested => location.pathname === nested.to));

                                return (
                                    <li key={index} className="text-white">
                                        {item.dropdown ? (
                                            <div className="group">
                                                <button
                                                    // onClick={() => toggleDropdown(index, item?.to && !item.dropdown ? item?.to : null)}
                                                    onClick={() => toggleDropdown(index, item?.to)}
                                                    className={`w-full flex items-center p-3 hover:underline underline-offset-4 transition ${isOpen ? "justify-between" : "justify-center"}  ${isDropdownActive && 'bg-green-700 font-semibold'}`}
                                                >
                                                    <div className={`flex items-center ${isOpen ? "space-x-2" : ""} justify-center`}>
                                                        <img src={item.icon} width={20} height={20} alt="" />
                                                        {isOpen && <span className="text-lg ">{item.label}</span>}
                                                    </div>
                                                    {isOpen && (
                                                        <DropdownSymbol activeDropdown={activeDropdown} index={index} />
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
                                                                        className={`py-0 m-0 flex items-center no-underline justify-between pr-4 ${isActiveSub || isSubDropdownActive ? 'bg-green-700 font-semibold' : ''} `}>
                                                                        <p className={`block m-0 pl-[42px] pr-2 py-2 text-base text-white no-underline hover:underline underline-offset-4 `}>
                                                                            {subItem.label}
                                                                        </p>
                                                                        {hasNested && (
                                                                            <ActiveDropdownSymbol isNestedOpen={isNestedOpen} />
                                                                        )}
                                                                    </Link>
                                                                    {hasNested && isNestedOpen && (
                                                                        <ul className="mt-1 p-0">
                                                                            {subItem.subDropdown.map((nestedItem, nestedIndex) => {

                                                                                return (
                                                                                    <li key={nestedIndex} className='mt-1 space-y-1 duration-300 ease-in-out p-0'>
                                                                                        <Link
                                                                                            to={nestedItem.to}
                                                                                            className={`py-2  pl-14 m-0 flex items-center justify-between text-white no-underline hover:underline underline-offset-4 ${location.pathname === nestedItem.to
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