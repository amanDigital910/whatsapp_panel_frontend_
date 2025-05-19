/* eslint-disable no-use-before-define */
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreditHeader from "../../components/CreditHeader";
import { CampaignHeading, CampaignTitle, CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton, PdfUploader, VideoUploader } from "../utils/Index";
import ImageUploaderGroup from "../utils/ImageUploaderGroup";
import useIsMobile from "../../hooks/useMobileSize";

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

  const textareaRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    pdf: null,
    video: null,
  });

  // New state for media captions.
  const [mediaCaptions, setMediaCaptions] = useState({
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    pdf: "",
    video: "",
  });

  // Refs for file inputs.
  const inputRefs = {
    image1: useRef(null),
    image2: useRef(null),
    image3: useRef(null),
    image4: useRef(null),
    pdf: useRef(null),
    video: useRef(null),
  };

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

  const renderRow = (log, index) => (
    <tr key={index} className="text-black border border-gray-700 hover:bg-gray-500 whitespace-nowrap">
      <td className="px-2 py-2 border border-gray-900">{log.id}</td>
      <td className="px-2 py-2 border border-gray-900">{log.groupName}</td>
      <td className="px-2 py-2 border border-gray-900">{log.groupNumber || '-'}</td>
      <td className="px-2 py-2 border border-gray-900 ">{log.groupDate}</td>
      <td className="px-2 py-2 border border-gray-900">  {new Date(log.groupDate).toLocaleDateString('en-GB')}</td>
    </tr>
  );

  const handleSearch = (e) => {
    const query = setSearchTerm(e.target.value.toLowerCase());
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredUsers(usersList);
    } else {
      const filtered = usersList.filter(user =>
        user.groupName.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  };

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
  }, [searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle file uploads for images, PDF, and video.
  const handleFileUpload = (e, type) => {
    const files = e.target.files;
    if (!files.length) {
      console.warn("No file selected");
      return;
    }
    const file = files[0];

    if (type.startsWith("image")) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        alert(
          "Invalid file type. Please select a valid image (JPEG, PNG, or GIF)."
        );
        return;
      }
      const maxSizeInMB = 2;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        alert("File size exceeds 2MB. Please select a smaller image.");
        return;
      }
      const preview = URL.createObjectURL(file);
      setUploadedFiles((prev) => ({ ...prev, [type]: { file, preview } }));
    } else if (type === "pdf") {
      if (file.type !== "application/pdf") {
        alert("Invalid file type. Please select a PDF file.");
        return;
      }
      const maxPdfSizeInMB = 10;
      if (file.size > maxPdfSizeInMB * 1024 * 1024) {
        alert("File size exceeds 10MB. Please select a smaller PDF.");
        return;
      }
      setUploadedFiles((prev) => ({ ...prev, pdf: file }));
    } else if (type === "video") {
      const validVideoTypes = ["video/mp4"];
      if (!validVideoTypes.includes(file.type)) {
        alert("Invalid file type. Please select a valid video (MP4).");
        return;
      }
      const maxVideoSizeInMB = 15;
      if (file.size > maxVideoSizeInMB * 1024 * 1024) {
        alert("File size exceeds 15MB. Please select a smaller video.");
        return;
      }
      const preview = URL.createObjectURL(file);
      setUploadedFiles((prev) => ({ ...prev, video: { file, preview } }));
    }
  };

  const removeFile = (type) => {
    setUploadedFiles((prev) => ({ ...prev, [type]: null }));
  };


  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const fetchTemplates = async () => {
    try {
      console.log(`${process.env.REACT_APP_API_URL}`);

      // const response = await fetch(
      //   `${process.env.REACT_APP_API_URL}/msggroup/`
      // );
      // if (response.ok) {
      //   const data = await response.json();
      //   setGroup(data);
      // } else {
      //   toast.error("Failed to fetch templates.");
      // }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const saveTemplate = async () => {
    if (!groupName || !groupNub) {
      setFeedback("All fields are required.");
      toast.error("All fields are required.");
      return;
    }

    const payload = {
      userId: 1,
      group_name: groupName,
      group_number: groupNub,
    };

    // try {
    //   const method = editingId ? "PUT" : "POST";
    //   const url = editingId
    //     ? `${process.env.REACT_APP_API_URL}/msggroup//${editingId}`
    //     : `${process.env.REACT_APP_API_URL}/msggroup/`;
    //   const response = await fetch(url, {
    //     method,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(payload),
    //   });

    //   if (response.ok) {
    //     const data = await response.json();
    //     toast.success(
    //       editingId
    //         ? "Template updated successfully!"
    //         : "Template added successfully!"
    //     );
    //     setGroupName("");
    //     setGroupNum("");
    //     setEditingId(null);
    //     fetchTemplates();
    //   } else {
    //     const errorData = await response.json();
    //     toast.error(errorData.message || "Something went wrong.");
    //   }
    // } catch (error) {
    //   toast.error(`Error: ${error.message}`);
    // }
  };

  const editTemplate = (id) => {
    const templateToEdit = group.find((grp) => grp.groupId === id);
    if (templateToEdit) {
      setGroupName(templateToEdit.group_name);
      setGroupNum(templateToEdit.group_number);
      setEditingId(id);
    }
  };

  const deleteTemplate = async (id) => {
    // try {
    //   const response = await fetch(
    //     `${process.env.REACT_APP_API_URL}/msggroup/${id}`,
    //     {
    //       method: "DELETE",
    //     }
    //   );

    //   if (response.ok) {
    //     toast.success("Template deleted successfully!");
    //     fetchTemplates();
    //   } else {
    //     const errorData = await response.json();
    //     toast.error(errorData.message || "Something went wrong.");
    //   }
    // } catch (error) {
    //   toast.error(`Error: ${error.message}`);
    // }
  };


  const totalPages = Math.ceil(group.length / recordsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <>
      <section className="w-[100%] bg-gray-200   flex justify-center flex-col">
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

              <div className="w-[100%] h-[auto] flex flex-col gap-2">
                <p className="text-black m-0">Group Message</p>
                <textarea
                  ref={textareaRef}
                  value={groupNub}
                  onChange={(e) => {
                    setGroupNum(e.target.value);
                    handleInput();
                  }}
                  className="p-2 rounded w-[100%] h-full min-h-[400px] bg-white text-black border-black border-[0.1px]"
                  placeholder="Enter your message"
                />
              </div>
            </div>

            <div className="lg:w-full w-[50%] flex flex-col gap-4">
              {/* Upload Media Section */}
              <div className="bg-white rounded p-4 border border-black flex flex-col gap-6 ">
                <ImageUploaderGroup
                  inputRefs={inputRefs}
                  uploadedFiles={uploadedFiles}
                  handleFileUpload={handleFileUpload}
                  removeFile={removeFile}
                  mediaCaptions={mediaCaptions}
                  setMediaCaptions={setMediaCaptions}
                />

                <div className="grid grid-cols-1 gap-6">
                  <PdfUploader
                    inputRef={inputRefs.pdf}
                    uploadedFile={uploadedFiles.pdf}
                    onFileUpload={handleFileUpload}
                    onRemove={removeFile}
                    caption={mediaCaptions.pdf || ""}
                    onCaptionChange={(val) => setMediaCaptions((prev) => ({ ...prev, pdf: val }))}
                  />

                  <VideoUploader
                    inputRef={inputRefs.video}
                    uploadedFile={uploadedFiles.video}
                    onFileUpload={handleFileUpload}
                    onRemove={removeFile}
                    caption={mediaCaptions.video || ""}
                    onCaptionChange={(val) => setMediaCaptions((prev) => ({ ...prev, video: val }))}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center mb-4 flex-col">
            {feedback && <p className="text-red-500 m-0">{feedback}</p>}
            <button className="btn btn-primary w-24 py-2" onClick={saveTemplate}>
              {editingId ? "Update" : "Submit"}
            </button>
            {/* Feedback */}
          </div>

          <div className="bg-white p-3 m-3">
            <div className="flex  md:justify-start justify-between gap-3 md:flex-col py-3 ">
              <div className="flex gap-3  ">
                <CopyToClipboard headers={headers} dataLogs={dummyData} />
                <DownloadCSVButton headers={headers} dataLogs={dummyData} />
                <DownloadPDFButton />
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
      <ToastContainer />
    </>
  );
};

export default GroupCampaign;
