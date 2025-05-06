/* eslint-disable no-lone-blocks */
import React, { useState } from "react";
import { CategoryScale, Chart as ChartJS, defaults, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";
import '../commonCSS.css'
import sourceData from "./sourceData.json";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'; 

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const PieChart = () => {
  return (
    <div className="flex justify-center items-center lg:w-full w-[205px] sm:h-[250px] h-[300px] pb-3" >
      <Doughnut
        data={{
          labels: sourceData.map((data) => data.label),
          datasets: [
            {
              label: "Count",
              data: sourceData.map((data) => data.value),
              backgroundColor: [
                "rgba(43, 63, 229, 0.8)",
                "rgba(250, 192, 19, 0.8)",
                "rgba(253, 135, 135, 0.8)",
              ],
              borderColor: [
                "rgba(43, 63, 229, 0.8)",
                "rgba(250, 192, 19, 0.8)",
                "rgba(253, 135, 135, 0.8)",
              ],
            },
          ],
        }} />
    </div>

  );
};

export const DashboardBarChart = () => {

  const dummyDates = [
    "2025-04-10",
    "2025-04-15",
    "2025-04-20",
    "2025-04-25",
    "2025-04-30",
    "2025-05-05",
    "2025-05-10",
  ];

  const GenerateDummyData = (dates) => {
    return dates.map(date => ({
      date,
      success: Math.floor(Math.random() * 1000),
      failure: Math.floor(Math.random() * 700),
    }));
  };

  // Set initial date range to cover all dummy data
  const initialStartDate = new Date();
  const initialEndDate = new Date();
  initialStartDate.setDate(initialStartDate.getDate() - 7);
  const [dateRange, setDateRange] = useState([initialStartDate, initialEndDate]);
  const [startDate, endDate] = dateRange;

  const data = GenerateDummyData(dummyDates);

  // Filter data within selected date range
  const filteredData = data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  });

  const chartData = {
    labels: filteredData.map((item) => item.date),
    datasets: [
      {
        label: "Failure",
        data: filteredData.map((item) => item.failure),
        backgroundColor: "rgba(53, 162, 235, 1)",
      },
      {
        label: "Success",
        data: filteredData.map((item) => item.success),
        backgroundColor: "rgba(53, 162, 35, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
        beginAtZero: true,
      },
    },
  };


  return (
    <div className="border rounded shadow-md lg:w-full overflow-auto h-[400px] overflow-y-auto p-1 custom-Scroll">
      <div className="flex gap-4 w-full justify-center pt-3">
        <DatePicker
          className='w-60 px-2 border-2 border-black '
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
          }}
          isClearable={true}
        />
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
};
