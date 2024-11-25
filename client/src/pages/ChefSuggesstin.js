import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Sidebar/Sidebar";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const ChefSuggestion = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, isModal] = useState(false);
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

  useEffect(() => {
    fetchDataValid();
  }, []);
  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/api/chef/get-chef`
      );
      setSuggestions(response.data.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSuggestion = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER}/api/chef/delete/${id}`
      );
      setSuggestions(suggestions.filter((suggestion) => suggestion._id !== id));
    } catch (error) {
      console.error("Error deleting suggestion:", error);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/chef/add-chef`,
        formData
      );
      toast.success("Chef suggestion added successfully!");
      fetchSuggestions();
      isModal(false);
      setFormData({
        name: "",
        description: "",
        category: "",
      });
    } catch (error) {
      toast.success("Something went wrong");
      console.error("Error adding chef suggestion:", error);
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
    category: "",
    description: "",
    price: "",
    isAvailable: true,
  });
  const openEditModal = (suggestion) => {
    setSelectedSuggestion(suggestion);
    editsetFormData({
      name: suggestion.name,
      description: suggestion.description,
      category: suggestion.category,
      price: suggestion.price,
      isAvailable: suggestion.isAvailable,
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
        `${process.env.REACT_APP_SERVER}/api/chef/update/${selectedSuggestion._id}`,
        eidtformData
      );
      fetchSuggestions();
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating suggestion:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
          <div className="flex justify-end mb-4">
            <button
              className="px-4 py-2 text-black rounded-md bg-[#B1D4E0]-100 dark:bg-[#B1D4E0] "
              onClick={() => isModal(true)}
            >
              Add Chef Suggestion
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-black-500 dark:text-black-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-300 dark:text-black-400">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Available</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suggestions && suggestions.length > 0 ? (
                  suggestions.map((suggestion) => (
                    <tr
                      key={suggestion._id}
                      className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-200"
                    >
                      <td className="px-6 py-3">{suggestion.name}</td>
                      <td className="px-6 py-3">{suggestion.description}</td>
                      <td className="px-6 py-3">{suggestion.category}</td>
                      <td className="px-6 py-3">{suggestion.price}</td>
                      <td className="px-6 py-3">
                        {suggestion.isAvailable ? (
                          <span className="text-green-500">✔</span>
                        ) : (
                          <span className="text-red-500">✘</span>
                        )}
                      </td>
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

          {modal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-xl font-bold mb-4">Add Chef Suggestion</h2>
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
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="lunch">Dinner</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Price
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => isModal(false)}
                      className="px-4 py-2 bg-black text-white rounded-md mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-black rounded-md bg-[#B1D4E0]-100 dark:bg-[#B1D4E0] "
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
                  <div className="mb-4">
                    <label className="block text-gray-700">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={eidtformData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <input
                      type="text"
                      name="description"
                      value={eidtformData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Price</label>
                    <input
                      type="text"
                      name="price"
                      value={eidtformData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="inline-flex items-center text-gray-700">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={eidtformData.isAvailable}
                        onChange={() =>
                          editsetFormData({
                            ...eidtformData,
                            isAvailable: !eidtformData.isAvailable,
                          })
                        }
                        className="mr-2"
                      />
                      Available
                    </label>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setEditModalOpen(false)}
                      className="px-4 py-2 bg-black text-white rounded-md mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-black rounded-md bg-[#B1D4E0]-100 dark:bg-[#B1D4E0] "
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

export default ChefSuggestion;
