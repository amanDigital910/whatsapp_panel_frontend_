import React, { useState } from "react";
import { DisplayButton } from "../pages/utils/Index";

const DisplayButtonComponent = () => {
  const [buttons, setButtons] = useState([
    { id: 1, type: "phone", number: "", text: "" },
    { id: 2, type: "url", number: "", text: "" },
  ]);

  const handleAddButton = () => {
    if (buttons.length < 5) {
      setButtons([
        ...buttons,
        {
          id: Date.now(),
          type: "custom", // could be phone or url depending on user choice
          number: "",
          text: "",
        },
      ]);
    }
  };

  const handleRemoveButton = (id) => {
    setButtons(buttons.filter((btn) => btn.id !== id));
  };

  const updateButton = (id, key, value) => {
    setButtons(
      buttons.map((btn) =>
        btn.id === id ? { ...btn, [key]: value } : btn
      )
    );
  };

  return (
    <div className="flex flex-col gap-3 mt-4 items-start w-full">
      {buttons.length < 5 && (
        <button onClick={handleAddButton}>+ Add Button</button>
      )}
      {buttons.map((btn) => (
        <div key={btn.id} className="relative flex w-full" style={{ marginBottom: "10px" }}>
          <DisplayButton
            buttonNumber={btn.number}
            buttonText={btn.text}
            setButtonNumber={(val) => updateButton(btn.id, "number", val)}
            setButtonText={(val) => updateButton(btn.id, "text", val)}
            phBtnText={
              btn.type === "url"
                ? "Button Display Text (Web URL)"
                : "Button Display Text (Call Now)"
            }
            phBtnDetails={
              btn.type === "url"
                ? "https://writeyoururl.com"
                : "Max 10 digit number allowed"
            }
          />
          {btn.id !== 1 && btn.id !== 2 && (
            <button className="absolute top-0 right-0 h-full justify-center mr-2" onClick={() => handleRemoveButton(btn.id)}>❌</button>
          )}
        </div>
      ))}


    </div>
  );
};

export default DisplayButtonComponent;
