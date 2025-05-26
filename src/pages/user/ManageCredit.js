/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreditHeader from "../../components/CreditHeader";
import useIsMobile from '../../hooks/useMobileSize';
import '../user/whatsapp_offical/commonCSS.css'
import { CampaignHeading, CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton } from '../utils/Index';
import { getSecureItem } from '../utils/SecureLocalStorage';
import { getAllUsers } from '../../redux/actions/authAction';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import '../user/whatsapp_offical/commonCSS.css'

function ManageCredit({ isOpen }) {
    const [user, setUser] = useState(null); // User state
    const [usersList, setUsersList] = useState([]); // List of users fetched from the API
    const [categories, setCategories] = useState([]); // List of categories
    const [transactionLogs, setTransactionLogs] = useState([]); // Transaction logs
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');

    const { userList, transactionsLogs, loading, error } = useSelector((state) => state.creditsTransaction);

    const isMobile = useIsMobile();
    const dispatch = useDispatch();
    const dropdownRef = useRef(null);
    const getISTDateFormatted = () => {
        const now = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const istDate = new Date(now.toLocaleString('en-US', options));

        const day = String(istDate.getDate()).padStart(2, '0');
        const month = String(istDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = istDate.getFullYear();
        const formattedTime = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });

        return `${day}-${month}-${year} ${formattedTime}`;
    };


    const storedData = JSON.parse(getSecureItem("userData"));
    const [inputValue, setInputValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const groupedOptions = {
        Virtual: ['Virtual Quick Credit', 'Virtual DP Credit', 'Virtual Button Credit'],
        Personal: ['Personal Quick Credit', 'Personal POLL Credit', 'Personal Professional Credit'],
        International: ['International Personal Credit', 'International Virtual Credit'],
    };

    const recordsPerPage = 5; // You can adjust this as needed

    const [formData, setFormData] = useState({
        toUserId: "",
        creditDebit: "",
        creditAmount: "",
        currentDate: "",
        selectedCampaign: "",
    });

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setIsDropdownOpen(value.length > 0);
        setFormData(prev => ({ ...prev, toUserId: value }));
    };

    const handleOptionClick = (username, userId) => {
        setInputValue(username);
        setFormData(prev => ({ ...prev, toUserId: userId }));
        setIsDropdownOpen(false);
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredUsers = userList?.data?.filter(user =>
        user.username.toLowerCase().includes(inputValue.toLowerCase())
    );

    const headers = [
        { key: 'id', label: 'ID' },
        { key: 'userName', label: 'UserName' },
        { key: 'balanceType', label: 'Balance Type' },
        { key: 'balance', label: 'Balance' },
        { key: 'availableBalance', label: 'Available Balance' },
        { key: 'currentDate', label: 'Current Date' },
        { key: 'creditNote', label: 'Credit Note' },
    ]

    const dummyData = [
        {
            id: 1,
            userName: "john_doe",
            balanceType: "Debit",
            balance: 1500.75,
            availableBalance: 1500.75,
            creditNote: "WAV",
            currentDate: "2025-04-28",
        },
        {
            id: 2,
            userName: "jane_smith",
            balanceType: "Debit",
            balance: 234.50,
            availableBalance: 234.50,
            creditNote: "WAVDP",
            currentDate: "2025-05-01",
        },
        {
            id: 3,
            userName: "michael_lee",
            balanceType: "Credit",
            balance: 9876.00,
            availableBalance: 9876.00,
            creditNote: "WAP",
            currentDate: "2025-04-15",
        },
        {
            id: 4,
            userName: "emily_watson",
            balanceType: "Credit",
            balance: 15000.00,
            availableBalance: 15000.00,
            creditNote: "WAVDP",
            currentDate: "2025-03-30",
        },
        {
            id: 5,
            userName: "david_clark",
            balanceType: "Debit",
            balance: 512.35,
            availableBalance: 512.35,
            creditNote: "WAVBT",
            currentDate: "2025-05-05",
        },
    ];

    useEffect(() => {
        dispatch(getAllUsers())
    }, [dispatch])

    // Simulating user data fetching from localStorage
    useEffect(() => {

        if (storedData) {
            const parsedData = (storedData);
            setUser(parsedData?.username);
            // Fetch all necessary data
            // fetchUsers(parsedData.user.userid);
            // fetchTransactionLogs(parsedData.user.userid);
            // fetchCategories();
        }
    }, []);

    // Handle form data change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.toUserId || !formData.creditAmount || !formData.creditDebit) {
            toast.error("Please fill in all required fields", {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
            return;
        }
        try {
            let payload, response;
            console.log("Selected user:", formData);

            // Prepare the payload based on Credit or Debit
            if (formData?.creditDebit === "Credit") {
                payload = {
                    toUserId: formData?.toUserId,
                    creditDebit: formData?.creditDebit,
                    creditAmount: parseInt(formData?.creditAmount),
                    currentDate: getISTDateFormatted(),
                    selectedCampaign: formData?.selectedCampaign,
                };

                // Call the Credit API
                response = await axios.post(`${process.env.REACT_APP_API_URL}/transfer/credit`, payload);
            } else {
                payload = {
                    toUserId: formData?.toUserId,
                    creditDebit: formData?.creditDebit,
                    creditAmount: parseInt(formData?.creditAmount),
                    currentDate: getISTDateFormatted(),
                    selectedCampaign: formData?.selectedCampaign,
                };

                // Call the Debit API
                response = await axios.post(`${process.env.REACT_APP_API_URL}/transfer/debit`, payload);
            }

            // Handle API response
            if (response.status === 200) {
                toast.success("Transaction successful!", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                });

                // Fetch updated transaction logs
                // fetchTransactionLogs(user.userid);

                // Clear the form
                setFormData({
                    toUserId: "",
                    creditDebit: "",
                    creditAmount: "",
                    currentDate: getISTDateFormatted(),
                    selectedCampaign: "",
                });
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (error) {
            console.error("Error during transaction:", error.response?.data || error.message);

            toast.error("Transaction failed. Please try again.", {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
        }
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = transactionLogs.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalRecords = transactionLogs.length;

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < Math.ceil(totalRecords / recordsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const renderRow = (item, index) => (
        <tr key={index} className="text-black border border-gray-700 hover:bg-gray-500">
            <td className="px-4 py-2 border border-gray-700">{item.id}</td>
            <td className="px-4 py-2 border border-gray-700">{item.userName}</td>
            <td className="px-4 py-2 border border-gray-700">{item.balanceType}</td>
            <td className="px-4 py-2 border border-gray-700">₹ {item.balance.toFixed(2)}</td>
            <td className="px-4 py-2 border border-gray-700">₹ {item.availableBalance.toFixed(2)}</td>
            <td className="px-4 py-2 border border-gray-700">{new Date(item.currentDate).toLocaleDateString('en-GB')}</td>
            <td className="px-4 py-2 border border-gray-700">{item.creditNote}</td>
        </tr>
    );

    const filteredAndSortedLogs = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();

        const filtered = (dummyData || transactionsLogs).filter(data => {
            const userMatch = data?.userName?.toLowerCase().includes(term);
            return userMatch;
        });

        if (sortConfig.key) {
            return [...filtered].sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                // Handle strings and numbers gracefully
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    return sortConfig.direction === 'asc'
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                }

                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
                }

                return 0;
            });
        }

        return filtered;
    }, [searchTerm, sortConfig, dummyData]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    return (
        <>
            <section className='w-[100%] bg-gray-200 h-full min-h-[calc(100vh-70px)] flex flex-col '>
                <CreditHeader />
                <div className="w-full mt-8">
                    <CampaignHeading campaignHeading="Manage Credits" />
                    <div className="w-full px-3 pt-3 ">
                        <div className='bg-white px-3 py-3 mb-3'>
                            {/* Filters Section */}
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-3 pb-3 border-b border-[#383387]">
                                    <div className="flex gap-3 md:flex-col">
                                        <div className="relative grow w-full">
                                            <input
                                                type="text"
                                                name="toUserId"
                                                value={inputValue}
                                                onChange={handleInputChange}
                                                placeholder="Select Username"
                                                className="border border-black w-full p-1.5 pl-3 rounded"
                                            />
                                            {isDropdownOpen && filteredUsers.length > 0 && (
                                                <ul className="absolute z-40 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto custom-horizontal-scroll">
                                                    {filteredUsers.map((user) => (
                                                        <li
                                                            key={user._id}
                                                            onMouseDown={() => handleOptionClick(user.username, user._id)}
                                                            className="py-2 -ml-8 px-3 hover:bg-gray-300 cursor-pointer"
                                                        >
                                                            {user.username}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <div className="grow w-full">
                                            <select
                                                name="selectedCampaign"
                                                value={formData?.selectedCampaign}
                                                onChange={handleChange}
                                                className="form-select border border-black w-full">
                                                <option value="" disabled>Select Campaign</option>
                                                {Object.entries(groupedOptions).map(([groupLabel, options]) => (
                                                    <optgroup key={groupLabel} label={groupLabel}>
                                                        {options.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grow w-full">
                                            <select
                                                name="creditDebit"
                                                value={formData.creditDebit}
                                                onChange={handleChange}
                                                className="form-select border border-black w-full"
                                            >
                                                <option value="" disabled>Select Transaction</option>
                                                <option value="Credit">Credit</option>
                                                <option value="Debit">Debit</option>
                                            </select>
                                        </div>
                                        <div className="grow w-full">
                                            <input
                                                type="text"
                                                name="creditAmount"
                                                value={formData?.creditAmount}
                                                onChange={handleChange}
                                                className="form-control border border-black w-full"
                                                placeholder="Balance"
                                            />
                                        </div>
                                        <div className="grow w-fit">
                                            <button type="submit" className="btn text-white bg-black w-100 px-4">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            {/* Buttons Section */}
                            <div className="flex  md:justify-start justify-between gap-3 md:flex-col pt-3">
                                <div className="flex gap-3  ">
                                    <CopyToClipboard headers={headers} data={dummyData} />
                                    <DownloadCSVButton headers={headers} dataLogs={dummyData} />
                                    <DownloadPDFButton headers={headers} dataLogs={dummyData} />
                                </div>
                                <div className="relative md:w-full  max-w-[300px]">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="p-2 pr-8 w-full border border-black rounded-md"
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchTerm('')}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 bg-white px-1 hover:text-black"
                                        >
                                            ❌
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Table Section */}
                            {loading ? (
                                <div className="text-center my-4">
                                    <div className="spinner-border text-dark" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="text-center text-red-600 my-4 font-semibold">
                                    {error}
                                </div>) : <div className={`min-w-max py-3`}>
                                <div className={`w-full bg-gray-300 flex-shrink-0 overflow-auto custom-horizontal-scroll select-text h-full ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-64px)]"}`}>
                                    <CustomizeTable
                                        headers={headers}
                                        data={filteredAndSortedLogs}
                                        sortConfig={sortConfig}
                                        onSort={handleSort}
                                        emptyMessage='No Credits Available'
                                        renderRow={renderRow}
                                        className="table-auto border-collapse"
                                        theadClassName="bg-gray-800"
                                    />
                                </div>
                            </div>
                            }
                            {/* <table className="min-w-full text-sm">
                                    <thead className="bg-gray-100 sticky top-0 z-10 ">
                                        <tr>
                                            {headers.map(({ label, key }) => (
                                                <th
                                                    key={key}
                                                    onClick={() => handleSort(key)}
                                                    className="px-4 py-2 text-left cursor-pointer select-none whitespace-nowrap bg-gray-300"
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        {label}
                                                        <div className='w-8'>
                                                            {sortConfig.key === key ? (
                                                                sortConfig.direction === 'asc' ? <LuArrowUp /> : <LuArrowDown />
                                                            ) : (
                                                                <span className="text-gray-600 flex flex-row"><LuArrowUp /><LuArrowDown /></span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAndSortedLogs.length > 0 ? (
                                            filteredAndSortedLogs?.map((log, index) => (
                                                <tr key={index} className="bg-white hover:bg-gray-50 whitespace-nowrap border border-black">
                                                    <td className="px-2 py-2 border border-gray-900">{log.id}</td>
                                                    <td className="px-2 py-2 border border-gray-900 text-blue-600 underline cursor-pointer">{log.to_user_name}</td>
                                                    <td className="px-2 py-2 border border-gray-900">{log.credit_type.charAt(0).toUpperCase() + log.credit_type.slice(1)}</td>
                                                    <td className="px-2 py-2 border border-gray-900">{log.credit || '-'}</td>
                                                    <td className="px-2 py-2 border border-gray-900 text-red-600">{log.name}</td>
                                                    <td className="px-2 py-2 border border-gray-900 max-w-[200px] truncate">{new Date(log.transaction_date).toLocaleString()}</td>
                                                </tr>
                                            ))) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-3 text-red-500 text-lg font-semibold">
                                                    No transaction logs available.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table> */}

                            {/* Pagination Controls */}
                            <div className="d-flex justify-content-end align-items-center gap-3">
                                <button className="btn btn-dark" onClick={handlePrevious} disabled={currentPage === 1}>
                                    &lt;
                                </button>
                                <div>
                                    {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, totalRecords)} of {totalRecords}
                                </div>
                                <button
                                    className="btn btn-dark"
                                    onClick={handleNext}
                                    disabled={currentPage === Math.ceil(totalRecords / recordsPerPage)}
                                >
                                    &gt;
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ManageCredit;
