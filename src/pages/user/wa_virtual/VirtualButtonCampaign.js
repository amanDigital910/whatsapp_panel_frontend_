import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import CreditHeader from "../../../components/CreditHeader";
import DisplayButtonComponent from "../../../components/DisplayButtonComponent";
import { CampaignHeading, CampaignStatus, CampaignTitle, CountryDropDown, CSVButton, DragDropButton, GroupDropDown, SendNowButton, TemplateDropdown, WhatsappTextNumber } from "../../utils/Index";
import CustomEditor from "../../../components/RichTextEditor";

const VirtualButtonCampaign = () => {
  // File and editor states
  const inputRef = useRef(null);
  const [editorData, setEditorData] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileObj, setSelectedFileObj] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [caption, setCaption] = useState("");

  // Group Country Button
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countries, setCountries] = useState([]);

  // API fetched data
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [msgTemplates, setMsgTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Additional form fields
  const [campaignTitle, setCampaignTitle] = useState("");
  const [whatsAppNumbers, setWhatsAppNumbers] = useState("");

  // Display Button Numbers 
  const [buttons, setButtons] = useState("");

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

  // Handle file upload via click or drag-and-drop
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);
    setSelectedFile(fileUrl);
    setSelectedFileObj(file);

    // Determine file type and update state accordingly
    if (file.type.startsWith("image/")) {
      setFileType("image");
    } else if (file.type.startsWith("video/")) {
      setFileType("video");
    } else if (file.type === "application/pdf") {
      setFileType("pdf");
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setSelectedFileObj(null);
    setFileType(null);
    setCaption("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
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

  // Handle sending the campaign data via axios
  const handleSendCampaign = async () => {
    const formData = new FormData();
    formData.append("campaignTitle", campaignTitle);
    formData.append("selectedGroup", selectedGroup);
    formData.append("countryCode", selectedCountry);
    formData.append("whatsAppNumbers", whatsAppNumbers);
    formData.append("displayButtonDetails", buttons);
    formData.append("userMessage", editorData);
    formData.append("selectedTemplate", selectedTemplate);
    // formData.append("button1Text", button1Text);
    // formData.append("button1Number", button1Number);
    // formData.append("button2Text", button2Text);
    // formData.append("button2Url", button2Url);

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
        <CampaignHeading campaignHeading={"Virtual Perosnal Button Campaign"} />

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

          {/* Right Column */}
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

            {/* File Upload and Button Settings */}
            <div className="w-full">
              <DragDropButton
                caption={caption}
                setCaption={setCaption}
                fileType={fileType}
                handleDrop={handleDrop}
                handleFileInputChange={handleFileInputChange}
                inputRef={inputRef}
                removeFile={removeFile}
                selectedFile={selectedFile}
              />
            </div>

            <div className="bg-white rounded p-4 border border-black flex flex-col ">
              {/* Button Details */}
              <DisplayButtonComponent buttons={buttons} setButtons={setButtons} />
              {/* </div> */}
            </div>
          </div>
        </div>

        {/* Send Now Button */}
        <SendNowButton handleSendCampaign={handleSendCampaign} />
      </div>
    </section>
  );
};

export default VirtualButtonCampaign;
