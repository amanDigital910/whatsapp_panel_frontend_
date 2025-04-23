import axios from 'axios';
import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import CreditHeader from "../../components/CreditHeader";

function ManageCredit() {
    const [user, setUser] = useState(null); // User state
    const [usersList, setUsersList] = useState([]); // List of users fetched from the API
    const [categories, setCategories] = useState([]); // List of categories
    const [transactionLogs, setTransactionLogs] = useState([]); // Transaction logs
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5; // You can adjust this as needed

    const [formData, setFormData] = useState({
        sendUser: "",
        selectedCategory: "",
        balance: "",
        creditDebit: "",
    }); // Form data state

    // Simulating user data fetching from localStorage
    useEffect(() => {
        const storedData = localStorage.getItem("userData");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setUser(parsedData.user);
            // Fetch all necessary data
            fetchUsers(parsedData.user.userid);
            fetchTransactionLogs(parsedData.user.userid);
            fetchCategories();
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
                fetchTransactionLogs(user.userid);

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


    return (
        <>
            <section className='w-[100%] bg-gray-200  flex justify-center flex-col pb-10'>
                <CreditHeader />
                <div className="w-full px-3 ">
                    <div className="container-fluid p-3 mt-5">
                        {/* Filters Section */}
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-4 me-0">
                                {/* Left Section */}
                                <div className="col-md-6 d-flex gap-3 align-items-center ">
                                    <div className="flex-grow-1">
                                        <select
                                            name="sendUser"
                                            value={formData.sendUser}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="">Select User</option>
                                            {usersList.map((user) => (
                                                <option key={user.userid} value={user.userid}>
                                                    {user.userName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex-grow-1">
                                        <select
                                            name="selectedCategory"
                                            value={formData.selectedCategory}
                                            onChange={handleChange}
                                            className="form-select"
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
                                <div className="col-md-6 d-flex gap-3 align-items-center p-2">
                                    <div className="flex-grow-1">
                                        <select
                                            name="creditDebit"
                                            value={formData.creditDebit}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="Credit">Credit</option>
                                            <option value="Debit">Debit</option>
                                        </select>
                                    </div>
                                    <div className="flex-grow-1">
                                        <input
                                            type="text"
                                            name="balance"
                                            value={formData.balance}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Balance"
                                        />
                                    </div>
                                    <div className="flex-grow-1">
                                        <button type="submit" className="btn btn-dark w-100">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Buttons Section */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center">
                                <button className="btn btn-outline-primary me-2">Copy</button>
                                <button className="btn btn-outline-success me-2">Excel</button>
                                <button className="btn btn-outline-danger me-2">PDF</button>
                            </div>

                            <div className="d-flex align-items-center">
                                <label className="me-2 mb-0">Search:</label>
                                <input type="text" className="form-control d-inline-block w-auto" />
                            </div>
                        </div>

                        {/* Table Section */}
                        <table className="table table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>UserName</th>
                                    <th>Balance Type</th>
                                    <th>Balance</th>
                                    <th>Credit Type</th>
                                    <th>Credit Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.length > 0 ? (
                                    currentRecords.map((log) => (
                                        <tr key={log.id}>
                                            <td>{log.id}</td>
                                            <td>{log.to_user_name}</td>
                                            <td>{log.credit_type.charAt(0).toUpperCase() + log.credit_type.slice(1)}</td>
                                            <td>{log.credit}</td>
                                            <td>{log.name}</td>
                                            <td>{new Date(log.transaction_date).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            No transaction logs available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
            </section>
        </>
    )
}

export default ManageCredit;
