import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MenuItem = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Breakfast");
  const [activeType, setActiveType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    filterMenuItems(category, activeType, searchTerm);
  };
  const handleFilterChange = (value) => {
    setActiveType(value);
    filterMenuItems(activeCategory, value, searchTerm);
  };
  const filterMenuItems = (category, type, searchTerm) => {
    let filtered = menuItems.filter((item) => item.menuType === category);
    if (type) {
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
      console.log(response.data.items);
      setMenuItems(response.data.items);
      handleCategoryChange("Breakfast");
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };
  useEffect(() => {
    filterMenuItems("Breakfast", "", "");
  }, [menuItems]);

  useEffect(() => {
    fetchTodayMenu();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row min-h-screen p-1">
      {/* Sidebar for Large Screens */}
      <aside
        id="sidebar-multi-level-sidebar"
        className={`top-0 left-0 z-40 sm:w-64 sm:h-screen transition-transform sm:translate-x-0 p-2 br-10 sm:block fixed sm:relative ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        style={{
          backgroundColor: "#723d12",
          borderRadius: "5px",
          margin: "5px",
        }}
      >
        {/* Sidebar Content */}
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {menuItems1.map((item) => (
              <li key={item.name}>
                <Link
                  to="#"
                  className={`flex items-center p-2 rounded-lg transition-colors duration-300 ${
                    activeCategory === item.name
                      ? "bg-[#5a2d0c] text-white"
                      : "text-white hover:bg-[#5a2d0c]"
                  }`}
                  onClick={() => handleCategoryChange(item.name)} // Update active category
                >
                  <span className="ms-3 tracking-extra-wide">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Top Navigation for Small Screens */}
      <nav className="sm:hidden fixed top-0 left-0 w-full bg-[#723d12] z-50 p-2">
        <ul className="space-y-2 font-medium">
          {menuItems1.map((item) => (
            <li key={item.name}>
              <Link
                to="#"
                className={`flex items-center p-2 rounded-lg transition-colors duration-300 ${
                  activeCategory === item.name
                    ? "bg-[#5a2d0c] text-white"
                    : "text-white hover:bg-[#5a2d0c]"
                }`}
                onClick={() => handleCategoryChange(item.name)} // Update active category
              >
                <span className="ms-3 tracking-extra-wide">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 rounded-lg mt-3 sm:mt-0 mt-2">
        <div className="mb-4 flex items-center justify-evenly">
          <div className="flex items-center space-x-4">
            <label className="text-white font-medium tracking-extra-wide">
              Filter by:
            </label>
            <select
              className="px-3 py-2 border border-[#a87442] bg-[#e7c6a5] text-[#723d12] rounded focus:outline-none focus:ring focus:ring-[#d19b73] hover:bg-[#d19b73] hover:text-[#ffffff]"
              onChange={(e) => handleFilterChange(e.target.value)}
              defaultValue=""
            >
              <option value="" className="text-[#723d12]">
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

          {/* Right: Search Bar */}
          <div className="w-1/2">
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
        </div>

        <div>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-300 py-4"
              >
                <div className="flex items-center mb-4 sm:mb-0">
                  <div>
                    <h3 className="font-bold text-lg text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-black">{item.description}</p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-black font-bold">₹{item.dprice}</p>
                  <p className="text-sm text-yellow line-through">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No menu available for the selected filters.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default MenuItem;
