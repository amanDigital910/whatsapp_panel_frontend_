/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { IoScanCircle } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import CreditHeader from "../../../components/CreditHeader";
import { CampaignHeading, CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton } from "../../utils/Index";
import useIsMobile from "../../../hooks/useMobileSize";

const PersonalCampaignScan = ({ isOpen }) => {
  const [model, setModel] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [instanceData, setInstanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  const headers = [
    { key: 'id', label: 'Id' },
    { key: 'whatsAppName', label: 'WhatsApp Name' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action' }
  ];

  const dummyData = [
    {
      id: 1,
      whatsAppName: "john_doe",
      mobile: "+91 9876543210",
      status: "Active",
      action: "Edit",
    },
    {
      id: 2,
      whatsAppName: "jane_smith",
      mobile: "+91 8765432109",
      status: "Inactive",
      action: "Deactivate",
    },
    {
      id: 3,
      whatsAppName: "mark_taylor",
      mobile: "+91 7654321098",
      status: "Active",
      action: "Edit",
    },
    {
      id: 4,
      whatsAppName: "emily_jones",
      mobile: "+91 6543210987",
      status: "Pending",
      action: "Approve",
    },
    {
      id: 5,
      whatsAppName: "alex_brown",
      mobile: "+91 5432109876",
      status: "Active",
      action: "Edit",
    },
    {
      id: 6,
      whatsAppName: "lucy_williams",
      mobile: "+91 4321098765",
      status: "Suspended",
      action: "Activate",
    },
    {
      id: 7,
      whatsAppName: "sarah_davis",
      mobile: "+91 3210987654",
      status: "Active",
      action: "Edit",
    },
    {
      id: 8,
      whatsAppName: "david_clark",
      mobile: "+91 2109876543",
      status: "Inactive",
      action: "Deactivate",
    },
    {
      id: 9,
      whatsAppName: "olivia_martin",
      mobile: "+91 1098765432",
      status: "Pending",
      action: "Approve",
    },
    {
      id: 10,
      whatsAppName: "chris_lee",
      mobile: "+91 0987654321",
      status: "Active",
      action: "Edit",
    }
  ];


  const renderRow = (item) => (
    <tr key={item.id} className="text-black border border-gray-700 hover:bg-gray-500">
      <td className="px-4 py-2 border border-gray-700">{item.id}</td>
      <td className="px-4 py-2 border border-gray-700">{item.whatsAppName}</td>
      <td className="px-4 py-2 border border-gray-700">{item.mobile}</td>
      <td className="px-4 py-2 border border-gray-700">{item.status}</td>
      <td className="px-4 py-2 border border-gray-700">{item.action}</td>
      {/* <td className="px-4 py-2 border border-gray-700">{item.creditDate}</td> */}
    </tr>
  );

  // Memoized filtered and sorted data
  const filteredAndSortedLogs = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    // Filtering based on the search term
    const filtered = dummyData.filter(data => {
      const userMatch = data.whatsAppName.toLowerCase().includes(term);
      return userMatch;
    });

    // Sorting logic based on the sortConfig
    if (sortConfig.key) {
      return [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        // Handle sorting based on string and number types
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

    return filtered;
  }, [dummyData, searchTerm, sortConfig]);

  // Handle sorting logic
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/InternationalPersonalCampaign/getInstanceUserData`
      )
      .then((response) => {
        console.log("Instance data:", response.data);
        const data = response.data;
        // Check if the response indicates that the instance is not ready.
        if (
          data &&
          data.me &&
          data.me.status === "error" &&
          data.me.message.toLowerCase() === "instance not ready"
        ) {
          setInstanceData(null);
        } else if (data && data.me) {
          setInstanceData(data);
        } else {
          setInstanceData(null);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching instance data:", error);
        setInstanceData(null);
        setIsLoading(false);
      });
  }, [process.env.REACT_APP_API_URL]);

  // Function to call the API and update the QR code state
  const handleAddChannel = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/InternationalPersonalCampaign/InternationalpersonalCampaignScan`
      );
      let qrData = response.data.qrCode.data.qr_code;
      if (!qrData.startsWith("data:image")) {
        qrData = "data:image/png;base64," + qrData;
      }
      setQrCode(qrData);
      setModel(true);
    } catch (error) {
      console.error("Error fetching QR Code:", error);
    }
  };

  // Function to call the InstanceDelete API endpoint when Delete is clicked.
  const handleDeleteInstance = async () => {
    try {
      // Using axios.delete to call the delete API endpoint.
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/InternationalPersonalCampaign/InstanceDelete`
      );
      console.log("Delete response:", response.data);
      // Update instanceData to null so that the table shows "No Data Found".
      setInstanceData(null);
    } catch (error) {
      console.error("Error deleting instance:", error);
    }
  };

  return (
    <>
      <section className="w-full bg-gray-200  flex justify-center flex-col pb-10">
        <CreditHeader />
        <div className="w-full mt-8 px-4">
          <div className="w-full h-full flex sm:flex-col gap-2 m-0 justify-between items-center bg-white rounded-md pr-4 py-2">
            <CampaignHeading campaignHeading={"Scan Whatsapp"} />
            <button
              onClick={handleAddChannel}
              className="text-white flex px-4 py-2 h-full rounded bg-brand_colors ">
              <span className="flex h-fit gap-2 justify-center items-center">
                <IoScanCircle /> Scan Whatsapp
              </span>
            </button>
          </div>

          {/* Modal displaying the API QR Code */}
          {model && (
            <div className="w-screen h-screen bg-black/40 absolute z-20 top-0 left-0 flex justify-center items-center">
              <div className="w-[700px] h-[400px] overflow-auto bg-white rounded p-3">
                <div className="w-full flex justify-end">
                  <RxCross1
                    className="text-black cursor-pointer"
                    onClick={() => setModel(false)}
                  />
                </div>
                <br />
                <div className="w-full flex justify-between">
                  <div className="w-full">
                    <p>This part comes from the backend</p>
                  </div>
                  <div className="w-full border-2 rounded p-1">
                    {qrCode ? (
                      <img
                        src={qrCode}
                        alt="QR Code"
                        className="w-full h-[300px] object-contain"
                      />
                    ) : (
                      <p>Loading QR Code...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Table with Instance Data */}
          <div className="w-full bg-white rounded mt-2 py-3 px-3">
            <div className="w-full flex sm:flex-col gap-3 justify-between items-center">
              <div className="flex items-center gap-3">
                <CopyToClipboard headers={headers} data={dummyData} />
                <DownloadCSVButton dataLogs={dummyData} headers={headers} />
                <DownloadPDFButton headers={headers} dataLogs={dummyData} /> 
              </div>
              <div className="d-flex align-items-center sm:w-full">
                {/* <label className="me-2 mb-0">Search:</label> */}
                <input
                  type="text" placeholder='Search...'
                  onChange={e => setSearchTerm(e.target.value)}
                  className="form-control d-inline-block border-black border" />
              </div>
            </div>
            <br />
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

          {/* Additional duplicate modal (if needed) */}
          {model && (
            <div className="w-screen h-screen bg-black/40 absolute z-20 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
              <div className="w-[700px] h-[400px] overflow-auto bg-white rounded p-3">
                <div className="w-full flex justify-end">
                  <RxCross1
                    className="text-black cursor-pointer"
                    onClick={() => setModel(false)}
                  />
                </div>
                <br />
                <div className="w-full flex justify-between">
                  <div className="w-full">
                    <p>This part comes from the backend</p>
                  </div>
                  <div className="w-full border-2 rounded p-1">
                    <img
                      src={qrCode}
                      alt="QR Code"
                      className="w-full h-[300px] object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PersonalCampaignScan;
