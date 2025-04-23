import React, { useState } from 'react';
import axios from 'axios';

const PersonalCampaign = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [mediaUrl, setMediaUrl] = useState(''); // Updated to handle URL instead of file
  const [numbers, setNumbers] = useState('');
  const [selectedNumber, setSelectedNumber] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isLoading,setisLoading]=useState(false)
  const token = localStorage.getItem('token');

  const handleCreateCampaign = async () => {
    setisLoading(true)
    const header = {
      'Authorization': `${token}`,
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/api/create-campaign',
        {
          name,
          message,
          mediaPath: mediaUrl, // Send media URL instead of file path
          numbers: numbers.split(',').map((num) => num.trim()), // Convert numbers string to an array
          selectedNumber,
        },
        { headers: header }
      );

      console.log(response?.data);
      setStatus(response.data.message);
      setisLoading(false)
      setError('');
      if(response.data.message==="Campaign created and messages processed"){
       window.location.reload() 
      }
    } catch (err) {
      setError('Failed to create campaign.');
      setStatus('');
      setisLoading(false)
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-brand_color">Create WhatsApp Campaign</h1>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Campaign Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border rounded-md shadow-sm focus:border-brand_color focus:ring-brand_color sm:text-sm"
          placeholder="Enter campaign name"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full border rounded-md shadow-sm focus:border-brand_color focus:ring-brand_color sm:text-sm"
          placeholder="Enter your message"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="mediaUrl" className="block text-sm font-medium text-gray-700">Media URL</label>
        <input
          type="text"
          id="mediaUrl"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          className="mt-1 block w-full border rounded-md shadow-sm focus:border-brand_color focus:ring-brand_color sm:text-sm"
          placeholder="Enter media URL"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="numbers" className="block text-sm font-medium text-gray-700">Phone Numbers</label>
        <input
          type="text"
          id="numbers"
          value={numbers}
          onChange={(e) => setNumbers(e.target.value)}
          className="mt-1 block w-full border rounded-md shadow-sm focus:border-brand_color focus:ring-brand_color sm:text-sm"
          placeholder="Enter comma-separated phone numbers"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="selectedNumber" className="block text-sm font-medium text-gray-700">Your WhatsApp Number</label>
        <input
          type="text"
          id="selectedNumber"
          value={selectedNumber}
          onChange={(e) => setSelectedNumber(e.target.value)}
          className="mt-1 block w-full border rounded-md shadow-sm focus:border-brand_color focus:ring-brand_color sm:text-sm"
          placeholder="Enter your WhatsApp number"
        />
      </div>
      <button
        onClick={handleCreateCampaign}
        className="w-full bg-brand_color text-white py-2 px-4 rounded-md hover:bg-brand_color_2 focus:outline-none focus:ring-2 focus:ring-brand_color_2 focus:ring-offset-2 bg-brand_colors"
      >
      {isLoading?"Loading....":"Create Campaign"}
      </button>
      {status && (
        <div className={`mt-4 p-4 ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} border border-${error ? 'red' : 'green'}-300 rounded-md`}>
          {error ? error : status}
        </div>
      )}
    </div>
  );
};

export default PersonalCampaign;
