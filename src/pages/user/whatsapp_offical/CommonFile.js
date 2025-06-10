
export const RequiredAsterisk = ({ required }) => {
    return (
        <p>{required && <span className="text-red-500">*</span>}</p>
    )
}


export const TitleName = ({ titleName }) => {
    return (
        <>
            <p className='py-3 px-3 bg-white shadow-lg font-bold text-xl tracking-wide'>{titleName}</p>
        </>
    )
}


export const TextFieldArea = ({ fieldType, className, labelText, inputId, placeholder, valueInput, setValueInput, required, ...rest }) => {
    return (
        <div className="flex gap-0 flex-col w-full">
            <p className="text-lg font-semibold flex flex-row h-8 w-fit p-0 m-0">
                {labelText}
                <RequiredAsterisk required={required} />
            </p>
            <input
                type={fieldType}
                className={className}
                placeholder={placeholder}
                id={inputId}
                value={valueInput}
                required
                onChange={(e) => setValueInput(e.target.value)}
                {...rest}
            />
        </div>
    );
}

export const RadioButtonGroup = ({ name, labelClassName, options, radioTitle, selectedValue, setSelectedValue, required }) => {
    return (
        <div className="flex flex-col ">
            <label className={` h-10 flex flex-row ${labelClassName}`}>
                {radioTitle}
                <RequiredAsterisk required={required} />
            </label>
            <div className="flex flex-row gap-3">
                {options.map((option) => (
                    <label key={option.value} className="flex items-center gap-2">
                        <input
                            className="flex flex-row"
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={selectedValue === option.value}
                            onChange={(e) => setSelectedValue(e.target.value)}
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        </div>
    );
};

export const CheckboxField = ({ label, labelClassName, checked, onChange, name, className = '', required, ...rest }) => {
    return (
        <button className={`flex gap-2 cursor-pointer w-fit h-8 ${className}`} onChange={(e) => onChange(e.target.checked)}>
            <label className={` flex flex-row m-0 p-0 h-full items-center ${labelClassName}`}>
                {label}
                <RequiredAsterisk required={required} />
            </label>
            <input
                type="checkbox"
                className="text-lg "
                name={name}
                checked={checked}
                required

                {...rest}
            />
        </button>
    );
};

export const CountryDropDown = ({ labelClassName, titleName, required, selectedCountry, setSelectedCountry, countries }) => {
    return (
        <div className="">
            <p className={` flex flex-row h-8 w-fit p-0 m-0 ${labelClassName}`}>
                {titleName}
                <RequiredAsterisk required={required} />
            </p>
            <select
                className="form-select border-black px-3 py-2 rounded-md"
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
        </div>
    )
}



// New whatsapp Text Numbers
export const WhatsappTextNumber = ({ setWhatsAppNumbers, whatsAppNumbers, labelClassName, required, labelText, warningMessage, setStatsNumber, className }) => {

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
            <p className={` flex flex-row h-8 w-fit p-0 m-0 ${labelClassName}`}>
                {labelText}
                <RequiredAsterisk required={required} />
            </p>
            {warningMessage && <p className={` flex flex-row whitespace-pre-wrap w-fit p-0 m-0 text-base text-red-500`}>
                {warningMessage}
            </p>}
            <div className="h-full flex flex-grow">
                <textarea
                    className={`w-full h-full px-3 py-2 rounded-md bg-white text-black form-control placeholder-gray-500 ${className}`}
                    placeholder="Enter WhatsApp Numbers (without 91)"
                    required
                    style={{
                        minHeight: '500px',
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

// Templates Dropdowns 
export const TemplateDropdown = ({ selectedTemplate, setSelectedTemplate, msgTemplates, setEditorData, labelText, required }) => {
    return (
        <div>
            <p className="text-lg font-semibold flex flex-row h-8 w-fit p-0 m-0">
                {labelText}
                <RequiredAsterisk required={required} />
            </p>
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
        </div>
    );
}

export const SubmitNowButton = ({ handleSendCampaign }) => {
    return (
        <div className="">
            <button
                className="w-full rounded-md bg-green-600 py-2 text-white md:text-xl text-2xl capitalize font-semibold flex items-center justify-center hover:bg-green-500 transition duration-300"
                onClick={handleSendCampaign}>
                Send Now
            </button>
        </div>
    )
}