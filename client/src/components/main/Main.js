import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Chart from "../charts/Chart";
import Navbar from "../Sidebar/Sidebar";
import { toast } from "react-toastify";
import { Carousel } from "react-responsive-carousel"; // Add carousel package
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles

const Main = () => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Validate token and fetch user data
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
        const userResponse = await axios.get(
          `${process.env.REACT_APP_SERVER}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserName(userResponse.data.name);
        setLoading(false);
      } else {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during token validation:", error);
      toast.error("Unable to validate session. Please log in again.");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchDataValid();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
          <main className="bg-gray-100 grid-area-main overflow-auto mt-0">
            <div className="px-8 py-5">
              <div className="flex items-center mb-5">
                <img
                  src="https://anglophone-direct.com/ap_img/Coffee-scaled.jpg"
                  alt="Coffee"
                  className="max-h-24 object-contain mr-5"
                />
                <div className="text-[#2e4a66]">
                  <h1 className="text-2xl">Hello,{userName || "User"}</h1>
                  <p className="text-sm font-semibold text-[#a5aaad]">
                    Welcome to our Cavallo Bianco
                  </p>
                </div>
              </div>

     

              {/* Custom Div with Image and Text */}
              <div className="w-full h-[550px] sm:h-[300px] bg-gradient-to-r from-[#42f5bf] to-[#00bfae] text-white flex flex-col sm:flex-row items-center justify-between px-8 mb-8 rounded-lg shadow-lg">
              {/* Image Section */}
              <div className="w-full sm:w-1/3 sm:order-1 sm:mt-4">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTPxVddzXEj0D_2VLPdLu0WaQpTVMZdLjprQ&s" // Replace with your image URL
                alt="Eggify"
                className="w-full h-[300px] sm:h-full object-cover rounded-lg shadow-md sm:object-top sm:mt-4"
              />
            </div>
            
              {/* Content Section (Heading and Button) */}
              <div className="flex flex-col justify-center space-y-4 w-full sm:w-2/3 sm:pl-8 sm:order-2">
                <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                  Elevate Your Culinary Experience with Eggify
                </h1>
                <button className="px-6 py-3 border-2 border-white text-white bg-transparent rounded-full transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white w-max">
                  Get Started
                </button>
              </div>
            </div>
            


              {/* Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-5">
              <div className="flex flex-col justify-between sm:h-[300px] md:h-40 p-6 rounded-lg bg-white text-black shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <i className="fa fa-home text-2xl text-black hover:text-blue-500 transition-colors duration-300"></i>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-black text-lg">
                    <span className="font-semibold">Add Menu </span>Click here to add a new menu item.
                  </p>
                </div>
              </div>
            
              <div className="flex flex-col justify-between sm:h-[300px] md:h-40 p-6 rounded-lg bg-white text-black shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <i className="fa fa-calendar text-2xl text-black hover:text-red-500 transition-colors duration-300"></i>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-black text-lg">
                    <span className="font-semibold">Add Weekly Menu </span>Click here to add the weekly menu.
                  </p>
                </div>
              </div>
            
              <div className="flex flex-col justify-between sm:h-[300px] md:h-40 p-6 rounded-lg bg-white text-black shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <i className="fa fa-download text-2xl text-black hover:text-green-500 transition-colors duration-300"></i>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-black text-lg">
                    <span className="font-semibold">Download Sample File (Weekly Menu) </span>Download a sample file here.
                  </p>
                </div>
              </div>
            </div>
            


              {/* Report Section */}
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="p-6 rounded-lg bg-white shadow-lg">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h1 className="text-xl text-[#2e4a66]">
                        Report On this week
                      </h1>
                    </div>
                    <i className="fa fa-usd"></i>
                  </div>
                  <Chart />
                </div>

                <div className="p-6 rounded-lg bg-white shadow-lg">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h1 className="text-xl text-[#2e4a66]">7 Days Reports</h1>
                    </div>
                    <i className="fa fa-user"></i>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 mt-6">
                    <div className="bg-[#d1ecf1] text-[#35a4ba] text-center p-6 rounded-lg text-sm min-w-[180px]">
                      <h1 className="text-base sm:text-lg lg:text-xl">
                        Calories
                      </h1>
                    </div>

                    <div className="bg-[#d2f9ee] text-[#38e1b0] text-center p-6 rounded-lg text-sm min-w-[180px]">
                      <h1 className="text-base sm:text-lg lg:text-xl">Sugar</h1>
                    </div>

                    <div className="bg-[#fddcdf] text-[#f65a6f] text-center p-6 rounded-lg text-sm min-w-[180px]">
                      <h1 className="text-base sm:text-lg lg:text-xl">Fats</h1>
                    </div>

                    <div className="bg-[#d1ecf1] text-[#35a4ba] text-center p-6 rounded-lg text-sm min-w-[180px]">
                      <h1 className="text-base sm:text-lg lg:text-xl">
                        Protein
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Main;
