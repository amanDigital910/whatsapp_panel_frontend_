import React from 'react';

const Notes = () => {
  const notes = [
    "Maximum 5 Demo Allowed.",
    "Maximum 2 campaigns can be submitted in a single day.",
    "Minimum campaign Quantity: 100.",
    "Maximum campaign Quantity: 50000.",
    "All campaigns will be processed between 10:00 AM to 6:00 PM on working days.",
    "If you do not receive campaign messages for any reason, you have to wait for the report.",
    "Report will update in 24 hours to 48 hours working days.",
    "Your database will remain in your portal for 15 days from the day of the campaign.",
    "If you send any spam or abusive messages, your credits will be forfeited.",
    "In case the WhatsApp messaging site is down, we may have to wait until maintenance is over."
  ];

  return (
    <>
      <div className='w-[100%] bg-white py-3 px-4  rounded'>
        <h1 className='text-black text-[25px] mb-4'>Note :-</h1>
        <ul className='w-[100%] text-red-500 text-[18px] font-semibold list-disc pl-5'>
          {notes.map((note, index) => (
            <li key={index} className='mb-2'>
              {note}
            </li>
          ))}
        </ul>
       
      </div>
    </>
  );
};

export default Notes;
