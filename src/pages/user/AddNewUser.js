
import React, { useState, useEffect } from "react";
import CreditHeader from "../../components/CreditHeader";
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, } from "react-redux";
import { createUser, getAllUsers } from "../../redux/actions/authAction";
import { getSecureItem } from "../utils/SecureLocalStorage";
import { useNavigate } from "react-router-dom";

function AddNewUser() {
    const [user, setUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const userControlsOptions = [
        "Create Users",
        "Update Users",
        "Delete Users",
        "View All Users",
        "Manage Admins",
        "Manage Resellers",
        "Manage Users",
        "View Analytics",
        "Manage Settings",
        "Manage Pricing Plans",
        "View System Stats",
        "Manage All Campaigns",
        "Manage All Reports",
        "Manage All Groups",
        "Manage All Templates",
        "Manage All Credits",
        "Manage All APIKeys",
        "Unlimited Credits"
    ];

    const data = getSecureItem("userData");
    console.log(JSON.parse(data));


    const roleKeyMap = {
        Virtual: "virtual",
        Personal: "personal",
        "International Personal": "internationalPersonal",
        "International Virtual": "internationalVirtual",
    };

    // Generate permission object based on selected roles
    const generatePermissions = (selectedRoles) => {
        return Object.keys(roleKeyMap).reduce((acc, role) => {
            acc[roleKeyMap[role]] = selectedRoles.includes(role);
            return acc;
        }, {});
    };

    // Load user data from secure storage
    useEffect(() => {
        const storedData = getSecureItem("userData");
        if (storedData) {
            const parsed = JSON.parse(storedData);
            setUser(parsed?.user || parsed);
        }
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle role checkbox toggles
    const handleCheckboxChange = (role) => {
        setFormData((prev) => ({
            ...prev,
            selectedRoles: prev.selectedRoles.includes(role)
                ? prev.selectedRoles.filter((r) => r !== role)
                : [...prev.selectedRoles, role],
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const { username, password, confirmPassword, userRole, selectedRoles } = formData;

        // Form validation
        if (!username.trim()) return toast.error("Username is required.");
        if (!password || password.length < 6) return toast.error("Password must be at least 6 characters.");
        if (password !== confirmPassword) return toast.error("Passwords do not match.");
        if (!userRole) return toast.error("Please select a user role.");
        if (selectedRoles.length === 0) return toast.error("At least one permission role must be selected.");

        const payload = {
            username,
            password,
            role: userRole,
            permissions: generatePermissions(selectedRoles),
        };

        try {
            setIsSubmitting(true);
            const response = dispatch(createUser(payload));
            console.log("Response data", dispatch(createUser(payload)));

            if (response) {
                toast.success("User created successfully.");
                setFormData({
                    userid: "",
                    username: "",
                    password: "",
                    confirmPassword: "",
                    userRole: "",
                    selectedRoles: [],
                });
                navigate("/manage-user");
                dispatch(getAllUsers());
            }
        } catch (error) {
            toast.error(error?.message || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
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
            reseller: ["user"],
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
                            <div className="flex  gap-2 w-full h-full">
                                {/* User Permissions Section */}
                                <div className="flex gap-4 w-full md:flex-col">
                                    {/* User Permissions */}
                                    <div className="flex flex-col w-fit md:w-full h-fit md:min-h-fit min-h-full">
                                        <label className="text-lg font-medium text-black mb-1">User Permissions</label>
                                        <div className="flex-1 border-2 border-black rounded-md p-2 gap-1 h-fit">
                                            {userRolesOptions.map((role, index) => (
                                                <div key={index} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input mr-2 mt-0 border-black border-2"
                                                        id={`role-permission-${index}`}
                                                        value={role}
                                                        checked={formData.selectedRoles.includes(role)}
                                                        onChange={() => handleCheckboxChange(role)}
                                                    />
                                                    <label
                                                        className="form-check-label pt-0.5"
                                                        htmlFor={`role-permission-${index}`}
                                                    >
                                                        {role}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Controls Section */}
                                    <div className="flex-1 h-full flex flex-col mb-4">
                                        <label className="text-lg font-medium text-black">Controls</label>
                                        <div className="mt-1 flex-1 border-2 border-black rounded-md p-2 overflow-auto grid smm:lg:grid-cols-1 lg:grid-cols-2 grid-cols-3 gap-x-4">
                                            {userControlsOptions.map((role, index) => (
                                                <div key={index} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input mr-2 mt-0 border-black border-2"
                                                        id={`control-permission-${index}`}
                                                        value={role}
                                                        checked={formData.selectedRoles.includes(role)}
                                                        onChange={() => handleCheckboxChange(role)}
                                                    />
                                                    <label
                                                        className="form-check-label pt-0.5 whitespace-nowrap"
                                                        htmlFor={`control-permission-${index}`}
                                                    >
                                                        {role}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full mt-4 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600">
                                {formData.userid ? "Update User" : "Create User"}
                            </button>
                        </form>
                    </div>
                </div>
            </section >

            {/* Toast Container to Display Toasts */}
            < ToastContainer autoClose="5000" />
        </>
    );
}

export default AddNewUser