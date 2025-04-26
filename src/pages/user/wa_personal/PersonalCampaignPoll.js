import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import CreditHeader from "../../../components/CreditHeader";
import { CampaignHeading, CampaignStatus, CampaignTitle, CountryDropDown, CSVButton, DelayButtonDetails, GroupDropDown, PdfUploader, PollCampaign, SendNowButton, TemplateDropdown, VideoUploader, WhatsappTextNumber } from "../../utils/Index";
import ImageUploaderGroup from "../../utils/ImageUploaderGroup";
import CustomEditor from "../../../components/RichTextEditor";

const PersonalCampaignPoll = () => {
  // Campaign and group details
  const [campaignTitle, setCampaignTitle] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [whatsAppNumbers, setWhatsAppNumbers] = useState("");

  // Editor content (sent as userMessage)
  const [editorData, setEditorData] = useState("");

  // Media file uploads – images and video are stored as an object (with file and preview)
  const [uploadedFiles, setUploadedFiles] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    pdf: null,
    video: null,
  });

  // Captions for each media file
  const [mediaCaptions, setMediaCaptions] = useState({
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    pdf: "",
    video: "",
  });

  // Refs for hidden file inputs
  const inputRefs = {
    image1: useRef(null),
    image2: useRef(null),
    image3: useRef(null),
    image4: useRef(null),
    pdf: useRef(null),
    video: useRef(null),
  };

  // Message templates
  const [msgTemplates, setMsgTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  //Group Dropdown
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  // Delay between messages
  const [delayBetweenMessages, setDelayBetweenMessages] = useState("");

  // Poll question and options (maximum 7 options)
  const [question, setQuestion] = useState("");
  const [inputs, setInputs] = useState([""]);

  // Fetch groups from your API
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/msggroup/`)
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => console.error("Error fetching groups:", error));
  }, []);

  // Fetch countries from REST Countries API.
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

  // Fetch message templates from your API
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/msgtemplate`)
      .then((response) => setMsgTemplates(response.data))
      .catch((error) =>
        console.error("Error fetching message templates:", error)
      );
  }, []);

  // When a group is selected, update the WhatsApp numbers field
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

  // Handle file uploads for images, PDF, and video
  const handleFileUpload = (e, type) => {
    const files = e.target.files;
    if (!files.length) return;
    const file = files[0];

    if (type.startsWith("image")) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        alert("Invalid file type. Please select a JPEG, PNG, or GIF image.");
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
        alert("Invalid file type. Please select a valid MP4 video.");
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

  // Update media captions
  const handleMediaCaptionChange = (e, type) => {
    setMediaCaptions((prev) => ({ ...prev, [type]: e.target.value }));
  };

  // Update poll options
  const handleInputChange = (value, index) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = value;
    setInputs(updatedInputs);
  };

  const handleAddMore = () => {
    if (inputs.length < 7) {
      setInputs([...inputs, ""]);
    } else {
      alert("You can only add up to 7 options.");
    }
  };

  const delayOptions = [
    { value: "", label: "Delay Between Messages", disabled: true },
    { value: "3", label: "3 Sec" },
    { value: "5", label: "5 Sec" },
    { value: "10", label: "10 Sec" },
    { value: "20", label: "20 Sec" },
    { value: "30", label: "30 Sec" },
    { value: "60", label: "60 Sec" },
  ];

  // When the "Send Now" button is clicked, collect and send all data
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("campaignTitle", campaignTitle);
    formData.append("selectedGroup", selectedGroup);
    formData.append("whatsAppNumbers", whatsAppNumbers);
    formData.append("userMessage", editorData);
    formData.append("selectedTemplate", selectedTemplate);
    formData.append("countryCode", selectedCountry);
    formData.append("BetweenMessages", delayBetweenMessages);
    // Send poll question and options (stringify the options array)
    formData.append("pollQuestion", question);
    formData.append("pollOptions", JSON.stringify(inputs.slice(0, 7)));

    // Append media captions
    formData.append("image1Caption", mediaCaptions.image1);
    formData.append("image2Caption", mediaCaptions.image2);
    formData.append("image3Caption", mediaCaptions.image3);
    formData.append("image4Caption", mediaCaptions.image4);
    formData.append("pdfCaption", mediaCaptions.pdf);
    formData.append("videoCaption", mediaCaptions.video);

    // Append media files (if available)
    ["image1", "image2", "image3", "image4"].forEach((type) => {
      if (uploadedFiles[type]) {
        formData.append(type, uploadedFiles[type].file);
      }
    });
    if (uploadedFiles.pdf) formData.append("pdf", uploadedFiles.pdf);
    if (uploadedFiles.video) formData.append("video", uploadedFiles.video.file);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/PersonalCampaign/sendpersonalCampaign`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Campaign sent successfully!");
      // Optionally reset the form fields here.
    } catch (error) {
      console.error("Error sending campaign", error);
      alert("Failed to send campaign");
    }
  };

  return (
    <>
      <section className="w-[100%] bg-gray-200 flex justify-center flex-col">
        <CreditHeader />
        <div className="w-full mt-8">
          <CampaignHeading campaignHeading={"Personal Poll Campaign"} />

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
                setWhatsAppNumbers={setWhatsAppNumbers} />
            </div>

            {/* Right Column – Templates, Message, Media, Poll & Delay */}
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

              {/* Froala Editor for Custom Message */}
              <div className="w-full rounded-md h-[400px] ">
                <CustomEditor />
              </div>

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

              {/* Poll Question and Options */}
              <div className="bg-white rounded p-4 border border-black flex flex-col gap-2 w-full">
                <p className="m-0 text-lg font-semibold">Question</p>
                <PollCampaign
                  setQuestion={setQuestion}
                  question={question}
                  inputs={inputs}
                  handleInputChange={handleInputChange}
                  handleAddMore={handleAddMore}
                />
              </div>

              {/* Delay Between Messages */}
              <div className="bg-white rounded p-4 border border-black flex flex-col gap-6 ">
                <DelayButtonDetails
                  delayBetweenMessages={delayBetweenMessages}
                  delayOptions={delayOptions}
                  setDelayBetweenMessages={setDelayBetweenMessages} />
              </div>
            </div>
          </div>
          <SendNowButton handleSendCampaign={handleSubmit} />
        </div>
      </section>
    </>
  );
};

export default PersonalCampaignPoll;
