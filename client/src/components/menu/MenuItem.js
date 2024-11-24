import axios from "axios";
import React, { useEffect, useState } from "react";
const MenuItem = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    filterMenuItems(category, activeType, searchTerm);
  };
  const handleFilterChange = (value) => {
    setActiveType(value);
    filterMenuItems(activeCategory, value, searchTerm);
  };
  const filterMenuItems = (category, type, searchTerm) => {
    let filtered =
      category === "All"
        ? menuItems
        : menuItems.filter((item) => item.menuType === category);
    if (type && type !== "All") {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === type.toLowerCase()
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };
  const menuItems1 = [
    { name: "All" },
    { name: "Breakfast" },
    { name: "Lunch" },
    { name: "Dinner" },
    { name: "Chef Suggestion" },
  ];
  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/api/category/get-category`
      );
      setSuggestions(response.data.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchSuggestions();
  }, []);
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
      setMenuItems(response.data.items);
      handleCategoryChange("All");
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };
  useEffect(() => {
    filterMenuItems("All", "All", "");
  }, [menuItems]);
  useEffect(() => {
    fetchTodayMenu();
  }, []);
  return (
    <div className="flex flex-col sm:flex-row min-h-screen p-1">
      <aside
        id="sidebar-multi-level-sidebar"
        className={`hidden sm:block top-0 left-0 z-40 sm:w-64 sm:h-screen transition-transform sm:translate-x-0 p-2 br-10 fixed sm:relative`}
        style={{
          backgroundColor: "#723d12",
          borderRadius: "5px",
          margin: "5px",
        }}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <h2 className="text-xl font-extrabold mb-6 text-[#e7c6a5] tracking-wide">
            Categories
          </h2>
          <ul className="space-y-2 font-medium">
            {menuItems1.map((item) => (
              <li key={item.name}>
                <button
                  className={`flex items-center p-2 rounded-lg transition-colors duration-300 w-full ${
                    activeCategory === item.name
                      ? "bg-[#5a2d0c] text-white"
                      : "text-white hover:bg-[#5a2d0c]"
                  }`}
                  onClick={() => handleCategoryChange(item.name)}
                >
                  <span className="ms-3 tracking-extra-wide">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <nav className="sm:hidden fixed bottom-0 left-0 w-full bg-[#723d12] z-50 p-2 overflow-x-auto">
        <div className="flex justify-start whitespace-nowrap">
          <ul className="flex space-x-4 font-medium">
            {menuItems1.map((item) => (
              <li key={item.name}>
                <button
                  className={`flex flex-col items-center p-4 rounded-lg transition-colors duration-300 text-lg sm:text-xl ${
                    activeCategory === item.name
                      ? "bg-[#5a2d0c] text-white"
                      : "text-white hover:bg-[#5a2d0c]"
                  }`}
                  onClick={() => handleCategoryChange(item.name)}
                >
                  <span className="tracking-extra-wide">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="flex-1 p-4 rounded-lg mt-3 sm:mt-0 mt-2">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-evenly space-y-4 sm:space-y-0">
          <div className="w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search for items..."
              className="w-full px-4 py-2 border border-[#a87442] bg-[#e7c6a5] text-[#723d12] placeholder-[#9a6c48] rounded focus:outline-none focus:ring focus:ring-[#d19b73] focus:border-[#d19b73]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                filterMenuItems(activeCategory, activeType, e.target.value);
              }}
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-white font-medium tracking-extra-wide">
              Filter By:
            </label>
            <select
              className="px-3 py-2 border border-[#a87442] bg-[#e7c6a5] text-[#723d12] rounded focus:outline-none focus:ring focus:ring-[#d19b73] hover:bg-[#d19b73] hover:text-[#ffffff]"
              onChange={(e) => handleFilterChange(e.target.value)}
              defaultValue=""
            >
              <option value="All" className="text-[#723d12]">
                All
              </option>
              {suggestions.map((suggestion, index) => (
                <option
                  key={index}
                  value={suggestion.value}
                  className="hover:bg-[#f3d1b0] hover:text-[#723d12] transition-colors duration-200"
                >
                  {suggestion.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center sm:items-start justify-between border-b border-gray-300 py-4"
              >
                <div className="w-full sm:w-1/3 text-left">
                  <h2 className="font-bold text-2xl sm:text-3xl text-white">
                    {item.name}
                  </h2>
                  <p className="text-md sm:text-lg text-black mt-4">
                    {item.description}
                  </p>
                </div>
                <div className="w-full sm:w-1/3  sm:mt-0 text-right">
                  <p className="text-black font-bold text-3xl">
                    ₹{item.dprice}
                  </p>
                  <p className="text-md sm:text-lg text-yellow line-through mt-2">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white text-lg font-medium mt-4">
              No menu available for the selected filters.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default MenuItem;
