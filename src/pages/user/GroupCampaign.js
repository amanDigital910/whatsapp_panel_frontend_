import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreditHeader from "../../components/CreditHeader";
import { CampaignHeading, CampaignTitle } from "../utils/Index";

const GroupCampaign = () => {
  const [groupName, setGroupName] = useState("");
  const [groupNub, setGroupNum] = useState("");
  const [feedback, setFeedback] = useState("");
  const [group, setGroup] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [editingId, setEditingId] = useState(null);

  const textareaRef = useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const fetchTemplates = async () => {
    try {
      console.log(`${process.env.REACT_APP_API_URL}`);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/msggroup/`
      );
      if (response.ok) {
        const data = await response.json();
        setGroup(data);
      } else {
        toast.error("Failed to fetch templates.");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const saveTemplate = async () => {
    if (!groupName || !groupNub) {
      setFeedback("Both fields are required.");
      toast.error("Both fields are required.");
      return;
    }

    const payload = {
      userId: 1,
      group_name: groupName,
      group_number: groupNub,
    };

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${process.env.REACT_APP_API_URL}/msggroup//${editingId}`
        : `${process.env.REACT_APP_API_URL}/msggroup/`;
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(
          editingId
            ? "Template updated successfully!"
            : "Template added successfully!"
        );
        setGroupName("");
        setGroupNum("");
        setEditingId(null);
        fetchTemplates();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const editTemplate = (id) => {
    const templateToEdit = group.find((grp) => grp.groupId === id);
    if (templateToEdit) {
      setGroupName(templateToEdit.group_name);
      setGroupNum(templateToEdit.group_number);
      setEditingId(id);
    }
  };

  const deleteTemplate = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/msggroup/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Template deleted successfully!");
        fetchTemplates();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = group.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(group.length / recordsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <>
      <section className="w-[100%] bg-gray-200   flex justify-center flex-col">
        <CreditHeader />
        <div className="w-full mt-8">
          <CampaignHeading campaignHeading="All Groups Details" />
          {/* <div className=""> */}
          <div className="w-full px-3 md:px-6 py-6 flex lg:flex-col gap-6">

            {/* Left Column */}
            <div className="lg:w-full w-2/5 flex flex-col gap-6">

              {/* Group Name Input */}
              <CampaignTitle
                mainTitle={"Group Name"}
                setCampaignTitle={setGroupName}
                inputTitle={groupName}
                placeholder={"Enter Group Name"} />

              <div className="w-[100%] h-[auto] flex flex-col gap-2">
                <p className="text-black m-0">Group Message</p>
                <textarea
                  ref={textareaRef}
                  value={groupNub}
                  onChange={(e) => {
                    setGroupNum(e.target.value);
                    handleInput();
                  }}
                  className="p-2 rounded w-[100%] min-h-[400px] bg-white text-black border-black border-[0.1px]"
                  placeholder="Enter your message"
                />
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary w-25" onClick={saveTemplate}>
                  {editingId ? "Update" : "Submit"}
                </button>
              </div>
              {feedback && <p className="text-red-500 mt-2">{feedback}</p>}
            </div>
            <div className="lg:w-full w-[60%] flex flex-col gap-4">
              <div className="w-full max-h-[400px] rounded text-white overflow-auto">
                <table className="w-full text-center table-auto">
                  <thead className="bg-gray-800 border-b-2 border-gray-600">
                    <tr>
                      <th className="py-3 px-6 text-white font-semibold">Id</th>
                      <th className="py-3 px-6 text-white font-semibold">
                        Group Name
                      </th>
                      <th className="py-3 px-6 text-white font-semibold">
                        Group Number
                      </th>
                      <th className="py-3 px-6 text-white font-semibold">
                        Date
                      </th>
                      <th className="py-3 px-6 text-white font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-black">
                    {currentRecords.map((template) => (
                      <tr
                        key={template.id}
                        className="border-b border-gray-600 transition"
                      >
                        <td className="py-2 px-2">{template.groupId}</td>
                        <td className="py-2 px-2">{template.group_name}</td>
                        <td className="py-2 px-2">{template.group_number}</td>
                        <td className="py-2 px-2">
                          {moment(template.createdAt).format("DD-MMM-YYYY")}
                        </td>
                        <td className="py-2 px-2">
                          <button
                            onClick={() => editTemplate(template.groupId)}
                            className="me-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteTemplate(template.groupId)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end align-items-center gap-4 mt-1">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                <span>
                  {`${(currentPage - 1) * recordsPerPage + 1} - ${Math.min(
                    currentPage * recordsPerPage,
                    group.length
                  )}`}{" "}
                  of {group.length}
                </span>
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default GroupCampaign;
