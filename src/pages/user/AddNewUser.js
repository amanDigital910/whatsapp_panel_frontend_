
import React, { useState, useEffect } from "react";
import CreditHeader from "../../components/CreditHeader";
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, } from "react-redux";
import { createUser } from "../../redux/actions";
import { getSecureItem } from "../utils/SecureLocalStorage";

function AddNewUser() {
    const [user, setUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        userid: "",
        username: "",
        password: "",
        confirmPassword: "",
        userRole: "",
        selectedRoles: [],
    });

    const userRolesOptions = [
        "Virtual",
        "Personal",
        "International Personal",
        "International Virtual",
    ];

    // Get logged-in user data from localStorage
    useEffect(() => {
        const storedData = getSecureItem("userData");
        if (storedData) {
            const parsed = JSON.parse(storedData);
            setUser(parsed?.user || parsed); // Fallback if `user` key isn't nested
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === "selectedRoles") {
            const updatedRoles = checked
                ? [...formData.selectedRoles, value]
                : formData.selectedRoles.filter((role) => role !== value);
            setFormData((prev) => ({ ...prev, selectedRoles: updatedRoles }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCheckboxChange = (role) => {
        const updated = formData.selectedRoles.includes(role)
            ? formData.selectedRoles.filter((r) => r !== role)
            : [...formData.selectedRoles, role];
        setFormData((prev) => ({ ...prev, selectedRoles: updated }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        if (!formData.password.length || formData.password.length <= 6 || formData.selectedRoles.length === 0) {
            return toast.error("Password and User Permissions are required!");
        }

        const payload = {
            username: formData.username,
            password: formData.password,
            role: formData.userRole,
            email: "example11@gmail.com",
            permission: formData.selectedRoles,
            // isActive: true,
            // parentuser_id: user?.userid,
            // firstName: "Amansingh",
            // lastName: "Chauhan",
            // mobileNumber: "9234234234",
        };
        try {
            // Dispatch Redux action to create the user
            await dispatch(createUser(payload)); // Wait until it's done

            setFormData({
                userid: "",
                username: "",
                password: "",
                confirmPassword: "",
                userRole: "",
                selectedRoles: [],
            });
        } catch (error) {
            // No need for toast here since it's handled in the action
            console.error("Error dispatching createUser:", error);
        }
    };
    // try {
    //     const headerConfig = {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${localStorage.getItem("userToken")}`,
    //         }
    //     };

    //     //   const response = formData.userid
    //     // ? await axios.put(`${process.env.REACT_APP_API_URL}/auth/updateUser/${formData.userid}`, payload, config)
    //     // : await axios.post(`http://147.93.106.185:3000/api/auth/CreateUser`, payload, config);
    //     const response = await axios.post(`http://147.93.106.185:3000/api/auth/CreateUser`, payload, headerConfig);

    //     if ([200, 201].includes(response.status)) {
    //         // toast.success(formData.userid ? "User updated!" : "User created!");
    //         toast.success("Successfully User Created")

    //         setFormData({
    //             userid: "",
    //             username: "",
    //             password: "",
    //             confirmPassword: "",
    //             userRole: "",
    //             selectedRoles: [],
    //         });
    //     }
    // } catch (err) {
    //     console.error(err);
    //     toast.error("Something went wrong. Try again.");
    // }


    const renderRoleOptions = () => {
        if (!user) return null;

        const options = {
            selectRole: "Select a Role",
            super_admin: ["admin", "reseller", "user"],
            admin: ["reseller", "user"],
            user: ["user"],
        };

        const availableRoles = options[user.role || "user"] || [];

        return [
            <option key="default" value="" disabled>Select a Role</option>,
            ...availableRoles.map((role) => (
                <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
            )),
        ];
    };

    return (
        <>
            <section className="w-full bg-gray-200  flex justify-center flex-col pb-10">
                <CreditHeader />
                <div className="mx-6">
                    <div className="mt-4 py-4 px-8 bg-white w-full ">
                        <h3 className="text-2xl flex justify-center font-bold underline underline-offset-3">Add New User</h3>
                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="mb-4 ">
                                <label htmlFor="username" className="block text-lg font-medium text-black">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border-2 text-lg border-black rounded-md p-2"
                                    id="username"
                                    name="username"
                                    placeholder="Ex. (vikram)"
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
                                        className="mt-1 block w-full text-lg border-2 border-black rounded-md p-2"
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
                                        className="mt-1 block w-full border-2 text-lg border-black rounded-md p-2"
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

                            <div className="mb-4 w-full">
                                <label htmlFor="userRole" className="text-lg font-medium text-black">
                                    User Role
                                </label>
                                <select
                                    className="mt-1 block w-full border-2 border-black rounded-md px-2 pt-[14px]  form-select focus-within:border-black focus:border-black"
                                    id="userRole"
                                    style={{
                                        padding: '10px 0px',
                                    }}
                                    name="userRole"
                                    value={formData.userRole}
                                    onChange={handleChange}
                                    required
                                >
                                    {user ? (
                                        renderRoleOptions()
                                    ) : (
                                        <option value="" disabled>User Not Found...</option>
                                    )}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="text-lg font-medium text-black">User Permissions</label>
                                <div className="mt-1 block border-2 border-black rounded-md p-2 overflow-auto max-h-40">
                                    {userRolesOptions.map((role, index) => (
                                        <div key={index} className="flex items-center mb-1">
                                            <input
                                                type="checkbox"
                                                className="form-check-input mr-2 mt-0 border-black border-2"
                                                id={`permission-${index}`}
                                                value={role}
                                                checked={formData.selectedRoles.includes(role)}
                                                onChange={() => handleCheckboxChange(role)}
                                            />
                                            <label
                                                className="form-check-label pt-0.5"
                                                htmlFor={`permission-${index}`}
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