import React, { useState } from 'react'
import { TitleName } from './CommonFile'
import { DashboardBarChart, PieChart } from './Components/Charts'
import { CodeSnippet } from './CodeSnippet';
import './commonCSS.css'
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(CodeSnippet[0].language);
  const activeSnippet = CodeSnippet.find(snippet => snippet.language === activeTab);

  // Copy to Clipboard Button
  const copyToClipboard = () => {
    const textToCopy = activeSnippet.code.join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      // alert(`Copied ${activeSnippet.language} code to clipboard!`);
      toast.success(`Copied ${activeSnippet.language} code to clipboard!`)
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  return (
    <div className="w-full bg-gray-200">
      <TitleName titleName="Whatsapp Dashboard" />
      <div className="py-3 px-2 bg-white flex flex-col gap-3">
        <div className="flex gap-3 lg:flex-col">
          <div className="w-[50%] lg:w-full border border-black rounded-md shadow-xl">
            <span className="bg-[#383387] py-3 flex justify-around text-white text-lg">
              <p className="m-0">Total Submission</p>
              <p className="m-0">0</p>
            </span>
            <div className="flex lg:flex-col md:w-full md:justify-center">
              <div className="md:w-full py-5 md:px-2 px-4 md:py-2 flex items-center flex-col">
                <p className="text-xl font-medium m-0">Today's Stats</p>
                <div className="flex gap-5 text-lg font-medium">
                  <p className="w-32 m-0">Delivered</p>
                  <p className="m-0">0</p>
                </div>
                <div className="flex gap-5 text-lg font-medium">
                  <p className="w-32 m-0">Failed</p>
                  <p className="m-0">0</p>
                </div>
              </div>
              <div className='h-full w-full  flex justify-center '>
                <PieChart />
              </div>
            </div>
          </div>
          <div className="w-[50%] lg:flex-col lg:w-full min-h-60 max-h-full border border-black rounded-md shadow-xl">
            <span className="border-black border-b py-3 flex justify-center text-lg">
              <p className="m-0">Total Submission</p>
            </span>
            <div className="flex">
              <div className="w-full py-1 px-4 pt-2 items-center flex flex-col">
                <p className="text-xl font-medium m-0">Whatsapp</p>
                <p className="text-lg font-normal m-0">1,482.53 Credits</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex lg:flex-col gap-3 w-full">
          {/* Performance Report with Bar Chart */}
          <div className="lg:w-full w-[50%] border border-black rounded-md shadow-xl">
            <span className="py-2 flex justify-center text-black border-b border-black text-lg rounded-t-md">
              <p className="m-0">Performance Report</p>
            </span>
            <DashboardBarChart />
          </div>

          {/* Code Example Panel */}
          <div className="lg:w-full w-[50%] h-full border border-black rounded-md shadow-xl">
            <div className="bg-white rounded-lg">
              <div className="border-b border-black py-2 px-3 flex gap-4 overflow-x-auto text-[1.1rem]">
                {CodeSnippet.map(snippet => (
                  <button
                    key={snippet.language}
                    className={`font-semibold whitespace-nowrap ${activeTab === snippet.language
                      ? 'border-b-2 border-black text-black'
                      : 'text-gray-500'
                      }`}
                    onClick={() => setActiveTab(snippet.language)}
                  >
                    {snippet.language}
                  </button>
                ))}
              </div>

              <div className="relative overflow-x-auto rounded-b-lg bg-gray-300 h-[400px] flex flex-wrap custom-horizontal-scroll">
                {/* Copy Button */}
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-3 z-10 px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800"
                >
                  Copy
                </button>

                <pre className="px-3 py-4 m-0 text-sm whitespace-pre-wrap h-auto">
                  <code>
                    {activeSnippet.code.map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Dashboard