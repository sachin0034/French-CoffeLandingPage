import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import profileLogo from "../../assets/images.png";

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
                  <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
                    {userName.charAt(0).toUpperCase()}
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
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  >
                    <path d="M15 14c2.67 0 8 1.34 8 4v2H7v-2c0-2.66 5.33-4 8-4Zm0-2a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM3 12v2h4v-2H3ZM5 8H1v2h4V8Zm0 8H1v2h4v-2Z" />
                  </svg>

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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  >
                    <path d="M16 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7-4a3 3 0 1 0-3 3 3 3 0 0 0 3-3Zm7 6c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5ZM6 15a6.29 6.29 0 0 0-6 3v2h6Z" />
                  </svg>

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                >
                  <path d="M3 6h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2Zm0 5h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2Zm0 5h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2Z" />
                </svg>

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                >
                  <path d="M12 2c2.21 0 4 1.79 4 4 0 .36-.05.7-.13 1.03A5.98 5.98 0 0 1 20 12c0 3.31-2.69 6-6 6H10c-3.31 0-6-2.69-6-6 0-2.58 1.64-4.79 4-5.64C8.05 6.7 8 6.36 8 6c0-2.21 1.79-4 4-4zm-3 13h6c1.66 0 3-1.34 3-3a3.003 3.003 0 0 0-5.77-1.06A5.99 5.99 0 0 1 12 8a5.99 5.99 0 0 1-2.23.94A3.003 3.003 0 0 0 7 12c0 1.66 1.34 3 3 3zm1.5 3h3c.83 0 1.5.67 1.5 1.5S15.33 21 14.5 21h-5c-.83 0-1.5-.67-1.5-1.5S9.67 18 10.5 18h3z" />
                </svg>

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                >
                  <path d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1a10.4 10.4 0 0 0 9 10 10.4 10.4 0 0 0 9-10ZM5 6h14a1 1 0 0 1 1 1v.3a9.2 9.2 0 0 1-7 8.4 9.2 9.2 0 0 1-7-8.4V7a1 1 0 0 1 1-1ZM7 10a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm6 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z" />
                </svg>

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-gray-500 transition-transform duration-300 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-hover:scale-110"
                >
                  <path d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1a10.4 10.4 0 0 0 9 10 10.4 10.4 0 0 0 9-10ZM5 6h14a1 1 0 0 1 1 1v.3a9.2 9.2 0 0 1-7 8.4 9.2 9.2 0 0 1-7-8.4V7a1 1 0 0 1 1-1ZM7 10a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm6 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z" />
                </svg>
                <span className="ms-3">Add Category</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Navbar;
