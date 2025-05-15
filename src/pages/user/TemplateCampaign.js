import { useEffect, useMemo, useRef, useState } from 'react';
import CreditHeader from '../../components/CreditHeader';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CampaignHeading, CampaignTitle, PdfUploader, VideoUploader } from '../utils/Index';
import ImageUploaderGroup from '../utils/ImageUploaderGroup';
import { useDispatch, useSelector } from 'react-redux';
import { createTemplate, deleteTemplate, getAllTemplates, updateTemplate } from '../../redux/actions/templateAction';

const TemplateCampaign = () => {
  const [templateName, setTemplateName] = useState("");
  const [templateMsg, setTemplateMsg] = useState("");
  const [feedback, setFeedback] = useState("");
  const [templates, setTemplates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [editingId, setEditingId] = useState(null); // Track which template is being edited
  const dispatch = useDispatch();

  const { loading, data, } = useSelector((state) => state.template);
  console.log("Loading Data", data);

  const textareaRef = useRef(null);

  const payload = {
    userId: 1 || editingId,
    template_name: templateName,
    template_msg: templateMsg,
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
    // Fetch templates when component mounts
    dispatch(getAllTemplates());
    return () => {
      Object.values(uploadedFiles).forEach(file => {
        if (file?.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [dispatch, uploadedFiles]);

  useEffect(() => {
    if (data && data.ok) {
      setTemplates(data.templates || []);
    }
  }, [data]);

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

    const templateData = {
      ...payload,
      template_name: templateName,
      template_msg: templateMsg,
    };

    try {
      let response;

      if (editingId) {
        response = dispatch(updateTemplate(editingId, templateData));
        if (response?.ok) {
          toast.success("Template updated successfully!");
        } else {
          // If the response is found but not ok
          const errorMessage = response?.message || "Failed to update template.";
          setFeedback(errorMessage);
          toast.error(errorMessage);
        }
      } else {
        response = dispatch(createTemplate(templateData));
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
    if (data && data.ok) {
      setTemplates(data.templates); // Assuming the templates are in the 'templates' field of the response
    }
  }, [data]);

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

          <div className='px-3 pb-3'>
            <div className="w-full max-h-[400px] rounded text-white bg-white overflow-auto">
              <table className="w-full text-center table-auto">
                <thead className="bg-gray-800 border-b-2 border-gray-600 whitespace-nowrap">
                  <tr className='flex justify-around py-2 text-base'>
                    <th className="mr-0 text-white font-semibold">Id</th>
                    <th className="mr-0 text-white font-semibold">Template Name</th>
                    <th className="mr-0 text-white font-semibold">Template Message</th>
                    <th className="mr-0 text-white font-semibold">Date</th>
                    <th className="mr-0 text-white font-semibold">Action</th>
                  </tr>
                </thead>
                {(!currentRecords || currentRecords.length === 0 || loading) &&
                  (<tbody className=" text-black">
                    {currentRecords.map((template) => (
                      <tr key={template.templateId} className="border-b border-gray-600 transition">
                        <td className="py-2 px-2">{template.templateId}</td>
                        <td className="py-2 px-2">{template.template_name}</td>
                        <td className="py-2 px-2">{template.template_msg}</td>
                        <td className="py-2 px-2">
                          {moment(template.createAt).format('DD-MMM-YYYY')}
                        </td>
                        <td className="py-2 px-2">
                          <button onClick={() => editTemplate(template.templateId)} className='me-2'>Edit</button>
                          <button onClick={() => deleteTemplateHandler(template.templateId)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  )}
              </table>
              {(!currentRecords || currentRecords.length === 0) && (
                <h5 className="text-center py-4 m-0 text-xl tracking-wider text-red-400 font-bold">
                  Fail to Load the Data
                </h5>)}
              {/* Pagination */}
              <div className="flex justify-end align-items-center gap-4 border-t border-gray-400 pr-4 py-2 text-black">
                <button
                  className="px-4 py-2 border-2 border-gray-500 rounded"
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                <span>{`${(currentPage - 1) * recordsPerPage + 1} - ${Math.min(currentPage * recordsPerPage, templates.length)}`} of {templates.length}</span>
                <button
                  className="px-4 py-2 border-2 border-gray-500 rounded"
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>
      {/* Toast Container */}
      <ToastContainer />
    </>
  );
};

export default TemplateCampaign;
