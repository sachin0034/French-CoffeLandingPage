import React, { useEffect, useState } from "react";
import Navbar from "../components/Sidebar/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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
  const [weeklyMenu, setWeeklyMenu] = useState({
    Monday: { date: "", name: "", description: "", price: "" },
    Tuesday: { date: "", name: "", description: "", price: "" },
    Wednesday: { date: "", name: "", description: "", price: "" },
    Thursday: { date: "", name: "", description: "", price: "" },
    Friday: { date: "", name: "", description: "", price: "" },
    Saturday: { date: "", name: "", description: "", price: "" },
    Sunday: { date: "", name: "", description: "", price: "" },
  });

  const handleInputChange = (day, field, value) => {
    setWeeklyMenu((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSubmitWeekLy = async (e) => {
    e.preventDefault();
    try {
      console.log(weeklyMenu);
      // const response = await axios.post(
      //   `${process.env.REACT_APP_SERVER}/api/menu/weekly`,
      //   weeklyMenu
      // );
      // alert("Weekly menu added successfully!");
      // console.log(response.data);
      // setWeeklyMenu({
      //   Monday: { date: "", name: "", description: "", price: "" },
      //   Tuesday: { date: "", name: "", description: "", price: "" },
      //   Wednesday: { date: "", name: "", description: "", price: "" },
      //   Thursday: { date: "", name: "", description: "", price: "" },
      //   Friday: { date: "", name: "", description: "", price: "" },
      //   Saturday: { date: "", name: "", description: "", price: "" },
      //   Sunday: { date: "", name: "", description: "", price: "" },
      // });
      setWeeklyMenuModalOpen(false);
    } catch (error) {
      console.error("Error adding weekly menu:", error);
      alert("Failed to add weekly menu. Please try again.");
    }
  };
  return (
    <div>
      <Navbar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="p-6 bg-blue-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-blue-700"
              onClick={() => setAddMenuModalOpen(true)}
            >
              <h3 className="text-lg font-bold">Add Menu</h3>
              <p className="text-sm">Click here to add a new menu item.</p>
            </div>
            {/* <div
              className="p-6 bg-green-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-green-700"
              onClick={() => setWeeklyMenuModalOpen(true)}
            >
              <h3 className="text-lg font-bold">Add weekly menu</h3>
              <p className="text-sm">Click here to add the weekly menu.</p>
            </div> */}
          </div>
        </div>
      </div>

      {isAddMenuModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl sm:max-w-8xl md:max-w-9xl lg:max-w-10xl xl:max-w-screen-xl p-10">
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
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

      {/* {isWeeklyMenuModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 overflow-hidden max-h-[80vh]">
            <h2 className="text-xl font-bold mb-4">Add Weekly Menu</h2>
            <form onSubmit={handleSubmitWeekLy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 overflow-y-auto max-h-[60vh]">
                {Object.keys(weeklyMenu).map((day) => (
                  <div key={day} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{day}</h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Enter date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={weeklyMenu[day].date}
                        onChange={(e) =>
                          handleInputChange(day, "date", e.target.value)
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Menu Name
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter menu name for ${day}`}
                        value={weeklyMenu[day].name}
                        onChange={(e) =>
                          handleInputChange(day, "name", e.target.value)
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        placeholder={`Enter description for ${day}`}
                        value={weeklyMenu[day].description}
                        onChange={(e) =>
                          handleInputChange(day, "description", e.target.value)
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                      ></textarea>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Menu Price
                      </label>
                      <input
                        type="number"
                        placeholder={`Enter price for ${day}`}
                        value={weeklyMenu[day].price || ""}
                        onChange={(e) =>
                          handleInputChange(day, "price", e.target.value)
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white rounded-md mr-2 hover:bg-red-700"
                  onClick={() => setWeeklyMenuModalOpen(false)}
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
      )} */}
    </div>
  );
};

export default Dashboard;
