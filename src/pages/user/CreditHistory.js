import { useDispatch, useSelector } from "react-redux";
import { CampaignHeading, CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton, RecordsPerPageDropdown } from "../utils/Index"
import { useEffect, useMemo, useState } from "react";
import { getSecureItem } from "../utils/SecureLocalStorage";
import useIsMobile from "../../hooks/useMobileSize";
import { getAllUsers } from "../../redux/actions/authAction";
import CreditHeader from "../../components/CreditHeader";

const CreditManagement = ({ isOpen }) => {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();

  const [recordsPerPage, setRecordsPerPage] = useState(25);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: '_id', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');

  const { loading, users, error } = useSelector((state) => state.userCreate);

  useEffect(() => {
    dispatch(getAllUsers());
    // console.log("Set Filtered User", filteredUsers);
  }, [dispatch]);

  useEffect(() => {
    setFilteredUsers(users || []);
  }, [users]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const headers = [
    { key: '_id', label: 'User ID' },
    { key: 'username', label: 'Username' },
    { key: 'role', label: 'User Role' },
    { key: 'firstName', label: 'Firstname (usertype)' },
    { key: 'updatedAt', label: 'Last Updated' },
  ];

  const renderRow = (log, index) => (
    <tr key={index} className="text-black border border-gray-700 hover:bg-gray-500 whitespace-nowrap ">
      <td className="px-2 py-2 border text-[1rem] border-gray-900 w-20">{log?._id.slice(-5) || '-'}</td>
      <td className="px-2 py-2 border text-[1rem] border-gray-900">{log?.username || '-'}</td>
      <td className="px-2 py-2 border text-[1rem] border-gray-900">{log?.role || '-'}</td>
      <td className="px-2 py-2 border text-[1rem] border-gray-900">{log?.firstName || '-'}</td>
      {/* <td className="px-2 py-2 border text-[1rem] border-gray-900">{new Date(log?.updatedAt).toLocaleDateString('en-GB')}</td> */}
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

  const filteredAndSortedLogs = useMemo(() => {
    let filtered = filteredUsers;

    if (searchTerm.trim()) {
      filtered = filtered.filter(user =>
        user?.username?.toLowerCase().includes(searchTerm)
      );
    }

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        // Handle string vs number comparison
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        // Default fallback
        return 0;
      });
    }

    return filtered;
  }, [filteredUsers, searchTerm, sortConfig]);

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

  return (
    <section className='w-[100%] bg-gray-200 h-full min-h-[calc(100vh-70px)] flex flex-col pb-3 '>
      <CreditHeader />
      <div className="w-full mt-8">
        <CampaignHeading campaignHeading={"Credit History"} />
        <div className='px-3 pt-3'>
          <div className='bg-white border-t border-[#383387] pb-3 w-full'>
            <div className="container-fluid px-3 p-0">
              <div className="pt-3">
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
                  <div className={`min-w-max`}>
                    <div className="flex justify-between mb-3 gap-3 md:flex-col">
                      <div className="flex gap-3 md:justify-center ">
                        <CopyToClipboard headers={headers} data={filteredAndSortedLogs} />
                        <DownloadCSVButton headers={headers} dataLogs={filteredAndSortedLogs} />
                        <DownloadPDFButton headers={headers} dataLogs={filteredAndSortedLogs} />
                      </div>
                      <div className="flex justify-end gap-3 ">
                        <div className="relative">
                          <input
                            type="text"
                            className="form-control border border-black py-2"
                            placeholder="Search User by Name"
                            value={searchTerm}
                            onChange={handleSearch}
                          />
                          {searchTerm && (
                            <button
                              type="button"
                              onClick={() => setSearchTerm('')}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 bg-white px-1 hover:text-black"
                            >
                              ❌
                            </button>
                          )}
                        </div>
                        <RecordsPerPageDropdown
                          recordsPerPage={recordsPerPage}
                          setRecordsPerPage={setRecordsPerPage}
                          setCurrentPage={setCurrentPage}
                        />
                        <div className="flex flex-row whitespace-nowrap md:justify-center justify-end gap-3 align-items-center ">
                          <button
                            className="btn btn-dark py-2"
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                          >
                            &lt;
                          </button>
                          <div className="">
                            {indexOfFirstRecord + 1} -{' '}
                            {Math.min(indexOfLastRecord, filteredUsers.length)} of{' '}
                            {filteredUsers.length}
                          </div>
                          <button
                            className="btn btn-dark py-2"
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                          >
                            &gt;
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className={`w-full bg-gray-300 flex-shrink-0 overflow-auto custom-horizontal-scroll select-text h-full ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-64px)]"}`}>
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
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreditManagement