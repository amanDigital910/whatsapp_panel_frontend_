import React, { useEffect, useMemo, useState } from 'react';
import CreditHeader from '../../../components/CreditHeader';
import { CampaignHeading, CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton, InfoTooltip, RecordsPerPageDropdown } from '../../utils/Index';
import { handleGetCampaigns, } from '../../../redux/actions/campaignAction';
import { useDispatch, useSelector } from 'react-redux';
import useIsMobile from '../../../hooks/useMobileSize';

const AdminAllCampaigns = ({ isOpen }) => {
    const isMobile = useIsMobile();
    const dispatch = useDispatch();

    const [allCampaign, setAllCampaign] = useState();

    const [sortConfig, setSortConfig] = useState({ key: 'lastUpdated', direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(25);

    const { loading, campaigns, error } = useSelector((state) => state.campaigns);

    useEffect(() => {
        dispatch(handleGetCampaigns())
    }, [dispatch])

    useEffect(() => {
        if (campaigns) setAllCampaign(campaigns);
    }, [campaigns]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const dummyData = [
        {
            _id: 1,
            name: "sarah_jones",
            fromCredit: 500,
            toCredit: 750,
            totalNumbers: 20400,
            transactionType: "Credit",
            lastUpdated: "2025-01-15",
        },
        {
            _id: 2,
            name: "michael_smith",
            fromCredit: 1200,
            toCredit: 1000,
            totalNumbers: 78500,
            transactionType: "Debit",
            lastUpdated: "2025-02-20",
        },
        {
            _id: 3,
            name: "linda_brown",
            fromCredit: 300,
            toCredit: 600,
            totalNumbers: 15200,
            transactionType: "Credit",
            lastUpdated: "2025-03-10",
        },
        {
            _id: 4,
            name: "emily_watson",
            fromCredit: 1000,
            toCredit: 1200,
            totalNumbers: 1500000,
            transactionType: "Credit",
            lastUpdated: "2025-03-30",
        },
        {
            _id: 5,
            name: "david_clark",
            fromCredit: 800,
            toCredit: 820,
            totalNumbers: 51235,
            transactionType: "Debit",
            lastUpdated: "2025-05-05",
        },
    ];

    const headers = [
        { key: '_id', label: 'Id' },
        {
            key: 'name', label: (
                <div className="flex items-center gap-1">
                    <span>User Name</span>
                    <InfoTooltip message="Campaign Message Show" />
                </div>
            ),
        },
        {
            key: 'fromCredit', label: (
                <div className="flex items-center gap-1">
                    <span>Credit Cost</span>
                    <InfoTooltip message="Credit Cost Campaign" />
                </div>
            ),
        },
        { key: 'toCredit', label: 'Last Updated' },
        { key: 'totalNumbers', label: 'Total Numbers' },
        { key: 'transactionType', label: 'Transaction Type' },
        { key: 'lastUpdated', label: 'Updated by' }
    ];

    const renderRow = (log) => {
        const idShort = log?._id ? log._id : '-----';
        return (
            <tr key={log._id} className="text-black border border-gray-700 hover:bg-gray-500 whitespace-nowrap">
                <td className="px-2 py-2 border border-gray-900">{idShort}</td>
                <td className="px-2 py-2 border border-gray-900">{log.name}</td>
                <td className="px-2 py-2 border border-gray-900">{log.fromCredit || '-'}</td>
                <td className="px-2 py-2 border border-gray-900">{log.toCredit || '-'}</td>
                <td className="px-2 py-2 border border-gray-900">{log.totalNumbers || '-'}</td>
                <td className="px-2 py-2 border border-gray-900">{log.transactionType || '-'}</td>
                <td className="px-2 py-2 border border-gray-900 ">
                    {new Date(log?.lastUpdated).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })}
                </td>
            </tr>
        );
    }
    const filteredAndSortedLogs = useMemo(() => {
        if (!Array.isArray(allCampaign)) return [];

        const term = searchTerm.toLowerCase().trim();

        // const filtered = allCampaign.filter(log => {
        const filtered = dummyData.filter(log => {
            if (!log) return false;
            const name = log?.name?.toLowerCase() || '';

            return name.includes(term)
        }) || [];

        // Sorting logic
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aVal = (a?.[sortConfig.key] || '').toString().toLowerCase();
                const bVal = (b?.[sortConfig.key] || '').toString().toLowerCase();

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [allCampaign, dummyData, searchTerm, sortConfig]);


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
            <section className="w-full h-full bg-gray-200 flex flex-col min-h-[calc(100vh-70px)] pb-3">
                <CreditHeader />
                <div className="w-full mt-8 ">
                    <CampaignHeading campaignHeading="All Campaigns" />
                    <div className="w-full pt-3 px-3">
                        {/* Add User Button and Search Bar */}
                        {/* <div className="flex justify-end items-center mb-3">
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
                    </div> */}

                        {/* Data Table */}

                        <div className="flex flex-col bg-white border border-black p-3 rounded-md min-h-fit">
                            {/* {loading ? (
                                <div className="text-center my-4">
                                    <div className="spinner-border text-dark" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="text-center text-red-600 my-4 font-semibold">
                                    {"Transactions Unable to Fetch" || error}
                                </div>
                            ) : ( */}
                            <div>
                                <div className="flex md:justify-start justify-between gap-3 md:flex-col pb-3 ">
                                    <div className="flex gap-3  ">
                                        <CopyToClipboard headers={headers} data={dummyData} />
                                        <DownloadCSVButton headers={headers} dataLogs={dummyData} />
                                        <DownloadPDFButton headers={headers} dataLogs={dummyData} />
                                    </div>
                                    <div className='flex justify-end gap-3'>
                                        <RecordsPerPageDropdown
                                            recordsPerPage={recordsPerPage}
                                            setRecordsPerPage={setRecordsPerPage}
                                            setCurrentPage={setCurrentPage}
                                        />
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
                                </div>
                                <div className={` w-full bg-gray-300 flex-shrink-0 overflow-x-auto custom-horizontal-scroll select-text h-fit ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-64px)]"}`}>
                                    <CustomizeTable
                                        headers={headers}
                                        emptyMessage='No transaction logs available.'
                                        sortConfig={sortConfig}
                                        onSort={handleSort}
                                        renderRow={renderRow}
                                        data={currentRecords}
                                        className="table-auto border-collapse"
                                        theadClassName="px-4 py-2 text-left cursor-pointer select-none whitespace-nowrap"
                                        rowClassName=''
                                    // className="text-center py-3 text-lg font-semibold"
                                    />
                                </div>

                                <div className="flex flex-row whitespace-nowrap md:justify-center justify-end gap-3 mt-3 align-items-center ">
                                    <button
                                        className="btn btn-dark py-2"
                                        onClick={handlePrevious}
                                        disabled={currentPage === 1}
                                    >
                                        &lt;
                                    </button>
                                    <div className="">
                                        {indexOfFirstRecord + 1} - {' '}
                                        {Math.min(indexOfLastRecord, filteredAndSortedLogs?.length)} of {' '}
                                        {filteredAndSortedLogs?.length}
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
                            {/* )} */}
                        </div>
                    </div>
                </div>
            </section >
        </>
    );
}

export default AdminAllCampaigns