import React, { useState, useEffect } from "react";
import axios from "axios";

const MenuItem = () => {
  const [categories, setCategories] = useState([]);
  const [todayMenu, setTodayMenu] = useState([]);
  const [otherMenu, setOtherMenu] = useState([]);
  const [chefSuggestions, setChefSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredMenus, setFilteredMenus] = useState({
    todayMenu: [],
    otherMenu: [],
  });

  const [menuItems1, setMenuTime] = useState([]);
  const fetchMenuTime = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/api/menu-time/get-menu`
      );
      setMenuTime(response.data.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchMenuTime();
  }, []);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const categoryResponse = await axios.get(
          `${process.env.REACT_APP_SERVER}/api/category/get-category`
        );
        const todayMenuResponse = await axios.get(
          `${process.env.REACT_APP_SERVER}/api/menu/${getFormattedDate()}`
        );
        const chefSuggestion = await axios.get(
          `${process.env.REACT_APP_SERVER}/api/chef/get-chef`
        );
        const otherMenu = await axios.get(
          `${
            process.env.REACT_APP_SERVER
          }/api/dish/get-dish-date/${getFormattedDate()}`
        );
        setCategories(categoryResponse.data.data);
        setChefSuggestions(chefSuggestion.data.data);
        setTodayMenu(todayMenuResponse.data.items);
        setOtherMenu(otherMenu.data[0].items);

        // Initial data for filtered menus
        setFilteredMenus({
          todayMenu: todayMenuResponse.data.items,
          otherMenu: otherMenu.data[0].items,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchMenuData();
  }, []);

  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    applyFilters(selectedCategory, e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    applyFilters(category, selectedMenuType, searchTerm);
  };
  const [selectedMenuType, setSelectedMenuType] = useState("All");

  const handleMenuTypeChange = (menuType) => {
    setSelectedMenuType(menuType);
    applyFilters(selectedCategory, menuType, searchTerm);
  };

  const applyFilters = (category, menuType, search) => {
    const filterByCategory = (menu) => {
      if (category === "All") return menu;
      return menu.filter((item) => item.category === category);
    };

    const filterByMenuType = (menu) => {
      if (menuType === "All") return menu;
      return menu.filter((item) => item.menuType === menuType);
    };

    const filterBySearch = (menu) => {
      if (!search) return menu;
      return menu.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    };

    // Apply filters only on today's menu
    setFilteredMenus({
      todayMenu: filterBySearch(filterByMenuType(filterByCategory(todayMenu))),
      otherMenu, // Keep the original otherMenu unchanged
    });
  };

  return (
    <div className="flex flex-col lg:flex-row p-4 bg-gray-50">
      {/* Sidebar for Large Screens */}
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
                  className="flex items-center p-2 rounded-lg transition-colors duration-300 w-full"
                  onClick={() => handleMenuTypeChange(item.name)}
                >
                  <span className="ms-3 tracking-extra-wide">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Mobile and Tablet Navbar */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-[#723d12] z-50 p-2 overflow-x-auto">
        <div className="flex justify-start whitespace-nowrap">
          <ul className="flex space-x-4 font-medium">
            {menuItems1.map((item) => (
              <li key={item.name}>
                <button
                  className="flex flex-col items-center p-4 rounded-lg transition-colors duration-300 text-lg sm:text-xl"
                  onClick={() => handleMenuTypeChange(item.name)}
                >
                  <span className="tracking-extra-wide">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="lg:ml-2 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Search and Filter Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-4 bg-white shadow-md p-4 rounded-md">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search..."
              className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
            >
              <option value="All">All</option>
              {categories.map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Today's Menu */}
          <div className="bg-white shadow-md p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-4">Today's Menu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredMenus.otherMenu.map((item, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-md hover:shadow-lg transition"
                >
                  <h3 className="text-md font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-blue-600 font-semibold">{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Other Menus */}
          <div className="bg-white shadow-md p-4 rounded-md overflow-y-scroll h-64">
            <h2 className="text-lg font-semibold mb-4">Other Menus</h2>
            <ul>
              {filteredMenus.todayMenu.map((item, index) => (
                <li
                  key={index}
                  className="border-b p-4 hover:bg-gray-50 flex justify-between"
                >
                  <div>
                    <h3 className="text-md font-semibold">{item.name}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  <p className="text-blue-600 font-semibold">{item.price}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chef Suggestions */}
        <div className="bg-white shadow-md p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-4">Chef Suggestions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {chefSuggestions.map((item, index) => (
              <div
                key={index}
                className="border p-4 rounded-md hover:shadow-lg transition"
              >
                <h3 className="text-md font-semibold">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-blue-600 font-semibold">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
