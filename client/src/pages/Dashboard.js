import React, { useEffect, useState } from "react";
import Navbar from "../components/Sidebar/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
const Dashboard = () => {
  const [isAddMenuModalOpen, setAddMenuModalOpen] = useState(false);
  const [isWeeklyMenuModalOpen, setWeeklyMenuModalOpen] = useState(false);
  const [admin, isAdmin] = useState(false);
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    isAdmin(admin);
  }, []);
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
  const [menuData, setMenuData] = useState({
    date: "",
    name: "",
    price: "",
    description: "",
    menuType: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/menu/add-single`,
        menuData
      );
      toast.success("Menu added successfully!");
      console.log(response.data);
      setAddMenuModalOpen(false);
      setMenuData({
        date: "",
        name: "",
        price: "",
        description: "",
        menuType: "",
      });
    } catch (error) {
      console.error("Error adding menu:", error);
      toast.error("Failed to add menu. Please try again.");
    }
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleSubmitWeekLy = async () => {
    if (!selectedFile) {
      toast.info("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/menu/week`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("File uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file.");
    }

    setModalOpen(false);
  };

  const downloadSampleFile = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/menu-download`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sample-menu-weekly.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Download Successfully");
    } catch (error) {
      console.error("Error downloading the sample file:", error);
      toast.error("Internal Server Error");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              className="p-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setAddMenuModalOpen(true)}
            >
              <div className="flex items-center space-x-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-white"
                >
                  <path d="M12 4a8 8 0 1 1-8 8 8.01 8.01 0 0 1 8-8Zm1 5h3a1 1 0 0 1 0 2h-3v3a1 1 0 0 1-2 0v-3H8a1 1 0 0 1 0-2h3V6a1 1 0 0 1 2 0v3Z" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold tracking-normal">
                    Add Menu
                  </h3>
                  <p className="text-sm opacity-90">
                    Click here to add a new menu item.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="p-6 bg-green-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-green-700"
              onClick={() => setModalOpen(true)}
            >
              <h3 className="text-lg font-bold">Add Weekly Menu</h3>
              <p className="text-sm">Click here to add the weekly menu.</p>
            </div>
            <div
              className="p-6 bg-purple-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-purple-700"
              onClick={downloadSampleFile}
            >
              <h3 className="text-lg font-bold">Download Sample File</h3>
              <p className="text-sm">Click here to download a sample file.</p>
            </div>
          </div>
        </div>
      </div>

      {isAddMenuModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl sm:max-w-4xl md:max-w-3xl lg:max-w-3xl xl:max-w-4xl p-10">
        <h2 className="text-xl font-bold mb-4">Add Daily Menu</h2>
            <form onSubmit={handleSubmit}>
              {/* Date Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Enter date
                </label>
                <input
                  type="date"
                  name="date"
                  value={menuData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Menu Type
                </label>
                <select
                  name="menuType"
                  value={menuData.menuType}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                  required
                >
                  <option value="" disabled>
                    Select menu type
                  </option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              {/* Menu Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Menu Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={menuData.name}
                  onChange={handleChange}
                  placeholder="Enter menu name"
                  className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                  required
                />
              </div>

              {/* Menu Price */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Menu Price
                </label>
                <input
                  type="text"
                  name="price"
                  value={menuData.price}
                  onChange={handleChange}
                  placeholder="Enter menu price"
                  className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={menuData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                  required
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white rounded-md mr-2 hover:bg-red-700"
                  onClick={() => setAddMenuModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-20"
        overlayClassName="bg-black bg-opacity-50 fixed inset-0 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4">Upload Weekly Menu</h2>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="mb-4"
        />
        <button
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          onClick={handleSubmitWeekLy}
        >
          Submit
        </button>
        <button
          className="ml-4 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
          onClick={() => setModalOpen(false)}
        >
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default Dashboard;
