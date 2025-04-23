// src/components/PersonalCampaign.js
import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react'; // Import QRCode instead of QRCodeSVG
import UserMobileStatus from '../../../components/UserMobileStatus';
import CreateCampaign from '../../../components/CreateCampaign';

const PersonalCampaign = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const handleAddWhatsAppAccount = async () => {
    const header = {
      'Authorization': `${token}`,
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/api/add-whatsapp-account',
        { phoneNumber },
        { headers: header }
      );
      console.log(response?.data)
      if (response.data.qr) {
        setQrCode(response.data.qr);
        setStatus('Scan the QR code with your WhatsApp.');
        setError('');
      } else {
        setStatus(response.data.message);
        setError('');
      }
    } catch (err) {
      setError('Failed to add WhatsApp account.');
      setQrCode(null);
    }
  };

  return (
    <>
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-brand_color" style={{fontSize:"32px"}}>Add WhatsApp Account</h1>
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-1 block w-full border border-b_color rounded-md shadow-sm focus:border-brand_color focus:ring-brand_color sm:text-sm"
          placeholder="Enter Indian phone number"
        />
      </div>
      <button
        onClick={handleAddWhatsAppAccount}
        className="w-full bg-brand_color text-white py-2 px-4 bg-brand_colors rounded-md hover:bg-brand_color_2 focus:outline-none focus:ring-2 focus:ring-brand_color_2 focus:ring-offset-2"
      >
        Add WhatsApp Account
      </button>
      {qrCode && (
        <div className="mt-4">
          <QRCodeSVG value={qrCode} />
        </div>
      )}
      {status && (
        <div className={`mt-4 p-4 ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} border border-${error ? 'red' : 'green'}-300 rounded-md`}>
          {error ? error : status}
        </div>
      )}
    </div>
    <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <UserMobileStatus/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <CreateCampaign/>
    </>
  );
};

export default PersonalCampaign;
