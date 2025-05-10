/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from 'react'
import CreditHeader from '../../components/CreditHeader'
import profileDemoImg from '../../assets/profile.png'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [croppedImageUrl, setCroppedImageUrl] = useState(profileDemoImg || '');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          cropAndResizeImage(img);
        };
      };
      reader.readAsDataURL(file);
    }
  };  

  const cropAndResizeImage = (img) => {
    // Create a canvas to crop and resize the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Define the desired width and height (24x24 in this case)
    const width = 720; // 24x24 rem based on your Tailwind classes
    const height = 720;

    // Calculate the center of the image to crop it (if it's larger than 24x24)
    const x = (img.width - width) / 2;
    const y = (img.height - height) / 2;

    // Set the canvas size to the crop size
    canvas.width = width;
    canvas.height = height;

    // Draw the image on the canvas with the cropping values
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

    // Get the data URL for the cropped and resized image
    const croppedImageUrl = canvas.toDataURL();
    setCroppedImageUrl(croppedImageUrl);
  };


  const [formData, setFormData] = useState({
    userid: "",
    username: "",
    password: "",
    croppedImageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    if (!formData.password.length || formData.password.length <= 6 || formData.selectedRoles.length === 0) {
      return toast.error("Password and User Permissions are required!");
    }

    // const payload = {
    //   username: formData.username,
    //   password: formData.password,
    //   role: formData.userRole,
    //   permission: formData.selectedRoles,
    //   // parentuser_id: user?.userid,
    //   email: "example11@gmail.com",
    //   firstName: "Amansingh",
    //   lastName: "Chauhan",
    //   mobileNumber: "9234234234",
    // };
    try {
      // Dispatch Redux action to create the user
      // await dispatch(createUser(payload)); // Wait until it's done

      setFormData({
        userid: "",
        username: "",
        password: "",
        croppedImageUrl: "",
      });
    } catch (error) {
      // No need for toast here since it's handled in the action
      console.error("Error dispatching createUser:", error);
    }
  };

  return (
    <div>
      <CreditHeader />
      <div className='p-4 bg-gray-200'>
        <div className='w-full min-h-screen h-full py-4 bg-white'>
          <h2 className='w-full text-2xl font-bold text-center m-0'>Users Profile Page</h2>
          <form onSubmit={handleSubmit} className="w-full px-10 pt-4">
            {/* Profile Img Container */}
            <div className="flex md:flex-col gap-4 w-full mb-4">
              <div className='md:w-full flex justify-center items-center'>
                <div className="w-40 h-40 bg-gray-200 flex items-center justify-center p-2 shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
                  <img
                    className="w-full h-full object-cover"
                    alt="Profile Image"
                    src={croppedImageUrl || '/default-avatar.png'}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 w-80 md:w-full md:justify-center justify-start ">
                <input
                  type="file"
                  accept="image/jpeg, image/jpg, image/png"
                  id="fileInput"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="fileInput"
                  className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold text-center text-xl cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Upload
                </label>
                {/* <span className="w-full text-center text-black m-0 border-none text-xl font-semibold px-4 py-2 rounded-md bg-gray-400 cursor-not-allowed">
                  User Name
                </span> */}
              </div>
            </div>
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
                readOnly
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
            <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600">
              {formData.userid ? "Update User" : "Submit your Details"}
            </button>
          </form>
        </div >
      </div >
    </div >
  )
}

export default ProfilePage