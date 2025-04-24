import React, { useState } from "react";
import { DisplayButton } from "../pages/utils/Index";

const DisplayButtonComponent = () => {
  const [buttons, setButtons] = useState([
    { id: 1, type: "phone", number: "", text: "", phBtnDetails: "Max 10 digit number allowed" },
    { id: 2, type: "url", number: "", text: "", phBtnDetails: "https://write-your-url.com" },
  ]);

  // Adds a new button if under limit
  const handleAddButton = () => {
    if (buttons.length < 5) {
      setButtons([
        ...buttons,
        {
          id: Date.now(),
          type: "text",
          number: "",
          text: "",
          phBtnText: `Button ${buttons.length + 1} Display Text`,
          phBtnDetails: "Enter your text here",
        },
      ]);
    }
  };

  // Removes a button by ID
  const handleRemoveButton = (id) => {
    setButtons(buttons.filter((btn) => btn.id !== id));
  };

  // Updates a field (text or number) for a specific button
  const updateButton = (id, key, value) => {
    setButtons(
      buttons.map((btn) =>
        btn.id === id ? { ...btn, [key]: value } : btn
      )
    );
  };

  return (
    <div className="flex flex-col gap-3 items-start w-full">
      {buttons.length < 5 && (
        <button onClick={handleAddButton}>+ Add Button</button>
      )}
      {buttons.map((btn) => (
        <div
          key={btn.id}
          className="relative flex w-full"
          style={{ marginBottom: "10px" }}
        >
          <DisplayButton
            buttonNumber={btn.number}
            buttonText={btn.text}
            setButtonNumber={(val) => updateButton(btn.id, "number", val)}
            setButtonText={(val) => updateButton(btn.id, "text", val)}
            phBtnText={btn.phBtnText}
            phBtnDetails={btn.phBtnDetails}
          />
          {/* Only show remove button for buttons other than the first two */}
          {btn.id !== 1 && btn.id !== 2 && (
            <button
              className="absolute top-0 right-0 h-full justify-center mr-2 md:mt-5"
              onClick={() => handleRemoveButton(btn.id)}
            >
              ❌
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default DisplayButtonComponent;
