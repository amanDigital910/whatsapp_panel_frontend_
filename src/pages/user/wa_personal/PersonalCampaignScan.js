import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoScanCircle } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import CreditHeader from "../../../components/CreditHeader";

const PersonalCampaignScan = () => {
  const [model, setModel] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [instanceData, setInstanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/PersonalCampaign/getInstanceUserData`
      )
      .then((response) => {
        console.log("Instance data:", response.data);
        const data = response.data;
        // Check if the response indicates that the instance is not ready.
        if (
          data &&
          data.me &&
          data.me.status === "error" &&
          data.me.message.toLowerCase() === "instance not ready"
        ) {
          setInstanceData(null);
        } else if (data && data.me) {
          setInstanceData(data);
        } else {
          setInstanceData(null);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching instance data:", error);
        setInstanceData(null);
        setIsLoading(false);
      });
  }, [process.env.REACT_APP_API_URL]);

  // Function to call the API and update the QR code state
  const handleAddChannel = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/PersonalCampaign/personalCampaignScan`
      );
      let qrData = response.data.qrCode.data.qr_code;
      if (!qrData.startsWith("data:image")) {
        qrData = "data:image/png;base64," + qrData;
      }
      setQrCode(qrData);
      setModel(true);
    } catch (error) {
      console.error("Error fetching QR Code:", error);
    }
  };

  // Function to call the InstanceDelete API endpoint when Delete is clicked.
  const handleDeleteInstance = async () => {
    try {
      // Using axios.delete to call the delete API endpoint.
      const response = await axios.delete(
        "http://localhost:5000/api/PersonalCampaign/InstanceDelete"
      );
      console.log("Delete response:", response.data);
      // Update instanceData to null so that the table shows "No Data Found".
      setInstanceData(null);
    } catch (error) {
      console.error("Error deleting instance:", error);
    }
  };

  return (
    <>
      <section className="w-full bg-gray-200  flex justify-center flex-col pb-10">
        <CreditHeader />
        <div className="w-full px-4">
          <div className="w-full flex justify-between bg-white mt-5 py-3 px-3">
            <h1
              className="text-2xl text-black font-semibold pl-4"
              style={{ fontSize: "32px" }}
            >
              Whatsapp Scan
            </h1>
            <button
              onClick={handleAddChannel}
              className="text-white flex justify-center items-center gap-2 px-4 py-1 rounded bg-brand_colors"
            >
              <IoScanCircle /> Add Channel
            </button>
          </div>

          {/* Modal displaying the API QR Code */}
          {model && (
            <div className="w-screen h-screen bg-black/40 absolute z-20 top-0 left-0 flex justify-center items-center">
              <div className="w-[700px] h-[400px] overflow-auto bg-white rounded p-3">
                <div className="w-full flex justify-end">
                  <RxCross1
                    className="text-black cursor-pointer"
                    onClick={() => setModel(false)}
                  />
                </div>
                <br />
                <div className="w-full flex justify-between">
                  <div className="w-full">
                    <p>This part comes from the backend</p>
                  </div>
                  <div className="w-full border-2 rounded p-1">
                    {qrCode ? (
                      <img
                        src={qrCode}
                        alt="QR Code"
                        className="w-full h-[300px] object-contain"
                      />
                    ) : (
                      <p>Loading QR Code...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Table with Instance Data */}
          <div className="w-full bg-white rounded mt-5 py-3 px-3">
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button className="px-3 py-1 rounded bg-brand_color_4 text-white font-[600]">
                  Copy
                </button>
                <button className="px-3 py-1 rounded bg-brand_color_4 text-white font-[600]">
                  Excel
                </button>
                <button className="px-3 py-1 rounded bg-brand_color_4 text-white font-[600]">
                  PDF
                </button>
              </div>
              <div className="flex items-center gap-2 text-black">
                <p className="mb-0">Search :</p>
                <input
                  type="text"
                  placeholder="search"
                  className="w-[200px] border-[0.1px] bg-white border-black outline-none text-black py-1 px-2"
                />
              </div>
            </div>
            <br />
            <div className="w-full max-h-[400px] rounded text-white">
              <table className="w-full text-center table-auto">
                <thead className="bg-gray-800 border-b-2 border-gray-600">
                  <tr>
                    <th className="py-3 px-6 text-white font-semibold">Id</th>
                    <th className="py-3 px-6 text-white font-semibold">
                      WhatsApp Name
                    </th>
                    <th className="py-3 px-6 text-white font-semibold">
                      Mobile
                    </th>
                    <th className="py-3 px-6 text-white font-semibold">
                      Status
                    </th>
                    <th className="py-3 px-6 text-white font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-700">
                  {isLoading ? (
                    <tr className="border-b bg-white text-dark">
                      <td className="py-4 px-6" colSpan="5">
                        Loading...
                      </td>
                    </tr>
                  ) : instanceData && instanceData.me ? (
                    <tr className="border-b bg-white text-dark">
                      <td className="py-4 px-6">
                        {instanceData.me.instanceId}
                      </td>
                      <td className="py-4 px-6">
                        {instanceData.me.data.displayName}
                      </td>
                      <td className="py-4 px-6">
                        {instanceData.me.data.formattedNumber}
                      </td>
                      <td className="py-4 px-6">Active</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={handleDeleteInstance}
                          className="px-2 py-1 text-white bg-red-500 rounded mx-3"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr className="border-b bg-white text-dark">
                      <td className="py-4 px-6" colSpan="5">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional duplicate modal (if needed) */}
          {model && (
            <div className="w-screen h-screen bg-black/40 absolute z-20 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
              <div className="w-[700px] h-[400px] overflow-auto bg-white rounded p-3">
                <div className="w-full flex justify-end">
                  <RxCross1
                    className="text-black cursor-pointer"
                    onClick={() => setModel(false)}
                  />
                </div>
                <br />
                <div className="w-full flex justify-between">
                  <div className="w-full">
                    <p>This part comes from the backend</p>
                  </div>
                  <div className="w-full border-2 rounded p-1">
                    <img
                      src={qrCode}
                      alt="QR Code"
                      className="w-full h-[300px] object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PersonalCampaignScan;
