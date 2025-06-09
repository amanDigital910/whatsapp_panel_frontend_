import React, { useState, useEffect, useMemo } from "react";
import CreditHeader from "../../components/CreditHeader";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { getSecureItem } from "../utils/SecureLocalStorage";
import { CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton, RecordsPerPageDropdown } from "../utils/Index";
import useIsMobile from "../../hooks/useMobileSize";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers, updateUser } from "../../redux/actions/authAction";

function ManageUser({ isOpen }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useIsMobile();
    const getUser = getSecureItem("userData");

    const { loading, users, error } = useSelector((state) => state.userCreate);

    const [filteredUsers, setFilteredUsers] = useState([]);
    // const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(25);
    const [sortConfig, setSortConfig] = useState({ key: 'updatedAt', direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');
    const storedData = JSON.parse(getSecureItem("userData"));
    const [roleFilter, setRoleFilter] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserEdit, setSelectedUserEdit] = useState(null);
    const userData = JSON.parse(getSecureItem("userData"));
    const userRole = userData?.role || "";
    const filteredUsersRole = roleFilter
        ? users.filter(user => user.role.toLowerCase() === roleFilter.toLowerCase())
        : users;


    const [formData, setFormData] = useState({
        _id: "",
        username: "",
        role: "",
        permissions: [],
    });

    useEffect(() => {
        dispatch(getAllUsers());
        // console.log("Set Filtered User", filteredUsers);
    }, []);

    useEffect(() => {
        setFilteredUsers(users || []);
    }, [users]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            username: formData.username,
            role: formData.role,
            permissions: generatePermissionObject(formData.permissions),
        };

        if (formData._id) {
            const response = await dispatch(updateUser(formData._id, payload));
            if (response?.success) {
                dispatch(getAllUsers());
            }
        }

        setIsModalOpen(false);
        setFormData({
            _id: "",
            username: "",
            role: "",
            permissions: [],
        });
    };

    const allRoles = ["super_admin", "admin", "reseller", "user"];
    const renderRoleOptions = (role) => {
        if (!role) return null;

        const roleAccessMap = {
            selectRole: "Select a Role",
            super_admin: ["admin", "reseller", "user"],
            admin: ["admin", "reseller", "user"],
            reseller: ["reseller", "user"],
            user: ["reseller", "user"],
        };
        //  admin: ["admin", "reseller", "user"],
        //     reseller: ["admin", "reseller", "user"],
        //     user: ["admin", "reseller", "user"]


        const allowedRoles = roleAccessMap[role] || [];

        const filteredAndSortedRoles = allRoles
            .filter(r => allowedRoles.includes(r))
            .sort((a, b) => allowedRoles.indexOf(a) - allowedRoles.indexOf(b));

        return [
            <option key="default" value="" disabled>Select a Role</option>,
            ...filteredAndSortedRoles.map(r => (
                <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
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
        setFormData({});
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
        dispatch(getAllUsers());
    };

    const headers = [
        { key: '_id', label: 'User ID' },
        { key: 'username', label: 'Username' },
        { key: 'role', label: 'User Role' },
        ...(userRole !== 'reseller'
            ? [{ key: 'createdBy._id', label: 'Created By', }]
            : []),
        { key: 'updatedAt', label: 'Last Updated' },
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
            <td className="px-2 py-2 border text-[1rem] border-gray-900 w-20">{log?._id.slice(-5) || '-'}</td>
            <td className="px-2 py-2 border text-[1rem] border-gray-900">{log?.username || '-'}</td>
            <td className="px-2 py-2 border text-[1rem] border-gray-900" >{log?.role || '-'}</td>
            {userRole !== 'reseller' ?
                <td className="px-2 py-2 border text-[1rem] border-gray-900">{log?.createdBy?._id.slice(-5) || '-'}</td>
                : []}
            <td className="px-2 py-2 border text-[1rem] border-gray-900">
                {new Date(log?.updatedAt).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                })}
            </td>

            <td className="px-2 py-2 flex justify-center">
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
                        setSelectedUserEdit(log);
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

    return (
        <>
            <section className='w-[100%] bg-gray-200 h-full min-h-[calc(100vh-70px)] flex flex-col pb-3 '>
                <CreditHeader />
                <div className="w-full mt-8">
                    <div className='px-3 w-full'>
                        <div className="w-full flex md:flex- bg-white rounded-lg whitespace-nowrap m-0 py-2">
                            <h1 className="text-2xl ss:text-xl md:text-xl text-start pl-4 md:pl-2 md:flex justify-center text-black font-semibold py-0 m-0">
                                Manage User
                            </h1>
                            <div className={`w-full flex gap-4 pr-4 md:pr-2 justify-end items-center`}>
                                {storedData?.role !== "user" && <button className={`py-0 px-3 m-0 text-white rounded-md bg-black text-lg font-medium `} onClick={handleAddNewUser}>
                                    Add User
                                </button>}
                            </div>
                        </div>
                    </div>
                    <div className='px-3 pt-3'>
                        <div className='bg-white border-t border-[#383387] pb-3 w-full'>
                            <div className="container-fluid px-3 p-0">
                                <div className="pt-3">
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
                                                <div className="flex justify-end gap-3 md:flex-col ">
                                                    <div className="relative h-full">
                                                        <input
                                                            type="text"
                                                            className="form-control h-full border border-black"
                                                            placeholder="Search User by Name"
                                                            value={searchTerm}
                                                            onChange={handleSearch}
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
                                                    <div className="flex flex-row whitespace-nowrap md:justify-center justify-end gap-3 align-items-center ">
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
                                            </div>
                                            <div className={`w-full border-t border-[#383387] pt-3 flex-shrink-0 overflow-auto custom-horizontal-scroll select-text h-full ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-64px)]"}`}>
                                                <CustomizeTable
                                                    headers={headers}
                                                    emptyMessage='No transaction logs available.'
                                                    sortConfig={sortConfig}
                                                    onSort={handleSort}
                                                    renderRow={renderRow}
                                                    data={currentRecords}
                                                    className="table-auto border-collapse  bg-gray-300"
                                                    theadClassName="px-4 py-2 text-left cursor-pointer select-none whitespace-nowrap"
                                                    rowClassName=' bg-gray-300'
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
                                            disabled
                                        />
                                    </div>
                                    {selectedUserEdit?._id && <div className="mb-3">
                                        <label htmlFor={`role-${selectedUserEdit._id}`} className="form-label m-0">User Role</label>
                                        <select
                                            className="form-select"
                                            htmlFor={`role-${selectedUserEdit._id}`}
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            {renderRoleOptions(selectedUserEdit.role)}
                                        </select>
                                    </div>}
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
            {/* <ToastContainer autoClose="3000" /> */}
        </>
    );
}

export default ManageUser;