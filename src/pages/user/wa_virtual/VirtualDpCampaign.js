import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import CreditHeader from "../../../components/CreditHeader";
import userImage from "../../../assets/profile.png";
import "froala-editor/css/froala_editor.pkgd.min.css";
import { CampaignHeading, CampaignStatus, CampaignTitle, CountryDropDown, CSVButton, GroupDropDown, PdfUploader, ProfileImageUploader, RichTextEditor, SendNowButton, TemplateDropdown, VideoUploader, WhatsappTextNumber } from "../../utils/Index";
import ImageUploaderGroup from "../../utils/ImageUploaderGroup";

const VirtualDpCampaign = () => {
  // Form and editor states
  const [campaignTitle, setCampaignTitle] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [whatsAppNumbers, setWhatsAppNumbers] = useState("");
  const [editorData, setEditorData] = useState("");

  // Data fetched from APIs
  const [groups, setGroups] = useState([]);
  const [msgTemplates, setMsgTemplates] = useState([]);

  // State for media captions (for images, PDF, video)
  const [mediaCaptions, setMediaCaptions] = useState({});

  // State for user profile file.
  // The file will be sent with the key "userprofile"
  const [userprofile, setUserprofile] = useState(null);
  // For preview of user profile
  const [userprofilePreview, setUserprofilePreview] = useState(null);
  const [fileType, setFileType] = useState("");

  const [imageName, setImageName] = useState(null);

  // Country Selector State
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  // Refs for file uploads (other media: images, PDF, video)
  const inputRefs = {
    image1: useRef(null),
    image2: useRef(null),
    image3: useRef(null),
    image4: useRef(null),
    pdf: useRef(null),
    video: useRef(null),
  };

  // State for other media uploads: we store both a preview URL and the actual file.
  const [uploadedFiles, setUploadedFiles] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    pdf: null,
    video: null,
  });

  // Ref for the WhatsApp numbers textarea (for auto-resizing)
  const textareaRef = useRef(null);
  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Fetch groups when the component mounts.
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/msggroup/`)
      .then((response) => setGroups(response.data))
      .catch((error) => console.error("Error fetching groups:", error));
  }, []);

  // Fetch message templates when the component mounts.
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/msgtemplate`)
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

  // Update WhatsApp numbers when a group is selected.
  useEffect(() => {
    if (selectedGroup) {
      const group = groups.find((g) => g.groupId === parseInt(selectedGroup));
      if (group) {
        try {
          const numbers = JSON.parse(group.group_number);
          setWhatsAppNumbers(numbers.join("\n"));
        } catch (e) {
          console.error("Error parsing group numbers", e);
          setWhatsAppNumbers(group.group_number);
        }
      } else {
        setWhatsAppNumbers("");
      }
    } else {
      setWhatsAppNumbers("");
    }
  }, [selectedGroup, groups]);

  // Update editor content when a template is selected.
  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    const template = msgTemplates.find(
      (t) => t.templateId === parseInt(templateId)
    );
    setEditorData(
      template ? template.template_body || template.template_name : ""
    );
  };

  // Handle user profile file change.
  const handleUserprofileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setUserprofilePreview(URL.createObjectURL(selectedFile));
      setFileType(selectedFile.type);
      setUserprofile(selectedFile);
    }
  };

  // Handle other media uploads.
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
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        alert("File size exceeds 2MB. Please select a smaller image.");
        return;
      }
      const imagePreview = { preview: URL.createObjectURL(file), file };
      setUploadedFiles((prev) => ({ ...prev, [type]: imagePreview }));
    } else if (type === "pdf") {
      if (file.type !== "application/pdf") {
        alert("Invalid file type. Please select a PDF file.");
        return;
      }
      const maxPdfSizeInMB = 10;
      const maxPdfSizeInBytes = maxPdfSizeInMB * 1024 * 1024;
      if (file.size > maxPdfSizeInBytes) {
        alert(
          `File size exceeds ${maxPdfSizeInMB}MB. Please select a smaller PDF.`
        );
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
      const maxVideoSizeInBytes = maxVideoSizeInMB * 1024 * 1024;
      if (file.size > maxVideoSizeInBytes) {
        alert(
          `File size exceeds ${maxVideoSizeInMB}MB. Please select a smaller video.`
        );
        return;
      }
      const videoPreview = { preview: URL.createObjectURL(file), file };
      setUploadedFiles((prev) => ({ ...prev, video: videoPreview }));
    }
  };

  const removeFile = (type) => {
    setUploadedFiles((prev) => ({ ...prev, [type]: null }));
  };

  // When "Send Now" is clicked, build a FormData object and send to the API.
  // The user profile file is appended with the key "userprofile".
  const handleSend = async () => {
    const formData = new FormData();
    formData.append("campaignTitle", campaignTitle);
    formData.append("selectedGroup", selectedGroup);
    formData.append("selectedTemplate", selectedTemplate);
    formData.append("whatsAppNumbers", whatsAppNumbers);
    formData.append("userMessage", editorData);
    formData.append("countryCode", selectedCountry);
    // Append media captions
    formData.append("image1Caption", mediaCaptions.image1 || "");
    formData.append("image2Caption", mediaCaptions.image2 || "");
    formData.append("image3Caption", mediaCaptions.image3 || "");
    formData.append("image4Caption", mediaCaptions.image4 || "");
    formData.append("pdfCaption", mediaCaptions.pdf || "");
    formData.append("videoCaption", mediaCaptions.video || "");
    // Append the user profile file using the key "userprofile"
    if (userprofile) formData.append("userprofile", userprofile);
    // Append other uploaded media files
    if (uploadedFiles.image1 && uploadedFiles.image1.file) {
      formData.append("image1", uploadedFiles.image1.file);
    }
    if (uploadedFiles.image2 && uploadedFiles.image2.file) {
      formData.append("image2", uploadedFiles.image2.file);
    }
    if (uploadedFiles.image3 && uploadedFiles.image3.file) {
      formData.append("image3", uploadedFiles.image3.file);
    }
    if (uploadedFiles.image4 && uploadedFiles.image4.file) {
      formData.append("image4", uploadedFiles.image4.file);
    }
    if (uploadedFiles.pdf) {
      formData.append("pdf", uploadedFiles.pdf);
    }
    if (uploadedFiles.video && uploadedFiles.video.file) {
      formData.append("video", uploadedFiles.video.file);
    }

    // Log each key/value pair from the FormData

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/campaign/sendCampaign`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        alert("Campaign sent successfully!");
      } else {
        alert("Failed to send campaign");
      }
    } catch (error) {
      console.error("Error sending campaign:", error);
      alert("Error sending campaign. Please try again.");
    }
  };

  return (
    <section className="w-full bg-gray-200 flex justify-center flex-col">
      <CreditHeader />
      <div className="w-full mt-8">
        <CampaignHeading campaignHeading={"Virtual DP Campaign"} />

        {/* <div className=""> */}
        <div className="w-full px-3 md:px-6 py-6 flex lg:flex-col gap-6">

          {/* Left Column */}
          <div className="lg:w-full w-2/5 flex flex-col gap-6">

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

            {/* CSV Button Dropdown */}
            <CSVButton />

            {/* Country Dropdown */}
            <CountryDropDown
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              countries={countries} />

            {/* WhatsApp Numbers Textarea */}
            <WhatsappTextNumber
              whatsAppNumbers={whatsAppNumbers}
              setWhatsAppNumbers={setWhatsAppNumbers} />
          </div>

          {/* Right Column: Status, Template Selection, Image/Editor & File Uploads */}
          <div className="lg:w-full w-3/5 flex flex-col gap-6">
            {/* Status */}
            <CampaignStatus
              duplicateStatus={0}
              invalidStatus={0}
              totalStatus={0}
              validStatus={0}
            />

            {/* Template Dropdown */}
            <TemplateDropdown
              msgTemplates={msgTemplates}
              selectedTemplate={selectedTemplate}
              setEditorData={setEditorData}
              setSelectedTemplate={setSelectedTemplate} />

            {/* Image + Editor Section */}
            <div className="w-full flex lg:flex-col gap-3">
              <ProfileImageUploader
                userImage={userImage}
                userprofilePreview={userprofilePreview}
                handleUserprofileChange={handleUserprofileChange}
                setUserprofile={setUserprofile}
                setUserprofilePreview={setUserprofilePreview}
                imageName={imageName}
                setImageName={setImageName}
              />

              {/* Froala Editor for Custom Message */}
              <div className="w-full border border-black rounded-b-none rounded-[11px] ">
                <RichTextEditor
                  editorData={editorData}
                  setEditorData={setEditorData} />
              </div>
            </div>

            {/* File Uploads Section */}
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
      </div>

      {/* Send Button */}
      <SendNowButton handleSendCampaign={handleSend} />
    </section>
  );
};

export default VirtualDpCampaign;
