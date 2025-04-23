import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserMobileStatus = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMobileStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/user-mobile-status', {
          headers: {
            'Authorization': `${token}`
          }
        });
        setSessions(response?.data?.UserStatus);
      } catch (err) {
        setError('Failed to fetch mobile status');
      }
    };

    fetchMobileStatus();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-brand_color">WhatsApp Mobile Status</h1>
      {error ? (
        <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Data</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions?.map((session) => (
                <tr key={session._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session?.number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session?.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserMobileStatus;
