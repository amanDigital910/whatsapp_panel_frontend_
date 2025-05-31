
import React, { useState, useEffect } from "react";
import CreditHeader from "../../components/CreditHeader";
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, } from "react-redux";
import { createUser, getAllUsers } from "../../redux/actions/authAction";
import { getSecureItem } from "../utils/SecureLocalStorage";
import { Link, useNavigate } from "react-router-dom";

function AddNewUser() {
    const [user, setUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const options = {
        selectRole: "Select a Role",
        super_admin: ["admin", "reseller", "user"],
        admin: ["reseller", "user"],
        reseller: ["reseller", "user"],
        user: ["user"],
    };

    const [formData, setFormData] = useState({
        userid: "",
        username: "",
        password: "",
        confirmPassword: "",
        userRole: "",
        selectedRoles: [],
        selectedControls: [
            "canCreateUsers",
            "canUpdateUsers",
            "canViewAllUsers",
            "canManageUsers",
        ],
    });

    const userRolesOptions = [
        "Virtual",
        "Personal",
        "International Personal",
        "International Virtual",
    ];

    const userControlItems = [
        { key: "canCreateUsers", label: "Create Users" },
        { key: "canUpdateUsers", label: "Update Users" },
        { key: "canDeleteUsers", label: "Delete Users" },
        { key: "canViewAllUsers", label: "View All Users" },
        { key: "canManageAdmins", label: "Manage Admins" },
        { key: "canManageResellers", label: "Manage Resellers" },
        { key: "canManageUsers", label: "Manage Users" },
        // { key: "canViewAnalytics", label: "View Analytics" },
        // { key: "canManageSettings", label: "Manage Settings" },
        // { key: "canManagePricingPlans", label: "Manage Pricing Plans" },
        // { key: "canViewSystemStats", label: "View System Stats" },
        { key: "canManageAllCampaigns", label: "Manage All Campaigns" },
        { key: "canManageAllReports", label: "Manage All Reports" },
        { key: "canManageAllGroups", label: "Manage All Groups" },
        { key: "canManageAllTemplates", label: "Manage All Templates" },
        { key: "canManageAllCredits", label: "Manage All Credits" },
        { key: "canManageAllDebits", label: "Manage All Debits" },
        { key: "canManageAllAPIKeys", label: "Manage All APIKeys" },
        { key: "hasUnlimitedCredits", label: "Unlimited Credits" }
    ];

    const roleKeyMap = {
        "Virtual": "virtual",
        "Personal": "personal",
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

    const generateUserControls = (selectedControls) => {
        return userControlItems.reduce((acc, control) => {
            acc[control.key] = selectedControls.includes(control.key);
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

    const handleUserControlCheckboxChange = (permission) => {
        setFormData((prev) => ({
            ...prev,
            selectedControls: prev.selectedControls.includes(permission)
                ? prev.selectedControls.filter((p) => p !== permission)
                : [...prev.selectedControls, permission],
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const { username, password, confirmPassword, userRole, selectedRoles, selectedControls } = formData;

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
            rolePermissions: generateUserControls(selectedControls),
        };

        try {
            setIsSubmitting(true);
            const response = await dispatch(createUser(payload));

            if (response?.success) {
                toast.success("User created successfully.");
                setFormData({
                    userid: "",
                    username: "",
                    password: "",
                    confirmPassword: "",
                    userRole: "",
                    selectedRoles: [],
                    selectedControls: []
                });
                navigate("/manage-user");
                dispatch(getAllUsers());
            }
        } catch (error) {
            // toast.error(error?.message || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderRoleOptions = () => {
        if (!user) return null;

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
                <div className="px-3 mt-8">
                    <div className="w-full py-2 bg-white rounded-lg flex">
                        <Link className="no-underline" to={"/manage-user"}>
                            <h1 className="text-2xl ss:text-xl md:text-xl text-start pl-4 md:pl-0 md:flex justify-center text-black font-semibold py-0 m-0 hover:underline underline-offset-4">
                                Manage User
                            </h1>
                        </Link>
                        <h1 className="text-2xl ss:text-xl md:text-xl text-start md:pl-0 md:flex justify-center text-black font-semibold py-0 m-0">
                            &nbsp;&gt;&nbsp;Add New User
                        </h1>
                    </div>
                    <div className="mt-3 py-3 px-6 bg-white w-full ">
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
                                    maxLength={15}
                                    minLength={5}
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
                                    <div className={`flex flex-col h-fit ${formData.userRole !== "user" ? 'w-fit md:min-h-fit min-h-full' : 'w-full'}`}>
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
                                    {userControlItems.length > 0 && formData.userRole !== "user" && (
                                        <div className="flex-1 h-full flex flex-col mb-4">
                                            <label className="text-lg font-medium text-black">Controls</label>
                                            <div className="mt-1 flex-1 border-2 border-black rounded-md p-2 overflow-auto grid smm:lg:grid-cols-1 lg:grid-cols-2 grid-cols-3 gap-x-4">
                                                {userControlItems.map((controls, index) => (
                                                    <div key={index} className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input mr-2 mt-0 border-black border-2"
                                                            id={`control-permission-${index}`}
                                                            value={controls.key}
                                                            checked={formData.selectedControls.includes(controls.key)}
                                                            onChange={() => handleUserControlCheckboxChange(controls.key)}
                                                        />
                                                        <label
                                                            className="form-check-label pt-0.5 whitespace-nowrap"
                                                            htmlFor={`control-permission-${index}`}
                                                        >
                                                            {controls.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button type="submit" className="w-full mt-4 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600">
                                {formData.userid ? "Update User" : "Create User"}
                            </button>
                        </form>
                    </div>
                </div>
            </section >
        </>
    );
}

export default AddNewUser