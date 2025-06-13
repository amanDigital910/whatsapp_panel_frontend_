/* eslint-disable no-lone-blocks */
import React, { useRef, useState } from 'react'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css'
import iphonePreviewImg from '../../../../../assets/Iphone_12_blank_screen.png';
import previewBackground from '../../../../../assets/profile_img_logo_bg.jpg';
import whatsappPreviewSidebarLogo from '../../../../../assets/whatsappPreviewSidebarLogo.png';
import { BackArrow, LandscapeThreeDot } from '../../../../../assets';
import '../../commonCSS.css'
import { AlertBar } from '../../../../utils/Index';

const AddTemplates = () => {
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const MAX_CARDS = 10;

    const [show, setShow] = useState(true);
    const [showOptions, setShowOptions] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [dropUp, setDropUp] = useState(false);
    const [mediaType, setMediaType] = useState('Image');
    const [fileName, setFileName] = useState('');
    const [formData, setFormData] = useState({
        templateName: '',
        category: 'Marketing',
        language: 'English',
        templateType: 'Basic',
        enableClickTracking: 'False',
        headerType: 'None',
        headerText: '',
        body: '',
        footerText: '',
        documentUrl: '',
        mediaType: '',
        buttonType: [],
        // Carousel Fields:
        cards: [
            { body: '', dynamicText: '', dynamicUrl: '', quickReply: '', image: '', },
            { body: '', dynamicText: '', dynamicUrl: '', quickReply: '', image: '', },
        ],
    });

    // const options = ['Quick Reply', 'Visit Website', 'Phonenumber', 'Flow'];
    const options = [
        { key: 'quick', label: "Quick Reply" },
        { key: 'website', label: 'Visit Website' },
        { key: 'phone', label: "Phone Number" },
        { key: 'flow', label: "Flow" }];

    const limits = {
        'quick': 1,
        'website': 2,
        'phone': 1,
        'flow': 1,
    };

    const removeSelectedOption = (indexToRemove) => {
        const updated = [...selectedOptions];
        updated.splice(indexToRemove, 1);
        setSelectedOptions(updated);

        // Sync with formData
        setFormData((prev) => ({
            ...prev,
            buttonType: updated,
        }));
    };

    const handleOutsideClick = (event) => {
        if (
            (dropdownRef.current && !dropdownRef.current.contains(event.target)) &&
            (buttonRef.current && !buttonRef.current.contains(event.target))
        ) {
            setShowOptions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const toggleDropdown = () => setShowOptions(!showOptions);

    const handleButtonFieldChange = (index, field, value) => {
        const updated = [...selectedOptions];
        updated[index][field] = value;
        setSelectedOptions(updated);

        // Keep formData in sync
        setFormData((prev) => ({
            ...prev,
            buttonType: updated,
        }));
    };

    const handleSelect = (option) => {
        const count = selectedOptions.filter((o) => o.type === option).length;
        if (count < limits[option]) {
            const newOption = {
                type: option,
                text: '',
                urlType: 'Static',
                url: '',
                phoneNumber: '',
            };
            const updatedOptions = [...selectedOptions, newOption];
            setSelectedOptions(updatedOptions);

            setFormData((prev) => ({
                ...prev,
                buttonType: updatedOptions,
            }));
        } else {
            {
                show && (
                    <AlertBar
                        type="success"
                        message={`Limit reached for ${option}`}
                        onClose={() => setShow(false)}
                    />)
            }
        }
        setShowOptions(false);
    };

    const getLabel = (option) => {
        switch (option) {
            case 'Visit Website': return 'Visit Website (limit 2)';
            case 'Phone Number': return 'Phone Number (limit 1)';
            case 'Quick Reply': return 'Quick Reply (limit 1)';
            case 'Flow': return 'Flow (limit 1)';
            default: return option;
        }
    };

    useEffect(() => {
        if (showOptions && dropdownRef.current && buttonRef.current) {
            const dropdownRect = dropdownRef.current.getBoundingClientRect();
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - buttonRect.bottom;
            const spaceAbove = buttonRect.top;

            if (dropdownRect.height > spaceBelow && spaceAbove > spaceBelow) {
                setDropUp(true);
            } else {
                setDropUp(false);
            }
        }
    }, [showOptions]);

    const removeCard = (indexToRemove) => {
        if (formData.cards.length > 2) {
            const updated = formData.cards.filter((_, index) => index !== indexToRemove);
            setFormData((prev) => ({
                ...prev,
                cards: updated,
            }));
        } else {
            alert("Minimum 2 cards required.");
        }
    };

    const handleCardChange = (index, field, value) => {
        const updatedCards = [...formData.cards];
        updatedCards[index][field] = value;

        setFormData((prev) => ({
            ...prev,
            cards: updatedCards,
        }));
    };

    const addCard = () => {
        if (formData.cards.length < MAX_CARDS) {
            setFormData((prev) => ({
                ...prev,
                cards: [
                    ...prev.cards,
                    { body: '', dynamicText: '', dynamicUrl: '', quickReply: '' },
                ],
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file' && files.length > 0) {
            const file = files[0];
            setFileName(file.name);
            setFormData((prev) => ({
                ...prev,
                documentUrl: file.name,
            }));
        } else {
            // Reset related fields when headerType changes
            //     if () {
            //         const resetFields = {
            //             headerText: '',
            //             documentUrl: '',
            //         };
            //         setFormData((prev) => ({
            //             ...prev,
            //             [name]: value,
            //             ...resetFields,
            //         }));
            //     } else {
            //         setFormData((prev) => ({
            //             ...prev,
            //             [name]: value,
            //         }));
            //     }
            // }

            if (name === 'headerType' || name === 'templateType') {
                const resetFields = {
                    headerText: '',
                    documentUrl: '',
                    buttonType: [],
                };

                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                    ...resetFields,
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        }
    };

    console.log("Form Data", formData);



    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <section className="w-full bg-gray-200  flex flex-col pb-3">
            <div className="px-3 mt-8">
                <div className="w-full py-2 bg-white rounded-lg flex">
                    <Link className="no-underline" to={"/whatsapp-setting/templates"}>
                        <h1 className="text-2xl ss:text-xl md:text-xl text-start pl-4 md:flex justify-center text-black font-semibold py-0 m-0 hover:underline underline-offset-4">
                            Manage Template
                        </h1>
                    </Link>
                    <h1 className="text-2xl ss:text-xl md:text-xl text-start md:pl-0 md:flex justify-center text-black font-semibold py-0 m-0">
                        &nbsp;&gt;&nbsp;Add New Template
                    </h1>
                </div>

                <div className='bg-white rounded-lg flex lg:flex-col my-3'>
                    {/* Form Details of Template */}
                    <div className="flex flex-row lg:w-full w-2/3">
                        <form onSubmit={handleSubmit} className="p-4 space-y-4 w-full">
                            <div className="flex-1 flex flex-col">
                                <div className='flex justify-between'>
                                    <label className='font-semibold text-base'>Template Name</label>
                                    <label className='font-semibold text-base'>{formData.templateName.length}/512 {formData.templateName.length ? "Characters used" : ""}</label>
                                </div>
                                <input
                                    type="text"
                                    name="templateName"
                                    value={formData.templateName}
                                    onChange={handleChange}
                                    maxLength={512}
                                    placeholder="Template name cannot have capital letters and spaces"
                                    className="w-full border p-2 rounded"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2 flex flex-col ">
                                    <label className='font-semibold text-base'>Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded">
                                        <option value="Marketing" defaultValue="Marketing">Marketing</option>
                                        <option value="Transactional">Transactional / Utility</option>
                                        {/* Add more as needed */}
                                    </select>
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <label className='font-semibold text-base'>Language</label>
                                    <select name="language" value={formData.language} onChange={handleChange} className="w-full border p-2 rounded">
                                        <option value="English">English</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1 flex flex-col">
                                    <label className='font-semibold text-base'>Template Type</label>
                                    <select name="templateType" value={formData.templateType} onChange={handleChange} className="w-full border p-2 rounded">
                                        <option value="Basic" defaultValue="Basic">Basic</option>
                                        <option value="Carousel">Carousel</option>
                                    </select>
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <label className='font-semibold text-base'>Enable Click Tracking</label>
                                    <select name="enableClickTracking" value={formData.enableClickTracking} onChange={handleChange} className="w-full border p-2 rounded">
                                        <option value="False" defaultValue="False">False</option>
                                        <option value="True">True</option>
                                    </select>
                                </div>
                            </div>
                            {formData.templateType === "Basic" && <div className='w-full flex flex-col gap-3'>
                                <div className="flex-1 flex flex-col pt-2 border-t">
                                    <label className='font-semibold text-base'>Header (Optional)</label>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <label className='font-semibold text-base'>Header Type</label>
                                    <select name="headerType" value={formData.headerType} onChange={handleChange} className="w-full border p-2 rounded">
                                        <option value="None" defaultValue="None">None</option>
                                        <option value="Text">Text</option>
                                        <option value="Media">Media</option>
                                    </select>
                                </div>

                                {formData.headerType === "Text" &&
                                    <div className='flex flex-col'>
                                        <div className='flex justify-between'>
                                            <label className='font-semibold text-base'>Header Type</label>
                                            <label className='font-semibold text-base'>{formData.headerText.length}/60 {formData.headerText.length ? "Characters used" : ""}</label>
                                        </div>
                                        <input
                                            type="text"
                                            name="headerText"
                                            value={formData.headerText}
                                            onChange={handleChange}
                                            maxLength={60}
                                            placeholder="Template name cannot have capital letters and spaces"
                                            className="w-full border p-2 rounded"
                                        />
                                    </div>}

                                {formData.headerType === "Media" &&
                                    <div className="w-full ">
                                        <div className="mb-4">
                                            <label className="font-semibold block mb-2">Media Type</label>
                                            <div className="flex gap-6">
                                                {['Image', 'Document', 'Video'].map((type) => (
                                                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="mediaType"
                                                            value={type}
                                                            checked={mediaType === type}
                                                            onChange={() => {
                                                                setMediaType(type);
                                                                setFileName('');
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    mediaType: type,
                                                                    documentUrl: '',
                                                                }));
                                                            }}
                                                            className="accent-blue-600"
                                                        />
                                                        <span>{type}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {/* URL Input */}
                                            <div className="flex-1">
                                                <label className="block text-sm text-gray-600 mb-1">URL</label>
                                                <input
                                                    type="text"
                                                    placeholder="https://xxxxxxxxxxxx"
                                                    name="documentUrl"
                                                    onChange={handleChange}
                                                    value={formData.documentUrl}
                                                    className="w-full border px-3 py-2 rounded outline-none text-sm text-gray-700"
                                                />
                                            </div>

                                            <div className="h-12 border-l"></div>

                                            {/* File Upload */}
                                            <div className="flex justify-center flex-col w-1/2">
                                                <label className="text-sm font-semibold ">File Upload</label>
                                                <div className='flex gap-3 items-center'>
                                                    <input
                                                        type="file"
                                                        id="media-upload"
                                                        onChange={handleChange}
                                                        className="hidden"
                                                    />
                                                    <label
                                                        htmlFor="media-upload"
                                                        className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 text-sm rounded cursor-pointer"
                                                    >
                                                        Choose File
                                                    </label>
                                                    <span className="text-sm text-gray-700 truncate flex whitespace-pre-wrap max-w-full min-w-[120px]">
                                                        {fileName || 'No file chosen'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>}

                            <div className="flex-1 flex flex-col">
                                <div className='flex justify-between'>
                                    <label className='font-semibold text-base'>Body</label>
                                    <label className='font-semibold text-base'>{formData.body.length}/1024 {formData.body.length ? "Characters used" : ""}</label>
                                </div>
                                <textarea
                                    name="body"
                                    value={formData.body}
                                    onChange={handleChange}
                                    maxLength={1024}
                                    placeholder="Enter Template Message"
                                    className="w-full border p-2 rounded min-h-[200px]"
                                />
                                <div className="flex gap-2 mt-2">
                                    <button type="button" className="bg-blue-700 text-white px-2 py-1 content rounded font-semibold">B</button>
                                    <button type="button" className="bg-cyan-600 text-white px-2 py-1 rounded">I</button>
                                    <button type="button" className="bg-yellow-400 px-2 py-1 rounded">😊</button>
                                    <button type="button" className="bg-orange-500 text-white px-2 py-1 rounded">Add Placeholder</button>
                                </div>
                            </div>

                            {formData.templateType === "Carousel" && <div className="flex justify-between items-center vmb-4">
                                <div className="font-semibold text-lg">Total Cards : {formData.cards.length}</div>
                                {/* {cards.length < MAX_CARDS && ( */}
                                <button
                                    onClick={addCard}
                                    className={`text-white px-4 py-2 rounded shadow ${formData.cards.length < MAX_CARDS ? 'bg-blue-900' : 'bg-blue-900 opacity-80'} `}
                                >
                                    Add Card
                                </button>
                                {/* )} */}
                            </div>}

                            {formData.templateType === "Carousel" && (
                                <div className="w-full overflow-hidden">
                                    <div className="flex flex-row gap-3 custom-horizontal-scroll !max-w-full w-[690px] md:max-w-2xl !min-w-[400px] ">
                                        {formData.cards.map((_, index) => (
                                            <div
                                                key={index}
                                                className="max-w-[390px] flex-shrink-0 mb-3"
                                            >
                                                <Card
                                                    index={index}
                                                    data={formData.cards[index]}
                                                    onChange={handleCardChange}
                                                    onRemove={removeCard}
                                                    totalCards={formData.cards.length}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {formData.templateType === "Basic" && <div className='w-full flex flex-col gap-3'>
                                <div className="flex-1 flex flex-col pt-2 border-t">
                                    <label className='font-semibold text-base'>Footer (Optional)</label>
                                </div>
                                <div className="flex-1 flex flex-col">
                                    {/* <label className='font-semibold text-base'>Footer Text</label> */}
                                    <div className='flex justify-between'>
                                        <label className='font-semibold text-base'>Footer Text</label>
                                        <label className='font-semibold text-base'>{formData.footerText.length}/60 {formData.footerText.length ? "Characters used" : ""}</label>
                                    </div>
                                    <input
                                        type="text"
                                        name="footerText"
                                        value={formData.footerText}
                                        onChange={handleChange}
                                        maxLength={60}
                                        placeholder="Enter text"
                                        className="w-full border p-2 rounded"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col pt-2 border-t">
                                    <label className='font-semibold text-base'>Buttons (Optional)</label>
                                    <div className="relative inline-block text-left">
                                        <button
                                            ref={buttonRef}
                                            onClick={toggleDropdown}
                                            className="w-fit bg-[#1d9151] text-white px-4 py-1.5 rounded"
                                        >
                                            Action button ▼
                                        </button>

                                        {showOptions && (
                                            <div
                                                ref={dropdownRef}
                                                className={`absolute z-10 w-56 bg-white border rounded shadow-md ${dropUp ? 'bottom-full' : ''
                                                    }`}
                                            >
                                                {options.map((option, index) => {
                                                    const isFlowSelected = selectedOptions.some((o) => o.type === 'flow');
                                                    const isOtherSelected = selectedOptions.some((o) =>
                                                        ['quick', 'website', 'phone'].includes(o.type)
                                                    );
                                                    const isDisabled =
                                                        (option.key === 'flow' && isOtherSelected) ||
                                                        (['quick', 'website', 'phone'].includes(option.key) && isFlowSelected);

                                                    return (
                                                        <React.Fragment key={index}>
                                                            <button
                                                                onClick={() => !isDisabled && handleSelect(option.key)}
                                                                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${isDisabled ? 'cursor-not-allowed text-gray-400' : ''
                                                                    }`}
                                                                disabled={isDisabled}
                                                            >
                                                                {getLabel(option.label)}
                                                            </button>
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {selectedOptions.length > 0 && (
                                            <div className="mt-4 space-y-6">
                                                {selectedOptions.map((opt, index) => (
                                                    <div key={index} className="border-b pb-4">
                                                        <label className="block font-semibold mb-2">
                                                            {opt.type === 'quick' ? 'Quick Reply' : opt.type === 'website' ? 'Visit Website' : opt.type === 'flow' ? 'Flow' : 'Phone Number'}
                                                        </label>
                                                        {opt.type === 'quick' && (
                                                            <div className="flex gap-2 w-full flex-1">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Button Text (Max 25 characters)"
                                                                    className="w-full border p-2 rounded"
                                                                    value={opt.text}
                                                                    onChange={(e) => handleButtonFieldChange(index, 'text', e.target.value)}
                                                                />
                                                                <div className='flex h-full items-center justify-center'>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeSelectedOption(index)}
                                                                        className="text-white bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 text-sm flex items-center justify-center"
                                                                        title="Remove Action"
                                                                    >
                                                                        X
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {opt.type === 'website' && (
                                                            <div className="flex w-full gap-2">
                                                                <div className='flex flex-col w-full'>
                                                                    <label className="text-sm font-semibold">URL Type</label>
                                                                    <select
                                                                        className="border p-2 rounded"
                                                                        value={opt.urlType}
                                                                        onChange={(e) => handleButtonFieldChange(index, 'urlType', e.target.value)}
                                                                    >
                                                                        <option value="Static">Static</option>
                                                                        <option value="Dynamic">Dynamic</option>
                                                                    </select>
                                                                </div>
                                                                <div className='flex flex-col w-full'>
                                                                    <label className="text-sm font-semibold">Button Text</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter Button Text"
                                                                        value={opt.text}
                                                                        onChange={(e) => handleButtonFieldChange(index, 'text', e.target.value)}
                                                                        className="border p-2 rounded"
                                                                    />
                                                                </div>
                                                                <div className='flex flex-col w-full'>
                                                                    <label className="text-sm font-semibold">Website URL</label>
                                                                    <input
                                                                        type="url"
                                                                        placeholder="https://www.example.com"
                                                                        value={opt.url}
                                                                        onChange={(e) => handleButtonFieldChange(index, 'url', e.target.value)}
                                                                        className="border p-2 rounded"
                                                                    />
                                                                </div>
                                                                <div className='flex h-full items-center justify-end'>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeSelectedOption(index)}
                                                                        className="text-white bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 text-sm flex items-center justify-center"
                                                                        title="Remove"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {opt.type === 'phone' && (
                                                            <div className="flex w-full flex-1 flex-row gap-2">
                                                                <div className='flex flex-col w-full'>
                                                                    <label className="text-sm font-semibold">Button Text</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter Button Text"
                                                                        value={opt.text}
                                                                        onChange={(e) => handleButtonFieldChange(index, 'text', e.target.value)}
                                                                        className="border p-2 rounded"
                                                                    />
                                                                </div>
                                                                <div className='flex flex-col w-full'>
                                                                    <label className="text-sm font-semibold">Phone Number</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="+91XXXXXXXXXX"
                                                                        value={opt.phoneNumber}
                                                                        onChange={(e) => handleButtonFieldChange(index, 'phoneNumber', e.target.value)}
                                                                        className="border p-2 rounded"
                                                                    />
                                                                </div>
                                                                <div className='flex items-center justify-center'>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeSelectedOption(index)}
                                                                        className="text-white bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 text-sm flex items-center justify-center"
                                                                        title="Remove"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {opt.type === 'flow' && (
                                                            <div className='flex flex-row gap-2'>
                                                                <div className="grid grid-cols-2 w-full gap-2">
                                                                    <div className='flex flex-col w-full'>
                                                                        <label className="text-sm font-semibold">Text</label>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Enter Button Text (Max 25 characters)"
                                                                            value={opt.text}
                                                                            onChange={(e) => handleButtonFieldChange(index, 'text', e.target.value)}
                                                                            className="border p-2 rounded"
                                                                        />
                                                                    </div>
                                                                    <div className='flex flex-col w-full'>
                                                                        <label className="text-sm font-semibold">Flow Id</label>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Numeric Value"
                                                                            value={opt.text}
                                                                            onChange={(e) => handleButtonFieldChange(index, 'text', e.target.value)}
                                                                            className="border p-2 rounded"
                                                                        />
                                                                    </div>
                                                                    <div className='flex flex-col w-full'>
                                                                        <label className="text-sm font-semibold">Navigate Screen</label>
                                                                        <input
                                                                            type="url"
                                                                            placeholder="WELCOME_SCREEN"
                                                                            value={opt.url}
                                                                            onChange={(e) => handleButtonFieldChange(index, 'url', e.target.value)}
                                                                            className="border p-2 rounded"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className='flex items-center justify-end'>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeSelectedOption(index)}
                                                                        className="text-white bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 text-sm flex items-center justify-center"
                                                                        title="Remove"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>}


                            <div className="flex gap-2">
                                <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded">Save changes</button>
                                <Link to={"/whatsapp-setting/templates"} type="button" className="border border-gray-300 bg-gray-300 px-4 py-2 rounded no-underline text-black">Cancel</Link>
                            </div>
                        </form>
                    </div>

                    <div className='w-1/3 '>
                        <div className="px-4 lg:top-0 top-10 relative w-full ">
                            <div
                                className=""
                                style={{
                                    backgroundImage: `url(${iphonePreviewImg})`,
                                    position: 'relative',
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "100% 100%",
                                    minWidth: "300px",
                                    height: "640px"
                                }}
                            >
                                {/* <div className={`outline-none px-1 w-full`} > */}

                                {/* Chat body area */}
                                <div className="absolute top-[76px] left-[23px] right-[23px] bottom-[120px] overflow-h auto "
                                // style={{ backgroundImage: `url(${previewBackground})` }}
                                >
                                    <div className="relative px-3 py-4 w-full bg-[#1d9151] text-white
                                     flex flex-row justify-between items-center">
                                        <span className="font-semibold text-lg flex gap-2 items-center"><BackArrow /> Preview</span>
                                        <span className="text-blue-400 text-lg"><LandscapeThreeDot /></span>
                                    </div>

                                    <div className='w-full px-3 pt-2 bg-[#e6ddd4] h-full'>
                                        <div className="bg-white rounded-b-md rounded-r-md p-2 min-h-10 w-full top-[90px] shadow-sm bubble-with-logo">
                                            <span className="text-gray-800 flex break-all whitespace-pre-wrap text-lg font-semibold">{formData?.headerText}</span>
                                            <span className="text-gray-800 flex break-all whitespace-pre-wrap text-base font-medium">{formData?.body}</span>
                                            <span className="text-gray-800 flex break-all whitespace-pre-wrap text-base font-medium">{formData?.footerText}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </section >
    )
}

export default AddTemplates

const Card = ({ index, data, onChange, onRemove, totalCards }) => {
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(index, 'image', reader.result); // Save base64 preview URL
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <div className="border rounded w-fit shadow bg-white relative" >
            <div className="font-semibold mb-2 absolute py-2 px-2.5 rounded-br-xl bg-gray-200 z-30">
                {index + 1}
            </div>

            {totalCards > 2 && <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute z-30 top-0 right-0 py-2 px-2.5 bg-red-500 hover:bg-red-600 text-white rounded-bl-xl flex items-center justify-center text-xs"
                title="Remove Card"
            >
                X
            </button>}

            <div className="flex justify-center mb-3 border shadow relative w-full h-60">
                {data.image ? (
                    <img
                        src={data.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/1828/1828911.png"
                        alt="Upload"
                        className="w-32 h-60 object-contain mx-auto"
                    />
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    title="Click to upload image"
                />
            </div>

            <div className="px-2 pb-3 mb-2 w-full">
                {/* Body */}
                <div className="mb-2 flex flex-col">
                    <div className="flex justify-between">
                        <label className="text-sm font-semibold">Body</label>
                        <div className="text-right text-xs text-gray-500">
                            {data?.body?.length || 0}/160
                        </div>
                    </div>
                    <textarea
                        maxLength={160}
                        rows={3}
                        placeholder="Enter Card Body Message"
                        value={data.body}
                        onChange={(e) => onChange(index, 'body', e.target.value)}
                        className="w-full mt-1 border rounded p-2 text-sm max-h-28 min-h-20"
                    />
                </div>

                {/* Tools */}
                <div className="flex items-center space-x-2 mb-4">
                    <button className="px-2 py-1 bg-blue-500 text-white text-sm rounded font-bold">B</button>
                    <button className="px-2 py-1 bg-cyan-600 text-white text-sm rounded font-bold">I</button>
                    <button className="bg-yellow-400 px-2 py-1 rounded text-sm">😊</button>
                    <button className="px-2 py-1 bg-yellow-500 text-white text-sm rounded">Add Placeholder</button>
                </div>

                {/* Dynamic URL */}
                <div className="mb-2">
                    <label className="text-sm font-semibold">Dynamic URL</label>
                    <div className="flex space-x-2 mt-2 gap-2 lg:flex-col">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold">Text</label>
                            <input
                                value={data.dynamicText}
                                onChange={(e) => onChange(index, 'dynamicText', e.target.value)}
                                placeholder="Enter Button Text"
                                className="flex-1 p-2 border rounded text-sm"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold">URL</label>
                            <input
                                value={data.dynamicUrl}
                                onChange={(e) => onChange(index, 'dynamicUrl', e.target.value)}
                                placeholder="https://www.example.com"
                                className="flex-1 p-2 border rounded text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Quick Reply */}
                <div className="mt-3 flex flex-col">
                    <label className="text-sm font-semibold">Quick Reply</label>
                    <input
                        value={data.quickReply}
                        onChange={(e) => onChange(index, 'quickReply', e.target.value)}
                        placeholder="Enter Button Text (Max 25 characters)"
                        maxLength={25}
                        className="w-full mt-1 p-2 border rounded text-sm"
                    />
                </div>
            </div>
        </div >
    );
};


// const Card = ({ index }) => (
//     <div className="border rounded w-fit md:w-[250px] shadow bg-white relative">
//         <div className="font-semibold mb-2 absolute py-2 px-2.5 rounded-br-xl bg-gray-200">{index + 1}</div>

//         {/* Upload Placeholder */}
//         <div className="flex justify-center mb-3 border shadow">
//             <img
//                 src="https://cdn-icons-png.flaticon.com/512/1828/1828911.png"
//                 alt="Upload"
//                 className="w-32 h-52"
//             />
//         </div>
//         <div className='px-2 mb-4 w-full '>
//             {/* Body */}
//             <div className="mb-2 flex flex-col ">
//                 <div className='flex justify-between'>
//                     <label className="text-sm font-semibold">Body</label>
//                     <div className="text-right text-xs text-gray-500">0/160</div>
//                 </div>
//                 <textarea
//                     maxLength={160}
//                     rows={3}
//                     placeholder="Enter Card Body Message"
//                     className="w-full mt-1 border rounded p-2 text-sm"
//                 />
//             </div>

//             {/* Tools Row */}
//             <div className="flex items-center space-x-2 mb-4">
//                 <button className="px-2 py-1 bg-blue-500 text-white text-sm rounded font-bold">B</button>
//                 <button className="px-2 py-1 bg-cyan-600 text-white text-sm rounded font-bold">I</button>
//                 <button type="button" className="bg-yellow-400 px-2 py-1 rounded text-sm">😊</button>
//                 <button className="px-2 py-1 bg-yellow-500 text-white text-sm rounded">Add Placeholder</button>
//             </div>

//             {/* Dynamic URL */}
//             <div className="mb-2 ">
//                 <label className="text-sm font-semibold">Dynamic URL</label>
//                 <div className="flex space-x-2 mt-2 gap-2">
//                     <div className="flex flex-col">

//                         <label className="text-sm font-semibold">Text</label>
//                         <input
//                             placeholder="Enter Button Text"
//                             className="flex-1 p-2 border rounded text-sm"
//                         />
//                     </div>
//                     <div className="flex flex-col">
//                         <label className="text-sm font-semibold">URL</label>
//                         <input
//                             placeholder="https://www.example.com"
//                             className="flex-1 p-2 border rounded text-sm"
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Quick Reply */}
//             <div className="mt-3">
//                 <label className="text-sm font-semibold flex flex-row">Quick Reply</label>
//                 <input
//                     placeholder="Enter Button Text (Max 25 characters)"
//                     className="w-full mt-1 p-2 border rounded text-sm"
//                 />
//             </div>
//         </div>
//     </div>
// );