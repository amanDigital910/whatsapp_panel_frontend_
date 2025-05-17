import React, { useState, useEffect, useMemo } from "react";
import CreditHeader from "../../components/CreditHeader";
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { getSecureItem } from "../utils/SecureLocalStorage";
import { CampaignHeading, CustomizeTable } from "../utils/Index";
import useIsMobile from "../../hooks/useMobileSize";

function ManageUser({ isOpen }) {
    const navigate = useNavigate();

    const [user, setUser] = useState(null); // Current user data
    const [usersList, setUsersList] = useState([]); // List of users fetched from the API
    const [filteredUsers, setFilteredUsers] = useState([]); // Filtered list based on search
    const [searchQuery, setSearchQuery] = useState(""); // Search query state
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5; // Number of records per page
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');
    const isMobile = useIsMobile();

    const [formData, setFormData] = useState({
        userid: "",
        username: "",
        password: "",
        confirmPassword: "",
        userRole: "",
        selectedRoles: [], // Initialize as an empty array
    });

    const headers = [
        { key: 'id', label: 'S.No.' },
        { key: 'userName', label: 'Username' },
        { key: 'resellerUserName', label: 'Reseller UserName' },
        { key: 'userType', label: 'User Type' },
        { key: 'date', label: 'Date' },
        { key: 'action', label: 'Action' }
    ];


    const [isLoading, setIsLoading] = useState(false); // Loading state for API calls

    // Simulating user data fetching from localStorage
    useEffect(() => {
        const storedData = getSecureItem("userData");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setUser(parsedData.user);

            // Fetch users list using parentuser_id
            // fetchUsers(parsedData.user.userid);
        }
    }, []);

    // Fetch users based on parentuser_id
    const fetchUsers = async (userid) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/auth/parentuser/${userid}`
            );
            if (response.status === 200 && response.data.data) {
                setUsersList(response.data.data);
                setFilteredUsers(response.data.data);
            } else {
                toast.error("No users found for the given parent user ID.", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error("No users found for the given parent user ID.", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                });
            } else {
                console.error("Error fetching users:", error);
                toast.error("Error fetching users. Please try again.", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (selectedUser) => {
        setFormData({
            userid: selectedUser.userid, // Use the selected user's ID
            username: selectedUser.userName,
            password: "", // Leave blank for security
            confirmPassword: "", // Leave blank for security
            userRole: selectedUser.roleId,
            selectedRoles: selectedUser.permissions || [],
        });
    };

    // Handle search input change
    const handleSearch = (e) => {
        const query = setSearchTerm(e.target.value.toLowerCase());
        setSearchQuery(query);

        if (query.trim() === "") {
            setFilteredUsers(usersList);
        } else {
            const filtered = usersList.filter(user =>
                user.userName.toLowerCase().includes(query)
            );
            setFilteredUsers(filtered);
        }
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredUsers.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    const handleAddNewUser = () => {
        navigate('/add-new-user');
    }

    const renderRow = (log, index) => (
        <tr key={index} className="text-white border border-gray-700 hover:bg-gray-500 whitespace-nowrap">
            <td className="px-2 py-2 border border-gray-900">{log.id}</td>
            <td className="px-2 py-2 border border-gray-900 text-blue-600 underline cursor-pointer">{log.to_user_name}</td>
            <td className="px-2 py-2 border border-gray-900">
                {log.credit_type.charAt(0).toUpperCase() + log.credit_type.slice(1)}
            </td>
            <td className="px-2 py-2 border border-gray-900">{log.credit || '-'}</td>
            <td className="px-2 py-2 border border-gray-900 ">{log.name}</td>
            <td className="px-2 py-2 border border-gray-900 ">
                {new Date(log.transaction_date).toLocaleDateString('en-GB')}
            </td>
        </tr>
    );

    const filteredAndSortedLogs = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();

        const filtered = currentRecords.filter(log => {
            // Search term filter (matches phone, campaign, status, or read status)
            const matchesSearch =
                log.to.trim().includes(term);
            // log.campaignName.toLowerCase().trim().includes(term) ||
            // log.status.toLowerCase().trim().includes(term) ||
            // log.readStatus.toLowerCase().trim().includes(term);

            // Date filter (matches based on start date and end date)
            return matchesSearch;
        });

        // Sorting logic
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aVal = a[sortConfig.key] || '';
                const bVal = b[sortConfig.key] || '';
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [currentRecords, searchTerm, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const userData = JSON.parse(getSecureItem("userData"));

    return (
        <>
            <section className='w-[100%] bg-gray-200 h-full min-h-[calc(100vh-70px)] flex flex-col '>
                <CreditHeader />
                <div className="w-full mt-8">
                    <CampaignHeading campaignHeading="Manage User" />
                    <div className='px-3 pt-3'>
                        <div className='bg-white px-3 py-3 w-full'>
                            <div className="container-fluid p-0">
                                <div className={`w-full flex ${userData.role === "user" ? "justify-end" : "justify-between"} items-center mb-3`}>
                                    {userData.role !== "user" && <button className={`" btn btn-dark "}`} onClick={handleAddNewUser}>
                                        Add User
                                    </button>}
                                    <div className="flex justify-end ">
                                        <input
                                            type="text"
                                            className="form-control me-2 border border-black"
                                            placeholder="Search User"
                                            value={searchQuery}
                                            onChange={handleSearch}
                                        />

                                        <button className="btn btn-dark">Search</button>
                                    </div>
                                </div>

                                <div className="py-3 border-t border-[#383387] ">
                                    {isLoading ? (
                                        <div className="text-center my-4">
                                            <div className="spinner-border text-dark" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`min-w-max`}>
                                            <div className={`w-full bg-gray-300 flex-shrink-0 overflow-auto custom-horizontal-scroll select-text h-full ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-64px)]"}`}>
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
                                            {/* <table className="table table-bordered table-striped">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>S.No.</th>
                                                    <th>Username</th>
                                                    <th>User Type</th>
                                                    <th>Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentRecords.length > 0 ? (
                                                    currentRecords.map((user, index) => (
                                                        <tr key={user.userid}>
                                                            <td>{indexOfFirstRecord + index + 1}</td>
                                                            <td>{user.userName}</td>
                                                            <td>
                                                                {(() => {
                                                                    switch (user.role) {
                                                                        case "admin":
                                                                            return "Admin";
                                                                        case "reseller":
                                                                            return "Reseller";
                                                                        case "user":
                                                                            return "User";
                                                                        default:
                                                                            return "Unknown";
                                                                    }
                                                                })()}
                                                            </td>
                                                            <td>{new Date(user.createAt).toLocaleDateString()}</td>
                                                            <td>
                                                                <button className="btn btn-success btn-sm me-2">Active</button>
                                                                <button className="btn btn-warning btn-sm" onClick={() => handleEdit(user)}>
                                                                    Edit
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center">
                                                            No users found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table> */}

                                            <div className="d-flex justify-content-end gap-3 align-items-center mt-3">
                                                <button
                                                    className="btn btn-dark"
                                                    onClick={handlePrevious}
                                                    disabled={currentPage === 1}
                                                >
                                                    &lt;
                                                </button>
                                                <div>
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
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Modal
            {isModalOpen && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{formData.userid ? "Edit User" : "Add User"}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">
                                            Username
                                        </label>
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
                                        <label htmlFor="password" className="form-label">
                                            Password
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required={!formData.userid} // Required only for new users
                                            />
                                            <span
                                                className="input-group-text"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}  ></i>
                                            </span>
                                        </div>
                                        {formData.userid && (
                                            <small className="form-text text-muted">
                                                Leave blank to keep the current password.
                                            </small>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            Confirm Password
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className="form-control"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required={!formData.userid} // Required only for new users
                                            />
                                            <span
                                                className="input-group-text"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}
                                                    style={{ color: showConfirmPassword ? "red" : "blue" }}
                                                ></i>
                                            </span>
                                        </div>
                                        {formData.userid && (
                                            <small className="form-text text-muted">
                                                Leave blank to keep the current password.
                                            </small>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        {user ? (
                                            <>
                                                <label htmlFor="userRole" className="form-label">
                                                    User Role
                                                </label>
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
                                            </>
                                        ) : (
                                            <p>Loading user data...</p>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">User Permissions</label>
                                        <div className="border p-2 overflow-auto" style={{ maxHeight: "150px" }}>
                                            {userRolesOptions.map((role, index) => (
                                                <div key={index} className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`role-${index}`}
                                                        value={role}
                                                        checked={formData.selectedRoles.includes(role)}
                                                        onChange={() => handleCheckboxChange(role)}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor={`role-${index}`}
                                                    >
                                                        {role}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        {formData.userid ? "Update User" : "Create User"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )} */}
            {/* Toast Container to Display Toasts */}
            <ToastContainer />
        </>
    );
}

export default ManageUser;