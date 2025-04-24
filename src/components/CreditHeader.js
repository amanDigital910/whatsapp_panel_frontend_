import React from 'react'

const CreditHeader = () => {
  return (
    <div className="flex items-center justify-center w-full border">
      <div className="w-full flex flex-row md:items-center pt-2 gap-4 bg-[#406dc7] text-white px-3 py-2 overflow-x-auto">
        {/* Title */}

        {/* Credit Items */}
        <div className="flex flex-wrap md:flex-wrap items-center md:gap-x-4 gap-x-6 text-lg pl-2">
          <p className="text-lg font-semibold whitespace-nowrap p-0 m-0">Balance :-</p>
          <p className="whitespace-nowrap p-0 m-0">WAV:&nbsp;<span>0</span></p>
          <p className="whitespace-nowrap p-0 m-0">WAVBT:&nbsp;<span>0</span></p>
          <p className="whitespace-nowrap p-0 m-0">WAVDP:&nbsp;<span>0</span></p>
          <p className="whitespace-nowrap p-0 m-0">WAVPOLL:&nbsp;<span>0</span></p>
          <p className="whitespace-nowrap p-0 m-0">WAP:&nbsp;<span>0</span></p>
          <p className="whitespace-nowrap p-0 m-0">WAPBT:&nbsp;<span>0</span></p>
          <p className="whitespace-nowrap p-0 m-0">WAPGC:&nbsp;<span>0</span></p>
          <p className="whitespace-nowrap p-0 m-0">WAPCCC:&nbsp;<span>0</span></p>
          <p className="whitespace-nowrap p-0 m-0">WAPPOLL:&nbsp;<span>0</span></p>
          {/* <p className="whitespace-nowrap p-0 m-0">WAINT:&nbsp;<span>0</span></p> */}
        </div>
      </div>
    </div>

  )
}

export default CreditHeader