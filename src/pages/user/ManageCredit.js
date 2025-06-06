/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreditHeader from "../../components/CreditHeader";
import useIsMobile from '../../hooks/useMobileSize';
import '../user/whatsapp_offical/commonCSS.css'
import { CampaignHeading, CopyToClipboard, customAbbreviations, CustomizeTable, DownloadCSVButton, DownloadPDFButton, RecordsPerPageDropdown } from '../utils/Index';
import { getSecureItem } from '../utils/SecureLocalStorage';
import { getAllUsers } from '../../redux/actions/authAction';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import '../user/whatsapp_offical/commonCSS.css'
import { handleGetCampaigns } from '../../redux/actions/campaignAction';
import { fetchCreditStats, fetchTransactionLogs, handleCreditTransactions } from '../../redux/actions/transactionAction';

function ManageCredit({ isOpen }) {
    const isMobile = useIsMobile();
    const dispatch = useDispatch();
    const dropdownRef = useRef(null);

    const storedData = JSON.parse(getSecureItem("userData"));
    const [inputValue, setInputValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [user, setUser] = useState(null); // User state
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');

    const [recordsPerPage, setRecordsPerPage] = useState(25);
    const [campaignInputValue, setCampaignInputValue] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    const { loading, users, error } = useSelector((state) => state.userCreate);
    const { getCampLoading = loading, campaigns, getCampError = error } = useSelector((state) => state.campaigns);
    const { trnasLoading = loading, stats, logs, transError = error } = useSelector((state) => state.creditsTransaction);

    useEffect(() => {
        dispatch(handleGetCampaigns());
    }, []);

    useEffect(() => {
        dispatch(getAllUsers());
    }, []);

    useEffect(() => {
        dispatch(fetchTransactionLogs());
    }, []);

    useEffect(() => {
        dispatch(fetchCreditStats());
    }, []);

    // Filter logs when logs update (not users)
    useEffect(() => {
        setFilteredUsers(logs || []);
    }, [logs]);    

    // // Filter campaigns based on search input
    // useEffect(() => {
    //     if (campaignInputValue.trim() === '') {
    //         setFilteredCampaigns([]);
    //         return;
    //     }

    //     const filtered = campaigns?.filter((c) =>
    //         c?.name?.toLowerCase().includes(campaignInputValue.toLowerCase())
    //     );
    //     setFilteredCampaigns(filtered);
    // }, [campaignInputValue, campaigns]);


    // Simulating user data fetching from localStorage
    useEffect(() => {
        if (storedData) {
            const parsedData = (storedData);
            setUser(parsedData?.username);
        }
    }, []);

    const groupedOptions = {
        Virtual: ['Virtual Quick Credit', 'Virtual DP Credit', 'Virtual Button Credit'],
        Personal: ['Personal Quick Credit', 'Personal POLL Credit', 'Personal Professional Credit'],
        International: ['International Personal Credit', 'International Virtual Credit'],
    };

    const transactionTypes = [
        { value: '', label: 'Select Transaction', disabled: true },
        { value: 'Credit', label: 'Credit' },
        { value: 'Debit', label: 'Debit' },
    ];

    const [formData, setFormData] = useState({
        toUserId: "",
        // creditDebit: "",
        creditAmount: "",
        categoryId: "",
    });

    const handleCampaignChange = (e) => {
        const selectedId = e.target.value;
        const selectedCampaign = campaigns.find(c => c._id === selectedId);
        setFormData((prev) => ({
            ...prev,
            categoryId: selectedId,
        }));
        setCampaignInputValue(selectedCampaign?.name || '');
    }

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

    const filteredAllUser = users?.filter(user =>
        user.username.toLowerCase().includes(inputValue.toLowerCase())
    );

    const headers = [
        { key: '_id', label: 'ID' },
        { key: 'fromUserId.username', label: 'From User' },
        { key: 'toUserId.username', label: 'To User ID' },
        { key: 'credit', label: 'Credit Balance' },
        { key: 'creditType', label: 'Credit Type' },
        { key: 'createdAt', label: 'Current Date' },
        { key: 'creditNote', label: 'Credit Note' },
    ];

    const renderRow = (item) => (
        <tr key={item._id} className="text-black border border-gray-700 hover:bg-gray-500">
            <td className="px-4 py-2 border border-gray-700">{item?._id.slice(-5)}</td>
            <td className="px-4 py-2 border border-gray-700">{item?.fromUserId?.username}</td>
            <td className="px-4 py-2 border border-gray-700">{item?.toUserId?.username}</td>
            <td className="px-4 py-2 border border-gray-700">{item.credit}</td>
            <td className="px-4 py-2 border border-gray-700">{item.creditType}</td>
            <td className="px-4 py-2 border border-gray-700">{new Date(item.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })}</td>
            {/* <td className="px-4 py-2 border border-gray-700">{item?.categoryId?.name}</td> */}
            <td className="px-4 py-2 border border-gray-700 uppercase">
                {customAbbreviations[item?.categoryId?.name] || 'N/A'}
            </td>
        </tr>
    );

    // Handle form data change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.toUserId || !formData.creditAmount || !formData.creditDebit) {
            toast.error("All required fields must be completed.", {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
            return;
        }
        try {
            let response;

            // Prepare the payload based on Credit or Debit
            // if (formData?.creditDebit === "Credit") {
            const payload = {
                toUserId: formData?.toUserId,
                // creditDebit: formData?.creditDebit,
                creditAmount: parseInt(formData?.creditAmount),
                categoryId: formData?.categoryId,
            };

            // Call the Credit API
            response = await dispatch(handleCreditTransactions(payload));
            // } else {
            //     payload = {
            //         toUserId: formData?.toUserId,
            //         // creditDebit: formData?.creditDebit,
            //         creditAmount: parseInt(formData?.creditAmount),
            //         categoryId: formData?.categoryId,
            //     };

            //     // Call the Debit API
            //     response = await axios.post(`${process.env.REACT_APP_API_URL}/api/credits/transfer`, payload);
            // }

            // Handle API response
            if (response?.success) {
                toast.success(response?.message || "Credit Transferred Successfully!");
                // Fetch updated transaction logs
                dispatch(fetchTransactionLogs())
                dispatch(fetchCreditStats())
                console.log("dispatch(fetchCreditStats())", stats)
                // Clear the form
                setInputValue("")
                setFormData({
                    toUserId: "",
                    creditDebit: "",
                    creditAmount: "",
                    categoryId: "",
                });
            } else {
                toast.error(response || transError || "Transaction failed. Please try again.");
                throw new Error("Unexpected response from server.");
            }
        } catch (error) {
            console.log("Response Data Error::::::", getCampError);
            toast.error(error || "Transaction failed. Please try again.");
        }
    };

    const filteredAndSortedLogs = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();

        const filtered = filteredUsers.filter(data => {
            const userMatch = data?.fromUserId?.username?.toLowerCase().includes(term) ||
                data?.toUserId?.username?.toLowerCase().includes(term);
            return userMatch;
        });
        // console.log("Filtered Data", filtered, logs);


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
    }, [searchTerm, sortConfig, filteredUsers]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredAndSortedLogs.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalRecords = filteredAndSortedLogs.length;
    const totalPages = Math.max(1, Math.ceil(filteredAndSortedLogs.length / recordsPerPage));


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

    return (
        <>
            <section className={`w-[100%] h-full pb-3 bg-gray-200 min-h-[calc(100vh-70px)] ${!isMobile ? isOpen ? "ml-[240px] w-[calc(100vw-250px)]" : "ml-20 w-[calc(100vw-90px)]" : "left-0 w-full"} `}>
                <CreditHeader />
                <div className="w-full mt-8">
                    <CampaignHeading campaignHeading="Manage Credits" />
                    <div className="w-full px-3 pt-3 ">
                        <div className='bg-white border-t border-[#383387] px-3 py-3 mb-3'>
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
                                                onFocus={() => setIsDropdownOpen(true)}
                                            />
                                            {isDropdownOpen && (
                                                <ul className="absolute z-40 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto custom-horizontal-scroll">
                                                    {filteredAllUser.length > 0 ? (
                                                        filteredAllUser.map((user) => (
                                                            <li
                                                                key={user._id}
                                                                onMouseDown={() => handleOptionClick(user.username, user._id)}
                                                                className="py-2 -ml-8 px-3 hover:bg-gray-300 cursor-pointer"
                                                            >
                                                                {user.username}
                                                            </li>

                                                        ))) : (
                                                        <li className="py-2 -ml-8 px-3 text-gray-500 cursor-default">No users found</li>
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                        <div className="grow w-full">
                                            <select
                                                name="categoryId"
                                                value={formData.categoryId}
                                                onChange={handleCampaignChange}
                                                className="form-select border border-black w-full p-1.5 rounded"
                                            >
                                                <option value="" disabled>Select Campaign</option>
                                                {Object.entries(groupedOptions).map(([group, options]) => {
                                                    const matchingCampaigns = campaigns.filter(c => {
                                                        const firstWord = c.name?.split(" ")[0];
                                                        return firstWord === group;
                                                    });

                                                    if (matchingCampaigns.length === 0) return null;

                                                    return (
                                                        <optgroup key={group} label={group}>
                                                            {matchingCampaigns.map((c) => (
                                                                <option key={c._id} value={c._id}>
                                                                    {c.name}
                                                                </option>
                                                            ))}
                                                        </optgroup>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        <div className="grow w-full">
                                            <select
                                                name="creditDebit"
                                                value={formData.creditDebit}
                                                onChange={handleChange}
                                                className="form-select border border-black w-full p-1.5 rounded"
                                            >
                                                {transactionTypes.map((type, index) => (
                                                    <option
                                                        key={index}
                                                        value={type.value}
                                                        disabled={type.disabled}
                                                    >
                                                        {type.label}
                                                    </option>
                                                ))}
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
                            {loading ? (
                                <div className="text-center my-4">
                                    <div className="spinner-border text-dark" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : transError ? (
                                <div className="text-center text-red-600 my-4 font-semibold">
                                    {transError}
                                </div>) :
                                <div>
                                    <div className="flex  md:justify-start justify-between gap-3 md:flex-col pt-3">
                                        <div className="flex gap-3  ">
                                            <CopyToClipboard headers={headers} data={filteredAndSortedLogs} />
                                            <DownloadCSVButton headers={headers} dataLogs={filteredAndSortedLogs} />
                                            <DownloadPDFButton headers={headers} dataLogs={filteredAndSortedLogs} />
                                        </div>
                                        <div className="flex justify-end gap-3 ">
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
                                            <RecordsPerPageDropdown
                                                recordsPerPage={recordsPerPage}
                                                setRecordsPerPage={setRecordsPerPage}
                                                setCurrentPage={setCurrentPage}
                                            />
                                            {/* Pagination Controls */}
                                            <div className="flex flex-row whitespace-nowrap md:justify-center justify-end gap-3 align-items-center ">
                                                <button
                                                    className="btn btn-dark py-2"
                                                    onClick={handlePrevious}
                                                    disabled={currentPage === 1}
                                                >
                                                    &lt;
                                                </button>
                                                <div className="">
                                                    {indexOfFirstRecord + 1} -{' '}
                                                    {Math.min(indexOfLastRecord, filteredAndSortedLogs.length)} of{' '}
                                                    {filteredAndSortedLogs.length}
                                                </div>
                                                <button
                                                    className="btn btn-dark py-2"
                                                    onClick={handleNext}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    &gt;
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Table Section */}
                                    <div className={`w-full bg-gray-300 flex-shrink-0 overflow-auto custom-horizontal-scroll select-text h-full mt-3 ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-64px)]"}`}>
                                        <div className={`min-w-max`}>
                                            <CustomizeTable
                                                headers={headers}
                                                data={currentRecords}
                                                sortConfig={sortConfig}
                                                onSort={handleSort}
                                                emptyMessage='No Credits Available'
                                                renderRow={renderRow}
                                                className="table-auto border-collapse"
                                                theadClassName="bg-gray-800"
                                            />
                                        </div>

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
                                              <td className="px-2 py-2 border border-gray-900">{log.to_user_name}</td>
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
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ManageCredit;
