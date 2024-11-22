import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Sidebar/Sidebar";
import { FaTrash } from 'react-icons/fa'; 
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
        navigate("login");
      }
    } catch (error) {
      console.error("Error during token validation:", error);
      navigate("login");
    }
  };

  useEffect(() => {
    fetchDataValid();
  }, []);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-black-500 dark:text-black-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-300 dark:text-black-400">
                <tr>
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
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="bg-white border-b dark:bg-white-800 dark:border-gray-700"
                    >
                      <td className="px-6 py-3">{user.name}</td>
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
      </div>
    </div>
  );
};

export default UserList;
