import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Sidebar/Sidebar";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const Categorypage = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, isModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allDeleted, setAllDeleted] = useState(false);

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
        navigate("login");
      }
    } catch (error) {
      console.error("Error during token validation:", error);
      navigate("login");
    }
  };

  const handleDeleteAll = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must log in to perform this action.");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER}/api/category/delete-all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("All categories have been deleted successfully.");
        setSuggestions([]);
        setAllDeleted(true);
      } else {
        toast.error("Failed to delete all categories.");
      }
    } catch (error) {
      console.error("Error deleting all categories:", error);
      toast.error("An error occurred while deleting all categories.");
    }
  };

  useEffect(() => {
    fetchDataValid();
  }, []);
  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/api/category/get-category`
      );
      setSuggestions(response.data.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSuggestion = async (id) => {
    const suggestionToDelete = suggestions.find(
      (suggestion) => suggestion._id === id
    );
    if (!suggestionToDelete) {
      console.error("Suggestion not found");
      return;
    }
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER}/api/category/delete/${id}`
      );
      setSuggestions(suggestions.filter((suggestion) => suggestion._id !== id));
      toast.success(
        `${suggestionToDelete.name} has been deleted successfully.`
      );
    } catch (error) {
      console.error("Error deleting suggestion:", error);
      toast.error(`Failed to delete ${suggestionToDelete.name}.`);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the category already exists
    const isDuplicate = suggestions.some(
      (suggestion) =>
        suggestion.name.toLowerCase() === formData.name.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("You have already added this category!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/category/add-category`,
        formData
      );
      toast.success("Category added successfully!");
      fetchSuggestions(); // Fetch the updated suggestions
      isModal(false);
      setFormData({
        name: "",
      });

      // Reset allDeleted state to false as we added new categories
      setAllDeleted(false); // This will allow the button text to update in real-time
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error adding category:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [eidtformData, editsetFormData] = useState({
    name: "",
  });
  const openEditModal = (suggestion) => {
    setSelectedSuggestion(suggestion);
    editsetFormData({
      name: suggestion.name,
    });
    setEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    editsetFormData({
      ...eidtformData,
      [name]: value,
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER}/api/category/update/${selectedSuggestion._id}`,
        eidtformData
      );
      fetchSuggestions();
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating suggestion:", error);
    }
  };

  const filteredContacts = suggestions.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSuggestions = filteredContacts.slice(indexOfFirst, indexOfLast);

  // Change page handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div>
      <Navbar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by name"
              className="border border-gray-700 rounded-lg p-2 w-full sm:w-1/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Add Category Button */}
            <button
              className="px-4 py-2 text-black rounded-md bg-[#B1D4E0]-100 dark:bg-[#B1D4E0] w-full sm:w-auto"
              onClick={() => isModal(true)}
            >
              Add Category
            </button>

            {/* Delete All Categories Button */}
            <button
              onClick={handleDeleteAll}
              disabled={suggestions.length === 0 || allDeleted}
              className={`${
                allDeleted
                  ? "bg-gray-700 cursor-not-allowed"
                  : suggestions.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#000] hover:bg-[#000] focus:ring-blue-500"
              } text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 w-full sm:w-auto`}
            >
              {allDeleted ? "All Items Deleted" : "Delete All Categories"}
            </button>
          </div>
          {/* Table content */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-black-500 dark:text-black-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-300 dark:text-black-400">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentSuggestions && currentSuggestions.length > 0 ? (
                  currentSuggestions.map((suggestion) => (
                    <tr
                      key={suggestion._id}
                      className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-200"
                    >
                      <td className="px-6 py-3">{suggestion.name}</td>
                      <td className="px-6 py-3">
                        <div className="flex space-x-2">
                          <FaTrash
                            className="h-6 w-6 text-red-500 cursor-pointer"
                            onClick={() => deleteSuggestion(suggestion._id)}
                          />
                          <FaEdit
                            className="h-6 w-6 text-blue-500 cursor-pointer"
                            onClick={() => openEditModal(suggestion)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center px-6 py-3 text-gray-500"
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="mx-4">
              Page {currentPage} of{" "}
              {Math.ceil(filteredContacts.length / itemsPerPage)}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage ===
                Math.ceil(filteredContacts.length / itemsPerPage)
              }
              className="px-4 py-2 bg-black text-white rounded-md mr-2"
            >
              Next
            </button>
          </div>

          {/* Add Category Modal */}
          {modal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-xl font-bold mb-4">Add Category</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => isModal(false)}
                      className="mr-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {editModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Chef Suggestion</h2>
                <form onSubmit={handleSubmitEdit}>
                  <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={eidtformData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setEditModalOpen(false)}
                      className="mr-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="absolute top-2 right-2 text-gray-600"
                >
                  X
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categorypage;
