/* eslint-disable react-hooks/exhaustive-deps */

import CreditHeader from '../../../../components/CreditHeader'
import { FaFileCirclePlus } from 'react-icons/fa6'
import { LuRefreshCwOff } from 'react-icons/lu'
import { CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton } from '../../../utils/Index'
import { CodeSnippet } from '../../whatsapp_offical/CodeSnippet'
import useIsMobile from '../../../../hooks/useMobileSize'
import { useState } from 'react'
import { useMemo } from 'react'

const PersonalAPIManage = ({ isOpen }) => {
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();
  const logs = [
    {
      id: "185x6723-0912",
      key: "a1b2c3d4e5f6478a98b7b2e31d9e456f",
      status: "wamid.AB@NEWPRODUCTLAUNCH==",
      action: "9123456789",
    },
    {
      id: "192x3489-0771",
      key: "d3e4f5a6b7c8490c12d3f4b5c6d7e8f9",
      status: "wamid.CD@OFFERUPDATE2024==",
      action: "9876501234",
    },
    {
      id: "163x4105-0822",
      key: "11223344556677889900aabbccddeeff",
      status: "wamid.EF@REMINDERCAMPAIGN==",
      action: "9988776655",
    },
    {
      id: "178x5943-0345",
      key: "ffeeddccbbaa00998877665544332211",
      status: "wamid.GH@FESTIVEPROMO==",
      action: "9001122334",
    },
    {
      id: "199x7602-0630",
      key: "abcd1234efgh5678ijkl9012mnop3456",
      status: "wamid.IJ@SURVEYINVITE==",
      action: "8899001122",
    }
  ];


  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'key', label: 'Key' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action' },
  ];

  const renderRow = (log, index) => (
    <tr key={index} className="text-black border border-gray-700 hover:bg-gray-400 whitespace-nowrap">
      <td className="px-2 py-2 border border-gray-900 w-fit">{log.id}</td>
      <td className="px-2 py-2 border border-gray-900 w-fit">{log.key}</td>
      <td className="px-2 py-2 border border-gray-900 text-blue-700 underline cursor-pointer">{log.status}</td>
      <td className="px-2 py-2 border border-gray-900 ">
        <button className="px-3 py-1 bg-red-500">
          {log.action}
        </button>
      </td>
    </tr>
  );

  const activeSnippet = CodeSnippet.find(snippet => snippet.language);
  const filteredAndSortedLogs = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    const filtered = logs.filter(log => {
      // Search term filter (matches phone, campaign, status, or read status)
      const matchesSearch =
        log.key.trim().includes(term);
      // log.status.toLowerCase().trim().includes(term) ||
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
  }, [logs, searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };


  return (
    <section className="w-full bg-gray-200  flex justify-center flex-col">
      <CreditHeader />
      <div className="text-black p-3 bg-white w-full flex md:flex-col md:justify-normal gap-3 justify-between ">
        <span className="w-fit bg-[#383387] text-lg text-white flex items-center gap-3 py-2 px-3 rounded-md font-medium hover:bg-[#406dc7] cursor-pointer"><FaFileCirclePlus />Your subscription has expired.</span>
        <span className="bg-red-500 w-fit text-lg text-white flex items-center gap-3 py-2 px-3 rounded-md font-medium hover:bg-[#383387] cursor-pointer"><LuRefreshCwOff />Generate API Key</span>
      </div>
      <div className="px-3 py-3 ">
        <div className="px-3 py-3 bg-white flex gap-3 flex-col">
          <div className="flex  md:justify-start justify-between gap-3 ">
            <div className="flex gap-3  ">
              <CopyToClipboard activeSnippet={activeSnippet} />
              <DownloadCSVButton headers={headers} dataLogs={logs} />
              <DownloadPDFButton />
            </div>
            <div className="relative md:w-full w-[300px]">
              <input
                type="text"
                placeholder="Search by phone, campaign, or status"
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
          <div className={`min-w-max`}>
            <div className={`w-full bg-gray-300 flex-shrink-0 overflow-auto custom-horizontal-scroll select-text h-full ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-64px)]"}`}>
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
    </section>
  )
}

export default PersonalAPIManage