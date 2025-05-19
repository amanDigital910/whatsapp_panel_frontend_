import React, { useState, useEffect, useMemo } from "react";
import CreditHeader from "../../components/CreditHeader";
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { ToastContainer } from 'react-toastify'; // Import Toastify
import { useNavigate } from "react-router-dom";
import { getSecureItem } from "../utils/SecureLocalStorage";
import { CampaignHeading, CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton } from "../utils/Index";
import useIsMobile from "../../hooks/useMobileSize";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers, updateUser } from "../../redux/actions/authAction";

function ManageUser({ isOpen }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useIsMobile();

    const { loading, users, error } = useSelector((state) => state.userCreate);

    const [filteredUsers, setFilteredUsers] = useState([]);
    // const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');
    const storedData = JSON.parse(getSecureItem("userData"));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // For delete confirmation
    const [formData, setFormData] = useState({
        _id: "",
        username: "",
        role: "",
        permissions: [],
    });

    const userRolesOptions = [
        "Virtual",
        "Personal",
        "International Personal",
        "International Virtual",
    ];

    const roleKeyMap = {
        "Virtual": "virtual",
        "Personal": "personal",
        "International Personal": "internationalPersonal",
        "International Virtual": "internationalVirtual"
    };

    const generatePermissionObject = (selectedRoles) =>
        Object.fromEntries(Object.entries(roleKeyMap).map(([label, key]) => [key, selectedRoles.includes(label)]));

    const extractSelectedRoles = (permissions = {}) =>
        Object.entries(roleKeyMap).filter(([_, key]) => permissions[key]).map(([label]) => label);

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            username: formData.username,
            role: formData.role,
            permissions: generatePermissionObject(formData.permissions),
        };

        if (formData._id) {
            dispatch(updateUser(formData._id, payload));
        }

        setIsModalOpen(false);
        setFormData({
            _id: "",
            username: "",
            role: "",
            permissions: [],
        });
    };

    const renderRoleOptions = () => {
        if (!users) return null;

        const options = {
            selectRole: "Select a Role",
            super_admin: ["admin", "reseller", "user"],
            admin: ["reseller", "user"],
            reseller: ["user"],
            user: ["user"],
        };

        const availableRoles = options[users.role || "user"] || [];

        return [
            <option key="default" value="" disabled>Select a Role</option>,
            ...availableRoles.map((role) => (
                <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
            )),
        ];
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (role) => {
        setFormData((prevData) => {
            const updatedPermissions = prevData.permissions.includes(role)
                ? prevData.permissions.filter((r) => r !== role)
                : [...prevData.permissions, role];

            return {
                ...prevData,
                permissions: updatedPermissions,
            };
        });
    };

    // Close form modal
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({}); // Reset formData if needed
    };

    // Delete confirmation handlers
    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedUser(null);
    };

    const handleConfirmDelete = (userId) => {
        dispatch(deleteUser(userId)); // redux action
        setShowDeleteModal(false);
        setSelectedUser(null);
    };


    useEffect(() => {
        dispatch(getAllUsers());
        // console.log("Set Filtered User", filteredUsers);
    }, [dispatch, users?.data?.length]);

    useEffect(() => {
        if (users?.data?.length) {
            setFilteredUsers(users.data);
        }
    }, [users]);

    const headers = [
        { key: '_id', label: 'User ID' },
        { key: 'username', label: 'Username' },
        { key: 'role', label: 'User Role' },
        { key: 'firstName', label: 'Firstname (usertype)' },
        { key: 'updatedAt', label: 'Last Login' },
        { key: 'action', label: 'Action' }
    ];


    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchTerm(query);
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleAddNewUser = () => {
        navigate('/add-new-user');
    };

    const filteredAndSortedLogs = useMemo(() => {
        let filtered = filteredUsers;

        if (searchTerm.trim()) {
            filtered = filtered.filter(user =>
                user?.username?.toLowerCase().includes(searchTerm)
            );
        }

        if (sortConfig.key) {
            filtered = [...filtered].sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                // Handle string vs number comparison
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    return sortConfig.direction === 'asc'
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                }

                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
                }

                // Default fallback
                return 0;
            });
        }

        return filtered;
    }, [filteredUsers, searchTerm, sortConfig]);

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredAndSortedLogs.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredAndSortedLogs.length / recordsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const renderRow = (log, index) => (
        <tr key={index} className="text-black border border-gray-700 hover:bg-gray-500 whitespace-nowrap ">
            <td className="px-2 py-2 border text-[1rem] border-gray-900">{log?._id || '-'}</td>
            <td className="px-2 py-2 border text-[1rem] border-gray-900">{log?.username || '-'}</td>
            <td className="px-2 py-2 border text-[1rem] border-gray-900">{log?.role || '-'}</td>
            <td className="px-2 py-2 border text-[1rem] border-gray-900">{log?.firstName || '-'}</td>
            <td className="px-2 py-2 border text-[1rem] border-gray-900">{new Date(log?.createdAt).toLocaleDateString('en-GB')}</td>

            <td className="px-2 py-2 border border-gray-900 flex justify-center">
                <button
                    className="bg-[#ffc107] rounded-md py-1 px-2 text-bas font-medium me-2"
                    onClick={() => {
                        setFormData({
                            _id: log._id,
                            username: log.username,
                            role: log.role,
                            permissions: extractSelectedRoles(log.permissions || {}),
                        });
                        setIsModalOpen(true);
                    }}
                >
                    Edit
                </button>

                <button
                    className="bg-[#ff0000] rounded-md py-1 px-2 text-bas font-medium text-white"
                    onClick={() => handleDeleteClick(log)} // Pass the whole user
                >
                    Delete
                </button>

            </td>
        </tr>
    );

    console.log("All Customers Records", currentRecords, '\n', filteredAndSortedLogs);


    return (
        <>
            <section className='w-[100%] bg-gray-200 h-full min-h-[calc(100vh-70px)] flex flex-col pb-3 '>
                <CreditHeader />
                <div className="w-full mt-8">
                    <CampaignHeading campaignHeading="Manage User" />
                    <div className='px-3 pt-3'>
                        <div className='bg-white px-3 py-3 w-full'>
                            <div className="container-fluid p-0">
                                <div className={`w-full flex md:flex-col gap-4 ${storedData?.role === "user" ? "justify-end" : "justify-between"} items-center mb-3`}>
                                    {storedData?.role !== "user" && <button className={`" btn btn-dark "}`} onClick={handleAddNewUser}>
                                        Add User
                                    </button>}
                                    <div className="flex justify-end ">
                                        <input
                                            type="text"
                                            className="form-control me-2 border border-black"
                                            placeholder="Search User by Name"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                        />
                                        {/* <button className="btn btn-dark">Search</button> */}
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-[#383387] ">
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
                                        <div className={`min-w-max`}>
                                            <div className="flex justify-between mb-3 gap-3 md:flex-col">
                                                <div className="flex gap-3 md:justify-center ">
                                                    <CopyToClipboard headers={headers} data={filteredAndSortedLogs} />
                                                    <DownloadCSVButton headers={headers} dataLogs={filteredAndSortedLogs} />
                                                    <DownloadPDFButton headers={headers} dataLogs={filteredAndSortedLogs} />
                                                </div>
                                                <div className="d-flex md:justify-center justify-end gap-3 align-items-center ">
                                                    <button
                                                        className="btn btn-dark"
                                                        onClick={handlePrevious}
                                                        disabled={currentPage === 1}
                                                    >
                                                        &lt;
                                                    </button>
                                                    <div className="">
                                                        {indexOfFirstRecord + 1} -{' '}
                                                        {Math.min(indexOfLastRecord, filteredUsers.length)} of{' '}
                                                        {filteredUsers.length}
                                                    </div>
                                                    <button
                                                        className="btn btn-dark"
                                                        onClick={handleNext}
                                                        disabled={currentPage === totalPages}
                                                    >
                                                        &gt;
                                                    </button>
                                                </div>
                                            </div>
                                            <div className={`w-full bg-gray-300 flex-shrink-0 overflow-auto custom-horizontal-scroll select-text h-full ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-64px)]"}`}>
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
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Add / Edit User Modal */}
            {isModalOpen && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit User Details</h5>
                                <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label m-0">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="userRole" className="form-label m-0">User Role</label>
                                        <select
                                            className="form-select"
                                            id="userRole"
                                            name="userRole"
                                            value={formData.userRole}
                                            onChange={handleChange}
                                            required
                                        >
                                            {renderRoleOptions()}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label m-0">User Permissions</label>
                                        <div className="border p-2 overflow-auto" style={{ maxHeight: "150px" }}>
                                            {userRolesOptions.map((role, index) => (
                                                <div key={index} className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`role-${index}`}
                                                        value={role}
                                                        checked={formData.permissions.includes(role)}
                                                        onChange={() => handleCheckboxChange(role)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`role-${index}`}>
                                                        {role}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary">
                                        Update User
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                <p className="m-0">Are you sure you want to delete user <strong>{selectedUser.username}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleCancelDelete}>No</button>
                                <button className="px-3 py-2 rounded-md text-white bg-[#ff0000] " onClick={() => handleConfirmDelete(selectedUser._id)}>Yes, Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Container to Display Toasts */}
            <ToastContainer />
        </>
    );
}

export default ManageUser;