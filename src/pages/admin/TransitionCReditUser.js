import React, { useEffect, useState } from 'react';
import CreditHeader from '../../components/CreditHeader';

function TransitionCReditUser() {
    const [transactionLogs, setTransactionLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const recordsPerPage = 10;

    useEffect(() => {
        const fetchTransactionLogs = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/transfer/transactions/log');
                if (!response.ok) {
                    throw new Error('Failed to fetch transaction logs');
                }
                const result = await response.json();
                setTransactionLogs(result.data);
                setFilteredLogs(result.data); // Initialize with all records
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionLogs();
    }, []);

    // Handle search
    const handleSearch = () => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = transactionLogs.filter(
            log =>
                log.from_user_name.toLowerCase().includes(lowerCaseQuery) ||
                log.credit_type.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredLogs(filtered);
        setCurrentPage(1); // Reset to the first page after search
    };

    // Calculate indices for the current page
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredLogs.slice(indexOfFirstRecord, indexOfLastRecord);

    // Total pages calculation
    const totalPages = Math.ceil(filteredLogs.length / recordsPerPage);

    // Handle page navigation
    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <>
            <section className="w-full h-full bg-gray-200 flex flex-col min-h-[calc(100vh-70px)] pb-3">
                <CreditHeader />


                <div className="px-4 mt-14">
                    {/* Add User Button and Search Bar */}
                    <div className="flex justify-end items-center mb-3">
                        <div className="flex items-center space-x-2 rounded-md border-black border">
                            <input
                                type="text"
                                className="h-10 px-3 py-2 border border-gray-300 focus:outline-none rounded-l-md focus:ring-2 focus:ring-blue-500"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                className="h-10 px-4 m-0 bg-gray-800 text-white rounded-r-[0.3rem] hover:bg-gray-700 transition"
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="px-4 bg-white py-3 rounded-md shadow">
                        {loading ? (
                            <div className="text-center text-gray-500">Loading...</div>
                        ) : error ? (
                            <div className="text-center text-red-600 text-xl font-semibold">Something went wrong!!</div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-300 rounded-md">
                                        <thead className="bg-gray-800 text-white">
                                            <tr>
                                                <th className="px-4 py-2 text-left border">S.No.</th>
                                                <th className="px-4 py-2 text-left border">From User</th>
                                                <th className="px-4 py-2 text-left border">To User</th>
                                                <th className="px-4 py-2 text-left border">Credit Type</th>
                                                <th className="px-4 py-2 text-left border">Credit</th>
                                                <th className="px-4 py-2 text-left border">Transaction Date</th>
                                                <th className="px-4 py-2 text-left border">Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentRecords.length > 0 ? (
                                                currentRecords.map((log, index) => (
                                                    <tr key={log.id} className="hover:bg-gray-100">
                                                        <td className="px-4 py-2 border">{indexOfFirstRecord + index + 1}</td>
                                                        <td className="px-4 py-2 border">{log.from_user_name}</td>
                                                        <td className="px-4 py-2 border">{log.to_user_name}</td>
                                                        <td className="px-4 py-2 border">{log.credit_type}</td>
                                                        <td className="px-4 py-2 border">{log.credit}</td>
                                                        <td className="px-4 py-2 border">
                                                            {new Date(log.transaction_date).toLocaleDateString('en-GB')}
                                                        </td>
                                                        <td className="px-4 py-2 border">{log.name}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-4 text-gray-600">
                                                        No records found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex justify-end items-center space-x-4 mt-4">
                                    <button
                                        className="px-3 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50"
                                        onClick={handlePrevious}
                                        disabled={currentPage === 1}
                                    >
                                        &lt;
                                    </button>
                                    <div className="text-sm text-gray-700">
                                        {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, filteredLogs.length)} of {filteredLogs.length}
                                    </div>
                                    <button
                                        className="px-3 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50"
                                        onClick={handleNext}
                                        disabled={currentPage === totalPages}
                                    >
                                        &gt;
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

        </>
    );
}

export default TransitionCReditUser;
