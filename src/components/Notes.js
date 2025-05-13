import React from 'react';

const Notes = () => {
  const notes = [
    "Your database will remain in your portal for 15 days from the day of the campaign.",
    "For Smooth Use WhatsApp Number will be Old for More Than 6 Months, And For The New WhatsApp Number you Can Send Up to 100-300 WhatsApp Per Day",
    "In case the WhatsApp API site is down, we may have to wait till maintenance is over",
    "Your WhatsApp will disconnect from the panel if your device has connectivity issues or if there is a new update to the WhatsApp Business API platform or App.",
    "WhatsApp Number Ban is Subject to WhatsApp Rules & Sending Process.",
    "We Can Help You to Recover Your Number ASAP (Depend On WhatsApp Support Team)."
  ];

  return (
    <>
      <div className='w-[100%] bg-white py-3 px-4 my-3 rounded-md'>
        <h1 className='text-black text-[25px] mb-2'>Note :-</h1>
        <ul className='w-[100%] text-red-500 text-[18px] font-semibold list-disc pl-5'>
          {notes.map((note, index) => (
            <li key={index} className='mb-1'>
              {note}
            </li>
          ))}
        </ul>
       
      </div>
    </>
  );
};

export default Notes;
