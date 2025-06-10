import './style.css'
import { MdDelete } from "react-icons/md"
import { FaFileCsv } from "react-icons/fa6"
import { useRef, useState } from "react"
import { LuArrowDown, LuArrowUp } from 'react-icons/lu'
import { toast } from 'react-toastify'
import '../user/whatsapp_offical/commonCSS.css'
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Document, Packer, Paragraph } from 'docx';
import { QuestionMark } from '../../assets'

const RequireMark = () => {
    return (
        <span className="text-red-500">*</span>
    )
}

export const customAbbreviations = {
    'Virtual Quick Campaign': 'WV',
    'Virtual Button Campaign': 'WVB',
    'Virtual DP Campaign': 'WVD',
    'Personal Quick Campaign': 'WP',
    'Personal Button Campaign': 'WPB',
    'Personal POLL Campaign': 'WPP',
    'International Personal Quick Campaign': 'WIP',
    'International Personal Button Campaign': 'WIPB',
    'International Personal POLL Campaign': 'WIPP',
    'International Virtual Quick Campaign': 'WIV',
    'International Virtual Button Campaign': 'WIVB',
};

// Main Heading
export const CampaignHeading = ({ campaignHeading }) => {
    return (
        <div className="px-3">
            <div className="w-full py-2 bg-white rounded-lg">
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
        <div className=" custom-grid w-full">
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
                <div className="w-full flex flex-col">
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

    // Reset the file input after removal
    const resetFileInput = () => {
        csvInputRef.current.value = ""; // Resets the input field
    };

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
                console.log("Uploading CSV:", file);
                setUploadedFile(file);
                parseCSVPreview(file);
            }
        }
    };

    const onRemove = (type) => {
        if (type === "csv") {
            setUploadedFile(null);
            setCsvPreview([]);
            console.log("Removing CSV:", uploadedFile);
            resetFileInput(); // Reset input field when file is removed
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
                <span className="w-full relative flex flex-row justify-start md:justify-center text-[1rem] py-2 bg-[#00000013] text-gray-700 font-medium text-base overflow-hidden custom-rounded whitespace-nowrap md:rounded-r-md md:rounded-br-none md:rounded-bl-none rounded-tl-none rounded-tr-none">
                    <p className=" pl-3  flex m-0 py-0">Ex: Name, Number (Vikram, 91xxxxxx57)</p>
                    {/* <p className="py-0 m-0 absolute top-0 right-0 h-full bg-gray-400">&nbsp;</p> */}
                </span>
            </button>

            {uploadedFile && (
                <div className="w-full max-h-80  overflow-y-hidden border border-gray-200 truncate bg-white rounded  py-2">
                    <div className="flex relative justify-between items-center">
                        <div className='flex items-center px-3  gap-2'>
                            <FaFileCsv />
                            <span className="text-gray-700 font-medium flex gap-2 items-center w-[90%]">
                                {uploadedFile.name}
                            </span>
                        </div>
                        <MdDelete
                            className="absolute end-0 pr-2 w-8 bg-white text-red-500 text-xl cursor-pointer"
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
            <option value="" disabled>Select Your Group</option>
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
            <option value="" disabled>Select Country</option>
            {countries.map((country, index) => (
                <option key={index} value={country.dialCode}>
                    {country.name} (+{country.dialCode})
                </option>
            ))}
        </select>
    )
}

// New whatsapp Text Numbers
export const WhatsappTextNumber = ({ setWhatsAppNumbers, whatsAppNumbers, statsNumber, setStatsNumber }) => {

    const handleInputChange = (event) => {
        setWhatsAppNumbers(event.target.value);
    };

    const handleBlur = () => {
        const rawLines = whatsAppNumbers.split('\n');
        const seen = new Set();
        const validNumbers = [];

        let total = 0;
        let invalid = 0;
        let duplicates = 0;

        rawLines.forEach((line, index) => {
            const number = line.trim();
            if (number === '') return;

            total++;

            if (!/^\d{10}$/.test(number)) {
                invalid++;
                // errors.push(Line ${index + 1}: Invalid number "${number}");
            } else if (seen.has(number)) {
                duplicates++;
                // errors.push(Line ${index + 1}: Duplicate number "${number}");
            } else {
                seen.add(number);
                validNumbers.push(number);
            }
        });

        const cleanedText = validNumbers.join('\n');
        setWhatsAppNumbers(cleanedText);
        // setErrorMessages(errors);
        setStatsNumber({
            total,
            valid: validNumbers.length,
            invalid,
            duplicates,
        });
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* <div className="mt-2 text-sm text-gray-700">
                <p className="m-0">Total: {statsNumber.total}</p>
                <p className="m-0">Valid: {statsNumber.valid}</p>
                <p className="m-0">Invalid: {statsNumber.invalid}</p>
                <p className="m-0">Duplicates: {statsNumber.duplicates}</p>
            </div> */}

            <div className="h-full flex flex-grow">
                <textarea
                    className="w-full h-full px-3 py-2 rounded-md bg-white text-black border border-black form-control placeholder-gray-500"
                    placeholder="Enter WhatsApp Numbers (without 91)"
                    required
                    style={{
                        minHeight: '400px',
                        height: '100%',
                        maxHeight: '100%',
                        overflowY: 'auto',
                    }}
                    value={whatsAppNumbers}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                />
            </div>
        </div>
    );
};


// // Write all whatsapp Text Numbers
// export const WhatsappTextNumber = ({ setWhatsAppNumbers, whatsAppNumbers }) => {
//     const [errorMessages, setErrorMessages] = useState([]);

//     const handleInputChange = (event) => {
//         const value = event.target.value;
//         setWhatsAppNumbers(value);

//         // Split the input into an array of numbers
//         const numberArray = value.split('\n');
//         const newErrorMessages = [];

//         // Validation logic for each number
//         numberArray.forEach((number, index) => {
//             const cleanedNumber = number.trim();
//             if (cleanedNumber === '') {
//                 newErrorMessages[1] = ''; // Valid number
//             } else if (/\s/.test(cleanedNumber)) {
//                 newErrorMessages[2] = 'Spaces are not allowed.';
//             } else if (!/^\d{10}$/.test(cleanedNumber)) {
//                 newErrorMessages[3] = 'Mobile number must be exactly 10 digits.';
//             }
//         });
//         setErrorMessages(newErrorMessages);
//     };

//     return (
//         <div className="h-full relative ">
//             {errorMessages.length > 0 &&
//                 <div className="pb-1">
//                     {errorMessages.map((error, index) => (
//                         // error && <p key={index} className="m-0 pb-[5px] text-red-500">{error}</p>
//                         error && <p key={index} className="m-0 pb-[1px] text-red-500">{error}</p>
//                     ))}
//                 </div>}
//             <textarea
//                 className="w-full px-3 py-2 rounded-md bg-white text-black border-black form-control placeholder-gray-500"
//                 placeholder="Enter WhatsApp Numbers (one per line)"
//                 required
//                 rows={10}
//                 style={{
//                     minHeight: '400px',
//                     height: errorMessages.some(msg => msg) ? '94%' : '100%',
//                     overflowY: 'auto',
//                 }}
//                 value={whatsAppNumbers}
//                 onChange={handleInputChange}
//             />
//         </div>
//     );
// };

// Templates Dropdowns 
export const TemplateDropdown = ({ selectedTemplate, setSelectedTemplate, msgTemplates, setEditorData, }) => {
    return (
        <select
            className="form-select form-control border-black py-2 px-3 rounded-md text-black font-medium"
            value={selectedTemplate}
            onChange={(e) => {
                const templateId = e.target.value;
                setSelectedTemplate(templateId);
                const template = msgTemplates.find(
                    (t) => t._id.toString() === templateId
                );
                if (template) {
                    setEditorData(template);
                      console.log("Complete the template message",template);
                }
            }}
        >
            <option value="" disabled>Select Your Template</option>
            {msgTemplates.map((template) =>
                <option className='text-black font-medium' key={template._id} value={template._id}>
                    {template.name.toString()}
                </option>
            )}
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
        </div>
    )
}

// upload documents like Photos upto 2mb, Video and Pdf upto 15Mb.
export const ImagesUploader = ({ type, index, inputRef, uploadedFile, onFileUpload, onRemove, caption, onCaptionChange }) => {

    const removeRestBtn = (inputRef) => {
        inputRef.current.value = "";
        onRemove(type);
    };
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
                        type="button"
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
                        onClick={() => removeRestBtn(inputRef)}
                    />
                </div>
            )}
        </div>
    );
};

