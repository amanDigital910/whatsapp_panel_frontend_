import './style.css'
import { MdDelete } from "react-icons/md"
import { FaFileCsv } from "react-icons/fa6"
import { useEffect, useRef, useState } from "react"

const RequireMark = () => {
    return (
        <span className="text-red-500">*</span>
    )
}
// Main Heading
export const CampaignHeading = ({ campaignHeading }) => {
    return (
        <div className="px-3">
            <div className="w-full py-2 mb-2 bg-white rounded-lg">
                <h1 className="text-2xl ss:text-xl md:text-xl text-start pl-4 md:pl-0 md:flex justify-center text-black font-semibold py-0 m-0">
                    {campaignHeading}
                </h1>
            </div>
        </div>
    )
}

// Campaign Title Text and Campaign Name
export const CampaignTitle = ({ mainTitle, inputTitle, setCampaignTitle, placeholder }) => {
    return (
        <div className="flex md:flex-col items-start h-fit border-black border rounded-[0.42rem]">
            <p className="md:w-full w-[40%] py-2 md:px-4 px-3 bg-brand_colors whitespace-nowrap text-white text-start font-semibold 
            text-[1rem] m-0 md:rounded-t-md md:rounded-br-none md:rounded-bl-none rounded-l-md ">
                {mainTitle}
            </p>
            <input
                type="text"
                className="w-full max-h-full custom-rounded form-control border-0 rounded-none py-2 px-2 text-[1rem] text-black placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-0"
                placeholder={placeholder || "Enter Campaign Title"}
                value={inputTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
            />
        </div>
    )
}

// Campaign Status for all 
export const CampaignStatus = ({ totalStatus, validStatus, invalidStatus, duplicateStatus }) => {
    return (
        <div>
            <div className=" custom-grid ">
                <div className="w-full  whitespace-nowrap h-fit px-4 py-[9px] rounded-md text-white font-semibold bg-[#0d0c0d] text-center">
                    Total {totalStatus}
                </div>
                <div className="w-full whitespace-nowrap h-fit px-4 py-[9px] rounded-md text-white font-semibold bg-[#23a31af5] text-center">
                    Valid {validStatus}
                </div>
                <div className="w-full whitespace-nowrap h-fit px-4 py-[9px] rounded-md text-white font-semibold bg-[#b00202] text-center">
                    InValid {invalidStatus}
                </div>
                <div className="w-full whitespace-nowrap h-fit text text-center px-4 py-[9px] rounded-md text-white font-semibold bg-[#8a0418] ">
                    Duplicates {duplicateStatus}
                </div>
            </div>
        </div>
    )
}

// Drag and Drop Feature
export const DragDropButton = ({ handleDrop, inputRef, selectedFile, fileType, removeFile, handleFileInputChange, caption, setCaption }) => {
    return (
        <div className="flex p-4 bg-white h-fit border-black border rounded-[0.42rem]">
            {/* Drag & Drop Upload Box */}
            <div
                className="w-full h-[200px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center
                 text-gray-500 hover:border-[#383387] hover:text-[#383387] cursor-pointer transition-colors duration-200"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
            >
                {selectedFile ? (
                    <div className="w-full h-full relative">
                        {/* Image Preview */}
                        {fileType === "image" && (
                            <img
                                src={selectedFile}
                                alt="Uploaded preview"
                                className="w-full h-full object-contain rounded"
                            />
                        )}

                        {/* Video Preview */}
                        {fileType === "video" && (
                            <video
                                src={selectedFile}
                                className="w-full h-full object-contain rounded"
                                controls
                            />
                        )}

                        {/* PDF Preview */}
                        {fileType === "pdf" && (
                            <div className="w-full h-full flex justify-center items-center">
                                {/* <FaFilePdf className="text-[100px] text-red-400" /> */}
                                <embed
                                    src={selectedFile}
                                    type="application/pdf"
                                    className="w-full h-full rounded pt-4"
                                />
                                {/* <embed src={URL.createObjectURL(selectedFile)} type="application/pdf" className="text-[150px] h-full text-red-400" /> */}
                            </div>
                        )}

                        {/* Delete Button */}
                        <MdDelete
                            className="absolute top-2 right-2 text-[25px] text-red-500 cursor-pointer"
                            onClick={removeFile}
                        />
                    </div>
                ) : (
                    <p className="text-center text-2xl md:text-lg px-4">
                        Drag and drop your file here or click to upload <br />
                        <span className="font-medium">Image / PDF / Video</span>
                    </p>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*,application/pdf"
                className="hidden"
                onChange={handleFileInputChange}
            />
            {/* File Caption Input */}
            {selectedFile && (
                <div className="mt-3">
                    <input
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Enter file caption"
                        className="w-full p-2 border border-gray-400 placeholder-gray-500 rounded"
                    />
                </div>
            )}
        </div>
    )
}

export const DisplayButton = ({
    btnType,
    buttonText,
    setButtonText,
    setValueButtonNumber,
    valueButtonNumber,
    phBtnDetails,
    valueTextNumber,
    setValueTextNumber,
    phBtnShowText
}) => {
    const isFixedButton = buttonText === "Call Now" || buttonText === "URL Button";
    const isRequired = isFixedButton;

    return (
        <div className="w-full flex">
            <div className="w-full h-full flex md:flex-col !gap-0">
                {/* Left side: Select or Static Label */}
                <div
                    className={`w-[40%] md:w-full ${isFixedButton ? "h-fit py-2 " : "h-full"} flex flex-row px-2 bg-white border-r-0 md:border-r-2 border-l-2 border-y-2 border-b-2 md:border-b-0 border-gray-700 placeholder:text-gray-600 md:rounded-t-md md:rounded-br-none md:rounded-bl-none rounded-l-md focus:outline-black focus:outline-2`}
                >
                    {isFixedButton ? (
                        <div className="w-full h-full md:text-lg text-black flex items-center px-1">
                            {buttonText}
                            {isRequired && <RequireMark />}
                        </div>
                    ) : (
                        <select
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            className="w-full h-full md:text-lg text-black rounded-md focus-within:outline-none focus:outline-none py-[9.5px]"
                            required
                        >
                            <option value="" disabled>Pick Display Button</option>
                            <option value="Quick Reply">Quick Reply</option>
                            {/* <option value="Not Interested">Not Interested</option>
                            <option value="Interested">Interested</option> */}
                        </select>
                    )}
                </div>

                {/* Right side: Text Input Fields */}
                <div className="w-full">
                    {isFixedButton && (
                        <input
                            type="text"
                            placeholder={phBtnShowText}
                            value={valueTextNumber}
                            onChange={(e) => setValueTextNumber(e.target.value)}
                            className="w-full p-2 placeholder-gray-500 bg-white text-black md:text-lg border-b-0 border-t-2 border-x-2 border-gray-700 placeholder:text-gray-600 md:rounded-tr-none rounded-br-none md:rounded-tl-none rounded-r-md md:rounded-b-none focus:outline-black focus:outline-[0.5px]"
                        />
                    )}
                    {/* {isFixedButton && ( */}
                    <input
                        type="text"
                        placeholder={phBtnDetails}
                        value={valueButtonNumber}
                        onChange={(e) => setValueButtonNumber(e.target.value)}
                        className={`w-full p-2 placeholder-gray-500 bg-white text-black md:text-lg border-y-2 border-x-2 border-gray-700 placeholder:text-gray-600
                             md:rounded-b-md rounded-tr-none md:rounded-tr-none md:rounded-tl-none rounded-r-md focus:outline-black focus:outline-[0.5px] ${isFixedButton ? "rounded-tr-none" : 'rounded-tr-md'} `}
                    />
                    {/* )} */}
                </div>
            </div>
        </div>
    );
};

// CSV File Button
export const CSVButton = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [, setCsvPreview] = useState([]);
    const csvInputRef = useRef(null);

    const parseCSVPreview = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split("\n").slice(0, 5); // Only first 5 lines
            const rows = lines.map((line) => line.split(","));
            setCsvPreview(rows);
        };
        reader.readAsText(file);
    };

    const onFileUpload = (e, type) => {
        if (type === "csv") {
            const file = e.target.files[0];
            if (file) {
                setUploadedFile(file);
                parseCSVPreview(file);
            }
        }
    };

    const onRemove = (type) => {
        if (type === "csv") {
            setUploadedFile(null);
            setCsvPreview([]);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <input
                type="file"
                ref={csvInputRef}
                accept=".csv"
                className="hidden"
                onChange={(e) => onFileUpload(e, "csv")}
            />

            <button className="flex items-center md:flex-col border border-black rounded-[7px]" onClick={() => csvInputRef.current.click()}>
                <button className="bg-brand_colors font-medium text-[1rem] text-white text-base  py-2 px-3 w-fit md:w-full  whitespace-nowrap md:rounded-t-md md:rounded-br-none md:rounded-bl-none rounded-l-md">
                    Upload CSV
                </button>
                <span className="w-full relative flex flex-row justify-start md:justify-center text-[1rem] py-2 bg-gray-400 text-gray-700 font-medium text-base overflow-hidden custom-rounded whitespace-nowrap md:rounded-r-md md:rounded-br-none md:rounded-bl-none rounded-tl-none rounded-tr-none">
                    <p className=" pl-3  flex m-0 py-0">Ex: Name, Number (Vikram, 91xxxxxx57)</p>
                    {/* <p className="py-0 m-0 absolute top-0 right-0 h-full bg-gray-400">&nbsp;</p> */}
                </span>
            </button>

            {uploadedFile && (
                <div className="w-full max-h-80 overflow-y-hidden border border-gray-200 bg-white rounded px-3 py-2">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium flex gap-2 items-center truncate max-w-[80%]">
                            <FaFileCsv />
                            {uploadedFile.name}
                        </span>
                        <MdDelete
                            className="text-red-500 text-xl cursor-pointer"
                            onClick={() => onRemove("csv")}
                        />
                    </div>

                    {/* Scrollable Table Container */}
                    {/* <div className="w-fit max-h-60 overflow-auto border rounded-lg">
                        <table className="w-full border-collapse text-sm">
                            <tbody>
                                {csvPreview.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="border-b">
                                        {row.map((cell, cellIndex) => (
                                            <td
                                                key={cellIndex}
                                                className="border-r px-3 py-2 text-gray-700 align-top"
                                                style={{
                                                    width: '150px',
                                                    minWidth: '150px',
                                                    maxWidth: '150px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                                title={cell.trim()} // Tooltip for full value
                                            >
                                                {cell.trim()}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div> */}
                </div>
            )}
        </div>
    );
};

// Dropdown for Whatsapp Group Menu 
export const GroupDropDown = ({ selectedGroup, setSelectedGroup, groups }) => {
    return (
        <select
            className="form-select border-black py-2 px-3 rounded-md text-[1rem]"
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
    )
}

// Countries of the world and made by default India (+91)
export const CountryDropDown = ({ selectedCountry, setSelectedCountry, countries }) => {
    return (
        <select
            className="form-select border-black py-2 px-3 rounded-md"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
        >
            <option value="">Select Country</option>
            {countries.map((country, index) => (
                <option key={index} value={country.dialCode}>
                    {country.name} (+{country.dialCode})
                </option>
            ))}
        </select>
    )
}

// Write all whatsapp Text Numbers
export const WhatsappTextNumber = ({ setWhatsAppNumbers, whatsAppNumbers }) => {
    const [errorMessages, setErrorMessages] = useState([]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setWhatsAppNumbers(value);

        // Split the input into an array of numbers
        const numberArray = value.split('\n');
        const newErrorMessages = [];

        // Validation logic for each number
        numberArray.forEach((number, index) => {
            const cleanedNumber = number.trim();
            if (cleanedNumber === '') {
                newErrorMessages[1] = ''; // Valid number
            } else if (/\s/.test(cleanedNumber)) {
                newErrorMessages[2] = 'Spaces are not allowed.';
            } else if (!/^\d{10}$/.test(cleanedNumber)) {
                newErrorMessages[3] = 'Mobile number must be exactly 10 digits.';
            }
        });
        setErrorMessages(newErrorMessages);
    };

    return (
        <div className="h-full relative ">
            {errorMessages.length > 0 &&
                <div className="pb-1">
                    {errorMessages.map((error, index) => (
                        // error && <p key={index} className="m-0 pb-[5px] text-red-500">{error}</p>
                        error && <p key={index} className="m-0 pb-[1px] text-red-500">{error}</p>
                    ))}
                </div>}
            <textarea
                className="w-full px-3 py-2 rounded-md bg-white text-black border-black form-control placeholder-gray-500"
                placeholder="Enter WhatsApp Numbers (one per line)"
                required
                rows={10}
                style={{
                    minHeight: '400px',
                    height: errorMessages.some(msg => msg) ? '94%' : '100%',
                    overflowY: 'auto',
                }}
                value={whatsAppNumbers}
                onChange={handleInputChange}
            />
        </div>
    );
};

// Templates Dropdowns 
export const TemplateDropdown = ({ selectedTemplate, setSelectedTemplate, msgTemplates, setEditorData, }) => {
    return (
        <select
            className="form-select form-control border-black py-2 px-3 rounded-md"
            value={selectedTemplate}
            onChange={(e) => {
                const templateId = e.target.value;
                setSelectedTemplate(templateId);
                const template = msgTemplates.find(
                    (t) => t.templateId.toString() === templateId
                );
                if (template) {
                    setEditorData(template.template_msg);
                }
            }}
        >
            <option value="">Select Your Template</option>
            {msgTemplates.map((template) => (
                <option key={template.templateId} value={template.templateId}>
                    {template.template_name}
                </option>
            ))}
        </select>
    );
}

// Poll Campaign
export const PollCampaign = ({ question, setQuestion, inputs, handleInputChange, handleAddMore, setButtonDetail, buttonDetail }) => {
    return (
        <div className="flex flex-col ">
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask Your Question"
                className="py-2 px-3 rounded bg-white text-black border border-black placeholder-gray-500"
            />
            <div className="flex mt-3">
                <div className="w-[70%] flex flex-col gap-2">
                    {inputs.map((input, index) => (
                        <input
                            key={index}
                            value={input}
                            onChange={(e) =>
                                handleInputChange(e.target.value, index)
                            }
                            className="py-2 px-3 rounded bg-white text-black border border-black placeholder-gray-500"
                            placeholder={`Option ${index + 1}`}
                        />
                    ))}
                </div>
                <div className="w-[30%] px-2">
                    <button
                        className="w-full rounded px-2 py-[9px] bg-brand_colors text-white font-semibold"
                        onClick={handleAddMore}>
                        Add More
                    </button>
                </div>
            </div>
            {/* Button Detail and Delay Between Messages Section */}
            {/*<div className="w-full flex mt-3">
                <button
                    className="w-full rounded text-center py-2 bg-brand_colors h-[40px] text-white font-[500] flex items-center justify-center"
                    value={buttonDetail}
                    onChange={(e) => setButtonDetail(e.target.value)}
                    placeholder="Enter Button Detail"
                >
                    Button Detail
                </button>
            </div>*/}
        </div>
    )
}

// upload documents like Photos upto 2mb, Video and Pdf upto 15Mb.
export const ImagesUploader = ({ type, index, inputRef, uploadedFile, onFileUpload, onRemove, caption, onCaptionChange }) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <input
                    type="file"
                    accept="image/jpeg, image/jpg, image/png"
                    ref={inputRef}
                    className="hidden"
                    onChange={(e) => onFileUpload(e, type)}
                />
                <div className="flex md:flex-col w-full">
                    <button
                        className="bg-[#23a31af5] text-white py-2 px-4 md:rounded-t-md md:rounded-br-none md:rounded-bl-none rounded-l-md flex  "
                        onClick={() => inputRef.current.click()}
                    >
                        Image {index + 1}
                    </button>
                    <input
                        type="text"
                        maxLength={1500}
                        className="flex-1 border border-gray-300 py-2 px-3 custom-rounded placeholder-gray-500"
                        placeholder={`Enter caption for Image ${index + 1}`}
                        value={caption}
                        onChange={(e) => onCaptionChange(e.target.value)}
                    />
                </div>
            </div>
            {uploadedFile && (
                <div className="relative w-full h-[250px] border border-gray-200 rounded overflow-hidden">
                    <img
                        src={uploadedFile.preview}
                        alt={`Uploaded ${type}`}
                        className="absolute top-0 left-0 w-full h-full object-contain z-0"
                    />
                    <MdDelete
                        className="text-red-500 absolute top-2 right-2 text-xl z-10 cursor-pointer"
                        onClick={() => onRemove(type)}
                    />
                </div>
            )}
        </div>
    );
};

