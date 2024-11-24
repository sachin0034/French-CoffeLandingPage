import React, { useEffect, useState } from "react";
import Navbar from "../components/Sidebar/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
//import Chart from "../components/charts/Chart";

import Main from "../components/main/Main";
import { PieChart } from "react-minimal-pie-chart";

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
        const userResponse = await axios.get(
          `${process.env.REACT_APP_SERVER}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserName(userResponse.data.name);
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
    category: "",
    menuType: "",
    dprice: "",
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
  const [category, setCategory] = useState([]);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/api/category/get-category`
      );
      setCategory(response.data.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchSuggestions();
  }, []);

  const [userName, setUserName] = useState("");
  const [remainingDays, setRemainingDays] = useState(0);
  const pieChartData = [{ value: remainingDays, color: "black" }];

  const calculateRemainingDays = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/menu-left`
      );
      setRemainingDays(response.data.daysLeft.length - 1);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
    }
  };

  useEffect(() => {
    calculateRemainingDays();
  }, []);

  const handleButtonClick = () => {
    navigate(`/add-user`);
  };

  return (
    <div>
      <Navbar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
          <main className="bg-gray-100 grid-area-main overflow-auto mt-0">
            <div className="px-8 py-5">
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start sm:px-8">
                {/* Left Section */}
                <div className="flex items-center mb-5 sm:mb-0">
                  <img
                    src="https://anglophone-direct.com/ap_img/Coffee-scaled.jpg"
                    alt="Coffee"
                    className="max-h-24 object-contain sm:mr-5 sm:max-h-32"
                  />
                  <div className="text-[#2e4a66] sm:pl-4">
                    <h1 className="text-2xl sm:text-3xl font-semibold">
                      Hello, {userName || "User"}
                    </h1>
                    <p className="text-sm font-semibold text-[#a5aaad]">
                      Welcome to our Cavallo Bianco
                    </p>
                  </div>
                </div>

                {/* Right Section - PieChart */}
                <div className="flex justify-center items-center  sm:mt-0">
                  <h2>Menu Left </h2>
                  <PieChart
                    data={pieChartData}
                    radius={40}
                    lineWidth={15}
                    style={{
                      height: "100px",
                      width: "100px",
                      margin: "auto",
                    }}
                    label={({ dataEntry }) => `${dataEntry.value} days`}
                    labelStyle={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      fill: "black",
                    }}
                    animate
                  />
                </div>
              </div>

              <div className="w-full h-[550px] sm:h-[300px] bg-gradient-to-r from-[#42f5bf] to-[#00bfae] text-white flex flex-col sm:flex-row items-center justify-between px-8 mb-8 rounded-lg shadow-lg">
                <div className="w-full sm:w-1/3 sm:order-1 sm:mt-4">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTPxVddzXEj0D_2VLPdLu0WaQpTVMZdLjprQ&s" // Replace with your image URL
                    alt="Eggify"
                    className="w-full h-[300px] sm:h-full object-cover rounded-lg shadow-md sm:object-top sm:mt-4"
                  />
                </div>

                <div className="flex flex-col justify-center space-y-4 w-full sm:w-2/3 sm:pl-8 sm:order-2">
                  <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                    Elevate Your Culinary Experience with Eggify
                  </h1>
                  <button
                    onClick={() => setAddMenuModalOpen(true)}
                    className="px-6 py-3 border-2 border-white text-white bg-transparent rounded-full transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white w-max"
                  >
                    Add Menu
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-5">
                <div
                  className="flex flex-col justify-between items-center min-h-[200px] sm:min-h-[250px] p-6 rounded-lg bg-white text-black shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 "
                  onClick={() => setAddMenuModalOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-16 h-16 text-black hover:text-blue-500 transition-colors duration-300"
                  >
                    <path d="M12 3l7 6V20a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-5H9v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9l7-6a1 1 0 0 1 1.32 0zM12 1.75L4.2 8.38a2 2 0 0 0-.7 1.52V20a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-5h2v5a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3V9.9a2 2 0 0 0-.7-1.52L12 1.75z" />
                  </svg>

                  <div className="flex justify-between items-center mt-4">
                    <p className="text-black text-lg">
                      <span className="font-semibold">Add Menu </span>Click here
                      to add a new menu item.
                    </p>
                  </div>
                </div>

                <div
                  className="flex flex-col justify-between items-center min-h-[200px] sm:min-h-[250px] p-6 rounded-lg bg-white text-black shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => setModalOpen(true)}
                >
                  <div className="flex justify-center items-center mb-4">
                    {/* SVG Calendar Icon */}
                    <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  viewBox="0 0 24 24"
  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-black hover:text-red-500 transition-colors duration-300"
>
  <path d="M19 4h-1V2h-2v2H8V2H6v2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zM5 6h1v2h2V6h8v2h2V6h1a1 1 0 0 1 1 1v2H4V7a1 1 0 0 1 1-1zm14 14H5a1 1 0 0 1-1-1V11h16v8a1 1 0 0 1-1 1z" />
</svg>

                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-black text-lg">
                      <span className="font-semibold">Add Weekly Menu </span>
                      Click here to add the weekly menu.
                    </p>
                  </div>
                </div>

                {/* Download Sample File Card */}
                <div
                  className="flex flex-col justify-between items-center min-h-[200px] sm:min-h-[250px] p-6 rounded-lg bg-white text-black shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  onClick={downloadSampleFile}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-16 h-16 text-black hover:text-green-500 transition-colors duration-300"
                  >
                    <path d="M19 9h-4V3h-6v6H5l7 7 7-7zM5 14h14v2H5z" />
                  </svg>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-black text-lg">
                      <span className="font-semibold">
                        Download Sample File (Weekly Menu)
                      </span>{" "}
                      Download a sample file here.
                    </p>
                  </div>
                </div>
              </div>

              <Main />
            </div>
          </main>
        </div>
      </div>

      {isAddMenuModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-sm lg:max-w-md xl:max-w-lg p-10 overflow-y-auto max-h-[70vh]">
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

              {/* Category Input */}
              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  value={menuData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {category.map((category, index) => (
                    <option key={index} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Menu Type Input */}
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

              {/* Menu Name Input */}
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

              {/* Menu Price Input */}
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

              {/* Menu Discount Price Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Menu Discount Price
                </label>
                <input
                  type="text"
                  name="dprice"
                  value={menuData.dprice}
                  onChange={handleChange}
                  placeholder="Enter menu price"
                  className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                  required
                />
              </div>

              {/* Description Input */}
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
