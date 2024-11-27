import React, { useEffect, useState } from "react";
import Navbar from "../components/Sidebar/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const DishDescription = () => {
  const { date } = useParams();
  const [menus, setMenus] = useState([]);
  const [allDeleted, setAllDeleted] = useState(false);

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

  // const handleDeleteAll = async () => {
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     toast.error("You must log in to perform this action.");
  //     navigate("/login");
  //     return;
  //   }

  //   try {
  //     const response = await axios.delete(
  //       `${process.env.REACT_APP_SERVER}/api/dish/delete-all/${date}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       toast.success("All menu items have been deleted successfully.");
  //       setMenus([]);  // Clear the UI data
  //       setAllDeleted(true); // Set allDeleted state to true
  //     } else {
  //       toast.error("Failed to delete all menu items.");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting all menus:", error);
  //     toast.error("An error occurred while deleting all menus.");
  //   }
  // };

  const handleDeleteAll = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must log in to perform this action.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER}/api/dish/delete-all/${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("All menu items have been deleted successfully.");
        setMenus([]); // Clear the UI data
        setAllDeleted(true); // Set allDeleted state to true
      } else {
        toast.error("Failed to delete all menu items.");
      }
    } catch (error) {
      console.error("Error deleting all menus:", error);
      toast.error("An error occurred while deleting all menus.");
    }
  };

  useEffect(() => {
    fetchDataValid();
  }, []);
  const [isAddMenuModalOpen, setAddMenuModalOpen] = useState(false);
  const [menuData, setMenuData] = useState({
    date: "",
    dishes: [{ name: "", price: "", description: "" }],
    desserts: [{ name: "", price: "", description: "" }],
  });

  const handleDishChange = (index, field, value, type) => {
    setMenuData((prev) => {
      const updatedItems = [...prev[type]];
      updatedItems[index][field] = value;
      return { ...prev, [type]: updatedItems };
    });
  };

  const addNewRow = (type) => {
    if (type === "dishes" && menuData.dishes.length < 3) {
      setMenuData({
        ...menuData,
        dishes: [...menuData.dishes, { name: "", price: "", description: "" }],
      });
    } else if (type === "desserts" && menuData.desserts.length === 0) {
      setMenuData({
        ...menuData,
        desserts: [{ name: "", price: "", description: "" }],
      });
    } else {
      if (type === "dishes" && menuData.dishes.length >= 3) {
        toast.error("You can only add up to 3 dishes.");
      } else if (type === "desserts" && menuData.desserts.length > 0) {
        toast.error("You can only add 1 dessert.");
      }
    }
  };

  const removeRow = (index, type) => {
    if (type === "dishes") {
      const updatedDishes = menuData.dishes.filter((_, i) => i !== index);
      setMenuData({ ...menuData, dishes: updatedDishes });
    } else if (type === "desserts") {
      setMenuData({ ...menuData, desserts: [] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must log in to perform this action.");
      navigate("/login");
      return;
    }

    try {
      const payload = {
        date: new Date(menuData.date).toISOString(),
        items: [...menuData.dishes, ...menuData.desserts],
      };

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/dish/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Menu saved successfully!");
        setAddMenuModalOpen(false);
        setMenuData({
          date: "",
          dishes: [{ name: "", price: "", description: "" }],
          desserts: [{ name: "", price: "", description: "" }],
        });
        fetchMenus();
      } else {
        toast.error("Failed to save the menu.");
      }
    } catch (error) {
      console.error("Error saving menu:", error);
      toast.error("An error occurred while saving the menu.");
    }
  };

  // const fetchMenus = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_SERVER}/api/dish/get-dish-date/${date}`
  //     );
  //     setMenus(response.data[0].items);
  //     setAllDeleted(response.data[0].items.length === 0);
  //   } catch (err) {
  //     console.error("Failed to fetch menu data:", err);
  //   }
  // };

  const fetchMenus = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/api/dish/get-dish-date/${date}`
      );
      const menus = response.data[0]?.items || [];
      setMenus(menus);
      setAllDeleted(menus.length === 0);
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

  // const handleDelete = async (data) => {
  //   try {
  //     await axios.delete(
  //       `${process.env.REACT_APP_SERVER}/api/dish/delete/${data._id}/${date}`
  //     );
  //     toast.success(`${data.name} has been deleted successfully.`);
  //     fetchMenus();
  //   } catch (error) {
  //     console.error("Error deleting menu:", error);
  //     toast.error("Failed to delete the menu.");
  //   }
  // };

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
                    <td className="py-4 px-6">{item.description}</td>
                    <td className="py-4 px-6 flex gap-2">
                      <FaEdit
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 cursor-pointer hover:text-blue-800"
                        title="Edit"
                        size={20}
                      />
                      <FaTrash
                        onClick={() => !allDeleted && handleDelete(item)} // Prevent action if allDeleted is true
                        className={`text-red-600 cursor-pointer hover:text-gray-800 ${
                          allDeleted ? "text-gray-500 cursor-not-allowed" : ""
                        }`} // Gray color and no hover when disabled
                        title="Delete"
                        size={20}
                        disabled={allDeleted}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
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
            disabled={currentPage === 1 || paginatedMenu.length === 0} // Prevent going back if already on first page
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded-l-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-1 border bg-gray-100">{currentPage}</span>
          <button
            disabled={
              currentPage * itemsPerPage >= filteredMenu.length ||
              paginatedMenu.length === 0
            } // Prevent going forward if no more items
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded-r-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/dish/menu-file-upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Menu uploaded successfully!");
      fetchMenus();
      setUploadModalOpen(false);
    } catch (error) {
      toast.error("Error uploading the menu!");
      console.error(error);
    }
  };

  const downloadSampleFile = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/dish-download`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sample-dish.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Download Successfully");
    } catch (error) {
      console.error("Error downloading the sample file:", error);
      toast.error("Internal Server Error");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
          <div className="w-full flex flex-wrap justify-between items-center py-4 z-20 rounded-b-lg gap-6 space-y-4 sm:space-y-0 sm:flex-nowrap">
            {/* Button Group */}
            <div className="w-full sm:w-auto sm:flex gap-6 flex-wrap justify-between">
              {/* Add Menu Button */}
              <button
                onClick={() => setAddMenuModalOpen(true)}
                className="px-6 py-2 font-medium text-lg text-white bg-gray-800 dark:bg-gray-700 rounded-full hover:bg-gray-600 hover:text-white transition-all duration-300 w-full sm:w-auto"
              >
                Add Menu
              </button>

              {/* Upload Dish as Excel Button */}
              <button
                onClick={() => setUploadModalOpen(true)}
                className="px-6 py-2 font-medium text-lg text-white bg-blue-600 dark:bg-light-blue-700 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 w-full sm:w-auto"
              >
                Upload Dish as Excel
              </button>

              {/* Download Sample File Button */}
              <button
                onClick={downloadSampleFile}
                className="px-6 pl-5 ml-2 py-2 font-medium text-lg text-white bg-sky-600 dark:bg-sky-500 rounded-full hover:bg-sky-500 hover:text-white transition-all duration-300 w-full sm:w-auto"
              >
                Download Sample File
              </button>

              {/* Delete All Items Button */}
              <button
                onClick={handleDeleteAll}
                className={`px-6 py-2 font-medium text-lg text-white ${
                  allDeleted
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gray-600 hover:bg-red-500"
                } dark:bg-gray-700 dark:hover:bg-gray-500 rounded-full transition-all duration-300 w-full sm:w-auto`}
                disabled={allDeleted}
              >
                {allDeleted ? "All items deleted" : "Delete All Items"}
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="mt-6 flex justify-center">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search menu..."
              className="px-4 py-2 border-4 border-gray-600 dark:border-gray-500 rounded-lg shadow-md w-full max-w-md"
            />
          </div>

          {/* Render the Menu Table */}
          {menus && renderTable(menus)}
        </div>
      </div>

      {isAddMenuModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-10 overflow-y-auto max-h-[80vh] relative">
            {/* Close Button */}
            <button
              onClick={() => setAddMenuModalOpen(false)}
              className="absolute top-4 right-4 text-3xl font-bold text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4">Add Daily Menu</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="text"
                  name="date"
                  value={menuData.date}
                  readOnly
                  className="mt-1 block w-full border border-black rounded-md shadow-sm p-3 bg-gray-100"
                />
              </div>

              {/* Dish Section */}
              <h3 className="text-lg font-semibold mb-2">Dishes</h3>
              {menuData.dishes.map((dish, index) => (
                <div key={index} className="grid grid-cols-1 gap-4 mb-2">
                  <label className="font-bold">{`Dish-${index + 1}`}</label>
                  <input
                    type="text"
                    placeholder={`Dish-${index + 1} Name`}
                    value={dish.name}
                    onChange={(e) =>
                      handleDishChange(index, "name", e.target.value, "dishes")
                    }
                    className="border rounded-md p-2 w-full"
                    required
                  />
                  <input
                    type="number"
                    placeholder={`Dish-${index + 1} Price`}
                    value={dish.price}
                    onChange={(e) =>
                      handleDishChange(index, "price", e.target.value, "dishes")
                    }
                    className="border rounded-md p-2 w-full"
                    required
                  />

                  <input
                    type="text"
                    placeholder={`Dish-${index + 1} Description`}
                    value={dish.description}
                    onChange={(e) =>
                      handleDishChange(
                        index,
                        "description",
                        e.target.value,
                        "dishes"
                      )
                    }
                    className="border rounded-md p-2 w-full"
                    required
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeRow(index, "dishes")}
                      className="text-red-500 mt-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addNewRow("dishes")}
                className="px-4 py-2 text-black rounded-md bg-[#B1D4E0]-100 dark:bg-[#B1D4E0]"
                disabled={menuData.dishes.length >= 3}
              >
                Add Another Dish
              </button>

              {/* Dessert Section */}
              <h3 className="text-lg font-semibold mb-2">Dessert</h3>
              {menuData.desserts.length === 1 && (
                <div className="grid grid-cols-1 gap-4 mb-2">
                  <input
                    type="text"
                    placeholder="Dessert Name"
                    value={menuData.desserts[0].name}
                    onChange={(e) =>
                      handleDishChange(0, "name", e.target.value, "desserts")
                    }
                    className="border rounded-md p-2 w-full"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Dessert Price"
                    value={menuData.desserts[0].price}
                    onChange={(e) =>
                      handleDishChange(0, "price", e.target.value, "desserts")
                    }
                    className="border rounded-md p-2 w-full"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Dessert Description"
                    value={menuData.desserts[0].description}
                    onChange={(e) =>
                      handleDishChange(
                        0,
                        "description",
                        e.target.value,
                        "desserts"
                      )
                    }
                    className="border rounded-md p-2 w-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeRow(0, "desserts")}
                    className="text-red-500 mt-2"
                  >
                    Remove
                  </button>
                </div>
              )}
              {menuData.desserts.length === 0 && (
                <button
                  type="button"
                  onClick={() => addNewRow("desserts")}
                  className="px-4 py-2 text-black rounded-md bg-[#B1D4E0]-100 dark:bg-[#B1D4E0]"
                >
                  Add Dessert
                </button>
              )}

              {/* Submit */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-black text-white rounded-md mr-2"
                  onClick={() => setAddMenuModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-black rounded-md bg-[#B1D4E0]-100 dark:bg-[#B1D4E0]"
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

      {uploadModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-xl font-medium mb-4">
              Upload Menu as Excel File
            </h3>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
              <button
                onClick={handleFileUpload}
                className="px-4 py-2 text-black rounded-md bg-[#B1D4E0]-100 dark:bg-[#B1D4E0] "
                >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishDescription;
