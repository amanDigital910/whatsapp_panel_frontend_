/* eslint-disable react-hooks/exhaustive-deps */

import CreditHeader from '../../../../components/CreditHeader'
import { FaFileCirclePlus } from 'react-icons/fa6'
import { LuRefreshCwOff } from 'react-icons/lu'
import { CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton } from '../../../utils/Index'
import { CodeSnippet } from '../../whatsapp_offical/CodeSnippet'
import useIsMobile from '../../../../hooks/useMobileSize'
import { useState } from 'react'
import { useMemo } from 'react'
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import Notes from '../../../../components/Notes'


const PersonalAPIManage = ({ isOpen }) => {
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  const [data, setData] = useState([
    {
      id: "1",
      key: "a1b2c3d4e5f6478a98b7b2e31d9e456f",
      status: "active",
    },
    {
      id: "2",
      key: "d3e4f5a6b7c8490c12d3f4b5c6d7e8f9",
      status: "inactive",
    },
    {
      id: "3",
      key: "11223344556677889900aabbccddeeff",
      status: "inactive",
    },
    {
      id: "4",
      key: "ffeeddccbbaa00998877665544332211",
      status: "active",
    },
    {
      id: "199x7602-063",
      key: "abcd1234efgh5678ijkl9012mnop3456",
      status: "active",
    }
  ]);

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleStatusChange = (newStatus, index) => {
    setData((prevData) =>
      prevData.map((item, i) =>
        i === index ? { ...item, status: newStatus } : item
      )
    );
    setOpenDropdownIndex(null);
  };

  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'key', label: 'Key' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action' },
  ];

  const renderRow = (log, index) => {

    return (
      <tr key={index} className="text-black border border-gray-700 hover:bg-gray-400 whitespace-nowrap ">
        <td className="px-2 py-2 border border-gray-900 w-fit">{log.id}</td>
        <td className="px-2 py-2 border border-gray-900 w-fit">{log.key}</td>
        {/* <div className={`rounded px-3 py-1 w-fit font-medium shadow-md outline-none transition duration-300 flex justify-center items-center ${log.status === 'active'
            ? 'bg-[#008000] text-white'
            : 'bg-[#ff0000] text-white'}`}>
            <select
              required
              name="status"
              id={`status-${index}`}
              onChange={(e) => handleStatus(e, index)}
              className={`font-medium border-0 text-center bg-transparent outline-none appearance-none cursor-pointer ${log.status === 'active'
                ? ' bg-[#008000] text-white'
                : ' bg-[#ff0000] text-white'}`}
              value={data}>
              <option value="active" className="bg-gray-800 text-white text-center">Active</option>
              <option value="inactive" className="bg-gray-800 text-white text-center">Inactive</option>
            </select>
          </div>  */}
        <td className="px-2 py-2 border border-gray-900 pointer">
          <div className={`rounded px-3 py-1 font-medium flex items-center justify-between w-full cursor-pointer ${log.status === 'active' ? 'bg-[#34bc47]' : 'bg-[#ff0000]'} text-white`} onClick={() => toggleDropdown(index)}>
            {log.status === 'active' ? 'Active' : 'Inactive'}
            <span>{openDropdownIndex === index ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
          </div>

          {openDropdownIndex === index && (
            <div className="absolute z-50 bg-[#34bc47] text-black  rounded-md shadow-md w-32 mt-1 text-center">
              <div
                className="px-3 py-2 hover:bg-[#383387] hover:rounded-t-md cursor-pointer"
                onClick={() => handleStatusChange("active", index)}
              >
                Active
              </div>
              <div
                className="px-3 py-2 hover:bg-[#383387] hover:rounded-b-md cursor-pointer"
                onClick={() => handleStatusChange("inactive", index)}
              >
                Inactive
              </div>
            </div>
          )}
        </td>
        <td className="px-2 py-2 border border-gray-900 flex justify-center">
          <button className="px-3 py-1 rounded-md m-0 p-0 pt-1 text-base bg-[#ff0000] text-white">
            Delete
          </button>
        </td>
      </tr>
    );
  }

  const activeSnippet = CodeSnippet.find(snippet => snippet.language);
  const filteredAndSortedLogs = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    // derive which fields we actually want to search
    const searchableKeys = headers
      .map(h => h.key)
      .filter(k => k !== 'action');

    const filtered = data.filter(log => {
      // check if any searchable field contains the term
      return searchableKeys.some(key => {
        const val = (log[key] ?? '').toString().toLowerCase().trim();
        return val.includes(term);
      });
    });

    // ...then do your “exclude last, sort the rest, re-append” logic
    if (!sortConfig.key || filtered.length <= 1) return filtered;

    filtered.sort((a, b) => {
      const aVal = (a[sortConfig.key] ?? '').toString();
      const bVal = (b[sortConfig.key] ?? '').toString();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, searchTerm, sortConfig]);

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
        <span className="bg-[#ff0000] w-fit text-lg text-white flex items-center gap-3 py-2 px-3 rounded-md font-medium hover:bg-[#383387] cursor-pointer"><LuRefreshCwOff />Generate API Key</span>
      </div>
      <div className="px-3 py-3 ">
        <div className="px-3 py-3 bg-white flex gap-3 flex-col rounded-md">
          <div className="flex  md:justify-start justify-between gap-3 ">
            <div className="flex gap-3  ">
              <CopyToClipboard headers={headers} dataLogs={data} />
              <DownloadCSVButton headers={headers} dataLogs={data} />
              <DownloadPDFButton headers={headers} dataLogs={data} />
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
            <div className={`w-full bg-gray-300 flex-shrink-0 overflow-auto custom-horizontal-scroll select-text h-[300px] ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100%)]"}`}>
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
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-3 w-full">
        <div className=" flex flex-col items-start h-fit bg-[#383387] border-black border rounded-md">
          <p className="w-full py-2 px-3 bg-[#383387] whitespace-nowrap text-white text-start font-semibold 
            text-xl m-0 rounded-t-md ">
            WAPP API
          </p>
          <div className='py-3 px-3 border-t border-white w-full select-text'>
            <div className='flex flex-col px-3 py-3 bg-green-700 gap-4'>
              {/* <div style="background-color:#ff9102;padding: 10px; font-weight: bold;"> Response </div> */}
              <p className='text-white font-bold text-xl m-0 p-0'>Response</p>
              <p className='text-white font-bold text-xl m-0 p-0'>Array : https://wahbulk.com/api/wapi?apikey=
                <HighlightAPI message={"Key"} />
                &mobile=
                <HighlightAPI message={"MobileNumber"} />
                &msg=
                <HighlightAPI message={"TextMessage"} />
              </p>
              <p className='text-white font-bold text-xl m-0 p-0'>Json : https://wahbulk.com/api/wapi?json=true&apikey=
                <HighlightAPI message={"Key"} />
                &mobile=
                <HighlightAPI message={"MobileNumber"} />
                &msg=
                <HighlightAPI message={"TextMessage"} />
              </p>
            </div>
            <div className=" flex flex-col h-fit mt-3 ">
              <p className="w-full whitespace-nowrap text-white font-semibold 
            text-xl m-0 flex flex-col px-3 py-3 bg-green-700 gap-4 text-center">
                Send Message
              </p>

              <table className="min-w-full text-white text-sm">
                <thead>
                  <tr className="bg-[#383387] text-white ">
                    <th className="text-left py-2 px-4">Parameter</th>
                    <th className="text-left py-2 px-4">Values</th>
                    <th className="text-left py-2 px-4">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {TableSendMsg.map((item, index) => (
                    <tr key={index} className="border-t-2 border-gray-200 hover:bg-[#383372]">
                      <td className="py-2 px-4">{item.parameter}</td>
                      <td className="py-2 px-4">{item.values}</td>
                      <td className="py-2 px-4">{item.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className=" flex flex-col h-fit mt-3 ">
              <p className="w-full whitespace-nowrap text-white font-semibold 
            text-xl m-0 flex flex-col px-3 py-3 bg-green-700 gap-4 text-center">
                Send Message With Button for Client Reply
              </p>
              <table className="min-w-full text-white text-sm">
                <thead>
                  <tr className="bg-[#383387] text-white ">
                    <th className="text-left py-2 px-4">Parameter</th>
                    <th className="text-left py-2 px-4">Values</th>
                    <th className="text-left py-2 px-4">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {TableClientReply.map((item, index) => (
                    <tr key={index} className="border-t-2 border-gray-200 hover:bg-[#383372]">
                      <td className="py-2 px-4">{item.parameter}</td>
                      <td className="py-2 px-4">{item.values}</td>
                      <td className="py-2 px-4">{item.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Notes />
      </div>
    </section>
  )
}

export default PersonalAPIManage

const HighlightAPI = ({ message }) => {
  return (
    <span className='text-[#ff2f2f]'>
      {message}
    </span>
  )
}


const TableSendMsg = [
  { parameter: "&apikey=", values: "Scan api key", priority: "Mandatory" },
  { parameter: "&mobile=", values: "Put mobile number in which you want to send message", priority: "Mandatory" },
  { parameter: "&msg=", values: "Message for user", priority: "Mandatory" },
  { parameter: "&img1=", values: "Send image (gif, jpg, jpeg, png)", priority: "Optional" },
  { parameter: "&img2=", values: "Send image (gif, jpg, jpeg, png)", priority: "Optional" },
  { parameter: "&img3=", values: "Send image (gif, jpg, jpeg, png)", priority: "Optional" },
  { parameter: "&img4=", values: "Send image (gif, jpg, jpeg, png)", priority: "Optional" },
  { parameter: "&pdf=", values: "Send image (pdf)", priority: "Optional" },
  { parameter: "&audio=", values: "Send image (mp3, m4a, amr)", priority: "Optional" }
];

const TableClientReply = [
  { parameter: "&apikey=", values: "Scan api key", priority: "Mandatory" },
  { parameter: "&mobile=", values: "Put mobile number in which you want to send message", priority: "Mandatory" },
  { parameter: "&msg=", values: "Message for user", priority: "Mandatory" },
  { parameter: "&bt1=", values: "Button 1 Display Text", priority: "Mandatory" },
  { parameter: "&bt2=", values: "Button 2 Display Text", priority: "Mandatory" },
  { parameter: "&btcall=", values: "Valid Mobile Number", priority: "Mandatory" },
  { parameter: "&bturl=", values: "Enter valid URL", priority: "Mandatory" },
  { parameter: "&footer=", values: "Set footer Message for URL, Links, Mobile Number.", priority: "Optional" },
  { parameter: "&img1=", values: "Send image (gif, jpg, jpeg, png)", priority: "Optional" },
  { parameter: "&img2=", values: "Send image (gif, jpg, jpeg, png)", priority: "Optional" },
  { parameter: "&img3=", values: "Send image (gif, jpg, jpeg, png)", priority: "Optional" },
  { parameter: "&img4=", values: "Send image (gif, jpg, jpeg, png)", priority: "Optional" },
  { parameter: "&pdf=", values: "Send image (pdf)", priority: "Optional" },
  { parameter: "&audio=", values: "Send image (mp3, m4a, amr)", priority: "Optional" },
  { parameter: "&video=", values: "Send image (MP4, mp4, WMV, AVI, 3gp, MOV)", priority: "Optional" }
];
