import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import CreditHeader from "../../../components/CreditHeader";
import { CampaignHeading, CampaignStatus, CampaignTitle, CountryDropDown, CSVButton, DisplayButton, GroupDropDown, PdfUploader, SendNowButton, TemplateDropdown, VideoUploader, WhatsappTextNumber } from "../../utils/Index";
import CustomEditor from "../../../components/RichTextEditor";
import ImageUploaderGroup from "../../utils/ImageUploaderGroup";
import DisplayButtonComponent from "../../../components/DisplayButtonComponent";

const InternaitionaButtonCampaign = () => {
  // File and editor states
  const inputRef = useRef(null);
  const [editorData, setEditorData] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileObj, setSelectedFileObj] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [caption, setCaption] = useState("");

  // API fetched data
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [msgTemplates, setMsgTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Additional form fields
  const [campaignTitle, setCampaignTitle] = useState("");

  // Bulk Whatsapp Number Field
  const [whatsAppNumbers, setWhatsAppNumbers] = useState("");
  const [statsNumber, setStatsNumber] = useState({
    total: 0,
    valid: 0,
    invalid: 0,
    duplicates: 0,
  });

  const [buttons, setButtons] = useState("");

  // State for file uploads.
  // For images and video, we store an object with both file and preview.
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

  // New state for countries (for dialing code) and the selected country code.
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  // Fetch message groups using axios
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/msggroup/`)
      .then((response) => setGroups(response.data))
      .catch((error) => console.error("Error fetching groups:", error));
  }, []);

  // Fetch message templates using axios
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/msgtemplate/`)
      .then((response) => setMsgTemplates(response.data))
      .catch((error) =>
        console.error("Error fetching message templates:", error)
      );
  }, []);

  // Fetch countries from REST Countries API.
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const countryData = response.data.map((country) => {
          let dialCode = "";
          if (
            country.idd &&
            country.idd.root &&
            country.idd.suffixes &&
            country.idd.suffixes.length > 0
          ) {
            // Combine root and suffix
            dialCode = country.idd.root + country.idd.suffixes[0];
          }

          // Remove '+' for consistency
          dialCode = dialCode.replace("+", "");

          return {
            name: country.name.common,
            dialCode,
          };
        });

        // Sort alphabetically
        countryData.sort((a, b) => a.name.localeCompare(b.name));

        // Set countries
        setCountries(countryData);

        // Set default country to India if found
        const india = countryData.find((c) => c.name === "India");
        if (india) {
          setSelectedCountry(india.dialCode);
        }
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Handle file upload via click or drag-and-drop
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

  const handleFile = (file) => {
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);
    setSelectedFile(fileUrl);
    setSelectedFileObj(file);

    if (file.type.startsWith("image/")) {
      setFileType("image");
    } else if (file.type.startsWith("video/")) {
      setFileType("video");
    } else if (file.type === "application/pdf") {
      setFileType("pdf");
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  // Update WhatsApp numbers when a group is selected.
  useEffect(() => {
    if (selectedGroup !== "") {
      const group = groups.find(
        (g) => g.groupId.toString() === selectedGroup.toString()
      );
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

  // Handle sending the campaign data via axios
  const handleSendCampaign = async () => {
    const formData = new FormData();
    formData.append("campaignTitle", campaignTitle);
    formData.append("selectedGroup", selectedGroup);
    formData.append("whatsAppNumbers", whatsAppNumbers);
    formData.append("userMessage", editorData);
    formData.append("selectedTemplate", selectedTemplate);
    formData.append("button1Text", buttons);

    // Append the selected country dial code
    formData.append("countryCode", selectedCountry);

    // Append the file and caption based on fileType
    if (selectedFileObj) {
      if (fileType === "pdf") {
        formData.append("pdf", selectedFileObj);
        formData.append("pdfCaption", caption);
      } else if (fileType === "video") {
        formData.append("video", selectedFileObj);
        formData.append("videoCaption", caption);
      } else if (fileType === "image") {
        // Assuming a single image file is stored in the "image1" column
        formData.append("image1", selectedFileObj);
        formData.append("image1Caption", caption);
      }
    }

    // (Optional) Log each key/value pair from the FormData for debugging.
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/campaign/sendCampaign`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Campaign sent successfully:", response.data);
      // Optionally, clear form fields or display a success message here
    } catch (error) {
      if (error.response) {
        console.error("Error sending campaign:", error.response.data);
      } else {
        console.error("Error sending campaign:", error.message);
      }
    }
  };

  return (
    <section className="w-[100%] bg-gray-200 flex justify-center flex-col pb-5">
      <CreditHeader />

      <div className="w-full mt-8">
        <CampaignHeading campaignHeading={"International Virtual Button Campaign"} />

        {/* <div className=""> */}
        <div className="w-full px-3 md:px-6 py-6 flex lg:flex-col gap-6">

          {/* Left Column */}
          <div className="lg:w-full w-2/5 flex flex-col gap-6">

            {/* CSV Button Dropdown */}
            <CSVButton />

            {/* Campaign Title */}
            <CampaignTitle
              inputTitle={campaignTitle}
              mainTitle="Campaign Title"
              setCampaignTitle={setCampaignTitle}
            />

            {/* Group Dropdown */}
            <GroupDropDown
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              groups={groups} />

            {/* Country Dropdown */}
            <CountryDropDown
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              countries={countries} />

            {/* WhatsApp Numbers Textarea */}
            <WhatsappTextNumber
              whatsAppNumbers={whatsAppNumbers}
              setWhatsAppNumbers={setWhatsAppNumbers}
              statsNumber={statsNumber}
              setStatsNumber={setStatsNumber} />
          </div>

          {/* Right Column */}
          <div className="lg:w-full w-3/5 flex flex-col gap-6">
            {/* Status */}
            <CampaignStatus
              duplicateStatus={statsNumber.duplicates}
              invalidStatus={statsNumber.invalid}
              totalStatus={statsNumber.total}
              validStatus={statsNumber.valid}
            />


            {/* Template Dropdown */}
            <TemplateDropdown
              msgTemplates={msgTemplates}
              selectedTemplate={selectedTemplate}
              setEditorData={setEditorData}
              setSelectedTemplate={setSelectedTemplate} />

            {/* Rich Text Editor */}
            <div className="w-full rounded-md h-[400px] ">
              <CustomEditor />
            </div>

            {/* File Upload and Button Settings */}
            {/* <div className="w-full">
              <DragDropButton
                handleDrop={handleDrop}
                handleFileInputChange={handleFileInputChange}
                inputRef={inputRef}
                removeFile={removeFile}
                selectedFile={selectedFile}
                fileType={fileType}
                caption={caption}
                setCaption={setCaption} />
                </div> */}

            {/* File Upload Section */}
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

            {/* Button Details */}
            <div className="bg-white rounded p-4 border border-black flex flex-col ">
              <DisplayButtonComponent buttons={buttons} setButtons={setButtons} />
            </div>
          </div>
        </div>
        {/* Send Now Button */}
        <SendNowButton handleSendCampaign={handleSendCampaign} />
      </div>
    </section >
  );
};

export default InternaitionaButtonCampaign;
