/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreditHeader from "../../components/CreditHeader";
import { CampaignHeading, CampaignStatus, CampaignTitle, CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton, WhatsappTextNumber } from "../utils/Index";
import useIsMobile from "../../hooks/useMobileSize";
import 'react-toastify/dist/ReactToastify.css';
import './whatsapp_offical/commonCSS.css'

const GroupCampaign = ({ isOpen }) => {
  const [groupName, setGroupName] = useState("");
  const [groupNub, setGroupNum] = useState("");
  const [feedback, setFeedback] = useState("");
  const [group, setGroup] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [editingId, setEditingId] = useState(null);
  const isMobile = useIsMobile();
  const [usersList, setUsersList] = useState([]); // List of users fetched from the API

  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [whatsAppNumbers, setWhatsAppNumbers] = useState("");
  const [statsNumber, setStatsNumber] = useState({
    total: 0,
    valid: 0,
    invalid: 0,
    duplicates: 0,
  });

  const dummyData = [
    {
      id: 1,
      groupName: "john_doe",
      balanceType: "Savings",
      groupNumber: 150075,
      groupDate: "2025-04-28",
    },
    {
      id: 2,
      groupName: "jane_smith",
      balanceType: "Checking",
      groupNumber: 23480,
      groupDate: "2025-05-01",
    },
    {
      id: 3,
      groupName: "michael_lee",
      balanceType: "Savings",
      groupNumber: 98760,
      groupDate: "2025-04-15",
    },
    {
      id: 1,
      groupName: "john_doe",
      balanceType: "Savings",
      groupNumber: 150075,
      groupDate: "2025-04-28",
    },
    {
      id: 2,
      groupName: "jane_smith",
      balanceType: "Checking",
      groupNumber: 23480,
      groupDate: "2025-05-01",
    },
    {
      id: 3,
      groupName: "michael_lee",
      balanceType: "Savings",
      groupNumber: 98760,
      groupDate: "2025-04-15",
    },
    {
      id: 4,
      groupName: "emily_watson",
      balanceType: "Investment",
      groupNumber: 1500000,
      groupDate: "2025-03-30",
    },
    {
      id: 5,
      groupName: "david_clark",
      balanceType: "Checking",
      groupNumber: 51235,
      groupDate: "2025-05-05",
    },
  ];

  const headers = [
    { key: 'id', label: 'Id' },
    { key: 'groupName', label: 'Group Name' },
    { key: 'groupNumber', label: 'Group Number' },
    { key: 'groupDate', label: 'Date' },
    { key: 'action', label: 'Action' }
  ];

  const handleEdit = (log) => {
    setGroupName(log.groupName);
    setGroupNum(log.groupNumber);
    setEditingId(log.id); // This is key
  };

  const handleDeleteClick = (log) => {
    const updatedGroup = group.filter(item => item.id !== log.id);
    setGroup(updatedGroup);
    toast.success("Group deleted!");
  };

  const saveTemplate = async () => {
    if (!groupName || !groupNub) {
      setFeedback("All fields are required.");
      toast.error("All fields are required.");
      return;
    } else {
      setFeedback("")
    }

    const newTemplate = {
      id: editingId || Date.now(), // Use real ID if editing, or temp one if new
      groupName,
      groupNumber: groupNub,
      groupDate: new Date().toISOString().split("T")[0], // Default today
    };

    if (editingId) {
      // Update mode
      const updatedList = group.map((item) =>
        item.id === editingId ? newTemplate : item
      );
      setGroup(updatedList);
      toast.success("Group updated!");
    } else {
      // Create mode
      setGroup([...group, newTemplate]);
      toast.success("Group added!");
    }

    // Reset form
    setGroupName("");
    setGroupNum("");
    setEditingId(null);
  };


  const renderRow = (log, index) => (
    <tr key={index} className="text-black border border-gray-700 hover:bg-gray-500 whitespace-nowrap">
      <td className="px-2 py-2 border border-gray-900">{log.id}</td>
      <td className="px-2 py-2 border border-gray-900">{log.groupName}</td>
      <td className="px-2 py-2 border border-gray-900">{log.groupNumber || '-'}</td>
      <td className="px-2 py-2 border border-gray-900 ">{log.groupDate}</td>
      <td className="px-2 py-2 flex justify-center items-center h-full w-full min-w-32">
        <div className="flex items-center justify-center gap-2 flex-1 max-h-full">
          <button
            className="bg-[#ffc107] rounded-md py-1 px-2 text-base font-medium me-2"
            onClick={() => { handleEdit(log) }}
          >
            Edit
          </button>

          <button
            className="bg-[#ff0000] rounded-md py-1 px-2 text-base font-medium text-white"
            onClick={() => handleDeleteClick(log)} // Pass the whole user
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );

  const filteredAndSortedLogs = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    const filtered = dummyData.filter(log => {
      // Search term filter (matches phone, campaign, status, or read status)
      const matchesSearch =
        log.groupName.includes(term);
      // log.campaignName.toLowerCase().trim().includes(term) ||
      // log.status.toLowerCase().trim().includes(term) ||
      // log.readStatus.toLowerCase().trim().includes(term);

      // Date filter (matches based on start date and end date)
      return matchesSearch;
    });

    // Sorting logic
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key] || '';
        const bVal = b[sortConfig.key] || '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [dummyData, searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const editTemplate = (id) => {
    const templateToEdit = group.find((grp) => grp.groupId === id);
    if (templateToEdit) {
      setGroupName(templateToEdit.group_name);
      setGroupNum(templateToEdit.group_number);
      setEditingId(id);
    }
  };

  const totalPages = Math.ceil(group.length / recordsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setGroup(dummyData);
  }, []);

  return (
    <>
      <section className="w-[100%] h-full min-h-[calc(100vh-70px)] bg-gray-200   flex items-center flex-col">
        <CreditHeader />
        <div className="w-full mt-8">
          <CampaignHeading campaignHeading="All Groups Details" />
          {/* <div className=""> */}
          <div className="w-full px-3 md:px-6 py-6 flex lg:flex-col gap-6">

            {/* Left Column */}
            <div className="lg:w-full w-1/2 flex flex-col gap-6">

              {/* Group Name Input */}
              <CampaignTitle
                mainTitle={"Group Name"}
                setCampaignTitle={setGroupName}
                inputTitle={groupName}
                placeholder={"Enter Group Name"} />

              <div className="lg:flex hidden w-full ">
                <CampaignStatus
                  duplicateStatus={statsNumber.duplicates}
                  invalidStatus={statsNumber.invalid}
                  totalStatus={statsNumber.total}
                  validStatus={statsNumber.valid}
                />
              </div>

              {/* WhatsApp Numbers Textarea */}
              <WhatsappTextNumber
                whatsAppNumbers={whatsAppNumbers}
                setWhatsAppNumbers={setWhatsAppNumbers}
                statsNumber={statsNumber}
                setStatsNumber={setStatsNumber} />
            </div>
            <div className="lg:hidden w-3/5 flex flex-col gap-6">
              <CampaignStatus
                duplicateStatus={statsNumber.duplicates}
                invalidStatus={statsNumber.invalid}
                totalStatus={statsNumber.total}
                validStatus={statsNumber.valid}
              />

              <div className="lg:hidden flex flex-col bg-white border border-black p-3 rounded-md min-h-[400px]">
                <div className="flex md:justify-start justify-between gap-3 md:flex-col pb-3 ">
                  <div className="flex gap-3  ">
                    <CopyToClipboard headers={headers} data={dummyData} />
                    <DownloadCSVButton headers={headers} dataLogs={dummyData} />
                    <DownloadPDFButton headers={headers} dataLogs={dummyData} />
                  </div>
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
                </div>
                <div className={` w-full bg-gray-300 flex-shrink-0 overflow-x-auto custom-horizontal-scroll select-text h-[310px] ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-64px)]"}`}>
                  <CustomizeTable
                    headers={headers}
                    emptyMessage='No transaction logs available.'
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    renderRow={renderRow}
                    data={filteredAndSortedLogs}
                    className="table-auto border-collapse"
                    theadClassName="px-4 py-2 text-left cursor-pointer select-none whitespace-nowrap"
                    rowClassName=''
                  // className="text-center py-3 text-lg font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center mb-4 flex-col px-3">
            {feedback && <p className="text-red-500 m-0">{feedback}</p>}
            <button className="w-full btn btn-primary py-2" onClick={saveTemplate}>
              {editingId ? "Update" : "Submit"}
            </button>
            {/* Feedback */}
          </div>

          <div className="hidden lg:flex flex-col bg-white p-3 m-3">
            <div className="flex  md:justify-start justify-between gap-3 md:flex-col py-3 ">
              <div className="flex gap-3  ">
                <CopyToClipboard headers={headers} data={dummyData} />
                <DownloadCSVButton headers={headers} dataLogs={dummyData} />
                <DownloadPDFButton headers={headers} dataLogs={dummyData} />
              </div>
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
            </div>
            <div className={` w-full bg-gray-300 flex-shrink-0 overflow-auto custom-horizontal-scroll select-text h-full ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-64px)]"}`}>
              <CustomizeTable
                headers={headers}
                emptyMessage='No transaction logs available.'
                sortConfig={sortConfig}
                onSort={handleSort}
                renderRow={renderRow}
                data={filteredAndSortedLogs}
                className="table-auto border-collapse"
                theadClassName="px-4 py-2 text-left cursor-pointer select-none whitespace-nowrap"
                rowClassName=''
              // className="text-center py-3 text-lg font-semibold"
              />
            </div>
          </div>
        </div>
      </section >
    </>
  );
};

export default GroupCampaign;
