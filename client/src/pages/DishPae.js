import React, { useState, useEffect } from "react";
import Navbar from "../components/Sidebar/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader/Loader";

const DishPage = () => {
  const [calendarData, setCalendarData] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/api/dish/get-dish`
      );
      setLoading(false);

      if (response.data.success) {
        setCalendarData(response.data.calendarData);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching dishes:", error);
      toast.error("Failed to load calendar data.");
    }
  };

  const validateToken = async () => {
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

      if (!response.data.isValid) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Token validation error:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleDateClick = (date) => {
    navigate(`/dish-description/${date}`);
  };

  const sortedDates = Object.keys(calendarData).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  return (
    <div>
      <Navbar />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader />
        </div>
      )}
      <div className="p-4 sm:ml-64">
        <h1 className="text-2xl font-bold mb-4">Menu Details</h1>
        <div className="grid grid-cols-7 gap-4">
          {sortedDates.map((date) => {
            const isToday =
              new Date(date).toDateString() === new Date().toDateString();
            const isFuture = new Date(date) > new Date();

            return (
              <div
                key={date}
                className={`p-4 border rounded-lg cursor-pointer ${
                  calendarData[date].hasMenu ? "bg-green-200" : "bg-gray-100"
                }`}
                onClick={() => handleDateClick(date)}
              >
                <p className="text-center font-bold text-black">
                  {new Date(date).getDate()}
                </p>
                {isToday && (
                  <p className="text-sm text-center mt-2 text-blue-800">
                    📅 Today
                  </p>
                )}
                {isFuture && (
                  <p className="text-sm text-center mt-2 text-yellow-800">
                    ⏳ Upcoming
                  </p>
                )}
                {calendarData[date].hasMenu ? (
                  <p className="text-sm text-center mt-2 text-green-800">
                    🍴 Menu Available
                  </p>
                ) : (
                  <p className="text-sm text-center mt-2 text-gray-600">
                    No Menu
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DishPage;
