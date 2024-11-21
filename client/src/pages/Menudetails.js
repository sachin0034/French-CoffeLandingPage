import React, { useState, useEffect } from "react";
import Navbar from "../components/Sidebar/Sidebar";

const Menudetails = () => {
  const [calendarData, setCalendarData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Generate calendar data (previous 30 days, today, next 7 days)
  useEffect(() => {
    const generateCalendarData = () => {
      const today = new Date();
      const data = {};

      // Previous 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split("T")[0];
        data[dateString] = {
          hasMenu: Math.random() > 0.5,
          menu:
            Math.random() > 0.5
              ? {
                  name: "Sample Menu",
                  description: "Menu details here",
                  price: 100,
                }
              : null,
        };
      }

      // Today
      const todayString = today.toISOString().split("T")[0];
      data[todayString] = {
        hasMenu: Math.random() > 0.5,
        menu:
          Math.random() > 0.5
            ? {
                name: "Today Menu",
                description: "Today's menu details",
                price: 120,
              }
            : null,
      };

      // Next 7 days
      for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = date.toISOString().split("T")[0];
        data[dateString] = {
          hasMenu: Math.random() > 0.5,
          menu:
            Math.random() > 0.5
              ? {
                  name: "Future Menu",
                  description: "Upcoming menu details",
                  price: 150,
                }
              : null,
        };
      }

      setCalendarData(data);
    };
    generateCalendarData();
  }, []);

  // Handle date click
  const handleDateClick = (date) => {
    setSelectedDay(date);
    setShowModal(true);
  };

  // Handle delete menu
  const handleDeleteMenu = () => {
    setCalendarData((prevData) => ({
      ...prevData,
      [selectedDay]: { ...prevData[selectedDay], menu: null, hasMenu: false },
    }));
    setShowModal(false);
  };

  // Handle edit menu
  const handleEditMenu = (key, value) => {
    setCalendarData((prevData) => ({
      ...prevData,
      [selectedDay]: {
        ...prevData[selectedDay],
        menu: { ...prevData[selectedDay].menu, [key]: value },
      },
    }));
  };

  const sortedDates = Object.keys(calendarData).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  return (
    <div>
      <Navbar />
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
                {calendarData[date].hasMenu && (
                  <p className="text-sm text-center mt-2 text-green-800">
                    🍴 Menu Available
                  </p>
                )}
                {!calendarData[date].hasMenu && (
                  <p className="text-sm text-center mt-2 text-gray-600">
                    No Menu
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              Menu for {new Date(selectedDay).toLocaleDateString()}
            </h2>
            {calendarData[selectedDay].menu ? (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Menu Name
                  </label>
                  <input
                    type="text"
                    value={calendarData[selectedDay].menu.name}
                    onChange={(e) => handleEditMenu("name", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={calendarData[selectedDay].menu.description}
                    onChange={(e) =>
                      handleEditMenu("description", e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    value={calendarData[selectedDay].menu.price}
                    onChange={(e) => handleEditMenu("price", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                  />
                </div>
              </div>
            ) : (
              <p>No menu available for this date.</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2 hover:bg-gray-600"
              >
                Close
              </button>
              {calendarData[selectedDay].menu && (
                <button
                  onClick={handleDeleteMenu}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete Menu
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menudetails;
