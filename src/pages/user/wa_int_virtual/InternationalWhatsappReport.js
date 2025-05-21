import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CreditHeader from "../../../components/CreditHeader";
import { CampaignHeading, CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton } from "../../utils/Index";
import useIsMobile from "../../../hooks/useMobileSize";
import '../whatsapp_offical/commonCSS.css'

const WhatsappReport = ({ isOpen }) => {
  const isMobile = useIsMobile();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [dummyData, setDummyData] = useState([
    {
      "campaignId": "CMP1001",
      "userName": "Alice Johnson",
      "numberCount": 120,
      "campaignTitle": "Spring Sale",
      "campaignReport": "Completed",
      "templateStatus": "Approved",
      "campaignSubmit": "2025-05-10 14:00"
    },
    {
      "campaignId": "CMP1002",
      "userName": "Bob Smith",
      "numberCount": 85,
      "campaign": "Event Reminder",
      "campaignReport": "Pending",
      "templateStatus": "Pending",
      "campaignSubmit": "2025-05-11 09:30"
    },
    {
      "campaignId": "CMP1003",
      "userName": "Clara Green",
      "numberCount": 200,
      "campaign": "Product Launch",
      "campaignReport": "Completed",
      "templateStatus": "Rejected",
      "campaignSubmit": "2025-05-12 16:45"
    },
    {
      "campaignId": "CMP1004",
      "userName": "Daniel White",
      "numberCount": 50,
      "campaign": "Feedback Request",
      "campaignReport": "Failed",
      "templateStatus": "Approved",
      "campaignSubmit": "2025-05-13 11:15"
    }])

  const headers = [
    { key: "CampaignId", label: 'Campaign ID' },
    { key: "userName", label: 'User Name' },
    { key: "numberCount", label: 'Number Count' },
    { key: "campaignTitle", label: 'Campaign Title' },
    { key: "campaignReport", label: 'Campaign Report' },
    { key: "templateStatus", label: 'Template Status' },
    { key: "campaignSubmit", label: 'Campaign Submit' }
  ];

  const renderRow = (log, index) => (
    <tr key={index} className="text-black border border-gray-700 hover:bg-gray-500 whitespace-wrap">
      <td className="px-2 py-2 border border-gray-900">{log.campaignId ?? '-'}</td>
      <td className="px-2 py-2 border border-gray-900 text-blue-600 underline cursor-pointer">
        {log.userName || 'N/A'}
      </td>
      <td className="px-2 py-2 border border-gray-900">
        {log.numberCount || 'N/A'}
      </td>
      <td className="px-2 py-2 border border-gray-900">{log.campaignTitle ?? '-'}</td>
      <td className="px-2 py-2 border border-gray-900">{log.campaignReport || 'N/A'}</td>
      <td className="px-2 py-2 border border-gray-900">{log.templateStatus || 'Invalid date'}</td>
      <td className="px-2 py-2 border border-gray-900">{log.campaignSubmit || 'N/A'}</td>
    </tr>
  );


  const filteredAndSortedLogs = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    const filtered = dummyData.filter(log => {
      // Search term filter (matches phone, campaign, status, or read status)
      const matchesSearch =
        log.campaignId.includes(term);
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

  // Fetch campaigns on component mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/Internationalcampaign")
      .then((response) => {
        // Set the returned data to state
        setCampaigns(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching campaigns:", error);
        setError("Failed to load campaigns");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <section className={`w-[100%] h-full pb-3 bg-gray-200 min-h-[calc(100vh-70px)] ${!isMobile ? isOpen ? "ml-[240px] 60 w-[calc(100vw-246px)]" : "ml-20 w-[calc(100vw-80px)]" : ""} `}>
        <CreditHeader />
        <div className="w-full mt-8 mb-2">
          <CampaignHeading campaignHeading="Whatsapp Report" />
        </div>
        <div className="px-3 flex flex-col gap-2">
          <div className="w-full flex gap-3 justify-content-between md:items-start items-center md:flex-col py-2 bg-white px-3">
            <div className="flex items-center gap-2 min-w-[30%]">
              <p className="font-[600] text-[20px] m-0">To</p>
              <input type="date" className="form-control" />
            </div>
            <div className="flex items-center gap-2 min-w-[30%]">
              <p className="font-[600] text-[20px] m-0">From</p>
              <input type="date" className="form-control" />
            </div>
            <button className="px-10 py-2 rounded text-white bg-brand_colors">
              Submit
            </button>
          </div>

          <div className=" bg-white flex flex-col gap-3 px-3 py-3 rounded-md">
            <div className=" flex justify-between md:flex-col gap-4 items-center">
              <div className="flex items-center gap-3">
                <CopyToClipboard headers={headers} data={dummyData} />
                <DownloadCSVButton headers={headers} dataLogs={dummyData} />
                <DownloadPDFButton headers={headers} dataLogs={dummyData} />
              </div>
              <div className="relative md:w-full  max-w-[300px]">
                <input
                  type="text"
                  placeholder="Search by Username, Campaign, Campaign List"
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
            <div className="min-w-max overflow-hidden bg-gray-300">
              <div className={`custom-horizontal-scroll overflow-x-auto  select-text h-full relative ${!isMobile ? (isOpen ? "max-w-[calc(100vw-310px)]" : "max-w-[calc(100vw-60px)]") : "max-w-[calc(100vw-64px)]"}`}>
                <CustomizeTable
                  headers={headers}
                  emptyMessage='No transaction logs available.'
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  renderRow={renderRow}
                  data={filteredAndSortedLogs}
                  className="table-auto border-collapse"
                  theadClassName="px-4 py-2 text-left cursor-pointer select-none whitespace-wrap text-black"
                  rowClassName='text-black'
                // className="text-center py-3 text-lg font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhatsappReport;
