/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useRef, useState } from 'react';
import useIsMobile from '../../../../hooks/useMobileSize';
import '../commonCSS.css'
import { CampaignHeading, CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton, RecordsPerPageDropdown } from '../../../utils/Index';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const ReportCampaign = ({ isOpen }) => {
  const textareaRef = useRef(null);
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [allCampaign, setAllCampaign] = useState();
  const [sortConfig, setSortConfig] = useState({ key: 'lastUpdated', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(25);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dummyData = [
    {
      date_time: "2025-06-10 09:00:00",
      name: "Campaign Alpha",
      sender: "SenderX",
      template: "Template A",
      route: "Transactional",
      submitted: 1000,
      delivered: 980,
      awaited: 10,
      failed: 10,
      read: 750,
      credits: 120,
      price: 60.00,
      dlr_percent: "98%",
      status: "Completed",
      campaign_action: "Follow-up"
    },
    {
      date_time: "2025-06-09 15:30:00",
      name: "Campaign Beta",
      sender: "SenderY",
      template: "Template B",
      route: "Promotional",
      submitted: 800,
      delivered: 760,
      awaited: 25,
      failed: 15,
      read: 540,
      credits: 100,
      price: 48.00,
      dlr_percent: "95%",
      status: "Completed",
      campaign_action: "Reminder"
    },
    {
      date_time: "2025-06-08 11:45:00",
      name: "Campaign Gamma",
      sender: "SenderZ",
      template: "Template C",
      route: "Transactional",
      submitted: 1200,
      delivered: 1170,
      awaited: 20,
      failed: 10,
      read: 880,
      credits: 130,
      price: 65.00,
      dlr_percent: "97.5%",
      status: "Completed",
      campaign_action: "Survey"
    },
    {
      date_time: "2025-06-07 18:20:00",
      name: "Campaign Delta",
      sender: "SenderA",
      template: "Template D",
      route: "Promotional",
      submitted: 600,
      delivered: 570,
      awaited: 10,
      failed: 20,
      read: 410,
      credits: 90,
      price: 44.00,
      dlr_percent: "95%",
      status: "Completed",
      campaign_action: "Feedback"
    },
    {
      date_time: "2025-06-06 08:10:00",
      name: "Campaign Epsilon",
      sender: "SenderB",
      template: "Template E",
      route: "Transactional",
      submitted: 1500,
      delivered: 1450,
      awaited: 30,
      failed: 20,
      read: 1000,
      credits: 160,
      price: 75.00,
      dlr_percent: "96.7%",
      status: "Completed",
      campaign_action: "None"
    }
  ];

  const headers = [
    { key: "date_time", label: "Date Time" },
    { key: "name", label: "Name" },
    { key: "sender", label: "Sender" },
    { key: "template", label: "Template" },
    { key: "route", label: "Route" },
    { key: "submitted", label: "Submitted" },
    { key: "delivered", label: "Delivered" },
    { key: "awaited", label: "Awaited" },
    { key: "failed", label: "Failed" },
    { key: "read", label: "Read" },
    { key: "credits", label: "Credits" },
    { key: "price", label: "Price" },
    { key: "dlr_percent", label: "DLR %" },
    { key: "status", label: "Status" },
    { key: "campaign_action", label: "Campaign Action" }
  ];

  const renderRow = (log, index) => {
    return (
      <tr key={index} className="text-black border border-gray-700 hover:bg-gray-500 whitespace-nowrap">
        <td className="px-2 py-2 border border-gray-900">
          {log.date_time
            ? new Date(log.date_time).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
            : '-'}
        </td>
        <td className="px-2 py-2 border border-gray-900">{log.name || '-'}</td>
        <td className="px-2 py-2 border border-gray-900">{log.sender || '-'}</td>
        <td className="px-2 py-2 border border-gray-900">{log.template || '-'}</td>
        <td className="px-2 py-2 border border-gray-900">{log.route || '-'}</td>
        <td className="px-2 py-2 border border-gray-900">{log.submitted ?? '-'}</td>
        <td className="px-2 py-2 border border-gray-900">{log.delivered ?? '-'}</td>
        <td className="px-2 py-2 border border-gray-900">{log.awaited ?? '-'}</td>
        <td className="px-2 py-2 border border-gray-900">{log.failed ?? '-'}</td>
        <td className="px-2 py-2 border border-gray-900">{log.read ?? '-'}</td>
        <td className="px-2 py-2 border border-gray-900">{log.credits ?? '-'}</td>
        <td className="px-2 py-2 border border-gray-900">{log.price ?? '-'}</td>
        <td className="px-2 py-2 border border-gray-900">{log.dlr_percent || '-'}</td>
        <td className="px-2 py-2 border border-gray-900">{log.status || '-'}</td>
        <td className="px-2 py-2 border border-gray-900">{log.campaign_action || '-'}</td>
      </tr>
    );
  };

  const filteredAndSortedLogs = useMemo(() => {
    if (!Array.isArray(dummyData)) return [];

    const term = searchTerm.toLowerCase().trim();

    // const filtered = allCampaign.filter(log => {
    const filtered = dummyData.filter(log => {
      if (!log) return false;
      const name = log?.name?.toLowerCase() || '';

      return name.includes(term)
    }) || [];

    // Sorting logic
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = (a?.[sortConfig.key] || '').toString().toLowerCase();
        const bVal = (b?.[sortConfig.key] || '').toString().toLowerCase();

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [allCampaign, dummyData, searchTerm, sortConfig]);


  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredAndSortedLogs.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalRecords = filteredAndSortedLogs.length;
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedLogs.length / recordsPerPage));


  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(totalRecords / recordsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <section className={`h-full bg-gray-200 flex flex-col min-h-[calc(100vh-70px)] pb-3  ${!isMobile ? isOpen ? "w-[calc(100vw-242px)]" : "w-[calc(100vw-90px)]" : "left-0 w-full"} `} >

      <div className='w-full mt-8'>
        <CampaignHeading campaignHeading="Campaign Logs" />
        <div className="w-full mt-3 px-3">
          {/* Data Table */}
          <div className="flex flex-col bg-white border border-black p-3 rounded-md min-h-fit">
            {/* {loading ? (
                                     <div className="text-center my-4">
                                         <div className="spinner-border text-dark" role="status">
                                             <span className="visually-hidden">Loading...</span>
                                         </div>
                                     </div>
                                 ) : error ? (
                                     <div className="text-center text-red-600 my-4 font-semibold">
                                         {"Transactions Unable to Fetch" || error}
                                     </div>
                                 ) : ( */}
            <div>
              <div className="flex md:justify-start justify-between gap-3 md:flex-col pb-3 ">
                <div className="flex gap-3  ">
                  <CopyToClipboard headers={headers} data={dummyData} />
                  <DownloadCSVButton headers={headers} dataLogs={dummyData} />
                  <DownloadPDFButton headers={headers} dataLogs={dummyData} />
                </div>
                <div className='flex justify-end gap-3'>
                  <RecordsPerPageDropdown
                    recordsPerPage={recordsPerPage}
                    setRecordsPerPage={setRecordsPerPage}
                    setCurrentPage={setCurrentPage}
                  />
                  <div className="relative md:w-full  max-w-[300px]">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="p-2 pr-8 w-full border border-black rounded-md"
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
                  <div className="flex flex-row whitespace-nowrap md:justify-center justify-end gap-3 align-items-center ">
                    <button
                      className="btn btn-dark py-2"
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </button>
                    <div className="">
                      {indexOfFirstRecord + 1} - {' '}
                      {Math.min(indexOfLastRecord, filteredAndSortedLogs?.length)} of {' '}
                      {filteredAndSortedLogs?.length}
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
              <div className={` w-full bg-gray-300 flex-shrink-0 overflow-x-auto custom-horizontal-scroll select-text h-fit ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-64px)]"}`}>
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
            {/* )} */}
          </div>
          {/* {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
        <div className="text-center text-red-600 text-xl font-semibold">Something went wrong!!</div>
        ) : ( */}
        </div>
      </div>
    </section>
  );
};

export default ReportCampaign;
