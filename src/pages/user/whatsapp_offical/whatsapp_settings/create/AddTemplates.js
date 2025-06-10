import React, { useRef, useState } from 'react'
import { useEffect } from 'react';
import { Link } from 'react-router-dom'

const AddTemplates = () => {
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const [showOptions, setShowOptions] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [dropUp, setDropUp] = useState(false);
    const [formData, setFormData] = useState({
        templateName: '',
        category: 'Marketing',
        language: 'English',
        templateType: 'Basic',
        enableClickTracking: 'False',
        headerType: 'None',
        body: '',
        footerText: '',
    });

    const options = ['Quick Reply', 'Visit Website', 'Phonenumber', 'Flow'];
    const limits = {
        'Quick Reply': 1,
        'Visit Website': 2,
        'Phonenumber': 1,
        'Flow': 1,
    };

    const toggleDropdown = () => setShowOptions(!showOptions);

    const handleSelect = (option) => {
        const count = selectedOptions.filter((o) => o === option).length;
        if (count < limits[option]) {
            setSelectedOptions((prev) => [...prev, option]);
        } else {
            alert(`Limit reached for ${option}`);
        }
        setShowOptions(false);
    };

    const getLabel = (option) => {
        switch (option) {
            case 'Visit Website': return 'Visit Website (limit 2)';
            case 'Phonenumber': return 'Phonenumber (limit 1)';
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
                setDropUp(true); // not enough space below, more space above
            } else {
                setDropUp(false); // enough space below
            }
        }
    }, [showOptions]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <section className="w-full bg-gray-200  flex flex-col min-h-[calc(100vh-70px)] pb-3">
            <div className="px-3 mt-8">
                <div className="w-full py-2 bg-white rounded-lg flex">
                    <Link className="no-underline" to={"/whatsapp-setting/templates"}>
                        <h1 className="text-2xl ss:text-xl md:text-xl text-start pl-4 md:pl-0 md:flex justify-center text-black font-semibold py-0 m-0 hover:underline underline-offset-4">
                            Manage Template
                        </h1>
                    </Link>
                    <h1 className="text-2xl ss:text-xl md:text-xl text-start md:pl-0 md:flex justify-center text-black font-semibold py-0 m-0">
                        &nbsp;&gt;&nbsp;Add New Template
                    </h1>
                </div>

                {/* Form Details of Template */}
                <div className="w-full bg-white rounded-lg flex flex-row mt-3 ">
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
                                    <option value="Marketing">Marketing</option>
                                    <option value="Transactional">Transactional</option>
                                    {/* Add more as needed */}
                                </select>
                            </div>
                            <div className="flex-1 flex flex-col">
                                <label className='font-semibold text-base'>Language</label>
                                <select name="language" value={formData.language} onChange={handleChange} className="w-full border p-2 rounded">
                                    <option value="English">English</option>
                                    {/* Add more languages as needed */}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 flex flex-col">
                                <label className='font-semibold text-base'>Template Type</label>
                                <select name="templateType" value={formData.templateType} onChange={handleChange} className="w-full border p-2 rounded">
                                    <option value="Basic">Basic</option>
                                    <option value="Media">Media</option>
                                </select>
                            </div>
                            <div className="flex-1 flex flex-col">
                                <label className='font-semibold text-base'>Enable Click Tracking</label>
                                <select name="enableClickTracking" value={formData.enableClickTracking} onChange={handleChange} className="w-full border p-2 rounded">
                                    <option value="False">False</option>
                                    <option value="True">True</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col pt-2 border-t">
                            <label className='font-semibold text-base'>Header (Optional)</label>
                        </div>

                        <div className="flex-1 flex flex-col">
                            <label className='font-semibold text-base'>Header Type</label>
                            <select name="headerType" value={formData.headerType} onChange={handleChange} className="w-full border p-2 rounded">
                                <option value="None">None</option>
                                <option value="Text">Text</option>
                                <option value="Media">Media</option>
                            </select>
                        </div>

                        <div className="flex-1 flex flex-col">
                            <label className='font-semibold text-base'>Body</label>
                            <textarea
                                name="body"
                                value={formData.body}
                                onChange={handleChange}
                                maxLength={1024}
                                placeholder="Enter Template Message"
                                className="w-full border p-2 rounded min-h-[200px]"
                            ></textarea>
                            <div className="flex gap-2 mt-2">
                                <button type="button" className="bg-blue-700 text-white px-2 py-1 content rounded font-semibold">B</button>
                                <button type="button" className="bg-cyan-600 text-white px-2 py-1 rounded">I</button>
                                <button type="button" className="bg-yellow-400 px-2 py-1 rounded">😊</button>
                                <button type="button" className="bg-orange-500 text-white px-2 py-1 rounded">Add Placeholder</button>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col pt-2 border-t">
                            <label className='font-semibold text-base'>Footer (Optional)</label>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label className='font-semibold text-base'>Footer Text</label>
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
                                    className="w-fit bg-gray-500 text-white px-4 py-1.5 rounded"
                                >
                                    Action button ▼
                                </button>

                                {showOptions && (
                                    <div
                                        ref={dropdownRef}
                                        className={`absolute z-10 w-56 bg-white border rounded shadow-md ${dropUp ? 'bottom-full mb-2' : 'mt-2'
                                            }`}
                                    >
                                        {options.map((option, index) => (
                                            <React.Fragment key={index}>
                                                <button
                                                    onClick={() => handleSelect(option)}
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                                >
                                                    {getLabel(option)}
                                                </button>
                                                {/* {index < options.length - 1 && (
                                                    <hr className="border-t border-gray-200 mx-2" />
                                                )} */}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                )}

                                {selectedOptions.length > 0 && (
                                    <div className="mt-2">
                                        <strong>Selected:</strong>
                                        <ul className="list-disc list-inside">
                                            {selectedOptions.map((opt, idx) => (
                                                <li key={idx}>{opt}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded">Save changes</button>
                            <Link to={"/whatsapp-setting/templates"} type="button" className="border border-gray-300 bg-gray-300 px-4 py-2 rounded no-underline text-black">Cancel</Link>
                        </div>
                    </form>
                </div>
                <div className='w-1/3'>
                    <div className=''>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default AddTemplates