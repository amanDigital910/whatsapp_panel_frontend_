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
            <section className="w-[100%] bg-gray-200  pt-3 flex justify-center flex-col pb-10">
                <CreditHeader />
                <div className="w-full px-3 mt-8">
                    <div className="container-fluid mt-4">
                        {/* Add User Button and Search Bar */}
                        <div className="d-flex justify-content-end align-items-center mb-3">
                            <div className="d-flex">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder="Search..   "
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="btn btn-dark" onClick={handleSearch}>
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="card">
                            <div className="card-body">
                                {loading ? (
                                    <div className="text-center">Loading...</div>
                                ) : error ? (
                                    <div className="text-center text-danger">{error}</div>
                                ) : (
                                    <>
                                        <table className="table table-bordered table-striped">
                                            <thead className="table-dark bg-dark">
                                                <tr>
                                                    <th>S.No.</th>
                                                    <th>From User</th>
                                                    <th>To User</th>
                                                    <th>Credit Type</th>
                                                    <th>Credit</th>
                                                    <th>Transaction Date</th>
                                                    <th>Name</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentRecords.length > 0 ? (
                                                    currentRecords.map((log, index) => (
                                                        <tr key={log.id}>
                                                            <td>{indexOfFirstRecord + index + 1}</td>
                                                            <td>{log.from_user_name}</td>
                                                            <td>{log.to_user_name}</td>
                                                            <td>{log.credit_type}</td>
                                                            <td>{log.credit}</td>
                                                            <td>{new Date(log.transaction_date).toLocaleString()}</td>
                                                            <td>{log.name}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="text-center">
                                                            No records found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>

                                        {/* Pagination Controls */}
                                        <div className="d-flex justify-content-end align-items-center gap-4 mt-3">
                                            <button
                                                className="btn btn-dark"
                                                onClick={handlePrevious}
                                                disabled={currentPage === 1}
                                            >
                                                &lt;
                                            </button>
                                            <div>
                                                {indexOfFirstRecord + 1} -{' '}
                                                {Math.min(indexOfLastRecord, filteredLogs.length)} of{' '}
                                                {filteredLogs.length}
                                            </div>
                                            <button
                                                className="btn btn-dark"
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
                    </div>
                </div>
            </section>
        </>
    );
}

export default TransitionCReditUser;
