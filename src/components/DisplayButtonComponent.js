import React, { useState } from "react";
import { DisplayButton } from "../pages/utils/Index";

const DisplayButtonComponent = () => {
  const [buttons, setButtons] = useState([
    {
      id: 1,
      type: "phone",
      text: "Call Now",
      phBtnText: "Call Now",
      phBtnShowText: "Button 1 Display Text (Call Now)",
      phBtnDetails: "Max 10 digit number allowed",
    },
    {
      id: 2,
      text: "URL Button",
      phBtnText: "URL Button",
      // phBtnDetails: "https://write-your-url.com",
      phBtnShowText: "Button 2 Display Text (Website URL)",
      phBtnDetails: "https://write-your-url.com",
    },
  ]);

  const [buttonValues, setButtonValues] = useState({
    1: { btnValueData: "", showBtnText: "", type: "phone" },
    2: { btnValueData: "", showBtnText: "", type: "url" },
  });

  // Add new dynamic button
  const handleAddButton = () => {
    if (buttons.length < 5) {
      const index = buttons.length + 1;
      const id = index;
      const labels = [
        "Button 3 Display Quick Reply",
        "Button 4 Display Not Interested Button",
        "Button 5 Display Interested Button",
      ];
      const labelIndex = buttons.length - 2;

      const newButton = {
        id,
        text: "",
        phBtnDetails: labels[labelIndex] || `Button ${buttons.length + 1}`,
      };

      setButtons([...buttons, newButton]);
      setButtonValues((prev) => ({
        ...prev,
        [id]: { btnValueData: "", showBtnText: "", type: "text" },
      }));
    }
  };

  // Remove dynamic button
  const handleRemoveButton = (id) => {
    if (id !== 1 && id !== 2) {
      setButtons((prev) => prev.filter((btn) => btn.id !== id));
      setButtonValues((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  // Update button values (btnValueData or display text)
  const updateValue = (id, key, value) => {
    setButtonValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }));
  };

  // Update static button text (if needed)
  const updateButton = (id, key, value) => {
    setButtons((prev) =>
      prev.map((btn) => (btn.id === id ? { ...btn, [key]: value } : btn))
    );
  };

  const finalPayload = buttons.map((btn) => ({
    ...btn,
    ...buttonValues[btn.id],
  }));

  console.log("Payload ready to send:", buttonValues);

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <div className="flex justify-between w-full sm:flex-col">
        <p className="m-0 font-semibold uppercase text-lg whitespace-nowrap text-center flex items-center">
          Call to Action Option
        </p>
        <button
          className={`bg-green-600 text-white text-xl px-3 py-1 mb-0 font-medium rounded-xl w-fit ${buttons.length >= 5 && "opacity-60 cursor-not-allowed"
            }`}
          onClick={handleAddButton}
          disabled={buttons.length >= 5}
        >
          + Add Button
        </button>
      </div>

      <div className="w-full flex flex-col gap-4">
        {buttons.map((btn) => (
          <div key={btn.id} className="relative flex w-full">
            <DisplayButton
              btnType={btn.type}
              buttonText={btn.text}
              setButtonText={(val) => updateButton(btn.id, "text", val)}
              phBtnDetails={btn.phBtnDetails}
              phBtnShowText={btn.phBtnShowText}
              valueButtonNumber={buttonValues[btn.id]?.btnValueData || ""}
              setValueButtonNumber={(val) =>
                updateValue(btn.id, "btnValueData", val)
              }
              valueTextNumber={buttonValues[btn.id]?.showBtnText || ""}
              setValueTextNumber={(val) =>
                updateValue(btn.id, "showBtnText", val)
              }
            />
            {btn.id !== 1 && btn.id !== 2 && (
              <button
                className="absolute top-0 right-0 h-full justify-center mr-2 md:mt-5 text-red-500"
                onClick={() => handleRemoveButton(btn.id)}
              >
                ❌
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayButtonComponent;
