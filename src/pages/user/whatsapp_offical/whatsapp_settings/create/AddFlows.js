import React from 'react'
import { Link } from 'react-router-dom'

const AddFlows = () => {
    return (
        <section className="w-full bg-gray-200 flex flex-col min-h-[calc(100vh-70px)] pb-3">

            <div className="px-3 mt-8">
                <div className="w-full py-2 bg-white rounded-lg flex">
                    <Link className="no-underline" to={"/whatsapp-settings/flows"}>
                        <h1 className="text-2xl ss:text-xl md:text-xl text-start pl-4 md:pl-0 md:flex justify-center text-black font-semibold py-0 m-0 hover:underline underline-offset-4">
                            Manage Flows
                        </h1>
                    </Link>
                    <h1 className="text-2xl ss:text-xl md:text-xl text-start md:pl-0 md:flex justify-center text-black font-semibold py-0 m-0">
                        &nbsp;&gt;&nbsp;Add New Flow
                    </h1>
                </div>
            </div>
            <div className="mt-3 py-3 px-6 bg-white w-full ">
                {/*     <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4 ">
                        <label htmlFor="username" className="block text-lg font-medium text-black">
                            Username
                        </label>
                        <input
                            type="text"
                            className="mt-1 block w-full border-2 text-lg border-black rounded-md p-2"
                            id="username"
                            name="username"
                            maxLength={15}
                            minLength={5}
                            placeholder="Ex. (vikram)"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </form>
                */}
            </div>
        </section>
    )
}

export default AddFlows