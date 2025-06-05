import React, { useEffect, useMemo, useRef, useState } from 'react'
import CreditHeader from '../../../components/CreditHeader';
import { CampaignHeading, CampaignTitle, CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton, RecordsPerPageDropdown } from '../../utils/Index';
import { toast } from 'react-toastify';
import useIsMobile from '../../../hooks/useMobileSize';
import '../../user/whatsapp_offical/commonCSS.css'
import { useDispatch, useSelector } from 'react-redux';
import { handleCreateCampaign, handleDeleteCampaign, handleGetCampaigns, handleUpdateCampaign } from '../../../redux/actions/campaignAction';

const AdminCreateTemplates = ({ isOpen }) => {
    const textareaRef = useRef(null);
    const isMobile = useIsMobile();
    const dispatch = useDispatch();

    const [allCampaign, setAllCampaign] = useState();
    const [campaignMsg, setCampaignMsg] = useState("");
    const [campaignName, setCampaignName] = useState("");
    const [campaignCost, setCampaignCost] = useState("");
    const [feedback, setFeedback] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'updatedAt', direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(25);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

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
            id: 4,
            groupName: "emily_watson",
            balanceType: "Investment",
            groupNumber: 1500000,
            groupDate: "2025-03-30",
        },
        {
            id: 5,
            groupName: "david_clark",
            balanceType: "Checking",
            groupNumber: 51235,
            groupDate: "2025-05-05",
        },
    ];

    const headers = [
        { key: '_id', label: 'Id' },
        { key: 'name', label: 'Campaign Name' },
        { key: 'creditCost', label: 'Credit Cost' },
        { key: 'updatedAt', label: 'Last Updated' },
        { key: 'action', label: 'Action' }
    ];

    // Adjust the height of the textarea dynamically
    const handleInput = () => {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    const saveCampaign = async () => {
        // Trim and validate required fields
        const name = campaignName.trim();
        const message = campaignMsg.trim();
        const cost = Number(campaignCost);

        if (!name || !message || !cost) {
            setFeedback("All fields are required.");
            toast.error("Please fill all fields with valid values.");
            return;
        } else if (name.length >= 60) {
            toast.error("Campaign name must not exceed 40 characters.");
            return;
        } else {
            setFeedback("");
        }


        const payload = {
            name,
            description: message,
            creditCost: cost,
        };

        try {
            let response;
            if (editingId) {
                response = await dispatch(handleUpdateCampaign(editingId, payload));
            } else {
                response = await dispatch(handleCreateCampaign(payload));
            }

            console.error("Error saving campaign:", response,);

            if (response?.success) {
                toast.success(editingId ? "Campaign updated successfully." : "Campaign created successfully.");
                dispatch(handleGetCampaigns());
                setCampaignName("");
                setCampaignMsg("");
                setCampaignCost("");
                setEditingId(null);
            } else {
                toast.error(response?.message || (editingId ? "Failed to Update Campaign." : "Failed to Create Campaign."));
            }
        } catch (error) {
            toast.error(error?.message || "Failed to save campaign. Please try again.");
            console.error("Default Errorr:", error);
        }
    };


    const handleEdit = (log) => {
        setCampaignName(log.name);
        setCampaignMsg(log.description);
        setCampaignCost(log.creditCost);
        setEditingId(log._id);
    };

    const handleDeleteClick = (log) => {
        setSelectedUser(log);
        setShowDeleteModal(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedUser(null);
    };

    const handleConfirmDelete = async (userId) => {
        try {
            const response = await dispatch(handleDeleteCampaign(userId));

            if (response) {
                toast.success(response.message || "Campaign deleted successfully!");
                await dispatch(handleGetCampaigns());
            } else {
                toast.error(response.message || "Failed to delete Campaign.");
                console.error("Delete failed:", response);
            }
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Something went wrong while deleting the Campaign.");
        } finally {
            setShowDeleteModal(false);
            setSelectedUser(null);
        }
    };

    const renderRow = (log) => {
        const idShort = log?._id ? log._id.slice(-5) : '-----';
        return (
            <tr key={log._id} className="text-black border border-gray-700 hover:bg-gray-500 whitespace-nowrap">
                <td className="px-2 py-2 border border-gray-900">{idShort}</td>
                <td className="px-2 py-2 border border-gray-900">{log.name}</td>
                <td className="px-2 py-2 border border-gray-900">{log.creditCost || '-'}</td>
                <td className="px-2 py-2 border border-gray-900 ">
                    {new Date(log?.updatedAt).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })}
                </td>
                <td className="px-2 py-2 flex justify-center items-center h-full w-full min-w-32">
                    <div className="flex items-center justify-center gap-2 flex-1 max-h-full">
                        <button
                            className="bg-[#ffc107] rounded-md py-1 px-2 text-base font-medium me-2"
                            onClick={() => { handleEdit(log) }}
                        >
                            Edit
                        </button>

                        <button
                            className="bg-[#ff0000] rounded-md py-1 px-2 text-base font-medium text-white"
                            onClick={() => handleDeleteClick(log)} // Pass the whole user
                        >
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        );
    }
    const filteredAndSortedLogs = useMemo(() => {
        if (!Array.isArray(allCampaign)) return [];

        const term = searchTerm.toLowerCase().trim();

        const filtered = allCampaign.filter(log => {
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
    }, [allCampaign, searchTerm, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredAndSortedLogs.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.max(1, Math.ceil(filteredAndSortedLogs.length / recordsPerPage));

    const handleNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    return (
        <section className="w-[100%] h-full min-h-[calc(100vh-70px)] bg-gray-200   flex items-center flex-col">
            <CreditHeader />
            <div className="w-full mt-8">
                <CampaignHeading campaignHeading="All Campaigns" />
                {/* <div className=""> */}
                <div className="w-full px-3 md:px-6 py-6 flex lg:flex-col gap-6">

                    {/* Left Column */}
                    <div className="lg:w-full w-1/2 flex flex-col gap-6">

                        {/* Group Name Input */}
                        <CampaignTitle
                            mainTitle={"Campaign Title"}
                            setCampaignTitle={setCampaignName}
                            inputTitle={campaignName || ""}
                            placeholder={"Enter Campaign Name"} />

                        <CampaignTitle
                            mainTitle={"Campaign Cost"}
                            setCampaignTitle={setCampaignCost}
                            inputTitle={campaignCost}
                            placeholder={"Enter Campaign Cost"} />

                        <div className="w-[100%] h-full flex flex-col gap-2">
                            <textarea
                                ref={textareaRef}
                                value={campaignMsg}
                                onChange={(e) => {
                                    setCampaignMsg(e.target.value);
                                    handleInput();
                                }}
                                rows={10}
                                style={{ height: "100%", minHeight: "400px" }}
                                className="w-full px-3 py-2 flex-1 rounded-md bg-white text-black border-black form-control placeholder-gray-500"
                                placeholder="Enter your message"
                            />
                        </div>
                    </div>
                    <div className="lg:hidden w-3/5 flex flex-col gap-6">
                        <div className="lg:hidden flex flex-col bg-white border border-black p-3 rounded-md min-h-[530px]">
                            {loading ? (
                                <div className="text-center my-4">
                                    <div className="spinner-border text-dark" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            // ) : error ? (
                            //     <div className="text-center text-red-600 my-4 font-semibold">
                            //         {"Transactions Unable to Fetch" || error}
                            //     </div>
                            )
                             : (
                                <div>
                                    <div className="flex md:justify-start justify-between gap-3 md:flex-col pb-3 ">
                                        <div className="flex gap-3  ">
                                            <CopyToClipboard headers={headers} data={dummyData} />
                                            <DownloadCSVButton headers={headers} dataLogs={dummyData} />
                                            <DownloadPDFButton headers={headers} dataLogs={dummyData} />
                                        </div>
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
                                    <div className={` w-full bg-gray-300 flex-shrink-0 overflow-x-auto custom-horizontal-scroll select-text h-[440px] ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-64px)]"}`}>
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

                                    <div className="flex flex-row whitespace-nowrap md:justify-center justify-end gap-3 align-items-center ">
                                        <button
                                            className="btn btn-dark py-2"
                                            onClick={handlePrevious}
                                            disabled={currentPage === 1}
                                        >
                                            &lt;
                                        </button>
                                        <div className="">
                                            {indexOfFirstRecord + 1} - {' '}
                                            {Math.min(indexOfLastRecord, allCampaign?.length)} of {' '}
                                            {allCampaign?.length}
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
                                )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center mb-4 px-3 flex-col">
                    {feedback && <p className="text-red-500 m-0">{feedback}</p>}
                    <button className="bg-[#0b5ed7] w-full rounded-md font-semibold text-white text-xl py-2" onClick={saveCampaign}>
                        {editingId ? "Update" : "Submit"}
                    </button>
                </div>

                <div className="hidden w-full lg:flex flex-col gap-6 px-3">
                    <div className="hidden lg:flex flex-col bg-white border border-black p-3 rounded-md min-h-[400px]">
                        <div className="flex md:justify-start justify-between gap-3 md:flex-col pb-3 ">
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
                        {loading ? (
                            <div className="text-center my-4">
                                <div className="spinner-border text-dark" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-600 my-4 font-semibold">
                                {error}
                            </div>) : (
                            <div className={` w-full bg-gray-300 flex-shrink-0 overflow-x-auto custom-horizontal-scroll select-text h-[310px] ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-64px)]"}`}>
                                <CustomizeTable
                                    headers={headers}
                                    emptyMessage='No transaction logs available.'
                                    sortConfig={sortConfig}
                                    onSort={handleSort}
                                    renderRow={renderRow}
                                    data={filteredAndSortedLogs}
                                    className="table-auto border-collapse"
                                    theadClassName="px-4 py-2 text-left cursor-pointer select-none whitespace-nowrap"
                                    rowClassName=''
                                // className="text-center py-3 text-lg font-semibold"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedUser && (
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Delete</h5>
                                    <button type="button" className="btn-close" onClick={handleCancelDelete} aria-label="Close"></button>
                                </div>
                                <div className="modal-body m-0">
                                    <p className="m-0">Confirm Delete: <strong>{selectedUser.name}</strong>?</p>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={handleCancelDelete}>No</button>
                                    <button className="px-3 py-2 rounded-md text-white bg-red-600" onClick={() => handleConfirmDelete(selectedUser?._id)}>Yes, Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section >
    )
}

export default AdminCreateTemplates;