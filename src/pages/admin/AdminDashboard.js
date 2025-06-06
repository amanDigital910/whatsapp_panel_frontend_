import React, { useEffect, useMemo, useState } from 'react'
import { AdminSVGComponent, ResellerSVGComponent, UserSVGComponent } from '../../assets/index.js';
import { useDispatch, useSelector } from 'react-redux';
import useIsMobile from '../../hooks/useMobileSize';
import { getAllUsers } from '../../redux/actions/authAction';
import { CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton, RecordsPerPageDropdown } from '../utils/Index';

const AdminDashboard = ({ isOpen }) => {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();

  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [resellerCount, setResellerCount] = useState(0);
  const [activeTab, setActiveTab] = useState('admin');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: '_id', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');

  const { loading, users, error } = useSelector((state) => state.userCreate);

  const headers = [
    { key: '_id', label: 'User ID' },
    { key: 'username', label: 'Username' },
    { key: 'role', label: 'User Role' },
    { key: 'firstName', label: 'Firstname (usertype)' },
    { key: 'updatedAt', label: 'Last Updated' },
  ];

  const renderRow = (log, index) => (
    <tr key={index} className="text-black border border-gray-700 hover:bg-gray-500 whitespace-nowrap">
      <td className="px-2 py-2 border text-[1rem] border-gray-900 w-20">
        {log?._id?.slice(-5) || '-'}
      </td>
      <td className="px-2 py-2 border text-[1rem] border-gray-900">
        {log?.username || '-'}
      </td>
      <td className="px-2 py-2 border text-[1rem] border-gray-900">
        {log?.role || '-'}
      </td>
      <td className="px-2 py-2 border text-[1rem] border-gray-900">
        {log?.firstName || '-'}
      </td>
      <td className="px-2 py-2 border text-[1rem] border-gray-900">
        {new Date(log?.updatedAt).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}
      </td>
    </tr>
  );

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const userTabs = [
    {
      label: 'Admin',
      route: 'admin',
      icon: (isActive) => <AdminSVGComponent color={isActive ? "#fff" : "#000"} />,
      count: adminCount,
    },
    {
      label: 'Reseller',
      route: 'reseller',
      icon: (isActive) => <ResellerSVGComponent color={isActive ? "#fff" : "#000"} />,
      count: resellerCount,
    },
    {
      label: 'User',
      route: 'user',
      icon: (isActive) => <UserSVGComponent color={isActive ? "#fff" : "#000"} />,
      count: userCount,
    },
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredAndSortedLogs = useMemo(() => {
    if (!users) return [];

    // Filter by active tab first
    const roleFiltered = users.filter(user => user?.role?.toLowerCase() === activeTab);

    // Then filter by search term
    const term = searchTerm.trim();
    const searched = term
      ? roleFiltered.filter(user =>
        user?.username?.toLowerCase().includes(term))
      : roleFiltered;

    // Finally sort
    return [...searched].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal == null || bVal == null) return 0;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // Handle dates
      if (sortConfig.key === 'updatedAt') {
        const dateA = new Date(aVal);
        const dateB = new Date(bVal);
        return sortConfig.direction === 'asc'
          ? dateA - dateB
          : dateB - dateA;
      }

      return 0;
    });
  }, [searchTerm, users, sortConfig, activeTab]);

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredAndSortedLogs.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedLogs.length / recordsPerPage));

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Counter animation
  useEffect(() => {
    if (!users) return;

    const counters = {
      admin: 0,
      user: 0,
      reseller: 0
    };

    // Count users by role
    users.forEach(user => {
      if (user?.role) {
        counters[user.role.toLowerCase()]++;
      }
    });

    const interval = setInterval(() => {
      let allDone = true;

      if (adminCount < counters.admin) {
        setAdminCount(prev => Math.min(prev + 5, counters.admin));
        allDone = false;
      }

      if (userCount < counters.user) {
        setUserCount(prev => Math.min(prev + 5, counters.user));
        allDone = false;
      }

      if (resellerCount < counters.reseller) {
        setResellerCount(prev => Math.min(prev + 5, counters.reseller));
        allDone = false;
      }

      if (allDone) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [adminCount, resellerCount, userCount, users]);

  return (
    <>
      <div className='flex flex-col pb-3 bg-gray-200 min-h-[calc(100vh-70px)]'>
        <div className="flex gap-4 mb-4 mt-8 md:flex-col items-center justify-center">
          {userTabs.map((tab) => (
            <button
              key={tab.route}
              onClick={() => setActiveTab(tab.route)}
              className={`w-52 md:w-72 rounded-xl shadow-md transition-all duration-300 ${activeTab === tab.route ? 'bg-[#406dc7] text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
            >
              <div className="flex items-center p-4">
                {/* Icon */}
                <div className={`mr-4 flex-shrink-0 ${activeTab === tab.route ? "text-white" : "text-black"}`}>
                  {/* <img src={tab.icon} alt={tab.label} className="w-10 h-10 object-contain" /> */}
                  {tab.icon(activeTab === tab.route)}
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
                  <CopyToClipboard headers={headers} data={currentRecords} />
                  <DownloadCSVButton headers={headers} dataLogs={currentRecords} />
                  <DownloadPDFButton headers={headers} dataLogs={currentRecords} />
                </div>

                <div className="flex md:flex-col md:justify-center justify-end gap-3 items-center ">
                  <input
                    type="text"
                    className="form-control py-2 border border-black"
                    placeholder="Search User by Name"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <RecordsPerPageDropdown
                    recordsPerPage={recordsPerPage}
                    setRecordsPerPage={setRecordsPerPage}
                    setCurrentPage={setCurrentPage}
                  />
                  <div className='flex flex-row gap-3 items-center'>
                    <button
                      className="btn btn-dark py-2 text-2xl"
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </button>

                    <div className='flex flex-row whitespace-nowrap'>
                      {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, filteredAndSortedLogs.length)} of {filteredAndSortedLogs.length}
                    </div>

                    <button
                      className="btn btn-dark py-2 text-2xl"
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
              <div className={`w-full bg-gray-200 flex-shrink-0 overflow-auto custom-horizontal-scroll select-text h-full ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-50px)]"}`}>
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