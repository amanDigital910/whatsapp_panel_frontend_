/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useMemo, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreditHeader from "../../components/CreditHeader";
import useIsMobile from '../../hooks/useMobileSize';
import '../user/whatsapp_offical/commonCSS.css'
import { CampaignHeading, CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton } from '../utils/Index';
import { getSecureItem } from '../utils/SecureLocalStorage';

function ManageCredit({ isOpen }) {
    const [user, setUser] = useState(null); // User state
    const [usersList, setUsersList] = useState([]); // List of users fetched from the API
    const [categories, setCategories] = useState([]); // List of categories
    const [transactionLogs, setTransactionLogs] = useState([]); // Transaction logs
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');
    const isMobile = useIsMobile();

    const userToken = getSecureItem("userToken");

    const recordsPerPage = 5; // You can adjust this as needed

    const [formData, setFormData] = useState({
        sendUser: "",
        selectedCategory: "",
        balance: "",
        creditDebit: "",
    }); // Form data state

    const headers = [
        // UserName Balance Type Balance Credit Type Credit Date
        { key: 'id', label: 'ID' },
        { key: 'userName', label: 'UserName' },
        { key: 'balanceType', label: 'Balance Type' },
        { key: 'balance', label: 'Balance' },
        { key: 'creditType', label: 'Credit Type' },
        { key: 'creditDate', label: 'Credit Date' },
    ]

    const dummyData = [
        {
            id: 1,
            userName: "john_doe",
            balanceType: "Savings",
            balance: 1500.75,
            creditType: "Salary",
            creditDate: "2025-04-28",
        },
        {
            id: 2,
            userName: "jane_smith",
            balanceType: "Checking",
            balance: 234.50,
            creditType: "Refund",
            creditDate: "2025-05-01",
        },
        {
            id: 3,
            userName: "michael_lee",
            balanceType: "Savings",
            balance: 9876.00,
            creditType: "Bonus",
            creditDate: "2025-04-15",
        },
        {
            id: 4,
            userName: "emily_watson",
            balanceType: "Investment",
            balance: 15000.00,
            creditType: "Dividend",
            creditDate: "2025-03-30",
        },
        {
            id: 5,
            userName: "david_clark",
            balanceType: "Checking",
            balance: 512.35,
            creditType: "Transfer",
            creditDate: "2025-05-05",
        },
    ];


    // Simulating user data fetching from localStorage
    useEffect(() => {
        const storedData = localStorage.getItem("userData");
        if (storedData) {
            const parsedData = (storedData);
            setUser(parsedData?.user);
            // Fetch all necessary data
            // fetchUsers(parsedData.user.userid);
            // fetchTransactionLogs(parsedData.user.userid);
            // fetchCategories();
        }
    }, []);

    // Fetch users based on parentuser_id
    const fetchUsers = async (userid) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/auth/parentuser/${userid}`
            );
            if (response.status === 200) {
                setUsersList(response.data.data);
            } else {
                toast.error("Failed to fetch users!", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                });
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Error fetching users. Please try again.", {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
        }
    };

    const fetchTransactionLogs = async (userId) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/transfer/transactions/log/${userId}`
            );
            if (response.status === 200) {
                setTransactionLogs(response.data.data);
            } else {
                toast.error("Failed to fetch transaction logs!", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                });
            }
        } catch (error) {
            console.error("Error fetching transaction logs:", error);
            toast.error("Error fetching transaction logs. Please try again.", {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/transfer/category`);
            if (response.status === 200) {
                setCategories(response.data.data);
            } else {
                toast.error("Failed to fetch categories!", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                });
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Error fetching categories. Please try again.", {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
        }
    };

    // Handle form data change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let payload, response;

            // Prepare the payload based on Credit or Debit
            if (formData.creditDebit === "Credit") {
                payload = {
                    fromUserId: user.userid,
                    toUserId: parseInt(formData.sendUser),
                    categoryId: parseInt(formData.selectedCategory),
                    creditAmount: parseInt(formData.balance),
                };

                // Call the Credit API
                response = await axios.post(`${process.env.REACT_APP_API_URL}/transfer/credit`, payload);
            } else {
                payload = {
                    fromUserId: parseInt(formData.sendUser),
                    toUserId: user.userid,
                    categoryId: parseInt(formData.selectedCategory),
                    creditAmount: parseInt(formData.balance),
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
                    sendUser: "",
                    selectedCategory: "",
                    balance: "",
                    creditDebit: "",
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
            <td className="px-4 py-2 border border-gray-700">${item.balance.toFixed(2)}</td>
            <td className="px-4 py-2 border border-gray-700">{item.creditType}</td>
            <td className="px-4 py-2 border border-gray-700">{new Date(item.creditDate).toLocaleDateString('en-GB')}</td>
        </tr>
    );

    const filteredAndSortedLogs = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();

        const filtered = dummyData.filter(data => {
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
                        <div className='bg-white px-3 py-3'>
                            {/* Filters Section */}
                            <form onSubmit={handleSubmit}>
                                <div className="me-0 flex md:flex-col gap-3 pb-3 border-b border-[#383387]">
                                    {/* Left Section */}
                                    <div className="flex sm:flex-col w-full gap-3 align-items-center ">
                                        <div className="grow w-full">
                                            <select
                                                name="sendUser"
                                                value={formData.sendUser}
                                                onChange={handleChange}
                                                className="form-select border border-black w-full"
                                            >
                                                <option value="">Select User</option>
                                                {usersList.map((user) => (
                                                    <option key={user.userid} value={user.userid}>
                                                        {user.userName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grow w-full">
                                            <select
                                                name="selectedCategory"
                                                value={formData.selectedCategory}
                                                onChange={handleChange}
                                                className="form-select border border-black w-full"
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Right Section */}
                                    <div className="flex sm:flex-col w-full gap-3 align-items-center">
                                        <div className="grow w-full">
                                            <select
                                                name="creditDebit"
                                                value={formData.creditDebit}
                                                onChange={handleChange}
                                                className="form-select border border-black w-full"
                                            >
                                                <option value="Credit">Credit</option>
                                                <option value="Debit">Debit</option>
                                            </select>
                                        </div>
                                        <div className="grow w-full">
                                            <input
                                                type="text"
                                                name="balance"
                                                value={formData.balance}
                                                onChange={handleChange}
                                                className="form-control border border-black w-full"
                                                placeholder="Balance"
                                            />
                                        </div>
                                        <div className="grow w-fit ">
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
                            <div className={`min-w-max py-3`}>
                                <div className={`w-full bg-gray-300 flex-shrink-0 overflow-auto custom-horizontal-scroll select-text h-full ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-64px)]"}`}>
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
                            {/* Pagination Controls */}
                            <div className="d-flex justify-content-end align-items-center gap-3 mt-3">
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
