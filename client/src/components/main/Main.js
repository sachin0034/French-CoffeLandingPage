import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Chart from "../charts/Chart";
import Navbar from "../Sidebar/Sidebar";
import { toast } from "react-toastify";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Main = () => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [mealToday, setMealToday] = useState({
    breakfast: null,
    lunch: null,
    dinner: null,
  });
  const [currentDate, setCurrentDate] = useState("");

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
        setLoading(false);
      } else {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during token validation:", error);
      toast.error("Unable to validate session. Please log in again.");
      navigate("/login");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/api/auth/get-user`
      );
      setUsers(response.data.slice(0, 6));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const fetchTodayMenu = async () => {
    try {
      const todayDate = getFormattedDate();
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/api/menu/${todayDate}`
      );
      if (response && response.data.items) {
        let breakfastItem = null;
        let lunchItem = null;
        let dinnerItem = null;

        response.data.items.forEach((item) => {
          if (item.menuType === "Breakfast" && !breakfastItem) {
            breakfastItem = item;
          } else if (item.menuType === "Lunch" && !lunchItem) {
            lunchItem = item;
          } else if (item.menuType === "Dinner" && !dinnerItem) {
            dinnerItem = item;
          }
        });

        setMealToday({
          breakfast: breakfastItem,
          lunch: lunchItem,
          dinner: dinnerItem,
        });
      } else {
        console.warn("No meal data found for today.");
        setMealToday({
          breakfast: null,
          lunch: null,
          dinner: null,
        });
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  const [chef, setChef] = useState({});

  const fetchMealToday = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/api/chef/get-chef`
      );

      setChef(response.data.data[0]);
      console.log(response.data.data);
      console.log(chef);
    } catch (error) {
      console.error("Error fetching today's menu:", error);
    }
  };

  useEffect(() => {
    fetchDataValid();
    fetchUsers();
    fetchMealToday();
    fetchTodayMenu();
  }, []);

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <div className="p-6 rounded-lg bg-white shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl text-[#2e4a66]">Report for the Day</h1>
            </div>
            <i className="fa fa-usd"></i>
          </div>
          <Chart />
        </div>

        <div className="p-6 rounded-lg bg-white shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl text-[#2e4a66]">First 6 Userlist</h1>
            </div>
            <i className="fa fa-user"></i>
          </div>

          {/* Container for user list */}
          <div className="overflow-y-auto max-h-[400px]">
            {" "}
            {/* max height set and overflow enabled */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 mt-6">
              {users.slice(0, 6).map((user) => (
                <div
                  key={user._id}
                  className="bg-[#d1ecf1] text-[#35a4ba] text-center p-6 rounded-lg text-sm min-w-[180px]"
                >
                  <h1 className="text-base sm:text-lg lg:text-xl">
                    {user.name}
                  </h1>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <div className="p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <div className="relative">
            <div className="absolute top-0 left-0 transform -translate-x-4 -translate-y-4 bg-white border-2 border-[#42f5bf] rounded-full w-14 h-20 flex items-center justify-center shadow-sm">
              <div className="text-center">
                <span className="text-2xl font-bold text-[#42f5bf]">
                  {new Date().getDate()}
                </span>
                <br />
                <span className="text-sm font-bold text-[#03fc94]">
                  {new Date().toLocaleString("en-US", {
                    weekday: "short",
                  })}
                </span>
              </div>
            </div>

            <div className="ml-20 mt-0">
              <h3 className="text-lg font-bold text-[#000] mb-3">Meal Today</h3>
              <div className="space-y-4 text-gray-500 text-sm">
                {mealToday.breakfast && (
                  <div>
                    <h4 className="text-md font-semibold text-[#000] mb-2">
                      Breakfast
                    </h4>
                    <p className="hover:text-[#000]  text-gray-400 font-bold transition">
                      {mealToday.breakfast.name} -{" "}
                      {mealToday.breakfast.description}
                    </p>
                  </div>
                )}
                {mealToday.lunch && (
                  <div>
                    <h4 className="text-md font-semibold text-[#000] mb-2">
                      Lunch
                    </h4>
                    <p className="hover:text-[#000] text-gray-400 font-bold transition duration-200">
                      {mealToday.lunch.name} - {mealToday.lunch.description}
                    </p>
                  </div>
                )}
                {mealToday.dinner && (
                  <div>
                    <h4 className="text-md font-semibold text-[#000] mb-2">
                      Dinner
                    </h4>
                    <p className="hover:text-[#000] text-gray-400 font-bold transition duration-200">
                      {mealToday.dinner.name} - {mealToday.dinner.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-lg bg-gray-900 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">Chef Suggestion</h3>
          {chef ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h4 className="text-md font-semibold text-white">Name</h4>
                <p className="text-sm text-gray-300">{chef.name}</p>
              </div>
              <div className="flex justify-between items-center border-b pb-3">
                <h4 className="text-md font-semibold text-white">Category</h4>
                <p className="text-sm text-gray-300">{chef.category}</p>
              </div>
              <div className="flex justify-between items-center border-b pb-3">
                <h4 className="text-md font-semibold text-white">Price</h4>
                <p className="text-sm text-gray-300">${chef.price}</p>
              </div>
              <div className="flex justify-between items-center border-b pb-3">
                <h4 className="text-md font-semibold text-white">
                  Availability
                </h4>
                <p className="text-sm text-gray-300">
                  {chef.isAvailable ? "Available" : "Not Available"}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <h4 className="text-md font-semibold text-white">
                  Description
                </h4>
                <p className="text-sm text-gray-300">{chef.description}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white">No Data Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
