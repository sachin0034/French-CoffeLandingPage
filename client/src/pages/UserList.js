import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Sidebar/Sidebar";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const UserList = () => {
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
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during token validation:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchDataValid();
  }, []);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/api/auth/get-user`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER}/api/auth/delete-user/${userId}`
      );
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User Deleted Successfully");
    } catch (error) {
      toast.error("Internal Server Error");
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Pagination logic
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = users.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div>
      <Navbar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
        <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchQuery}
          style={{border:"2px solid black"}}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-black-500 dark:text-black-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-300 dark:text-black-400">
                <tr>
                   <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Render each user row */}
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-3">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  filteredData.map((user) => (
                    <tr
                      key={user._id}
                      className="bg-white border-b dark:bg-white-800 dark:border-gray-700"
                    >
                      <td className="px-6 py-3 flex items-center">
                        <div className="w-10 h-10 bg-blue-500 text-white font-semibold rounded-full flex items-center justify-center">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-2">{user.name}</span>
                      </td>

                      <td className="px-6 py-3">{user.email}</td>
                      <td className="px-6 py-3">
                        <FaTrash
                          className="h-6 w-6 text-red-500 cursor-pointer"
                          onClick={() => deleteUser(user._id)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              } rounded`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
