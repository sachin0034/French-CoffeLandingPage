import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import profileLogo from "../../assets/images.png";
import dashboard from "../../assets/icons/layout.png";
import menu from "../../assets/icons/menu.png";
import user from "../../assets/icons/user.png";
import addUser from "../../assets/icons/add-user.png";
import category from "../../assets/icons/dish.png";
import logout from "../../assets/icons/logout.png";
import chef from "../../assets/icons/chef.png";
import contact from "../../assets/icons/contact-list.png";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [admin, isAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userName, setUserName] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("name");
    navigate("/login");
  };

  useEffect(() => {
    const adminStatus = localStorage.getItem("admin");
    const name = localStorage.getItem("name");
    setUserName(name);
    isAdmin(adminStatus === "true");
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={toggleSidebar}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  />
                </svg>
              </button>
              <a href="/" className="flex ms-2 md:me-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Cavallo Bianco
                </span>
              </a>
            </div>
            <div className="flex items-center lg:mr-20 md:mr-40 sm:mr-8">
              <button
                onClick={toggleDropdown}
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                aria-expanded="false"
              >
                <span className="sr-only">Open user menu</span>
                {userName ? (
                  <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {userName}
                  </p>
                </div>
                ) : (
                  <img
                    className="w-8 h-8 rounded-full"
                    src={profileLogo}
                    alt="Default profile"
                  />
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="z-50 absolute right-4 top-12 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 lg:mr-20 md:mr-40 sm:mr-8"
                  id="dropdown-user"
                >
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={() => navigate("/profile")}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Log out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                  <img
                    src={dashboard} // Replace with the actual image path
                    alt="Profile"
                    className="w-6 h-6 rounded-full" // Ensures the image itself is circular
                  />
                </div>
                <span className="ms-3">Dashboard </span>
              </NavLink>
            </li>

            {admin && (
              <li>
                <NavLink
                  to="/add-user"
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-lg ${
                      isActive
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`
                  }
                >
                   <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                  <img
                    src={addUser} // Replace with the actual image path
                    alt="Profile"
                    className="w-6 h-6 rounded-full" // Ensures the image itself is circular
                  />
                </div>
                  <span className="ms-3">Add User </span>
                </NavLink>
              </li>
            )}
            {admin && (
              <li>
                <NavLink
                  to="/user-list"
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-lg ${
                      isActive
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`
                  }
                >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                  <img
                    src={user} // Replace with the actual image path
                    alt="Profile"
                    className="w-6 h-6 rounded-full" // Ensures the image itself is circular
                  />
                </div>
                  <span className="ms-3">User List</span>
                </NavLink>
              </li>
            )}

            <li>
              <NavLink
                to="/menu-details"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                 <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                  <img
                    src={menu} // Replace with the actual image path
                    alt="Profile"
                    className="w-6 h-6 rounded-full" // Ensures the image itself is circular
                  />
                </div>

                <span className="ms-3">Menu Details</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/chef"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                  <img
                    src={chef} // Replace with the actual image path
                    alt="Profile"
                    className="w-6 h-6 rounded-full" // Ensures the image itself is circular
                  />
                </div>

                <span className="ms-3">Chef Suggestion</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                  <img
                    src={contact} // Replace with the actual image path
                    alt="Profile"
                    className="w-6 h-6 rounded-full" // Ensures the image itself is circular
                  />
                </div>

                <span className="ms-3">Contact List</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/category"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                 <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                  <img
                    src={category} // Replace with the actual image path
                    alt="Profile"
                    className="w-6 h-6 rounded-full" // Ensures the image itself is circular
                  />
                </div>
                <span className="ms-3">Add Category</span>
              </NavLink>
            </li>
            <li onClick={handleLogout}>
              <NavLink
                // to="/category"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${
                    isActive
                      ? " text-gray-900 dark:text-white"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                  <img
                    src={logout} // Replace with the actual image path
                    alt="Profile"
                    className="w-6 h-6 rounded-full" // Ensures the image itself is circular
                  />
                </div>
                <span className="ms-3">Log Out</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Navbar;
