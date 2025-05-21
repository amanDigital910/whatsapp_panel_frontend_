/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
import { useEffect, useMemo, useRef, useState } from 'react';
import CreditHeader from '../../components/CreditHeader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CampaignHeading, CampaignTitle, CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton, PdfUploader, VideoUploader } from '../utils/Index';
import ImageUploaderGroup from '../utils/ImageUploaderGroup';
import { useDispatch, useSelector } from 'react-redux';
import { createTemplate, deleteTemplate, getAllTemplates, updateTemplate } from '../../redux/actions/templateAction';
import useIsMobile from '../../hooks/useMobileSize';

const TemplateCampaign = ({ isOpen }) => {
  const [templateName, setTemplateName] = useState("");
  const [templateMsg, setTemplateMsg] = useState("");
  const [feedback, setFeedback] = useState("");
  const [templates, setTemplates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [editingId, setEditingId] = useState(null); // Track which template is being edited
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    templateMessage: "",
  });

  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const { loading, templatesData } = useSelector((state) => state.template);

  const textareaRef = useRef(null);
  // const payload = {
  //   userId: editingId || 1,
  //   name: templateName,
  //   text: templateMsg,
  // }
  const payload = {
    "name": "welcome_message by aman",
    "category": "MARKETING",
    "language": "en",
    "components": [
      {
        "type": "HEADER",
        "format": "TEXT",
        "text": "Welcome to Our Service! UV Digital Marketing"
      },
      {
        "type": "BODY",
        "text": "Hello Vikram Rajput, thank you for joining us! We're excited to have you on board."
      },
      {
        "type": "BUTTONS",
        "buttons": [
          {
            "type": "QUICK_REPLY",
            "text": "Get Started"
          },
          {
            "type": "URL",
            "text": "Visit Website",
            "url": "https://example.com"
          }
        ]
      }
    ]
  }

  const dummyData = [
    {
      id: 1,
      templateName: "john_doe",
      balanceType: "Savings",
      templateNumber: 150075,
      templateDate: "2025-04-28",
    },
    {
      id: 2,
      templateName: "jane_smith",
      balanceType: "Checking",
      templateNumber: 23480,
      templateDate: "2025-05-01",
    },
    {
      id: 3,
      templateName: "michael_lee",
      balanceType: "Savings",
      templateNumber: 98760,
      templateDate: "2025-04-15",
    },
    {
      id: 4,
      templateName: "emily_watson",
      balanceType: "Investment",
      templateNumber: 1500000,
      templateDate: "2025-03-30",
    },
    {
      id: 5,
      templateName: "david_clark",
      templateNumber: 51235,
      templateDate: "2025-05-05",
    },
  ];


  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: formData.username,
      templateMsg: formData.templateName,      
    };

    if (formData._id) {
      dispatch(updateTemplate(formData._id, payload));
    }

    setIsModalOpen(false);
    setFormData({
      _id: "",
      name: "",
      templateMessage: ""
    });
  };


  // Close form modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({}); // Reset formData if needed
  };

  // Delete confirmation handlers
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = (userId) => {
    dispatch(deleteTemplate(userId)); // redux action
    setShowDeleteModal(false);
    setSelectedUser(null);
  };


  useEffect(() => {
    dispatch(getAllTemplates());
    // console.log("Set Filtered User", filteredUsers);
  }, [dispatch, templatesData?.data?.length]);

  useEffect(() => {
    if (templatesData?.data?.length) {
      setFilteredUsers(templatesData.data);
    }
  }, [templatesData]);


  const headers = [
    { key: '_id', label: 'Id' },
    { key: 'name', label: 'Template Name' },
    { key: 'templateMessage', label: 'Template Message' },
    { key: 'templateDate', label: 'Date' },
    { key: 'action', label: 'Action' }
  ];

  const renderRow = (log, index) => (
    <tr key={index} className="text-black border border-gray-700 hover:bg-gray-500 whitespace-wrap h-full">
      <td className="px-2 py-2 border border-gray-900">{log?._id}</td>
      <td className="px-2 py-2 border border-gray-900">{log?.name}</td>
      <td className="px-2 py-2 border border-gray-900">{log?.components[1].text || '-'}</td>
      <td className="px-2 py-2 border border-gray-900">  {new Date(log.updatedAt).toLocaleDateString('en-GB')}</td>
      <td className="px-2 py-2 border border-gray-900 flex justify-center h-full">
        <div className="flex items-center justify-center gap-2 max-h-full">
          <button
            className="bg-[#ffc107] rounded-md py-1 px-2 text-bas font-medium me-2"
            onClick={() => {
              // setFormData({
              //   _id: log._id,
              //   username: log.username,
              //   role: log.role,
              //   permissions: extractSelectedRoles(log.permissions || {}),
              // });
              setIsModalOpen(true);
            }}
          >
            Edit
          </button>

          <button
            className="bg-[#ff0000] rounded-md py-1 px-2 text-bas font-medium text-white"
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

    const filtered = templatesData.filter(log => {
      // Search term filter (matches phone, campaign, status, or read status)
      const matchesSearch =
        log.name.includes(term);
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

  useEffect(() => {
    dispatch(getAllTemplates());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      Object.values(uploadedFiles).forEach(file => {
        if (file?.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [uploadedFiles]);

  useEffect(() => {
    if (templatesData && templatesData.statusText) {
      setTemplates(templatesData.templates || []);
    }
  }, [templatesData]);

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
        alert("Invalid file type. Please select a valid image (JPEG, PNG, or GIF).");
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

  // Adjust the height of the textarea dynamically
  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Add or update template
  const saveTemplate = async () => {
    if (!templateName || !templateMsg) {
      setFeedback("Both fields are required.");
      toast.error("Both fields are required.");
      return;
    }

    try {
      let response;

      if (editingId) {
        response = dispatch(updateTemplate(editingId, payload));
        if (response?.ok) {
          toast.success("Template updated successfully!");
        } else {
          // If the response is found but not ok
          const errorMessage = response?.message || "Failed to update template.";
          setFeedback(errorMessage);
          toast.error(errorMessage);
        }
      } else {
        response = dispatch(createTemplate(payload));
        if (response?.ok) {
          toast.success("Template added successfully!");
        } else if (response) {
          // If the response is found but not ok
          const errorMessage = response?.message || "Failed to add template.";
          setFeedback(errorMessage);
          toast.error(errorMessage);
        } else {
          // If no response object exists, it could mean no data was returned or an issue with the request.
          const errorMessage = "Server did not respond. Please try again later.";
          setFeedback(errorMessage);
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      // General catch block if there is an unexpected error
      console.error("Error occurred:", error);  // Log for debugging purposes

      // Show a generic error message
      const errorMessage = error?.message || "Something went wrong. Please try again later.";
      setFeedback(errorMessage);
      toast.error(errorMessage);
    }

    setTemplateName("");
    setTemplateMsg("");
    setEditingId(null);
  };

  // Edit Template (fetch and populate the form)
  const editTemplate = (id) => {
    const templateToEdit = templates.find((template) => template.templateId === id);
    setTemplateName(templateToEdit.template_name);
    setTemplateMsg(templateToEdit.template_msg);
    setEditingId(id);
  };

  const deleteTemplateHandler = async (id) => {
    try {
      // Show confirmation before deletion
      const isConfirmed = window.confirm("Are you sure you want to delete this template?");
      if (!isConfirmed) return;

      // Dispatch delete action
      const response = dispatch(deleteTemplate(id));

      if (response?.ok) {
        toast.success("Template deleted successfully!");
      } else {
        toast.error(response?.message || "Failed to delete template.");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };


  // Pagination Logic
  const totalPages = useMemo(() => {
    return Math.ceil(templates.length / recordsPerPage);
  }, [templates]);

  // Calculate the indices for the current page slice
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = templates.slice(indexOfFirstRecord, indexOfLastRecord);


  // Update the currentPage when the page changes
  const changePage = (pageNumber) => {
    console.log("Current records", currentRecords, pageNumber);
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;
    setCurrentPage(pageNumber);
  };

  // Ensure templates are properly fetched and loaded
  useEffect(() => {
    if (templatesData && templatesData.ok) {
      setTemplates(templatesData); // Assuming the templates are in the 'templates' field of the response      
    }
  }, [templatesData]);

  return (
    <>
      <section className="w-[100%] bg-gray-200   flex justify-center flex-col">
        <CreditHeader />
        <div className="w-full mt-8">
          <CampaignHeading campaignHeading={"All Templates"} />

          {/* <div className=""> */}
          <div className="w-full px-3 md:px-6 py-6 flex lg:flex-col gap-6">

            {/* Left Column */}
            <div className="lg:w-full w-1/2 flex flex-col gap-6">
              {/* Template Name Input */}
              <CampaignTitle
                mainTitle={"Template Name"}
                setCampaignTitle={setTemplateName}
                inputTitle={templateName}
                placeholder={"Enter Template Name"} />

              {/* Template Message Input */}
              <div className="w-[100%] h-full flex flex-col gap-2">
                <p className="text-black m-0 ">Template message</p>
                <textarea
                  ref={textareaRef}
                  value={templateMsg}
                  onChange={(e) => {
                    setTemplateMsg(e.target.value);
                    handleInput();
                  }}
                  rows={10}
                  style={{ height: "100%", minHeight: "400px" }}
                  className="w-full px-3 py-2 rounded-md bg-white text-black border-black form-control placeholder-gray-500"
                  placeholder="Enter your message"
                />
              </div>
            </div>

            {/* Upload Media Section */}
            <div className="lg:w-full w-[50%] flex flex-col gap-4">
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
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={handleCancelDelete} aria-label="Close"></button>
              </div>
              <div className="modal-body m-0">
                <p className="m-0">Are you sure you want to delete user <strong>{templatesData.name}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCancelDelete}>No</button>
                <button className="px-3 py-2 rounded-md text-white bg-[#ff0000] " onClick={() => handleConfirmDelete(templatesData._id)}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Toast Container */}
      <ToastContainer autoClose="1000" />
    </>
  );
};

export default TemplateCampaign;
