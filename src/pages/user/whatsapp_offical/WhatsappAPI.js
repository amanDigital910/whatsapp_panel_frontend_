import React, { useState } from 'react'
import { TextFieldArea, TitleName } from './CommonFile'

const WhatsappAPI = () => {

    const [apiKey, setApiKey] = useState();

    return (
        <div className="w-full bg-gray-200">
            <TitleName titleName={"Whatsapp API"} />
            <div className="px-3 py-4 bg-white w-full flex lg:flex-col gap-4">
                <TextFieldArea
                    className={"w-full py-2 border border-black px-3 text-lg"}
                    fieldType={"text"}
                    labelText={"API Key"}
                    setValueInput={setApiKey}
                    valueInput={apiKey}
                    placeholder={"Showing your API Key"}
                    disabled
                />
                <TextFieldArea
                    className={"w-full py-2 border border-black px-3 text-lg"}
                    fieldType={"text"}
                    labelText={"Whatsapp Wallet"}
                    setValueInput={setApiKey}
                    valueInput={apiKey}
                    placeholder={"Wallet Credits"}
                    disabled
                />
            </div>

        </div>
    )
}

export default WhatsappAPI