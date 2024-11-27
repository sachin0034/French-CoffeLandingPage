import React, { useState, useEffect } from "react";
import axios from "axios";
import category from "../../assets/icons/category.png";

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
<div className="flex flex-col lg:flex-row p-4 bg-[#a1887f]">
  {/* Sidebar for Large Screens */}
  <aside
    id="sidebar-multi-level-sidebar"
    className={`hidden lg:block top-0 left-0 z-40 lg:w-64 lg:h-screen transition-transform lg:translate-x-0 p-2 br-10 fixed lg:relative`}
    style={{
      backgroundColor: "#6d4c41",
      borderRadius: "5px",
      margin: "5px",
    }}
  >
    <div className="h-full px-3 py-4 overflow-y-auto">
      <div className="flex items-center mb-6">
        <img
          src={category}
          alt="category"
          className="w-10 h-10 mr-4 bg-[#f5f5f5] object-contain rounded-full"
        />
        <h2 className="text-xl font-extrabold text-[#fafafa] tracking-wide">
          Categories
        </h2>
      </div>
      <ul className="space-y-2 font-medium">
        {menuItems1.map((item) => (
          <li key={item.name} className="p-2">
            <button
              className="flex items-center p-2 rounded-lg transition-all duration-300 w-full bg-[#efebe9] text-black font-bold hover:bg-gray-100 hover:scale-105 hover:shadow-lg"
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
  <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-[#a1887f] z-50 p-2 overflow-x-auto">
    <div className="flex justify-start whitespace-nowrap">
      <ul className="flex space-x-4 font-medium">
        {menuItems1.map((item) => (
          <li key={item.name}>
            <button
              className="flex items-center p-2 rounded-lg transition-colors duration-300 w-full bg-white text-black font-bold hover:bg-gray-100"
              onClick={() => handleMenuTypeChange(item.name)}
            >
              <span className="ms-3 tracking-extra-wide">{item.name}</span>
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
      <div className="flex flex-wrap items-center gap-4 bg-[#f8f1e9] shadow-md p-4 rounded-md">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search..."
          className="flex-1 border border-[#bcaaa4] p-2 rounded-md focus:outline-none focus:ring focus:ring-#3e2723"
        />
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border border-[#3e2723] p-2 rounded-md"
        >
          <option value="All">All</option>
          {categories.map((category, index) => (
            <option key={index} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-[#f8f1e9] shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Today's Menu</h2>
        {/* Scrollable Container */}
        <div className="grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto">
          {filteredMenus.otherMenu.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border p-4 rounded-lg shadow-sm hover:shadow-lg transition bg-white"
            >
              {/* Menu Name and Description */}
              <div className="flex flex-1 items-center gap-4">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{item.description}</p>
                </div>
              </div>

              {/* Price and Discount */}
              <div className="text-right">
                <p className="text-gray-600 text-sm line-through">{item.price}</p>
                <p className="text-green-600 text-lg font-bold">{item.dprice}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#f8f1e9] shadow-lg p-4 rounded-md overflow-y-scroll h-60">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Other Menus</h2>
        <ul>
          {filteredMenus.todayMenu.map((item, index) => (
            <li
              key={index}
              className="border-b last:border-none p-4 flex justify-between items-center transition hover:bg-[#fffbf2] hover:shadow-md rounded-md"
            >
              {/* Menu Details */}
              <div>
                <h3 className="text-md font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>

              {/* Price */}
              <p className="text-lg font-semibold text-[#2d88ff]">{item.price}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Chef Suggestions */}
    <div className="bg-[#f8f1e9] shadow-lg p-4 rounded-md overflow-y-auto max-h-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Chef Suggestions</h2>
      <div className="grid grid-cols-1 gap-4">
        {chefSuggestions.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between border p-4 rounded-md shadow-sm hover:shadow-lg transition bg-white"
          >
            {/* Menu Item Details */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-600 truncate">{item.description}</p>
            </div>

            {/* Price and Discount */}
            <div className="text-right ml-4">
              <p className="text-sm text-gray-600">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

  );
};

export default MenuItem;