export const PdfUploader = ({ inputRef, uploadedFile, onFileUpload, onRemove, caption, onCaptionChange }) => {

    useEffect(() => {
        let url;
        if (uploadedFile) {
            url = URL.createObjectURL(uploadedFile);
        }
        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [uploadedFile]);

    return (
        <div className="flex flex-col gap-1">
            <h6 className="font-semibold m-0">PDF (Max 15MB):</h6>
            <input type="file" ref={inputRef} className="hidden" onChange={(e) => onFileUpload(e, "pdf")} accept="application/pdf" />
            <div className="flex items-center md:flex-col">
                <button
                    className="bg-[#23a31af5] text-white py-2 px-6 w-fit md:w-full whitespace-nowrap md:rounded-t-md md:rounded-br-none md:rounded-bl-none rounded-l-md"
                    onClick={() => inputRef.current.click()}
                >
                    Upload PDF
                </button>
                <input
                    type="text"
                    className="w-full border border-gray-300 py-2 px-3 custom-rounded placeholder-gray-500"
                    placeholder="Enter caption for PDF"
                    value={caption}
                    onChange={(e) => onCaptionChange(e.target.value)}
                />
            </div>
            {uploadedFile && (
                <div className="relative w-full h-[400px] flex justify-center items-center border border-gray-200 rounded">
                    {/* <FaFilePdf className="text-[150px] text-red-400" /> */}
                    {/* Give preview of PDF */}
                    <embed src={URL.createObjectURL(uploadedFile)} type="application/pdf" className="text-[150px] h-full text-red-400" />
                    <MdDelete
                        className="text-red-500 absolute top-2 right-2 text-xl cursor-pointer"
                        onClick={() => onRemove("pdf")}
                    />
                </div>
            )}
        </div>
    );
}

export const ProfileImageUploader = ({
    userImage,
    userprofilePreview,
    handleUserprofileChange,
    setUserprofile,
    setUserprofilePreview,
    imageName,
    setImageName,
}) => {
    const handleClear = () => {
        setUserprofile(null);
        setUserprofilePreview(null);
        setImageName(null);
    };

    return (
        <div className="w-[20%] lg:w-full items-center flex flex-col gap-2 border border-black rounded-lg bg-white px-2 pt-3 ">
            <div className="max-w-32 max-h-32 lg:h-52 lg:w-52 relative rounded-full overflow-hidden border-2 border-gray-300">
                <img
                    src={userprofilePreview || userImage}
                    alt="Profile"
                    className="w-full h-full object-cover cursor-pointer"
                />
            </div>

            {/* <label className="text-sm flex-row text-gray-700 font-medium">Select an image:</label> */}
            {userprofilePreview ? (
                <button
                    onClick={handleClear}
                    className="bg-red-600 text-white px-3 py-2 text-sm rounded hover:underline  underline-offset-2 lg:whitespace-nowrap"
                >
                    Remove Image
                </button>
            ) : (
                <label
                    htmlFor="profile-upload"
                    className="flex w-full lg:w-fit px-3 text-center text-sm bg-blue-600 text-white py-2 justify-center items-center lg:whitespace-nowrap rounded cursor-pointer hover:bg-blue-700 transition duration-200 hover:underline  underline-offset-2"
                >
                    Upload Image
                </label>
            )}
            <input
                id="profile-upload"
                type="file"
                onChange={(e) => {
                    handleUserprofileChange(e);
                    if (e.target.files?.[0]) {
                        setImageName(e.target.files[0].name);
                    }
                }}
                className="hidden"
                // className="text-sm w-full text-gray-600 file:text-white file:bg-blue-600 file:px-4 file:py-1 file:rounded file:cursor-pointer"
                accept="image/jpeg, image/jpg, image/png"
            />

            {imageName && (
                <span className="text-xs text-gray-500 mt-1 px-2 whitespace-normal truncate">
                    Selected: {imageName}
                </span>
            )}
        </div>
    );
};

export const DelayButtonDetails = ({ delayBetweenMessages, setDelayBetweenMessages, delayOptions }) => {
    return (
        <div className="flex flex-col gap-4">

            {/* Delay Between Messages Select */}
            <div className="w-full flex flex-col text-black">
                <select
                    className="w-full p-2 rounded bg-white border-black border-[0.1px]"
                    value={delayBetweenMessages}
                    onChange={(e) => setDelayBetweenMessages(e.target.value)}
                >
                    {delayOptions.map((option, index) => (
                        <option
                            key={index}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export const VideoUploader = ({ inputRef, uploadedFile, onFileUpload, onRemove, caption, onCaptionChange }) => (
    <div className="flex flex-col gap-1">
        <h6 className="font-semibold  m-0">Video (Max 15MB):</h6>
        <div className="flex items-center md:flex-col">
            <button
                className="bg-[#23a31af5] w-fit md:w-full text-white py-2 px-6 whitespace-nowrap md:rounded-t-md md:rounded-br-none md:rounded-bl-none rounded-l-md "
                onClick={() => inputRef.current.click()}
            >
                Upload Video
            </button>
            <input type="file" accept="video/mp4, video/x-matroska, video/webm, video/x-msvideo"
                ref={inputRef} className="hidden" onChange={(e) => onFileUpload(e, "video")} />
            <input
                type="text"
                className="w-full border border-gray-300 py-2 px-3 rounded-lg custom-rounded placeholder-gray-500"
                placeholder="Enter caption for Video"
                value={caption}
                onChange={(e) => onCaptionChange(e.target.value)}
            />
        </div>
        {uploadedFile && (
            <div className="relative w-full h-[250px] border border-gray-200 rounded overflow-hidden">
                <video src={uploadedFile.preview} className="w-full h-full object-contain" controls />
                <MdDelete
                    className="text-red-500 absolute top-2 right-2 text-xl cursor-pointer"
                    onClick={() => onRemove("video")}
                />
            </div>
        )}
    </div>
);

export const SendNowButton = ({ handleSendCampaign }) => {
    return (
        <div className="px-3 mb-4">
            <button
                className="w-full rounded-md bg-green-600 py-2 text-white md:text-xl text-2xl capitalize font-semibold flex items-center justify-center hover:bg-green-500 transition duration-300"
                onClick={handleSendCampaign}>
                Send Now
            </button>
        </div>
    )
}