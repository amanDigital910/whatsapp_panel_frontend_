import React, { useEffect, useState } from 'react'
import { CheckboxField, CountryDropDown, RadioButtonGroup, SubmitNowButton, TemplateDropdown, TextFieldArea, TitleName, WhatsappTextNumber } from './CommonFile'
import axios from 'axios';

const SendWhatsapp = () => {
  const [selectedValue, setSelectedValue] = useState('numbers');
  const [campaignName, setCampaignName] = useState();

  const [mobileNo, setMobileNo] = useState();
  const [isAgreed, setIsAgreed] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [whatsAppTextNumbers, setWhatsAppTextNumbers] = useState("");
  const [statsNumber, setStatsNumber] = useState({ total: 0, valid: 0, invalid: 0, duplicates: 0, });

  const [msgTemplates, setMsgTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [, setEditorData] = useState("");


  const options = [
    { label: 'Numbers', value: 'numbers' },
    { label: 'CSV Upload', value: 'csv' },
  ];

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/msgtemplate/`)
      .then((response) => setMsgTemplates(response.data))
      .catch((error) =>
        console.error("Error fetching message templates:", error)
      );
  }, []);


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


  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("campaignTitle", campaignName);
    formData.append("selectedTemplate", selectedTemplate);
    formData.append("phoneNumber", mobileNo);
    formData.append("selectedCountries", selectedCountry);
    formData.append("selectedRadioButton", selectedValue);
    formData.append("selectedCheckBox", isAgreed);
    formData.append("selectedTextNumbers", whatsAppTextNumbers);

    //  Axios Post Request
  }

  return (
    <div className='w-full bg-gray-200 '>
      <TitleName titleName={"Send Whatsapp Compaign"} />
      <div className=' p-3 h-full'>
        <div className=' h-full py-4 px-4 bg-white flex flex-col gap-4'>
          <TextFieldArea
            className={"border-black border w-full pl-2 py-2 rounded-md text-lg "}
            labelText={"Campaign Name"}
            fieldType={"text"}
            placeholder={"Enter Campaign Name"}
            valueInput={campaignName}
            setValueInput={setCampaignName}
            required='true'
          />

          <TextFieldArea
            className={"border-black border w-full pl-2 py-2 rounded-md text-lg "}
            labelText={"Phone Number"}
            fieldType={"phone"}
            placeholder={"Enter your number"}
            valueInput={mobileNo}
            setValueInput={setMobileNo}
            required='true'
          />

          <TemplateDropdown
            labelText="Template Name"
            labelClassName="font-bold text-lg"
            required
            msgTemplates={msgTemplates}
            selectedTemplate={selectedTemplate}
            setEditorData={setEditorData}
            setSelectedTemplate={setSelectedTemplate} />

          <CountryDropDown
            titleName="Countries"
            required='true'
            labelClassName="font-bold text-lg"
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            countries={countries} />

          <RadioButtonGroup
            name="whatsapp radio"
            labelClassName="font-bold text-lg"
            radioTitle={"Send Whatsapp Compaign"}
            options={options}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            required='true'
          />

          <CheckboxField
            label="Multi Country Campaign"
            className=''
            labelClassName="font-bold text-lg"
            checked={isAgreed}
            onChange={setIsAgreed}
            name="whatsapp checkbox"
            required='true'
          />

          {/* WhatsApp Numbers Textarea */}
          <WhatsappTextNumber
            labelText="Numbers"
            labelClassName="font-bold text-lg"
            warningMessage="This is the wraning"
            required='true'
            whatsAppNumbers={whatsAppTextNumbers}
            setWhatsAppNumbers={setWhatsAppTextNumbers}
            statsNumber={statsNumber}
            setStatsNumber={setStatsNumber}
            className="border border-black rounded-md focus:border-black focus-within:border-black"
          />

          <SubmitNowButton handleSendCampaign={handleSubmit} />

        </div>
      </div>
    </div>
  )
}

export default SendWhatsapp