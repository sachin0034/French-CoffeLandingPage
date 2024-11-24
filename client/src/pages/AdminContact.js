import React, { useEffect, useState } from "react";
import Navbar from "../components/Sidebar/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const fetchDataValid = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/auth/validateToken`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.isValid) {
        return;
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during token validation:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchDataValid();
  }, []);
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/api/contact/all`
      );
      setContacts(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch contacts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER}/api/contact/delete/${id}`
      );
      toast.success("Contact deleted successfully");
      fetchContacts();
    } catch (error) {
      toast.error("Failed to delete contact");
      console.error(error);
    }
  };

  const deleteAllContacts = async () => {
    if (window.confirm("Are you sure you want to delete all contacts?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_SERVER}/api/contact/delete-all`
        );
        toast.success("All contacts deleted successfully");
        setContacts([]);
      } catch (error) {
        toast.error("Failed to delete all contacts");
        console.error(error);
      }
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(contacts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
    XLSX.writeFile(workbook, "contacts.xlsx");
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-gray-200 rounded-lg dark:border-gray-400 mt-14">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search by name or email"
              className="border border-gray-700 rounded-lg p-2 w-1/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={deleteAllContacts}
              >
                Delete All
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={exportToExcel}
              >
                Download Excel
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : filteredContacts.length === 0 ? (
            <p className="text-center">No contacts found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-black uppercase bg-gray-100 dark:bg-gray-300 dark:text-black-400">
                  <tr>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Message</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className="bg-white border-b dark:bg-white-800 dark:border-gray-700"
                    >
                      <td className="px-6 py-4 text-black">{contact.email}</td>
                      <td className="px-6 py-4 text-black">{contact.phone}</td>
                      <td className="px-6 py-4 text-black">
                        {contact.message}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => deleteContact(contact._id)}>
                          <FaTrash className="w-5 h-5" />{" "}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContact;
