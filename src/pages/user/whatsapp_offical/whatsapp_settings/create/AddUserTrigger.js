import React from 'react'
import { Link } from 'react-router-dom'

const AddUserTrigger = () => {
    return (
        <section className="w-full bg-gray-200  flex flex-col  min-h-[calc(100vh-70px)] pb-3">

            <div className="px-3 mt-8">
                <div className="w-full py-2 bg-white rounded-lg flex">
                    <Link className="no-underline" to={"/whatsapp-settings/user-trigger"}>
                        <h1 className="text-2xl ss:text-xl md:text-xl text-start pl-4 md:pl-0 md:flex justify-center text-black font-semibold py-0 m-0 hover:underline underline-offset-4">
                            Manage Trigger
                        </h1>
                    </Link>
                    <h1 className="text-2xl ss:text-xl md:text-xl text-start md:pl-0 md:flex justify-center text-black font-semibold py-0 m-0">
                        &nbsp;&gt;&nbsp;Add New Trigger
                    </h1>
                </div>
            </div>
        </section>
    )
}

export default AddUserTrigger