export const PdfUploader = ({ inputRef, uploadedFile, onFileUpload, onRemove, caption, onCaptionChange }) => {

    const removeRestBtn = (inputRef) => {
        inputRef.current.value = "";
        onRemove("pdf");
    };

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
                    <embed src={uploadedFile.preview || URL.createObjectURL(uploadedFile) || URL.createObjectURL(uploadedFile.preview)} type="application/pdf" className="text-[150px] h-full text-red-400" />
                    <MdDelete
                        className="text-red-500 absolute top-2 right-2 text-xl cursor-pointer"
                        onClick={() => removeRestBtn(inputRef)}
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
            {/* Profile Image */}
            <div className="h-24 w-24 relative rounded-full overflow-hidden border-2 border-gray-300">
                <img
                    src={userprofilePreview || userImage}
                    alt="Profile"
                    className="w-full h-full object-cover cursor-pointer"
                />
            </div>

            {/* Upload or Remove Button */}
            {userprofilePreview ? (
                <button
                    onClick={handleClear}
                    className="bg-red-600 text-white px-2 py-2 md:text-sm text-[12px] rounded hover:underline underline-offset-2 whitespace-nowrap"
                >
                    Remove Image
                </button>
            ) : (
                <label
                    htmlFor="profile-upload"
                    className="flex w-full lg:w-fit px-2 text-center md:text-sm text-[12px] bg-blue-600 text-white py-2 justify-center items-center lg:whitespace-nowrap rounded cursor-pointer hover:bg-blue-700 transition duration-200 hover:underline  underline-offset-2"
                >
                    Upload Image
                </label>
            )}

            {/* Hidden File Input */}
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
                accept="image/jpeg, image/jpg, image/png"
            />

            {/* File Name */}
            {imageName && (
                <span className="text-xs text-gray-500 mb-3 break-words whitespace-normal block">
                    {imageName}
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

export const VideoUploader = ({ inputRef, uploadedFile, onFileUpload, onRemove, caption, onCaptionChange }) => {

    const removeRestBtn = (inputRef) => {
        inputRef.current.value = "";
        onRemove("video");
    };

    return (
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
                    <video src={uploadedFile?.preview} className="w-full h-full object-contain" controls />
                    <MdDelete
                        className="text-red-500 absolute top-2 right-2 text-xl cursor-pointer"
                        onClick={() => removeRestBtn(inputRef)}
                    />
                </div>
            )}
        </div>
    );
};

export const CustomizeTable = ({
    headers = [],
    data = [],
    sortConfig = {},
    onSort = () => { },
    renderRow,
    className = '',
    theadClassName = '',
    emptyMessage = 'No data available.',
}) => {
    const renderSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? <LuArrowUp /> : <LuArrowDown />;
        }
        return (
            <span className="text-white flex flex-row">
                <LuArrowUp />
                <LuArrowDown />
            </span>
        );
    };

    return (
        <table className={`min-w-[100%] text-sm ${className}`}>
            <thead className={`sticky top-0 z-10 ${theadClassName}`}>
                <tr>
                    {headers.map(({ label, key }) => (
                        <th
                            key={key}
                            onClick={() => onSort(key)}
                            className="px-2 py-2 text-left cursor-pointer select-none whitespace-wrap w-fit bg-[#383387] text-white border border-white"
                        >
                            <div className="flex items-center justify-between gap-3 ">
                                {label}
                                <div className="w-8">{renderSortIcon(key)}</div>
                            </div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className='custom-horizontal-scroll '>
                {data.length > 0 ? (
                    data.map((item, index) => renderRow(item, index))
                ) : (
                    <tr>
                        <td colSpan={headers.length} className="text-center py-2 text-red-500 tracking-wider text-lg font-semibold">
                            {emptyMessage}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export const RecordsPerPageDropdown = ({ recordsPerPage, setRecordsPerPage, setCurrentPage }) => {
    const options = [25, 50, 75, 100];

    return (
        <div className="flex items-center w-fit gap-2 pr-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <select
                value={recordsPerPage}
                onChange={(e) => {
                    setRecordsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing page size
                }}
                className="  px-2 py-2 text-lg rounded-md focus:border-none focus-within:border-none focus:outline-none "
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export const InfoTooltip = ({ message, props }) => {
    return (
        <div className="relative group inline-block cursor-pointer h-fit w-fit">

            {/* <div className=" py-0 px-1 -mt-1.5 rounded-full border border-gray-400 bg-[#383387] text-white text-[0.6rem] font-bold flex items-center justify-center"
            >
                ?
            </div> */}
            <div className=" py-0 px-1 -mt-1.5 rounded-full bg-[#383387] text-white text-[0.6rem] font-bold flex items-center justify-center"
            >
                <QuestionMark />
            </div>

            <div className="absolute left-1/2 top-full -translate-x-1/2 bg-black text-white text-sm w-60 whitespace-pre-wrap px-3 py-1 rounded opacity-0 group-hover:!opacity-100 transition-opacity duration-300 z-50 pointer-events-none ">
                {message}
            </div>
        </div>
    );
};

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

export const CopyToClipboard = ({ headers, data }) => {
    const copyToClipboard = () => {
        if (!Array.isArray(headers) || headers.length === 0 || !Array.isArray(data) || data.length === 0) {
            toast.error("Missing headers or data");
            return;
        }

        const allowedKeys = headers.map(({ key }) => key);

        const filteredData = data.map(row =>
            Object.fromEntries(
                allowedKeys.map(key => [key, row[key] ?? ""])
            )
        );

        const jsonString = JSON.stringify(filteredData, null, 2);

        // Try native clipboard first
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(jsonString)
                .then(() => toast.success("Selected fields copied to clipboard!"))
                .catch(() => {
                    fallbackCopy(jsonString);
                });
        } else {
            fallbackCopy(jsonString);
        }
    };

    // Fallback using a temporary textarea
    const fallbackCopy = (text) => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed"; // prevent scrolling to bottom
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            const successful = document.execCommand("copy");
            if (successful) {
                toast.success("Selected fields copied to clipboard!")
            } else {
                toast.error("Copy failed.");
            }
        } catch (err) {
            console.error("Fallback copy failed:", err);
            toast.error("Copy failed.");
        }

        document.body.removeChild(textarea);
    };

    return (
        <button
            onClick={copyToClipboard}
            className="px-3 py-1 text-base font-medium border-2 border-[#0d6efd] text-[#0d6efd] rounded-md hover:text-white hover:bg-[#0d6efd]"
        >
            Copy
        </button>
    );
};

export const DownloadCSVButton = ({ headers, dataLogs }) => {
    const convertToCSV = (rows) => {
        const csvHeaders = headers.slice(0, -1).map(h => h.label).join(',');

        const csvRows = rows.map(row =>
            headers.map(h => {
                const strValue = String(row[h.key] ?? '');
                const needsTextFormat = /^\d{9,}$/.test(strValue);
                const safeValue = needsTextFormat ? `+91 ${strValue}` : strValue;
                return `"${safeValue.replace(/"/g, '""')}"`;
            }).join(',')
        );

        toast.success('Logs details downloaded as CSV');
        return [csvHeaders, ...csvRows].join('\r\n');
    };

    const downloadCSV = () => {
        const csv = convertToCSV(dataLogs);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', 'data.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            className='px-3 py-1 text-base font-medium border-2 border-[#dc3545] text-[#dc3545] rounded-md hover:text-white hover:bg-[#dc3545]'
            onClick={downloadCSV}
        >
            CSV
        </button>
    );
};

export const DownloadReportCSV = ({ headers, dataLogs, filename = 'data.csv' }) => {
    if (!headers || !dataLogs) return;

    // Create CSV header row
    const csvHeader = headers.map(h => h.label).join(',') + '\n';

    // Create CSV body
    const csvRows = dataLogs.map(row => {
        return headers.map(h => {
            const value = h.key.split('.').reduce((acc, part) => acc?.[part], row);
            return `"${value ?? ''}"`; // Ensure empty values are handled
        }).join(',');
    }).join('\n');

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create and click a link to download the file
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
};

export const DownloadPDFButton = ({ headers, dataLogs }) => {
    const getFlattenedRow = (row) => {
        return headers.map(({ key }) => {
            if (key === 'submitted_failed') {
                return `Submitted: ${row.submitted || '-'} | Failed: ${row.failed || '-'}`;
            }
            return row[key] ?? '-';
        });
    };

    const downloadPDF = () => {
        const htmlContent = `
      <html>
        <head>
          <title>Download PDF</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-family: monospace; font-size: 11px; }
            th, td { border: 1px solid #ccc; padding: 2px; text-align: left; white-space: wrap; }
            th { background-color: #f2f2f2; }
            h2 { font-family: Arial, sans-serif; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h2>Exported Logs</h2>
          <table>
            <thead>
              <tr>${headers.slice(0, -1).map(h => `<th>${h.label}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${dataLogs.map(log => `
                <tr>
                  ${getFlattenedRow(log).slice(0, -1)?.map(val => `<td>${val}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            };
          </script>
        </body>
      </html>
    `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    return (
        <button
            className="px-3 py-1 text-base font-medium border-2 border-[#198754] text-[#198754] rounded-md hover:text-white hover:bg-[#198754]"
            onClick={downloadPDF}
        >
            PDF
        </button>
    );
};

export const CampaignReportModal = ({ campaignTitle, campaignType, message, numbers }) => {
    console.log("Message Data", message, campaignTitle, campaignType, numbers);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(message || '')
            .then(() => toast.success("Message copied to Clipboard!"))
            .catch(() => toast.error("Failed to copy!"));
    };

    const downloadNumbers = () => {
        if (numbers) return;
        toast.success("Numbers Download Successfully!")
        const blob = new Blob([numbers.join('\n')], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `${campaignTitle}_numbers.txt`);
    };

    const downloadMessageDocx = async () => {
        const doc = new Document({
            sections: [{
                children: [new Paragraph(message || '')],
            }],
        });
        toast.success("Message Download Successfully!")
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${campaignTitle}_message.docx`);
    };

    const downloadZip = async () => {
        if (!numbers || !campaignTitle) {
            toast.error("Missing numbers or campaign title.");
            return;
        }
        const zip = new JSZip();
        zip.file(`${campaignTitle}_numbers.txt`, numbers.join('\n'));

        const doc = new Document({
            sections: [{
                children: [new Paragraph(message || '')],
            }],
        });
        const messageBlob = await Packer.toBlob(doc);
        zip.file(`${campaignTitle}_message.docx`, messageBlob);
        console.log("Data found of Message Blob", messageBlob);

        zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, `${campaignTitle}_campaign.zip`);
            toast.success("Zip Downloaded Successfully!");
        }).catch(() => {
            toast.error("Failed to generate ZIP file.");
        });
    };

    return (
        <div className="bg-white rounded-md shadow-lg p-4 w-[600px] max-w-full">
            <h2 className="text-xl font-bold mb-2">
                {campaignTitle ? campaignTitle : 'Campaign'} Camp Type: {campaignType ?? 'N/A'}
            </h2>

            <div className="mb-4 flex flex-col">
                <label className="font-semibold text-lg block mb-1">Message</label>
                <textarea
                    readOnly
                    value={message}
                    className="w-full h-40 border border-gray-300 p-2 rounded-md resize-none"
                />
                <button
                    onClick={copyToClipboard}
                    className="mt-2 bg-[#0a3473] w-full text-white py-2 rounded-md"
                >
                    Copy Message
                </button>
            </div>

            <div>
                <p className="font-semibold mb-2 text-lg">Download Campaign</p>
                <div className="flex flex-wrap gap-2 w-full">
                    <button
                        onClick={downloadNumbers}
                        className="bg-orange-500 hover:bg-orange-600 text-white  px-6 py-2 rounded-md w-full flex-1"
                    >
                        Number
                    </button>

                    <button
                        onClick={downloadMessageDocx}
                        className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-md w-full flex-1"
                    >
                        Message
                    </button>

                    <button
                        onClick={downloadZip}
                        className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-md w-full flex-1"
                    >
                        Zip
                    </button>
                </div>
            </div>
        </div>
    );
};
