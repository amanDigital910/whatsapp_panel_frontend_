/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from 'react';
import useIsMobile from '../../../../hooks/useMobileSize';
import { LuArrowUp, LuArrowDown } from 'react-icons/lu';
import DownloadButtons from '../Components/DownloadButtons';
import '../commonCSS.css'

const ReportCampaign = ({ isOpen }) => {
  const logs = [
    {
      id: "174x4907-0659508475291997-0040726423",
      messageId: "wamid.HB@MOTE5OTCOMDAO==",
      sender: "9879987999",
      campaignName: "Wall Street Academy Group Grab",
      to: "9974004072",
      credits: "INR 1",
      templateId: "screenerin_45bgc64t5q8",
      status: "failed",
      route: "promotional",
      error: "This message was not delivered to maintain healthy ecosystem engagement.",
      submitted: "April 12, 2025 at 10:00 pm",
      failed: "April 27, 2025 at 10:00 pm",
      variables: "user_id=47823",
      readStatus: "Unread"
    },
    {
      id: "174x4907-065937839189199252214887022",
      messageId: "wamid.HB@MOTE5OTIMJ01MTO==",
      sender: "7284870376",
      campaignName: "Wall Street Academy Group Grab",
      to: "9925224148",
      credits: "INR 1",
      templateId: "screenerin_45bgc64t5q8",
      status: "failed",
      route: "promotional",
      error: "This message was not delivered to maintain healthy ecosystem engagement.",
      submitted: "April 13, 2025 at 10:01 pm",
      failed: "May 4, 2025 at 10:01 pm",
      variables: "group_id=18372",
      readStatus: "Unread"
    },
    {
      id: "174x4907-0659508475291997-0022387203914",
      messageId: "wamid.HB@MOTE5OTI0M2g5Mjc=",
      sender: "7284870376",
      campaignName: "Wall Street Academy Group Grab",
      to: "9924389270",
      credits: "INR 1",
      templateId: "screenerin_45bgc64t5q8",
      status: "failed",
      route: "promotional",
      error: "This message was not delivered to maintain healthy ecosystem engagement.",
      submitted: "March 7, 2025 at 10:02 pm",
      failed: "April 4, 2025 at 10:02 pm",
      variables: "course=starter_pack",
      readStatus: "Unread"
    },
    {
      id: "174x4907-0659508475291997-0038723623131",
      messageId: "wamid.HB@MOTE5OTI1MGJ3MTA==",
      sender: "7284870376",
      campaignName: "Welcome Offer Broadcast",
      to: "9991112233",
      credits: "INR 1",
      templateId: "screenerin_9adf87ad",
      status: "delivered",
      route: "transactional",
      error: "",
      submitted: "April 1, 2025 at 9:00 am",
      failed: "",
      variables: "promo=welcome100",
      readStatus: "Read"
    },
    {
      id: "174x4907-0659508475291997-0038128947233",
      messageId: "wamid.HB@MOTE5OTI2NWF9NTA==",
      sender: "7284870376",
      campaignName: "Flash Sale Alert",
      to: "9811223344",
      credits: "INR 1",
      templateId: "screenerin_flashsale",
      status: "failed",
      route: "promotional",
      error: "Number unreachable",
      submitted: "April 5, 2025 at 2:00 pm",
      failed: "April 5, 2025 at 2:05 pm",
      variables: "product_id=121",
      readStatus: "Unread"
    },
    {
      id: "174x4907-0659508475291997-0038891231201",
      messageId: "wamid.HB@MOTE5OTI3NGdoMTY=",
      sender: "7284870376",
      campaignName: "Monthly Newsletter",
      to: "9822334455",
      credits: "INR 1",
      templateId: "screenerin_newsletter_march",
      status: "delivered",
      route: "transactional",
      error: "",
      submitted: "March 30, 2025 at 8:30 am",
      failed: "",
      variables: "month=march",
      readStatus: "Read"
    },
    {
      id: "174x4907-0659508475291997-0038992211091",
      messageId: "wamid.HB@MOTE5OTI3ODdoMjY=",
      sender: "7284870376",
      campaignName: "App Install Reminder",
      to: "9833445566",
      credits: "INR 1",
      templateId: "screenerin_reminder_app",
      status: "failed",
      route: "promotional",
      error: "Opt-out user",
      submitted: "April 2, 2025 at 3:00 pm",
      failed: "April 2, 2025 at 3:05 pm",
      variables: "campaign=app_push",
      readStatus: "Unread"
    },
    {
      id: "174x4907-0659508475291997-0038128983420",
      messageId: "wamid.HB@MOTE5OTI5MGduNzY=",
      sender: "7284870376",
      campaignName: "Course Feedback Request",
      to: "9844556677",
      credits: "INR 1",
      templateId: "screenerin_feedback_23",
      status: "delivered",
      route: "transactional",
      error: "",
      submitted: "April 6, 2025 at 11:00 am",
      failed: "",
      variables: "course_id=CS101",
      readStatus: "Read"
    },
    {
      id: "174x4907-0659508475291997-0038128994511",
      messageId: "wamid.HB@MOTE5OTMwMWdjMzA=",
      sender: "7284870376",
      campaignName: "Payment Reminder",
      to: "9855667788",
      credits: "INR 1",
      templateId: "screenerin_payment_due",
      status: "failed",
      route: "transactional",
      error: "User blocked the sender",
      submitted: "April 7, 2025 at 5:00 pm",
      failed: "April 7, 2025 at 5:03 pm",
      variables: "invoice_id=INV12345",
      readStatus: "Unread"
    },
    {
      id: "174x4907-0659508475291997-0038128911222",
      messageId: "wamid.HB@MOTE5OTMwM2hxNTE=",
      sender: "7284870376",
      campaignName: "Event Invite",
      to: "9866778899",
      credits: "INR 1",
      templateId: "screenerin_event_invite",
      status: "delivered",
      route: "promotional",
      error: "",
      submitted: "April 8, 2025 at 6:00 pm",
      failed: "",
      variables: "event_id=98765",
      readStatus: "Read"
    }
  ];

  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'campaignName', label: 'Campaign' },
    { key: 'to', label: 'Phone No.' },
    { key: 'readStatus', label: 'Read Status' },
    { key: 'status', label: 'Status' },
    // { key: 'messageId', label: 'Message ID' },
    { key: 'sender', label: 'Sender' },
    // { key: 'credits', label: 'Credits' },
    { key: 'templateId', label: 'Template ID' },
    // { key: 'variables', label: 'Variables' },
    { key: 'route', label: 'Route' },
    { key: 'error', label: 'Error' },
    { key: 'submitted_failed', label: 'Timestamps' }
  ];


  const isMobile = useIsMobile();
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedLogs = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    const filtered = logs.filter(log => {
      // Search term filter (matches phone, campaign, status, or read status)
      const matchesSearch =
        log.to.trim().includes(term) ||
        log.campaignName.toLowerCase().trim().includes(term) ||
        log.status.toLowerCase().trim().includes(term) ||
        log.readStatus.toLowerCase().trim().includes(term);

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
  }, [logs, searchTerm, sortConfig,]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };


  return (
    <div className={`bg-gray-200 flex flex-col py-2  h-[calc(100vh-70px)] ${!isMobile ? (isOpen ? "ml-[241px] px-3" : "ml-20 px-3") : "w-screen pr-3 ml-0 pl-3"}`}>
      <div className="flex sm:flex-col sm:items-start items-center justify-between gap-4 mt-2 mb-3 ">
        <h2 className="text-2xl font-semibold m-0">Logs</h2>

        <div className='flex md:flex-col justify-end w-full gap-4 '>
          <DownloadButtons
            dataLogs={filteredAndSortedLogs}
            headers={headers}
          />

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
      </div>

      {/* Scrollable wrapper with horizontal guard */}
      <div className={`min-w-max bg-gray-200 `}>
        <div className={`w-full flex-shrink-0 overflow-auto custom-horizontal-scroll select-text ${!isMobile ? (isOpen ? "max-w-[calc(100vw-272px)] max-h-[calc(100vh-153px)]" : "max-w-[calc(100vw-110px)] max-h-[calc(100vh-153px)]") : "max-w-[calc(100vw-26px)] h-[calc(100vh-278px)] "}`}>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10 ">
              <tr>
                {headers.map(({ label, key }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-4 py-2 text-left cursor-pointer select-none whitespace-nowrap bg-gray-300"
                  >
                    <div className="flex items-center justify-between gap-3">
                      {label}
                      <div className='w-8'>
                        {sortConfig.key === key ? (
                          sortConfig.direction === 'asc' ? <LuArrowUp /> : <LuArrowDown />
                        ) : (
                          <span className="text-gray-600 flex flex-row"><LuArrowUp /><LuArrowDown /></span>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedLogs.map((log, index) => (
                <tr key={index} className="bg-white hover:bg-gray-50 whitespace-nowrap border border-black">
                  <td className="px-2 py-2 border border-gray-900">{log.id}</td>
                  <td className="px-2 py-2 border border-gray-900 text-blue-600 underline cursor-pointer">{log.campaignName}</td>
                  <td className="px-2 py-2 border border-gray-900">+91{log.to}</td>
                  <td className="px-2 py-2 border border-gray-900">{log.readStatus || '-'}</td>
                  <td className="px-2 py-2 border border-gray-900 text-red-600">{log.status}</td>
                  {/* <td className="px-2 py-2 border border-gray-900 max-w-[200px] truncate">{log.messageId}</td> */}
                  <td className="px-2 py-2 border border-gray-900">+91{log.sender}</td>
                  {/* <td className="px-2 py-2 border border-gray-900">{log.credits}</td> */}
                  <td className="px-2 py-2 border border-gray-900">{log.templateId}</td>
                  {/* <td className="px-2 py-2 border border-gray-900">{log.variables || '-'}</td> */}
                  <td className="px-2 py-2 border border-gray-900">{log.route}</td>
                  <td className="px-2 py-2 border border-gray-900 w-40">{log.error || '-'}</td>
                  <td className="px-2 py-2 border border-gray-900 w-48">
                    <strong>Submitted:</strong> {log.submitted || '-'}<br />
                    <strong>Failed:</strong> {log.failed || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportCampaign;
