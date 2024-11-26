import React, { useEffect, useState } from "react";
import Navbar from "../components/Sidebar/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const DishDescription = () => {
  const { date } = useParams();
  const [menus, setMenus] = useState([]);

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
  const [isAddMenuModalOpen, setAddMenuModalOpen] = useState(false);
  const [menuData, setMenuData] = useState({
    date: "",
    name: "",
    price: "",
    description: "",
    category: "",
    discountPrice: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/dish/create`,
        menuData
      );
      //  fetchMenus();
      toast.success("Menu added successfully!");
      setAddMenuModalOpen(false);
      setMenuData({
        name: "",
        price: "",
        description: "",
        category: "",
        discountPrice: "",
      });
    } catch (error) {
      console.error("Error adding menu:", error);
      toast.error("Failed to add menu. Please try again.");
    }
  };
  const fetchMenus = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/api/dish/get-dish-date/${date}`
      );
      setMenus(response.data[0].items);
    } catch (err) {
      console.error("Failed to fetch menu data:", err);
    }
  };
  useEffect(() => {
    setMenuData((prev) => ({
      ...prev,
      date: date,
    }));

    fetchMenus();
  }, [date]);

  const handleDelete = async (data) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER}/api/dish/delete/${data._id}/${date}`
      );
      toast.success(`${data.name} has been deleted successfully.`);
      fetchMenus();
    } catch (error) {
      console.error("Error deleting menu:", error);
      toast.error("Failed to delete the menu.");
    }
  };

  const [isEditMenuModalOpen, setEditMenuModalOpen] = useState(false);
  const [editmenuData, editsetMenuData] = useState({
    name: "",
    price: "",
    description: "",
    menuType: "",
    discountPrice: "",
  });
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    editsetMenuData((prev) => ({ ...prev, [name]: value }));
  };
  const [editValue, setEditValue] = useState({});
  const handleEdit = (item) => {
    setEditValue(item);
    editsetMenuData(item);
    setEditMenuModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER}/api/dish/edit/${date}/${editValue._id}`,
        editmenuData
      );
      toast.success("Menu updated successfully!");
      fetchMenus();
      setEditMenuModalOpen(false);
    } catch (error) {
      console.error("Error updating menu:", error);
      toast.error("Failed to update menu!");
    }
  };


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const paginate = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const renderTable = (data) => {
    const filteredMenu = data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginatedMenu = paginate(filteredMenu);

    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 capitalize">Menu</h2>
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm text-left text-black-500 dark:text-black-400">
            <thead className="text-xs text-black-700 uppercase bg-gray-50 dark:bg-gray-200 dark:text-black-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Name
                </th>
                <th scope="col" className="py-3 px-6">
                  Price
                </th>
                <th scope="col" className="py-3 px-6">
                  Discount Price
                </th>
                <th scope="col" className="py-3 px-6">
                  Category
                </th>
                <th scope="col" className="py-3 px-6">
                  Description
                </th>
                <th scope="col" className="py-3 px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedMenu.length > 0 ? (
                paginatedMenu.map((item) => (
                  <tr
                    key={item._id}
                    className="bg-white border-b dark:bg-white-800 dark:border-white-700"
                  >
                    <td className="py-4 px-6">{item.name}</td>
                    <td className="py-4 px-6">{item.price}</td>
                    <td className="py-4 px-6">{item.discountPrice}</td>
                    <td className="py-4 px-6">{item.category}</td>
                    <td className="py-4 px-6">{item.description}</td>
                    <td className="py-4 px-6 flex gap-2">
                      <FaEdit
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 cursor-pointer hover:text-blue-800"
                        title="Edit"
                        size={20}
                      />
                      <FaTrash
                        onClick={() => handleDelete(item)}
                        className="text-red-600 cursor-pointer hover:text-red-800"
                        title="Delete"
                        size={20}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <span className="text-gray-500 text-lg font-semibold italic">
                      No data found
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded-l-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-1 border bg-gray-100">{currentPage}</span>
          <button
            disabled={currentPage * itemsPerPage >= filteredMenu.length}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded-r-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
          <div className="top-0 left-0 w-full flex justify-between items-center py-4 z-20 rounded-b-lg">
            {/* Button on the right side */}
            <button
              onClick={() => setAddMenuModalOpen(true)} // Open modal on click
              className={`px-6 py-2 font-medium text-lg text-gray-300 
              bg-gray-800 rounded-full hover:bg-gray-600 hover:text-white transition-all duration-300 ml-auto`}
            >
              Add Menu
            </button>
          </div>
          <div className="mt-6 flex justify-center">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search menu..."
              className="px-4 py-2 border-4 border-gray-600 rounded-lg shadow-md w-full max-w-md"
            />
          </div>
          {menus && renderTable(menus)}
        </div>
      </div>
      {isAddMenuModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-sm lg:max-w-md xl:max-w-lg p-10 overflow-y-auto max-h-[70vh]">
            <h2 className="text-xl font-bold mb-4">Add Daily Menu</h2>
            <form onSubmit={handleSubmit}>
              {/* Date Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={menuData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                  required
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={menuData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="dish">Dish</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>

              {/* Menu Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={menuData.name}
                  onChange={handleChange}
                  placeholder="Enter menu name"
                  className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                  required
                />
              </div>

              {/* Menu Price */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={menuData.price}
                  onChange={handleChange}
                  placeholder="Enter menu price"
                  className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                  required
                />
              </div>

              {/* Discount Price */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Discount Price (Optional)
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={menuData.discountPrice}
                  onChange={handleChange}
                  placeholder="Enter discount price"
                  className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={menuData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                  required
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white rounded-md mr-2 hover:bg-red-700"
                  onClick={() => setAddMenuModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditMenuModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-sm lg:max-w-md xl:max-w-lg p-10 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Menu</h2>
            <form>
              <div className="mb-6">
                <label className="block text-gray-700 text-lg mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editmenuData.name}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-lg mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={editmenuData.price}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-lg mb-2">
                  Discount Price
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={editmenuData.discountPrice}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-lg mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editmenuData.description}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditMenuModalOpen(false)}
                  className="px-4 py-2 bg-black text-white rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditSubmit}
                  className="px-4 py-2 text-black rounded-md bg-[#B1D4E0]-100 dark:bg-[#B1D4E0] "
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishDescription;
