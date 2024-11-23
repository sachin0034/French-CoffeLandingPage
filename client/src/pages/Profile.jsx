import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Sidebar/Sidebar";

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [fieldToEdit, setFieldToEdit] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
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
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching profile:", error));
  }, []);

  const handleEditClick = (field) => {
    if (field === "email") return;
    setFieldToEdit(field);
    setEditValue(user[field] || "");
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editValue.trim()) {
      alert("Value cannot be empty.");
      return;
    }

    setLoading(true);
    axios
      .put(
        `${process.env.REACT_APP_SERVER}/api/auth/updateProfile`,
        { field: fieldToEdit, value: editValue },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setUser((prevUser) => ({ ...prevUser, [fieldToEdit]: editValue }));
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      })
      .finally(() => setLoading(false));
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <>
    <Navbar />
    <div className="p-4 sm:ml-64">
    <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
    <div className="container mx-auto mt-10 max-w-2xl">
      <div className="flex items-center mb-5">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-3xl text-gray-600">
            {user.name ? user.name[0] : "U"}
          </span>
        </div>
        <div className="ml-4">
          <h3 className="text-2xl font-semibold">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="space-y-5">
        {["name", "password", "phone"].map((field) => (
          <div
            key={field}
            className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow"
          >
            <div>
              <strong className="capitalize">{field}:</strong>{" "}
              {field === "password" ? "*******" : user[field]}
            </div>

            <button
              className={`text-blue-500 ${
                field === "email" ? "cursor-not-allowed" : ""
              }`}
              onClick={() => handleEditClick(field)}
            >
              ✎
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h4 className="text-lg font-medium mb-4">Edit {fieldToEdit}</h4>
            <input
              type={fieldToEdit === "password" ? "password" : "text"}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 text-white rounded-md ${
                  loading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Go to Dashboard Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={goToDashboard}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
   
  </div>
  </div>
</>
  );
};

export default ProfilePage;
