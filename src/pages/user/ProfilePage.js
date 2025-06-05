/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CreditHeader from '../../components/CreditHeader';
import profileDemoImg from '../../assets/profile.png';
import { getSecureItem } from '../utils/SecureLocalStorage';
import { changeUserPassword, uploadProfilePicture } from '../../redux/actions/authAction';
import DefaultImage from '../../assets/profile.png';
import 'react-toastify/dist/ReactToastify.css';
import { CampaignHeading, CampaignTitle } from '../utils/Index';

const ProfilePage = () => {
  const dispatch = useDispatch();

  const { user, error } = useSelector((state) => state.passwordChange);
  const { profileUploadError, uploadedProfilePicture } = useSelector((state) => state.uploadProfilePic);

  const userDetails = JSON.parse(getSecureItem('userData'));

  const [croppedImageUrl, setCroppedImageUrl] = useState(profileDemoImg);
  const [fetchCroppedImageUrl, setFetchCroppedImageUrl] = useState(profileDemoImg);
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '' });
  const [showCurrentPassword, setCurrentShowPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (uploadedProfilePicture) {
      toast.success('Profile picture uploaded successfully');
      setFetchCroppedImageUrl(`${process.env.REACT_APP_BASE_URL}${uploadedProfilePicture}`);
    }
    if (profileUploadError) {
      toast.error(profileUploadError);
    }
  }, [uploadedProfilePicture, profileUploadError]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => cropAndResizeImage(img, file);
    };
    reader.readAsDataURL(file);
  };

  const cropAndResizeImage = (img, file) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 720;
    const height = 720;

    const x = Math.max(0, (img.width - width) / 2);
    const y = Math.max(0, (img.height - height) / 2);

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
    setCroppedImageUrl(canvas.toDataURL());

    const formData = new FormData();
    formData.append('profilePicture', croppedImageUrl);
    dispatch(uploadProfilePicture(formData));
    console.log("Data foiund", formData, file, profileUploadError, uploadedProfilePicture, fetchCroppedImageUrl, croppedImageUrl);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  console.log("Data foiund of error", user, error);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) return toast.error('Please enter a new password');
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');

    const payload = { currentPassword, newPassword };
    dispatch(changeUserPassword(userDetails?.id, payload));;
  };

  return (
    <section className="w-full h-full bg-gray-200 flex flex-col min-h-[calc(100vh-70px)] pb-3">
      <CreditHeader />

      {/* <h2 className="text-2xl font-bold text-center">User Profile Page</h2> */}
      <div className='w-full mt-8'>
        <CampaignHeading campaignHeading={"User Profile Page"} />

        <div className="p-3 ">
          <div className="w-full min-h-screen py-3 bg-white">
            <form onSubmit={handleSubmit} className="px-10">
              <div className="flex md:flex-col gap-4 mb-4">
                <div className="flex justify-center items-center">
                  <div className="flex justify-center items-center">
                    <input
                      type="file"
                      accept="image/jpeg, image/jpg, image/png"
                      id="fileInput"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="fileInput" className="cursor-pointer">
                      <div className="w-40 h-40 bg-gray-200 p-2 shadow-md rounded-md overflow-hidden hover:opacity-90 transition">
                        <img
                          className="w-full h-full object-cover"
                          alt="Profile Picture Image"
                          src={croppedImageUrl || (userDetails?.profilePicture && userDetails?.profilePicture) || DefaultImage}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="username" className="block text-lg font-medium">Username</label>
                <input
                  type="text"
                  className="mt-1 block w-full border-2 text-lg bg-gray-200 cursor-not-allowed rounded-md p-2"
                  id="username"
                  name="username"
                  value={userDetails?.username || ''}
                  readOnly
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-lg font-medium">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    className="mt-1 block w-full text-lg border-2 rounded-md p-2"
                    id="currentPassword"
                    name="currentPassword"
                    placeholder="Type your current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    minLength={8}
                    required
                  />
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-5 cursor-pointer"
                    onClick={() => setCurrentShowPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-lg font-medium">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="mt-1 block w-full text-lg border-2 rounded-md p-2"
                    id="newPassword"
                    name="newPassword"
                    placeholder="Password must be 8 characters or more"
                    value={formData.newPassword}
                    onChange={handleChange}
                    minLength={8}
                    required
                  />
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-5 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-lg font-medium">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="mt-1 block w-full text-lg border-2 rounded-md p-2"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Enter Same Password again"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength={8}
                    required
                  />
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-5 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
