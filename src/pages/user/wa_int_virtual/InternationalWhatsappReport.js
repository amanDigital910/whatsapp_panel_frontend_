import React, { useState, useEffect } from "react";
import axios from "axios";
import CreditHeader from "../../../components/CreditHeader";

const WhatsappReport = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch campaigns on component mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/Internationalcampaign")
      .then((response) => {
        // Set the returned data to state
        setCampaigns(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching campaigns:", error);
        setError("Failed to load campaigns");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <section className="w-[100%] bg-gray-200 pb-[200px] ">
        <CreditHeader />
        <div className="w-full px-4 mt-8">
          <div className="w-full py-2 mb-3 bg-white">
            <h1
              className="text-2xl text-black font-semibold pl-4"
              style={{ fontSize: "32px" }}
            >
              International Whatsapp Report
            </h1>
          </div>

          <div className="w-full flex gap-3 justify-content-between align-items-center py-2 bg-white px-3">
            <div className="flex items-center gap-3 w-[30%]">
              <p className="font-[600] text-[20px] mt-2">To</p>
              <input type="date" className="form-control" />
            </div>
            <div className="flex items-center gap-3 w-[30%]">
              <p className="font-[600] text-[20px] mt-2">From</p>
              <input type="date" className="form-control" />
            </div>
            <button className="px-10 py-2 rounded text-white bg-brand_colors">
              Submit
            </button>
          </div>

          <br />
          <div className="w-[100%] bg-white px-3 pb-4 rounded">
            <div className="w-[100%] flex justify-between items-center gap-[150px] px-10 text-black">
              <div className="flex items-center gap-4 w-[100%]"></div>
            </div>
            <br />
            <div className="w-[100%] flex justify-between items-center">
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
                <p className="mt-3">Search :</p>
                <input
                  type="text"
                  placeholder="search"
                  className="w-[200px] border-[0.1px] bg-white border-black outline-none text-black rounded py-1 px-2"
                />
              </div>
            </div>
            <br />
            <div className="w-full rounded text-white">
              {loading ? (
                <p className="text-center text-black">Loading...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : (
                <table className="w-full text-center table-auto">
                  <thead className="bg-gray-800 border-b-2 border-gray-600">
                    <tr>
                      <th className="py-3 px-6 text-white font-semibold">
                        Campaign Id
                      </th>
                      <th className="py-3 px-6 text-white font-semibold">
                        User Name
                      </th>
                      <th className="py-3 px-6 text-white font-semibold">
                        Number Count
                      </th>
                      <th className="py-3 px-6 text-white font-semibold">
                        Campaign
                      </th>
                      <th className="py-3 px-6 text-white font-semibold">
                        Campaign Report
                      </th>
                      <th className="py-3 px-6 text-white font-semibold">
                        Template Status
                      </th>
                      <th className="py-3 px-6 text-white font-semibold">
                        Campaign Submit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-black">
                    {campaigns.map((campaign) => (
                      <tr
                        key={campaign.campaignId}
                        className="border-b border-gray-600 transition"
                      >
                        <td className="py-4 px-6">{campaign.campaignId}</td>
                        <td className="py-4 px-6">
                          {campaign.userName || "N/A"}
                        </td>
                        <td className="py-4 px-6">{campaign.numberCount}</td>
                        <td className="py-4 px-6">
                          {campaign.campaignTitle || "N/A"}
                        </td>
                        <td className="py-4 px-6">{campaign.campaignReport}</td>
                        <td className="py-4 px-6">
                          Template Status Placeholder
                        </td>
                        <td className="py-4 px-6">
                          {new Date(
                            campaign.campaignSubmitTime
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhatsappReport;
