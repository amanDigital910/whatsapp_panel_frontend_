
import React, { useState, useEffect } from "react";
import CreditHeader from "../../components/CreditHeader";
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AddNewUser() {
    const [user, setUser] = useState(null); // Current user data
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    // Simulating user data fetching from localStorage
    useEffect(() => {
        const storedData = localStorage.getItem("userData");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setUser(parsedData.user);
        }
    }, []);

    const [formData, setFormData] = useState({
        userid: "",
        username: "",
        password: "",
        confirmPassword: "",
        mobileNumber: "",
        userRole: "",
        selectedRoles: [],
        isActive: true// Initialize as an empty array
    });

    // Simulating user data fetching from localStorage

    // Handle form input change
    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === "selectedRoles") {
            // Handle checkbox changes
            let updatedRoles = [...formData.selectedRoles];
            if (checked) {
                updatedRoles.push(value);
            } else {
                updatedRoles = updatedRoles.filter(role => role !== value);
            }
            setFormData(prevData => ({
                ...prevData,
                selectedRoles: updatedRoles,
            }));
        } else if (name === "userRole") {
            setFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const userRolesOptions = [
        "Virtual",
        "Personal",
        "International Personal",
        "International Virtual"
    ];

    const handleCheckboxChange = (role) => {
        setFormData((prevData) => {
            const selectedRoles = prevData.selectedRoles || [];
            const isSelected = selectedRoles.includes(role);

            const updatedRoles = isSelected
                ? selectedRoles.filter((r) => r !== role)
                : [...selectedRoles, role];

            return { ...prevData, selectedRoles: updatedRoles };
        });
    };

    // Submit form data   
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            return; // Prevent form submission if passwords do not match
        }

        // Check if password and role are present
        if (!formData.password || !formData.selectedRoles || formData.selectedRoles.length === 0) {
            toast.error("Password and Role are required!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            return; // Prevent form submission if password or role is missing
        }

        // Prepare the data payload
        const payload = {
            userName: formData.username,
            password: formData.confirmPassword, // Use confirmPassword as the updated password
            role: formData.userRole, // Use selected role, default to "3" (Reseller)
            permission: formData.selectedRoles, // Use selected roles as permissions
            parentuser_id: user.userid, // Assuming `user` contains the parent user ID
        };

        console.log("Payload being sent to API:", payload);

        try {
            let response;
            if (formData.userid) {
                // If user ID exists, send a PUT request to update the user
                response = await axios.put(`${process.env.REACT_APP_API_URL}/auth/updateUser/${formData.userid}`, payload);
            } else {
                // If no user ID, it's a new user creation, send a POST request
                response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/CreateUser`, payload);
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(formData.userid ? "User updated successfully!" : "User created successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "dark",
                });

                // Reset the form data
                setFormData({
                    userid: "",
                    username: "",
                    password: "",
                    confirmPassword: "",
                    userRole: "3",
                    selectedRoles: [],
                });
            }
        } catch (error) {
            console.error("Error submitting user data:", error);
            toast.error("Failed to process request. Please try again.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
        }
    };

    const renderRoleOptions = () => {
        if (!user) return null; // Wait until user data is available

        switch (user.role) {
            case "super_admin":
                return (
                    <>
                        <option value="admin">Admin</option>
                        <option value="reseller">Reseller</option>
                        <option value="user">User</option>
                    </>
                );
            case "admin":
                return (
                    <>
                        <option value="reseller">Reseller</option>
                        <option value="user">User</option>
                    </>
                );
            case "user":
                return (
                    <option value="user" selected>User</option>
                );
            default:
                return <option value="user">User</option>;
        }
    };


    return (
        <>
            <section className="w-full bg-gray-200  flex justify-center flex-col pb-10">
                <CreditHeader />
                <div className="mx-6">
                    <div className="mt-4 py-4 px-8 bg-white w-full ">
                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="mb-4 ">
                                <label htmlFor="username" className="block text-lg font-medium text-black">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    className="w-full border-2 text-lg border-gray-400 rounded-md p-2"
                                    id="username"
                                    name="username"
                                    placeholder="Ex. (vikram_rajput)"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-lg font-medium text-black">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="mt-1 block w-full text-lg border-2 border-gray-400 rounded-md p-2"
                                        id="password"
                                        name="password"
                                        placeholder="Max 8 Characters Required"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required={!formData.userid} // Required only for new users
                                    />
                                    <span
                                        className="absolute inset-y-0 right-0 flex text-black z-20 items-center pr-5 w-10 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </span>
                                </div>
                                {formData.userid && (
                                    <small className="text-gray-500">
                                        Leave blank to keep the current password.
                                    </small>
                                )}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-lg font-medium text-black">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="mt-1 block w-full border-2 text-lg border-gray-400 rounded-md p-2"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Write same password as above"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required={!formData.userid} // Required only for new users
                                    />
                                    <span
                                        className="absolute inset-y-0 right-0 flex text-black z-20 items-center pr-5 w-10 cursor-pointer"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </span>
                                </div>
                                {formData.userid && (
                                    <small className="text-gray-500">
                                        Leave blank to keep the current password.
                                    </small>
                                )}
                            </div>

                            <div className="mb-4">
                                {user ? (
                                    <>
                                        <label htmlFor="userRole" className="block text-sm font-medium text-black">
                                            User Role
                                        </label>
                                        <select
                                            className="mt-1 block w-full border-2 border-gray-400 rounded-md px-2 py-2.5 "
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
                            <div className="mb-4">
                                <label className="block text-lg font-medium text-black">User  Permissions</label>
                                <div className="border-2 border-gray-400 rounded-md p-2 overflow-auto max-h-40">
                                    {userRolesOptions.map((role, index) => (
                                        <div key={index} className="flex items-center mb-1">
                                            <input
                                                type="checkbox"
                                                className="form-check-input mr-2 mt-0 border-black border-2"
                                                id={`permission`}
                                                value={role}
                                                checked={formData.selectedRoles.includes(role)}
                                                onChange={() => handleCheckboxChange(role)}
                                            />
                                            <label
                                                className="form-check-label pt-0.5"
                                                htmlFor={`permission`}
                                            >
                                                {role}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600">
                                {formData.userid ? "Update User" : "Create User"}
                            </button>
                        </form>
                    </div>
                </div>
            </section >

            {/* Toast Container to Display Toasts */}
            < ToastContainer />
        </>
    );
}

export default AddNewUser