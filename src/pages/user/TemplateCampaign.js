/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
import { useEffect, useMemo, useRef, useState } from 'react';
import CreditHeader from '../../components/CreditHeader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CampaignHeading, CampaignTitle, CopyToClipboard, CustomizeTable, DownloadCSVButton, DownloadPDFButton, PdfUploader, RecordsPerPageDropdown, VideoUploader } from '../utils/Index';
import ImageUploaderGroup from '../utils/ImageUploaderGroup';
import { useDispatch, useSelector } from 'react-redux';
import { createTemplate, deleteTemplate, getAllTemplates, updateTemplate } from '../../redux/actions/templateAction';
import useIsMobile from '../../hooks/useMobileSize';
import '../user/whatsapp_offical/commonCSS.css'

const TemplateCampaign = ({ isOpen }) => {
  const { loading, error, templatesData } = useSelector((state) => state.template);
  const [templateName, setTemplateName] = useState("");
  const [templateMsg, setTemplateMsg] = useState("");
  const [feedback, setFeedback] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(25);
  const [editingId, setEditingId] = useState(null); // Track which template is being edited
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // const [formData, setFormData] = useState({
  //   _id: "",
  //   name: "",
  //   templateMessage: "",
  // });

  const [sortConfig, setSortConfig] = useState({ key: 'updatedAt', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');

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



  const textareaRef = useRef(null);

  const handleEdit = (template) => {
    setEditingId(template._id);
    setTemplateName(template.name || "");
    setTemplateMsg(template.message?.text || "");

    // Populate media files with URL previews only (files can't be re-uploaded from server response)
    const uploadedImages = {};
    const captions = {};

    if (Array.isArray(template.images)) {
      template.images.forEach((img, index) => {
        const key = `image${index + 1}`;

        uploadedImages[key] = {
          file: null, // File not re-selectable, just for preview
          preview: `${process.env.REACT_APP_API_URL}${img?.url}`, // your media prefix
          filename: img.filename,
        };
        captions[key] = img.caption || "";
      });
    }

    if (template.video) {
      uploadedImages.video = {
        file: null,
        preview: (`${process.env.REACT_APP_API_URL}${template?.video.url}`),
        filename: template.video.filename,
      };
      captions.video = template.video.caption || "";
    }

    if (template.pdf) {
      uploadedImages.pdf = {
        file: null,
        preview: `${process.env.REACT_APP_API_URL}${template?.pdf.url}`,
        filename: template.pdf.filename,
      };
      captions.pdf = template.pdf.caption || "";
    }

    setUploadedFiles(uploadedImages);
    setMediaCaptions(captions);
  };


  // Close form modal
  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setFormData({}); // Reset formData if needed
  // };

  // Delete confirmation handlers
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = async (userId) => {
    try {
      const response = await dispatch(deleteTemplate(userId));

      if (response?.success === true) {
        toast.success(response.message || "Template deleted successfully!");
        await dispatch(getAllTemplates());
      } else {
        toast.error(response.message || "Failed to delete template.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Something went wrong while deleting the template.");
    } finally {
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };


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
    dispatch(getAllTemplates());
  }, [dispatch]);

  const headers = [
    { key: '_id', label: 'Id' },
    { key: 'name', label: 'Template Name' },
    { key: 'nestedMsg', label: 'Template Message' },
    { key: 'updatedAt', label: 'Last Updated' },
    { key: 'action', label: 'Action' }
  ];

  const renderRow = (log, index) => {
    const nestedMsg = log?.message?.text;
    return (
      <tr key={index} className="text-black border border-gray-700 hover:bg-gray-500 whitespace-wrap h-full">
        <td className="px-2 py-2 border border-gray-900 w-20">{log?._id?.slice(-5)}</td>
        <td className="px-2 py-2 border border-gray-900">{log?.name}</td>
        <td className="px-2 py-2 border border-gray-900">{nestedMsg || '-'}</td>
        <td className="px-2 py-2 border border-gray-900">
          {new Date(log?.updatedAt).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </td>
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
  }

  const filteredAndSortedLogs = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    const filtered = (templatesData || []).filter(log => {
      const matchSearch = log?.name?.toLowerCase() || "";
      return matchSearch?.includes(term);
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
  }, [templatesData, searchTerm, sortConfig]);

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
      const maxPdfSizeInMB = 15;
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
      toast.error("Template name and message are required.");
      return false;
    } else {
      setFeedback("")
    }

    const formData = new FormData();

    // Append basic text fields
    formData.append("name", templateName);
    formData.append("message[text]", templateMsg);

    ["image1", "image2", "image3", "image4"].forEach((key, index) => {
      const media = uploadedFiles[key];
      if (media?.file) {
        formData.append(`images[${index}][url]`, media.file);
        formData.append(`images[${index}][filename]`, media.file.name);
        formData.append(`images[${index}][caption]`, mediaCaptions[key] || "");
      }
    });

    // Video
    if (uploadedFiles.video?.file) {
      formData.append("video[url]", uploadedFiles.video.file);
      formData.append("video[caption]", mediaCaptions.video || "");
      formData.append("video[filename]", uploadedFiles.video.file.name);
    }

    // PDF
    if (uploadedFiles.pdf?.file) {
      formData.append("pdf[url]", uploadedFiles.pdf.file);
      formData.append("pdf[caption]", mediaCaptions.pdf || "");
      formData.append("pdf[filename]", uploadedFiles.pdf.file.name);
    }


    try {
      let response;
      if (editingId) {
        response = await dispatch(updateTemplate(editingId, formData));
      } else {
        response = await dispatch(createTemplate(formData));
      }
      console.log("Response Data", response);


      if (response?.success === true) {
        toast.success(editingId ? "Template updated successfully!" : "Template created successfully!");
        setTemplateName("");
        setTemplateMsg("");
        setUploadedFiles({
          image1: null,
          image2: null,
          image3: null,
          image4: null,
          pdf: null,
          video: null,
        });
        setMediaCaptions({
          image1: "",
          image2: "",
          image3: "",
          image4: "",
          pdf: "",
          video: "",
        });
        setEditingId(null);
        dispatch(getAllTemplates());
      } else {
        toast.error(response?.message || (editingId ? "Failed to update template." : "Failed to create template."));
      }
    } catch (error) {
      const errorMsg = error.message ||
        error.response?.data?.message ||
        "Upload failed. Please try again.";
      toast.error(errorMsg);
    }
  };

  // Pagination Logic
  const totalPages = useMemo(() => {
    return Math.ceil(templatesData.length / recordsPerPage);
  }, [templatesData]);

  // Calculate the indices for the current page slice
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = templatesData?.slice(indexOfFirstRecord, indexOfLastRecord);

  // Update the currentPage when the page changes
  const changePage = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;
    setCurrentPage(pageNumber);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <>
      <section className={`bg-gray-200 flex flex-col justify-center ${!isMobile ? (isOpen ? "ml-[240px] w-[calc(100vw-242px)]" : "ml-20 w-[calc(100vw-90px)]") : ""}`}>
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
                {/* <p className="text-black m-0 ">Template message</p> */}
                <textarea
                  ref={textareaRef}
                  value={templateMsg}
                  onChange={(e) => {
                    setTemplateMsg(e.target.value);
                    handleInput();
                  }}
                  rows={10}
                  style={{ height: "100%", minHeight: "400px" }}
                  className="w-full px-3 py-2 flex-1 rounded-md bg-white text-black border-black form-control placeholder-gray-500"
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
          <div className="flex items-center mb-4 px-3 flex-col">
            {feedback && <p className="text-red-500 m-0">{feedback}</p>}
            <button className="bg-[#0b5ed7] w-full rounded-md font-semibold text-white text-xl py-2" onClick={saveTemplate}>
              {editingId ? "Update" : "Submit"}
            </button>
            {/* Feedback */}
          </div>

          <div className="bg-white p-3 m-3">
            {loading ? (
              <div className="text-center my-4">
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )
              // : error ? (
              //   <div className="text-center text-red-600 my-4 font-semibold">
              //     {error}
              //   </div>)
              :
              <div>
                <div className="flex  md:justify-start justify-between gap-3 md:flex-col pb-3 ">
                  <div className="flex gap-3  ">
                    <CopyToClipboard headers={headers} data={templatesData} />
                    <DownloadCSVButton headers={headers} dataLogs={templatesData} />
                    <DownloadPDFButton headers={headers} dataLogs={templatesData} />
                  </div>
                  <div className='flex gap-3 md:flex-col md:justify-center justify-end '>
                    <div className="relative md:w-full max-w-[300px]">
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
                    <div className='flex sm:flex-row gap-3'>
                      <RecordsPerPageDropdown
                        recordsPerPage={recordsPerPage}
                        setRecordsPerPage={setRecordsPerPage}
                        setCurrentPage={setCurrentPage}
                      />
                      <div className="flex flex-row whitespace-nowrap gap-2 align-items-center ">
                        <button
                          className="btn btn-dark"
                          onClick={handlePrevious}
                          disabled={currentPage === 1}
                        >
                          &lt;
                        </button>
                        <div className="">
                          {indexOfFirstRecord + 1} -{' '}
                          {Math.min(indexOfLastRecord, filteredAndSortedLogs.length)} of{' '}
                          {filteredAndSortedLogs.length}
                        </div>
                        <button
                          className="btn btn-dark"
                          onClick={handleNext}
                          disabled={currentPage === totalPages}
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={` w-full bg-gray-300 flex-shrink-0 overflow-auto custom-horizontal-scroll select-text h-full custom-horizontal-scroll ${!isMobile ? (isOpen ? "max-w-[calc(100vw-50px)]" : "max-w-[calc(100vw-65px)]") : "max-w-[calc(100vw-64px)]"}`}>
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
              </div>}
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
                <p className="m-0">Confirm Delete: <strong>{selectedUser.name}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCancelDelete}>No</button>
                <button className="px-3 py-2 rounded-md text-white bg-red-600" onClick={() => handleConfirmDelete(selectedUser?._id)}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Toast Container */}
      {/* <ToastContainer autoClose="3000" /> */}
    </>
  );
};

export default TemplateCampaign;
