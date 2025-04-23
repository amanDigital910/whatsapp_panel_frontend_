import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa6";
import CreditHeader from "../../../components/CreditHeader";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_editor.pkgd.min.css";

const PersonalVSVCampaign = () => {
  const fileInputRef = useRef(null);
  const inputRefs = {
    image1: useRef(null),
    image2: useRef(null),
    image3: useRef(null),
    image4: useRef(null),
    pdf: useRef(null),
    video: useRef(null),
  };

  // Campaign and editor details
  const [campaignTitle, setCampaignTitle] = useState("");
  const [editorData, setEditorData] = useState("");
  const [whatsAppNumbers, setWhatsAppNumbers] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // CSV column selections
  const [mobileColumn, setMobileColumn] = useState("a");
  const [mediaUrlColumn, setMediaUrlColumn] = useState("b");

  // API data for groups and templates
  const [groups, setGroups] = useState([]);
  const [msgTemplates, setMsgTemplates] = useState([]);

  // File & preview storage for media uploads
  const [uploadedFiles, setUploadedFiles] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    pdf: null,
    video: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [fileType, setFileType] = useState("");

  // Captions for media
  const [imageCaptions, setImageCaptions] = useState(["", "", "", ""]);
  const [pdfCaption, setPdfCaption] = useState("");
  const [videoCaption, setVideoCaption] = useState("");

  // Alphabet array for dropdowns
  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  // Fetch groups and message templates
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/msggroup/`)
      .then((response) => setGroups(response.data))
      .catch((error) => console.error("Error fetching groups:", error));
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/msgtemplate`)
      .then((response) => setMsgTemplates(response.data))
      .catch((error) =>
        console.error("Error fetching message templates:", error)
      );
  }, []);

  // When a group is selected, populate WhatsApp numbers if available
  useEffect(() => {
    if (selectedGroup !== "") {
      const group = groups.find((g) => g.groupId.toString() === selectedGroup);
      if (group) {
        try {
          const numbersArray = JSON.parse(group.group_number);
          setWhatsAppNumbers(numbersArray.join("\n"));
        } catch (error) {
          console.error("Error parsing group_number:", error);
          setWhatsAppNumbers("");
        }
      }
    } else {
      setWhatsAppNumbers("");
    }
  }, [selectedGroup, groups]);

  // Handle media file uploads (for image, pdf, video)
  const handleFileUpload = (e, type) => {
    const files = e.target.files;
    if (!files.length) return;
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
      const imageUrl = URL.createObjectURL(file);
      setUploadedFiles((prev) => ({
        ...prev,
        [type]: { file, preview: imageUrl },
      }));
    } else if (type === "pdf") {
      if (file.type !== "application/pdf") {
        alert("Invalid file type. Please select a PDF file.");
        return;
      }
      const maxPdfSizeInMB = 10;
      if (file.size > maxPdfSizeInMB * 1024 * 1024) {
        alert(
          `File size exceeds ${maxPdfSizeInMB}MB. Please select a smaller PDF.`
        );
        return;
      }
      setUploadedFiles((prev) => ({ ...prev, pdf: { file, preview: "" } }));
    } else if (type === "video") {
      const validVideoTypes = ["video/mp4"];
      if (!validVideoTypes.includes(file.type)) {
        alert("Invalid file type. Please select a valid video (MP4).");
        return;
      }
      const maxVideoSizeInMB = 15;
      if (file.size > maxVideoSizeInMB * 1024 * 1024) {
        alert(
          `File size exceeds ${maxVideoSizeInMB}MB. Please select a smaller video.`
        );
        return;
      }
      setUploadedFiles((prev) => ({ ...prev, video: { file, preview: "" } }));
    }
  };

  const removeFile = (type) => {
    setUploadedFiles((prev) => ({ ...prev, [type]: null }));
  };

  // Handle drag & drop or file input for Excel/CSV file
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    validateFile(file);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    validateFile(file);
  };

  const validateFile = (file) => {
    if (file) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];
      if (validTypes.includes(file.type)) {
        setSelectedFile(URL.createObjectURL(file));
        setExcelFile(file);
        setFileType(file.type.includes("spreadsheet") ? "excel" : "csv");
      } else {
        alert("Only Excel (.xlsx) and CSV (.csv) files are allowed.");
        removeFile1();
      }
    }
  };

  const removeFile1 = () => {
    setSelectedFile(null);
    setExcelFile(null);
    setFileType("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Process the CSV/Excel file via the API.
  // Extracted WhatsApp numbers will be set into the textarea,
  // and the media URLs will be appended to the Froala editor message.
  const handleCsvProcessing = async () => {
    if (!excelFile) {
      alert("Please upload an Excel/CSV file first.");
      return;
    }
    const csvFormData = new FormData();
    csvFormData.append("uploadExcel", excelFile);
    csvFormData.append("whatsappColumn", mobileColumn);
    csvFormData.append("mediaUrlColumn", mediaUrlColumn);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/uploadExcel`,
        csvFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // Expecting response.data.data to be an array of objects: { whatsapp, mediaUrl }
      const extractedData = response.data.data;

      // Update WhatsApp numbers field
      const numbers = extractedData.map((row) => row.whatsapp).filter(Boolean);
      setWhatsAppNumbers(numbers.join("\n"));

      // Process media URLs and append them into the editor message
      const mediaUrls = extractedData
        .map((row) => row.mediaUrl)
        .filter((url) => url && url.trim() !== "");

      let mediaUrlText = "";
      for (let url of mediaUrls) {
        mediaUrlText += url + "\n";
      }
      // Append the media URLs to the current editor content
      setEditorData((prev) => prev + "\n" + mediaUrlText);

      alert("CSV processed successfully!");
    } catch (error) {
      console.error("Error processing CSV:", error);
      alert("Failed to process CSV file.");
    }
  };

  // Submit the campaign data
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("campaignTitle", campaignTitle);
    formData.append("selectedGroup", selectedGroup);
    formData.append("whatsAppNumbers", whatsAppNumbers);
    formData.append("userMessage", editorData);
    formData.append("selectedTemplate", selectedTemplate);

    // Append media files if provided manually
    if (uploadedFiles.image1?.file) {
      formData.append("image1", uploadedFiles.image1.file);
    }
    if (uploadedFiles.image2?.file) {
      formData.append("image2", uploadedFiles.image2.file);
    }
    if (uploadedFiles.image3?.file) {
      formData.append("image3", uploadedFiles.image3.file);
    }
    if (uploadedFiles.image4?.file) {
      formData.append("image4", uploadedFiles.image4.file);
    }
    if (uploadedFiles.pdf?.file) {
      formData.append("pdf", uploadedFiles.pdf.file);
    }
    if (uploadedFiles.video?.file) {
      formData.append("video", uploadedFiles.video.file);
    }
    // In this version, media URLs (if extracted from CSV) are already appended in the editor message.
    // Append captions
    formData.append("image1Caption", imageCaptions[0]);
    formData.append("image2Caption", imageCaptions[1]);
    formData.append("image3Caption", imageCaptions[2]);
    formData.append("image4Caption", imageCaptions[3]);
    formData.append("pdfCaption", pdfCaption);
    formData.append("videoCaption", videoCaption);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/PersonalCampaign/sendpersonalCampaign`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Campaign sent successfully!");
    } catch (error) {
      console.error("Error sending campaign", error);
      alert("Failed to send campaign");
    }
  };

  return (
    <section className="w-full bg-gray-200  flex flex-col">
      <CreditHeader />
      <div className="w-full px-4 mt-8">
        <div className="w-full py-2 mb-3 bg-white">
          <h1
            className="text-2xl text-black font-semibold pl-4"
            style={{ fontSize: "32px" }}
          >
            Personal Csv Campaign
          </h1>
        </div>
        <div className="flex gap-6">
          {/* Left Side: Campaign Title, Group, WhatsApp Numbers */}
          <div className="w-2/5 flex flex-col gap-6">
            <div className="flex items-center">
              <p className="w-1/3 py-2 bg-brand_colors text-white text-center font-semibold text-sm m-0 rounded-md">
                Campaign Title
              </p>
              <input
                type="text"
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                className="w-full border border-black rounded-md py-2 px-4 text-black placeholder-gray-500"
                placeholder="Enter Campaign Title"
              />
            </div>
            <div className="flex items-center gap-4">
              <select
                className="form-select border-black"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value="">Select Your Group</option>
                {groups.map((group) => (
                  <option key={group.groupId} value={group.groupId}>
                    {group.group_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <textarea
                className="w-full p-4 rounded-md bg-white text-black border border-black placeholder-gray-500"
                placeholder="Enter WhatsApp Number"
                rows={8}
                style={{ height: "720px" }}
                value={whatsAppNumbers}
                onChange={(e) => setWhatsAppNumbers(e.target.value)}
              ></textarea>
            </div>
          </div>
          {/* Right Side: Templates, CSV Upload, Editor, Media Upload */}
          <div className="w-3/5 flex flex-col gap-6">
            <div className="flex gap-4">
              <div className="w-full px-4 py-2 rounded-md text-white font-semibold bg-[#0d0c0d] text-center">
                Total 0
              </div>
              <div className="w-full px-4 py-2 rounded-md text-white font-semibold bg-[#033b01] text-center">
                Valid 0
              </div>
              <div className="w-full px-4 py-2 rounded-md text-white font-semibold bg-[#f70202] text-center">
                InValid 0
              </div>
              <div className="w-full px-4 py-2 rounded-md text-white font-semibold bg-[#8a0418] text-center">
                Duplicate 0
              </div>
            </div>
            <div className="w-full">
              <select
                className="form-select border-black"
                value={selectedTemplate}
                onChange={(e) => {
                  const templateId = e.target.value;
                  setSelectedTemplate(templateId);
                  const template = msgTemplates.find(
                    (t) => t.templateId.toString() === templateId
                  );
                  if (template) setEditorData(template.template_msg);
                }}
              >
                <option value="">Select Your Template</option>
                {msgTemplates.map((template) => (
                  <option key={template.templateId} value={template.templateId}>
                    {template.template_name}
                  </option>
                ))}
              </select>
            </div>
            {/* CSV Column Selection & Process CSV Button */}
            <div className="container">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Mobile Column</label>
                  <select
                    className="form-select"
                    value={mobileColumn}
                    onChange={(e) => setMobileColumn(e.target.value)}
                  >
                    {alphabet.map((letter) => (
                      <option key={letter} value={letter.toLowerCase()}>
                        {letter}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Media URL Column</label>
                  <select
                    className="form-select"
                    value={mediaUrlColumn}
                    onChange={(e) => setMediaUrlColumn(e.target.value)}
                  >
                    {alphabet.map((letter) => (
                      <option key={letter} value={letter.toLowerCase()}>
                        {letter}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-12">
                  <button
                    className="btn btn-primary"
                    onClick={handleCsvProcessing}
                  >
                    Process CSV
                  </button>
                </div>
              </div>
            </div>
            {/* CSV/Excel File Drag & Drop Area */}
            <div className="w-full">
              <div
                className="w-full h-[200px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center text-gray-500 hover:border-blue-400 hover:text-blue-400 cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                {selectedFile ? (
                  <div className="w-full h-full relative">
                    {fileType === "excel" && (
                      <div className="w-full h-full flex justify-center items-center text-green-500">
                        <span className="text-[20px] font-bold">
                          Excel File Uploaded
                        </span>
                      </div>
                    )}
                    {fileType === "csv" && (
                      <div className="w-full h-full flex justify-center items-center text-blue-500">
                        <span className="text-[20px] font-bold">
                          CSV File Uploaded
                        </span>
                      </div>
                    )}
                    <MdDelete
                      className="absolute top-2 right-2 text-[25px] text-red-500 cursor-pointer"
                      onClick={removeFile1}
                    />
                  </div>
                ) : (
                  <p className="text-center">
                    Drag and drop your CSV or Excel file here or click to upload
                  </p>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>
            {/* Froala Editor */}
            <div className="w-full border border-black rounded p-3">
              <FroalaEditor
                tag="textarea"
                config={{
                  placeholderText: "Enter your text here...",
                  charCounterCount: true,
                  toolbarButtons: ["bold", "italic", "formatOL"],
                  quickInsertButtons: [],
                  pluginsEnabled: [],
                  height: 300,
                  events: {
                    initialized: function () {
                      const toolbar =
                        document.querySelector(".fr-second-toolbar");
                      if (toolbar) toolbar.style.color = "white";
                    },
                  },
                }}
                model={editorData}
                onModelChange={(data) => setEditorData(data)}
              />
            </div>
            {/* Media Upload Section */}
            <div className="w-full bg-white rounded p-3 border border-black">
              <div className="flex flex-col gap-4">
                <h6>Upload Image (File size 2 MB.) :</h6>
                <div className="grid grid-cols-2 gap-4">
                  {["image1", "image2", "image3", "image4"].map(
                    (type, index) => (
                      <div key={index} className="flex gap-4">
                        <input
                          type="file"
                          className="hidden"
                          ref={inputRefs[type]}
                          onChange={(e) => handleFileUpload(e, type)}
                        />
                        <div className="flex flex-col gap-2">
                          <div className="flex">
                            <div
                              className="cursor-pointer"
                              onClick={() => inputRefs[type].current.click()}
                            >
                              <button className="bg-green-600 text-white py-2 px-4 rounded">
                                Image {index + 1}
                              </button>
                            </div>
                            <div>
                              <input
                                type="text"
                                maxLength={1500}
                                value={imageCaptions[index]}
                                onChange={(e) => {
                                  const newCaptions = [...imageCaptions];
                                  newCaptions[index] = e.target.value;
                                  setImageCaptions(newCaptions);
                                }}
                                className="w-[300px] border border-gray-300 py-2 px-3 rounded-lg"
                                placeholder={`Enter caption for Image ${
                                  index + 1
                                }`}
                              />
                            </div>
                          </div>
                          {uploadedFiles[type] && (
                            <div className="relative p-2 rounded border border-gray-200 h-[250px]">
                              <img
                                src={uploadedFiles[type].preview}
                                alt={`Uploaded ${type}`}
                                className="absolute z-0 w-full h-full object-contain"
                              />
                              <MdDelete
                                className="absolute top-2 right-2 text-[25px] text-red-500 cursor-pointer"
                                onClick={() => removeFile(type)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
                <hr />
                <div className="flex gap-4">
                  <div className="w-full">
                    <h6>PDF (File size 10 MB.) :</h6>
                    <div className="flex gap-4">
                      <input
                        type="file"
                        className="hidden"
                        ref={inputRefs.pdf}
                        onChange={(e) => handleFileUpload(e, "pdf")}
                      />
                      <div className="flex flex-col gap-2">
                        <div className="flex">
                          <div
                            className="cursor-pointer"
                            onClick={() => inputRefs.pdf.current.click()}
                          >
                            <button className="bg-green-600 text-white py-2 px-4 rounded">
                              PDF
                            </button>
                          </div>
                          <div>
                            <input
                              type="text"
                              value={pdfCaption}
                              onChange={(e) => setPdfCaption(e.target.value)}
                              className="w-[300px] border border-gray-300 py-2 px-3 rounded-lg"
                              placeholder="Enter caption for PDF"
                              maxLength={1500}
                            />
                          </div>
                        </div>
                        {uploadedFiles.pdf && (
                          <div className="relative p-2 rounded border border-gray-200 h-[250px] flex justify-center items-center">
                            {uploadedFiles.pdf.preview ? (
                              <>
                                <FaFilePdf className="text-[150px] text-red-400" />
                                <span className="absolute bottom-2 text-xs bg-white px-1">
                                  {uploadedFiles.pdf.preview}
                                </span>
                              </>
                            ) : (
                              <FaFilePdf className="text-[150px] text-red-400" />
                            )}
                            <MdDelete
                              className="absolute top-2 right-2 text-[25px] text-red-500 cursor-pointer"
                              onClick={() => removeFile("pdf")}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <h6>Video (File size 15 MB.) :</h6>
                    <div className="flex gap-4">
                      <input
                        type="file"
                        className="hidden"
                        ref={inputRefs.video}
                        onChange={(e) => handleFileUpload(e, "video")}
                      />
                      <div className="flex flex-col gap-2">
                        <div className="flex">
                          <div
                            className="cursor-pointer"
                            onClick={() => inputRefs.video.current.click()}
                          >
                            <button className="bg-green-600 text-white py-2 px-4 rounded">
                              Video
                            </button>
                          </div>
                          <div>
                            <input
                              type="text"
                              value={videoCaption}
                              onChange={(e) => setVideoCaption(e.target.value)}
                              maxLength={1500}
                              className="w-[300px] border border-gray-300 py-2 px-3 rounded-lg"
                              placeholder="Enter caption for Video"
                            />
                          </div>
                        </div>
                        {uploadedFiles.video && (
                          <div className="relative p-2 rounded border border-gray-200 h-[250px]">
                            <video
                              src={
                                uploadedFiles.video.file
                                  ? URL.createObjectURL(
                                      uploadedFiles.video.file
                                    )
                                  : uploadedFiles.video.preview
                              }
                              className="w-full h-full object-contain"
                              controls
                            />
                            <MdDelete
                              className="absolute top-2 right-2 text-[25px] text-red-500 cursor-pointer"
                              onClick={() => removeFile("video")}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mt-4 mb-4">
          <button
            onClick={handleSubmit}
            className="w-full rounded-md bg-green-600 py-3 text-white font-semibold flex items-center justify-center hover:bg-green-500 transition duration-300"
          >
            Send Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default PersonalVSVCampaign;
