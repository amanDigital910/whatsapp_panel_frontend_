import React, { useEffect, useMemo, useState } from 'react'
import Admin from '../../assets/icons/user-setting.png';
import User from '../../assets/icons/user.png';
import Reseller from '../../assets/icons/social (1).png';
import { useDispatch, useSelector } from 'react-redux';
import { getSecureItem } from '../utils/SecureLocalStorage';
import useIsMobile from '../../hooks/useMobileSize';
import { getAllUsers } from '../../redux/actions/authAction';
import { CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton } from '../utils/Index';

const AdminDashboard = ({ isOpen }) => {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();

  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [resellerCount, setResellerCount] = useState(0);
  const [activeTab, setActiveTab] = useState('admin');
  const [filteredUsers, setFilteredUsers] = useState([]);
  // const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const [sortConfig, setSortConfig] = useState({ key: '_id', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');

  const { loading, users, error } = useSelector((state) => state.userCreate);

  const headers = [
    { key: '_id', label: 'User ID' },
    { key: 'username', label: 'Username' },
    { key: 'role', label: 'User Role' },
    { key: 'firstName', label: 'Firstname (usertype)' },
    { key: 'updatedAt', label: 'Last Login' },
  ];

  const renderRow = (log, index) => (
    <tr key={index} className="text-black border border-gray-700 hover:bg-gray-500 whitespace-nowrap ">
      <td className="px-2 py-2 border text-[1rem] border-gray-900 w-20">{log?._id.slice(-5) || '-'}</td>
      <td className="px-2 py-2 border text-[1rem] border-gray-900">{log?.username || '-'}</td>
      <td className="px-2 py-2 border text-[1rem] border-gray-900">{log?.role || '-'}</td>
      <td className="px-2 py-2 border text-[1rem] border-gray-900">{log?.firstName || '-'}</td>
      <td className="px-2 py-2 border text-[1rem] border-gray-900">{new Date(log?.updatedAt).toLocaleDateString('en-GB')}</td>
    </tr>
  );

  useEffect(() => {
    setFilteredUsers(users?.data || []);
  }, [users]);

  useEffect(() => {
    dispatch(getAllUsers());
    // console.log("Set Filtered User", filteredUsers);
  }, [dispatch]);

  // Counter logic using useEffect
  useEffect(() => {
    const incrementCount = (target, setCount) => {
      let current = 0;
      const interval = setInterval(() => {
        current += 5; // Increment by 5
        if (current >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(current);
        }
      }, 50); // Update every 50ms
    };

    incrementCount(150, setAdminCount); // Admin's counter
    incrementCount(110, setUserCount); // User's counter
    incrementCount(100, setResellerCount); // Reseller's counter
  }, []);

  const userTabs = [
    {
      label: 'Admin',
      route: 'admin',
      icon: Admin,
      count: adminCount,
    },
    {
      label: 'Reseller',
      route: 'reseller',
      icon: Reseller,
      count: resellerCount,
    },
    {
      label: 'User',
      route: 'user',
      icon: User,
      count: userCount,
    },
  ];

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
  };

  const filteredAndSortedLogs = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    // Filter by role
    const roleFiltered = filteredUsers.filter(user => user.role === activeTab);

    // Filter by search term
    const searched = roleFiltered.filter(user =>
      user?.username?.toLowerCase().includes(term)
    );

    // Sort
    if (sortConfig.key) {
      return [...searched].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
    }

    return searched;
  }, [searchTerm, filteredUsers, sortConfig, activeTab]);


  console.log("Users Data", filteredAndSortedLogs);


  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredAndSortedLogs.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredAndSortedLogs.length / recordsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <>
      <div className='flex flex-col pb-3 bg-gray-200'>
        <div className="flex gap-4 mb-4 mt-8 md:flex-col items-center justify-center">
          {userTabs.map((tab) => (
            <button
              key={tab.route}
              onClick={() => setActiveTab(tab.route)}
              className={`w-52 md:w-72 rounded-xl shadow-md transition-all duration-300 ${activeTab === tab.route ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
            >
              <div className="flex items-center p-4">
                {/* Icon */}
                <div className="mr-4 flex-shrink-0">
                  <img src={tab.icon} alt={tab.label} className="w-10 h-10 object-contain" />
                </div>

                {/* Label and Count */}
                <div className="flex flex-col items-start justify-center">
                  <h5 className={`text-lg font-semibold m-0 ${activeTab === tab.route ? 'text-white' : 'text-gray-800'}`}>
                    {tab.label}
                  </h5>
                  <p className={`text-xl font-bold m-0 ${activeTab === tab.route ? 'text-white' : 'text-gray-600'}`}>
                    {tab.count}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="py-3 border-t border-[#383387] mx-3 bg-white">
          {loading ? (
            <div className="text-center my-4">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 my-4 font-semibold">
              {error}
            </div>) : (
            <div className={`min-w-full px-3`}>
              <div className="flex justify-between mb-3 gap-3 md:flex-col">
                <div className="flex gap-3 md:justify-center ">
                  <CopyToClipboard headers={headers} data={filteredAndSortedLogs} />
                  <DownloadCSVButton headers={headers} dataLogs={filteredAndSortedLogs} />
                  <DownloadPDFButton headers={headers} dataLogs={filteredAndSortedLogs} />
                </div>

                <div className="flex md:flex-col md:justify-center justify-end gap-3 items-center ">
                  <div className="flex justify-end ">
                    <input
                      type="text"
                      className="form-control me-2 border border-black"
                      placeholder="Search User by Name"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  <div className='flex gap-3 items-center'>
                    <button
                      className="btn btn-dark"
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </button>

                    <div>
                      {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, filteredAndSortedLogs.length)} of {filteredAndSortedLogs.length}
                    </div>

                    <button
                      className="btn btn-dark"
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
              <div className={`w-full bg-gray-100 flex-shrink-0 overflow-auto custom-horizontal-scroll select-text h-full ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-50px)]"}`}>
                <CustomizeTable
                  headers={headers}
                  emptyMessage='No transaction logs available.'
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  renderRow={renderRow}
                  data={currentRecords}
                  className="table-auto border-collapse"
                  theadClassName="px-4 py-2 text-left cursor-pointer select-none whitespace-nowrap"
                  rowClassName=''
                // className="text-center py-3 text-lg font-semibold"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminDashboard